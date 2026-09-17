import { describe, expect, it } from "vitest";
import {
  DuplicateActionError,
  InvalidAmountError,
  InvalidIdentifierError,
  InvalidTransitionError,
  ROLES,
  TRANSFER_STATES,
  TransferOperation,
  UnauthorizedRoleError,
} from "../src/index.js";

function operation() {
  return TransferOperation.create({ id: "tx-001", amount: 125_000n, initiatedBy: "alice" });
}

describe("TransferOperation core domain", () => {
  it("starts in CREATED with the original identity", () => {
    expect(operation().snapshot()).toMatchObject({ id: "tx-001", amount: "125000", initiatedBy: "alice", state: TRANSFER_STATES.CREATED });
  });
  it("rejects a zero amount", () => {
    expect(() => TransferOperation.create({ id: "x", amount: 0n, initiatedBy: "alice" })).toThrow(InvalidAmountError);
  });
  it("rejects a negative amount", () => {
    expect(() => TransferOperation.create({ id: "x", amount: -1n, initiatedBy: "alice" })).toThrow(InvalidAmountError);
  });
  it("rejects an empty operation id", () => {
    expect(() => TransferOperation.create({ id: "   ", amount: 1n, initiatedBy: "alice" })).toThrow(InvalidIdentifierError);
  });
  it("rejects an empty initiator", () => {
    expect(() => TransferOperation.create({ id: "x", amount: 1n, initiatedBy: "   " })).toThrow(InvalidIdentifierError);
  });
  it("preserves bigint precision in snapshots", () => {
    const amount = 9_007_199_254_740_993_123_456n;
    const op = TransferOperation.create({ id: "x", amount, initiatedBy: "alice" });
    expect(op.snapshot().amount).toBe(amount.toString());
  });
  it("authorizes a CREATED operation with the AUTHORIZER role", () => {
    const op = operation();
    const snapshot = op.authorize({ role: ROLES.AUTHORIZER, actorId: "bob", actionKey: "authorize-1" });
    expect(snapshot).toMatchObject({ state: TRANSFER_STATES.AUTHORIZED, authorizedBy: "bob" });
  });
  it("rejects authorize from the wrong role", () => {
    expect(() => operation().authorize({ role: ROLES.INITIATOR, actorId: "alice", actionKey: "authorize-1" })).toThrow(UnauthorizedRoleError);
  });
  it("rejects an empty authorizer id", () => {
    expect(() => operation().authorize({ role: ROLES.AUTHORIZER, actorId: " ", actionKey: "authorize-1" })).toThrow(InvalidIdentifierError);
  });
  it("rejects re-authorization with a different action key", () => {
    const op = operation();
    op.authorize({ role: ROLES.AUTHORIZER, actorId: "bob", actionKey: "a1" });
    expect(() => op.authorize({ role: ROLES.AUTHORIZER, actorId: "bob", actionKey: "a2" })).toThrow(InvalidTransitionError);
  });
  it("detects an exact duplicate authorization action", () => {
    const op = operation();
    op.authorize({ role: ROLES.AUTHORIZER, actorId: "bob", actionKey: "a1" });
    expect(() => op.authorize({ role: ROLES.AUTHORIZER, actorId: "bob", actionKey: "a1" })).toThrow(DuplicateActionError);
  });
  it("settles an AUTHORIZED operation with the SETTLER role", () => {
    const op = operation();
    op.authorize({ role: ROLES.AUTHORIZER, actorId: "bob", actionKey: "a1" });
    const snapshot = op.settle({ role: ROLES.SETTLER, actorId: "carol", actionKey: "s1" });
    expect(snapshot).toMatchObject({ state: TRANSFER_STATES.SETTLED, settledBy: "carol" });
  });
  it("rejects settlement directly from CREATED", () => {
    expect(() => operation().settle({ role: ROLES.SETTLER, actorId: "carol", actionKey: "s1" })).toThrow(InvalidTransitionError);
  });
  it("rejects settlement from the wrong role", () => {
    const op = operation();
    op.authorize({ role: ROLES.AUTHORIZER, actorId: "bob", actionKey: "a1" });
    expect(() => op.settle({ role: ROLES.AUTHORIZER, actorId: "bob", actionKey: "s1" })).toThrow(UnauthorizedRoleError);
  });
  it("rejects an empty settler id", () => {
    const op = operation();
    op.authorize({ role: ROLES.AUTHORIZER, actorId: "bob", actionKey: "a1" });
    expect(() => op.settle({ role: ROLES.SETTLER, actorId: " ", actionKey: "s1" })).toThrow(InvalidIdentifierError);
  });
  it("rejects re-settlement with a different action key", () => {
    const op = operation();
    op.authorize({ role: ROLES.AUTHORIZER, actorId: "bob", actionKey: "a1" });
    op.settle({ role: ROLES.SETTLER, actorId: "carol", actionKey: "s1" });
    expect(() => op.settle({ role: ROLES.SETTLER, actorId: "carol", actionKey: "s2" })).toThrow(InvalidTransitionError);
  });
  it("detects an exact duplicate settlement action", () => {
    const op = operation();
    op.authorize({ role: ROLES.AUTHORIZER, actorId: "bob", actionKey: "a1" });
    op.settle({ role: ROLES.SETTLER, actorId: "carol", actionKey: "s1" });
    expect(() => op.settle({ role: ROLES.SETTLER, actorId: "carol", actionKey: "s1" })).toThrow(DuplicateActionError);
  });
  it("does not permit an action key to be reused across transitions", () => {
    const op = operation();
    op.authorize({ role: ROLES.AUTHORIZER, actorId: "bob", actionKey: "same-key" });
    expect(() => op.settle({ role: ROLES.SETTLER, actorId: "carol", actionKey: "same-key" })).toThrow(DuplicateActionError);
  });
  it("starts at version zero", () => {
    expect(operation().version).toBe(0);
  });
  it("increments version after authorization", () => {
    const op = operation();
    op.authorize({ role: ROLES.AUTHORIZER, actorId: "bob", actionKey: "a1" });
    expect(op.version).toBe(1);
  });
  it("increments version after settlement", () => {
    const op = operation();
    op.authorize({ role: ROLES.AUTHORIZER, actorId: "bob", actionKey: "a1" });
    op.settle({ role: ROLES.SETTLER, actorId: "carol", actionKey: "s1" });
    expect(op.version).toBe(2);
  });
  it("returns frozen snapshots", () => {
    expect(Object.isFrozen(operation().snapshot())).toBe(true);
  });
  it("produces deterministic snapshots when state has not changed", () => {
    const op = operation();
    expect(op.snapshot()).toEqual(op.snapshot());
  });
  it("preserves identity and amount through all valid transitions", () => {
    const op = operation();
    op.authorize({ role: ROLES.AUTHORIZER, actorId: "bob", actionKey: "a1" });
    op.settle({ role: ROLES.SETTLER, actorId: "carol", actionKey: "s1" });
    expect(op.snapshot()).toMatchObject({ id: "tx-001", amount: "125000", initiatedBy: "alice" });
  });
});
