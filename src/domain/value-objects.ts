import { InvalidAmountError, InvalidIdentifierError } from "./errors.js";

const IDENTIFIER_PATTERN = /^[A-Za-z0-9][A-Za-z0-9:_-]{0,63}$/;

abstract class IdentifierValue {
  protected constructor(public readonly value: string) {
    Object.freeze(this);
  }

  public equals(other: IdentifierValue): boolean {
    return this.value === other.value;
  }

  protected static validate(kind: string, value: string): void {
    if (!IDENTIFIER_PATTERN.test(value)) {
      throw new InvalidIdentifierError(kind, value);
    }
  }
}

export class OperationId extends IdentifierValue {
  public static create(value: string): OperationId {
    IdentifierValue.validate("OperationId", value);
    return new OperationId(value);
  }
}

export class EventId extends IdentifierValue {
  public static create(value: string): EventId {
    IdentifierValue.validate("EventId", value);
    return new EventId(value);
  }
}

export class ActorId extends IdentifierValue {
  public static create(value: string): ActorId {
    IdentifierValue.validate("ActorId", value);
    return new ActorId(value);
  }
}

export class TestAmount {
  private constructor(public readonly atomicUnits: bigint) {
    Object.freeze(this);
  }

  public static create(value: string | bigint): TestAmount {
    const normalized = value.toString();
    if (!/^[0-9]+$/.test(normalized)) {
      throw new InvalidAmountError(normalized);
    }

    const atomicUnits = BigInt(normalized);
    if (atomicUnits <= 0n) {
      throw new InvalidAmountError(normalized);
    }

    return new TestAmount(atomicUnits);
  }

  public equals(other: TestAmount): boolean {
    return this.atomicUnits === other.atomicUnits;
  }

  public toString(): string {
    return this.atomicUnits.toString();
  }
}
