import {
  DuplicateDomainEventError,
  InvalidOperationParticipantsError,
  InvalidTransitionError,
  UnauthorizedDomainActionError,
} from "./errors.js";
import {
  ActorId,
  EventId,
  OperationId,
  TestAmount,
} from "./value-objects.js";

export const OperationStates = {
  DRAFT: "DRAFT",
  AUTHORIZED: "AUTHORIZED",
  SUBMITTED: "SUBMITTED",
  SETTLED: "SETTLED",
  REJECTED: "REJECTED",
  FAILED: "FAILED",
  RECONCILIATION_REQUIRED: "RECONCILIATION_REQUIRED",
} as const;

export type OperationState =
  (typeof OperationStates)[keyof typeof OperationStates];

export const DomainEventTypes = {
  AUTHORIZE: "AUTHORIZE",
  REJECT: "REJECT",
  SUBMIT: "SUBMIT",
  CONFIRM_SETTLED: "CONFIRM_SETTLED",
  CONFIRM_FAILED: "CONFIRM_FAILED",
  MARK_RECONCILIATION_REQUIRED: "MARK_RECONCILIATION_REQUIRED",
} as const;

export type DomainEventType =
  (typeof DomainEventTypes)[keyof typeof DomainEventTypes];

export const ActorRoles = {
  INITIATOR: "INITIATOR",
  SYSTEM: "SYSTEM",
  RECONCILER: "RECONCILER",
} as const;

export type ActorRole = (typeof ActorRoles)[keyof typeof ActorRoles];

export interface DomainEvent {
  readonly id: EventId;
  readonly type: DomainEventType;
  readonly actorRole: ActorRole;
}

export interface TransitionRecord {
  readonly eventId: string;
  readonly eventType: DomainEventType;
  readonly actorRole: ActorRole;
  readonly from: OperationState;
  readonly to: OperationState;
}

export interface OperationSnapshot {
  readonly id: string;
  readonly sourceActorId: string;
  readonly destinationActorId: string;
  readonly amountAtomicUnits: string;
  readonly state: OperationState;
  readonly history: readonly TransitionRecord[];
}

interface TransitionRule {
  readonly from: OperationState;
  readonly event: DomainEventType;
  readonly to: OperationState;
  readonly allowedRoles: readonly ActorRole[];
}

const TRANSITION_RULES: readonly TransitionRule[] = Object.freeze([
  {
    from: OperationStates.DRAFT,
    event: DomainEventTypes.AUTHORIZE,
    to: OperationStates.AUTHORIZED,
    allowedRoles: [ActorRoles.INITIATOR],
  },
  {
    from: OperationStates.DRAFT,
    event: DomainEventTypes.REJECT,
    to: OperationStates.REJECTED,
    allowedRoles: [ActorRoles.INITIATOR],
  },
  {
    from: OperationStates.AUTHORIZED,
    event: DomainEventTypes.SUBMIT,
    to: OperationStates.SUBMITTED,
    allowedRoles: [ActorRoles.SYSTEM],
  },
  {
    from: OperationStates.SUBMITTED,
    event: DomainEventTypes.CONFIRM_SETTLED,
    to: OperationStates.SETTLED,
    allowedRoles: [ActorRoles.RECONCILER],
  },
  {
    from: OperationStates.SUBMITTED,
    event: DomainEventTypes.CONFIRM_FAILED,
    to: OperationStates.FAILED,
    allowedRoles: [ActorRoles.RECONCILER],
  },
  {
    from: OperationStates.SUBMITTED,
    event: DomainEventTypes.MARK_RECONCILIATION_REQUIRED,
    to: OperationStates.RECONCILIATION_REQUIRED,
    allowedRoles: [ActorRoles.RECONCILER],
  },
  {
    from: OperationStates.RECONCILIATION_REQUIRED,
    event: DomainEventTypes.CONFIRM_SETTLED,
    to: OperationStates.SETTLED,
    allowedRoles: [ActorRoles.RECONCILER],
  },
  {
    from: OperationStates.RECONCILIATION_REQUIRED,
    event: DomainEventTypes.CONFIRM_FAILED,
    to: OperationStates.FAILED,
    allowedRoles: [ActorRoles.RECONCILER],
  },
]);

export interface CreateTransferOperationInput {
  readonly id: OperationId;
  readonly sourceActorId: ActorId;
  readonly destinationActorId: ActorId;
  readonly amount: TestAmount;
}

export class TransferOperation {
  private constructor(
    public readonly id: OperationId,
    public readonly sourceActorId: ActorId,
    public readonly destinationActorId: ActorId,
    public readonly amount: TestAmount,
    public readonly state: OperationState,
    public readonly history: readonly TransitionRecord[],
    private readonly processedEventIds: ReadonlySet<string>,
  ) {
    Object.freeze(this.history);
    Object.freeze(this);
  }

  public static create(input: CreateTransferOperationInput): TransferOperation {
    if (input.sourceActorId.equals(input.destinationActorId)) {
      throw new InvalidOperationParticipantsError();
    }

    return new TransferOperation(
      input.id,
      input.sourceActorId,
      input.destinationActorId,
      input.amount,
      OperationStates.DRAFT,
      [],
      new Set<string>(),
    );
  }

  public apply(event: DomainEvent): TransferOperation {
    if (this.processedEventIds.has(event.id.value)) {
      throw new DuplicateDomainEventError(event.id.value);
    }

    const rule = TRANSITION_RULES.find(
      (candidate) =>
        candidate.from === this.state && candidate.event === event.type,
    );

    if (rule === undefined) {
      throw new InvalidTransitionError(this.state, event.type);
    }

    if (!rule.allowedRoles.includes(event.actorRole)) {
      throw new UnauthorizedDomainActionError(
        event.actorRole,
        event.type,
        this.state,
      );
    }

    const transition: TransitionRecord = Object.freeze({
      eventId: event.id.value,
      eventType: event.type,
      actorRole: event.actorRole,
      from: this.state,
      to: rule.to,
    });

    return new TransferOperation(
      this.id,
      this.sourceActorId,
      this.destinationActorId,
      this.amount,
      rule.to,
      [...this.history, transition],
      new Set([...this.processedEventIds, event.id.value]),
    );
  }

  public toSnapshot(): OperationSnapshot {
    return Object.freeze({
      id: this.id.value,
      sourceActorId: this.sourceActorId.value,
      destinationActorId: this.destinationActorId.value,
      amountAtomicUnits: this.amount.toString(),
      state: this.state,
      history: Object.freeze([...this.history]),
    });
  }
}
