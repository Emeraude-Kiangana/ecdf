export abstract class DomainError extends Error {
  protected constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class InvalidIdentifierError extends DomainError {
  constructor(kind: string, value: string) {
    super(
      "INVALID_IDENTIFIER",
      `${kind} must contain 1-64 characters using letters, numbers, colon, underscore or hyphen; received ${JSON.stringify(value)}.`,
    );
  }
}

export class InvalidAmountError extends DomainError {
  constructor(value: string) {
    super(
      "INVALID_AMOUNT",
      `Amount must be a positive integer expressed in atomic units; received ${JSON.stringify(value)}.`,
    );
  }
}

export class InvalidOperationParticipantsError extends DomainError {
  constructor() {
    super(
      "INVALID_OPERATION_PARTICIPANTS",
      "Source and destination actors must be different.",
    );
  }
}

export class InvalidTransitionError extends DomainError {
  constructor(state: string, event: string) {
    super(
      "INVALID_TRANSITION",
      `Event ${event} is not valid while the operation is in state ${state}.`,
    );
  }
}

export class UnauthorizedDomainActionError extends DomainError {
  constructor(role: string, event: string, state: string) {
    super(
      "UNAUTHORIZED_DOMAIN_ACTION",
      `Role ${role} cannot apply event ${event} while the operation is in state ${state}.`,
    );
  }
}

export class DuplicateDomainEventError extends DomainError {
  constructor(eventId: string) {
    super(
      "DUPLICATE_DOMAIN_EVENT",
      `Domain event ${eventId} has already been applied to this operation.`,
    );
  }
}
