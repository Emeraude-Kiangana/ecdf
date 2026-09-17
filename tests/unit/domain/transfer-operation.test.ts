import { describe, expect, it } from "vitest";

import {
  ActorId,
  ActorRoles,
  DomainEventTypes,
  DuplicateDomainEventError,
  EventId,
  InvalidAmountError,
  InvalidIdentifierError,
  InvalidOperationParticipantsError,
  InvalidTransitionError,
  OperationId,
  OperationStates,
  TestAmount,
  TransferOperation,
  UnauthorizedDomainActionError,
  type ActorRole,
  type DomainEventType,
} from "../../../src/domain/index.js";

function createOperation(): TransferOperation {
  return TransferOperation.create({
    id: OperationId.create("op-001"),
    sourceActorId: ActorId.create("actor-source"),
    destinationActorId: ActorId.create("actor-destination"),
    amount: TestAmount.create("1250"),
  });
}

function event(
  id: string,
  type: DomainEventType,
  actorRole: ActorRole,
) {
  return { id: EventId.create(id), type, actorRole } as const;
}

function settle(operation: TransferOperation): TransferOperation {
  return operation
    .apply(event("event-authorize", DomainEventTypes.AUTHORIZE, ActorRoles.INITIATOR))
    .apply(event("event-submit", DomainEventTypes.SUBMIT, ActorRoles.SYSTEM))
    .apply(
      event(
        "event-settle",
        DomainEventTypes.CONFIRM_SETTLED,
        ActorRoles.RECONCILER,
      ),
    );
}

describe("TEST-eCDF-002 — valid state transitions", () => {
  it("executes the complete local happy path without mutating prior states", () => {
    const draft = createOperation();
    const authorized = draft.apply(
      event("event-1", DomainEventTypes.AUTHORIZE, ActorRoles.INITIATOR),
    );
    const submitted = authorized.apply(
      event("event-2", DomainEventTypes.SUBMIT, ActorRoles.SYSTEM),
    );
    const settled = submitted.apply(
      event(
        "event-3",
        DomainEventTypes.CONFIRM_SETTLED,
        ActorRoles.RECONCILER,
      ),
    );

    expect(draft.state).toBe(OperationStates.DRAFT);
    expect(authorized.state).toBe(OperationStates.AUTHORIZED);
    expect(submitted.state).toBe(OperationStates.SUBMITTED);
    expect(settled.state).toBe(OperationStates.SETTLED);
    expect(settled.history).toHaveLength(3);
    expect(settled.toSnapshot()).toMatchObject({
      id: "op-001",
      amountAtomicUnits: "1250",
      state: OperationStates.SETTLED,
    });
  });

  it("supports explicit rejection from DRAFT", () => {
    const rejected = createOperation().apply(
      event("event-reject", DomainEventTypes.REJECT, ActorRoles.INITIATOR),
    );

    expect(rejected.state).toBe(OperationStates.REJECTED);
  });

  it("resolves an ambiguous submission through reconciliation", () => {
    const reconciled = createOperation()
      .apply(event("event-a", DomainEventTypes.AUTHORIZE, ActorRoles.INITIATOR))
      .apply(event("event-b", DomainEventTypes.SUBMIT, ActorRoles.SYSTEM))
      .apply(
        event(
          "event-c",
          DomainEventTypes.MARK_RECONCILIATION_REQUIRED,
          ActorRoles.RECONCILER,
        ),
      )
      .apply(
        event(
          "event-d",
          DomainEventTypes.CONFIRM_FAILED,
          ActorRoles.RECONCILER,
        ),
      );

    expect(reconciled.state).toBe(OperationStates.FAILED);
  });
});

describe("TEST-eCDF-003 — invalid transitions", () => {
  it("rejects a direct DRAFT to SETTLED transition without mutation", () => {
    const draft = createOperation();

    expect(() =>
      draft.apply(
        event(
          "event-invalid",
          DomainEventTypes.CONFIRM_SETTLED,
          ActorRoles.RECONCILER,
        ),
      ),
    ).toThrow(InvalidTransitionError);
    expect(draft.state).toBe(OperationStates.DRAFT);
    expect(draft.history).toHaveLength(0);
  });

  it.each([
    DomainEventTypes.AUTHORIZE,
    DomainEventTypes.REJECT,
    DomainEventTypes.SUBMIT,
    DomainEventTypes.CONFIRM_SETTLED,
    DomainEventTypes.CONFIRM_FAILED,
    DomainEventTypes.MARK_RECONCILIATION_REQUIRED,
  ])("rejects %s after SETTLED", (type) => {
    const settled = settle(createOperation());

    expect(() =>
      settled.apply(event(`terminal-${type}`, type, ActorRoles.RECONCILER)),
    ).toThrow(InvalidTransitionError);
  });

  it("rejects a valid event performed by the wrong role", () => {
    expect(() =>
      createOperation().apply(
        event("event-role", DomainEventTypes.AUTHORIZE, ActorRoles.SYSTEM),
      ),
    ).toThrow(UnauthorizedDomainActionError);
  });
});

describe("TEST-eCDF-004 — invariant enforcement", () => {
  it.each(["0", "-1", "1.5", "not-an-amount", ""])(
    "rejects invalid atomic amount %j",
    (amount) => {
      expect(() => TestAmount.create(amount)).toThrow(InvalidAmountError);
    },
  );

  it("accepts an exact positive integer larger than Number.MAX_SAFE_INTEGER", () => {
    const amount = TestAmount.create("9007199254740993");

    expect(amount.atomicUnits).toBe(9007199254740993n);
  });

  it("rejects identical source and destination actors", () => {
    const actor = ActorId.create("same-actor");

    expect(() =>
      TransferOperation.create({
        id: OperationId.create("op-same"),
        sourceActorId: actor,
        destinationActorId: actor,
        amount: TestAmount.create("1"),
      }),
    ).toThrow(InvalidOperationParticipantsError);
  });

  it.each(["", " contains-space", "contains space", "x".repeat(65)])(
    "rejects malformed identifier %j",
    (identifier) => {
      expect(() => OperationId.create(identifier)).toThrow(
        InvalidIdentifierError,
      );
    },
  );

  it("is deterministic for equal state and event sequences", () => {
    const execute = () =>
      settle(createOperation()).toSnapshot();

    expect(execute()).toEqual(execute());
  });
});

describe("TEST-eCDF-005 — duplicate domain event", () => {
  it("rejects an already processed event identifier before another transition", () => {
    const authorization = event(
      "event-duplicate",
      DomainEventTypes.AUTHORIZE,
      ActorRoles.INITIATOR,
    );
    const authorized = createOperation().apply(authorization);

    expect(() => authorized.apply(authorization)).toThrow(
      DuplicateDomainEventError,
    );
    expect(authorized.state).toBe(OperationStates.AUTHORIZED);
    expect(authorized.history).toHaveLength(1);
  });
});
