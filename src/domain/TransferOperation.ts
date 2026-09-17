export const ROLES = {
  INITIATOR: "INITIATOR",
  AUTHORIZER: "AUTHORIZER",
  SETTLER: "SETTLER",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const TRANSFER_STATES = {
  CREATED: "CREATED",
  AUTHORIZED: "AUTHORIZED",
  SETTLED: "SETTLED",
} as const;

export type TransferState =
  (typeof TRANSFER_STATES)[keyof typeof TRANSFER_STATES];

export interface TransferSnapshot {
  readonly id: string;
  readonly amount: string;
  readonly state: TransferState;
  readonly initiatedBy: string;
  readonly authorizedBy?: string;
  readonly settledBy?: string;
  readonly version: number;
}

export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class InvalidAmountError extends DomainError {}
export class InvalidIdentifierError extends DomainError {}
export class InvalidTransitionError extends DomainError {}
export class UnauthorizedRoleError extends DomainError {}
export class DuplicateActionError extends DomainError {}

export class TransferOperation {
  readonly #id: string;
  readonly #amount: bigint;
  readonly #initiatedBy: string;
  #state: TransferState = TRANSFER_STATES.CREATED;
  #authorizedBy?: string;
  #settledBy?: string;
  #version = 0;
  readonly #actionKeys = new Set<string>();

  private constructor(id: string, amount: bigint, initiatedBy: string) {
    this.#id = requireNonEmpty("id", id);
    this.#initiatedBy = requireNonEmpty("initiatedBy", initiatedBy);

    if (amount <= 0n) {
      throw new InvalidAmountError("amount must be greater than zero");
    }

    this.#amount = amount;
  }

  static create(input: {
    id: string;
    amount: bigint;
    initiatedBy: string;
  }): TransferOperation {
    return new TransferOperation(input.id, input.amount, input.initiatedBy);
  }

  get state(): TransferState {
    return this.#state;
  }

  get version(): number {
    return this.#version;
  }

  authorize(input: {
    role: Role;
    actorId: string;
    actionKey: string;
  }): TransferSnapshot {
    requireRole(input.role, ROLES.AUTHORIZER, "authorize");
    const actorId = requireNonEmpty("actorId", input.actorId);
    const actionKey = requireNonEmpty("actionKey", input.actionKey);
    this.#assertFreshAction(actionKey);

    if (this.#state !== TRANSFER_STATES.CREATED) {
      throw new InvalidTransitionError(
        `cannot authorize transfer from state ${this.#state}`,
      );
    }

    this.#actionKeys.add(actionKey);
    this.#authorizedBy = actorId;
    this.#state = TRANSFER_STATES.AUTHORIZED;
    this.#version += 1;
    return this.snapshot();
  }

  settle(input: {
    role: Role;
    actorId: string;
    actionKey: string;
  }): TransferSnapshot {
    requireRole(input.role, ROLES.SETTLER, "settle");
    const actorId = requireNonEmpty("actorId", input.actorId);
    const actionKey = requireNonEmpty("actionKey", input.actionKey);
    this.#assertFreshAction(actionKey);

    if (this.#state !== TRANSFER_STATES.AUTHORIZED) {
      throw new InvalidTransitionError(
        `cannot settle transfer from state ${this.#state}`,
      );
    }

    this.#actionKeys.add(actionKey);
    this.#settledBy = actorId;
    this.#state = TRANSFER_STATES.SETTLED;
    this.#version += 1;
    return this.snapshot();
  }

  snapshot(): Readonly<TransferSnapshot> {
    return Object.freeze({
      id: this.#id,
      amount: this.#amount.toString(),
      state: this.#state,
      initiatedBy: this.#initiatedBy,
      authorizedBy: this.#authorizedBy,
      settledBy: this.#settledBy,
      version: this.#version,
    });
  }

  #assertFreshAction(actionKey: string): void {
    if (this.#actionKeys.has(actionKey)) {
      throw new DuplicateActionError(`duplicate action key: ${actionKey}`);
    }
  }
}

function requireNonEmpty(label: string, value: string): string {
  const normalized = value.trim();
  if (normalized.length === 0) {
    throw new InvalidIdentifierError(`${label} must not be empty`);
  }
  return normalized;
}

function requireRole(actual: Role, expected: Role, action: string): void {
  if (actual !== expected) {
    throw new UnauthorizedRoleError(
      `${action} requires role ${expected}; received ${actual}`,
    );
  }
}
