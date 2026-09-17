# ADR-eCDF-008 — Immutable explicit domain transitions

**QUESTION:** How should INC-02 represent operation state changes and failures?  
**STATUS:** DECIDED  
**DATE:** 2026-09-17

## Options

1. Mutate one operation and throw generic errors.
2. Return a new operation per event and expose explicit domain errors.
3. Introduce a general event-sourcing framework.

## Decision

Use option 2. `TransferOperation.apply` returns a new aggregate with an appended
transition record. Invalid transitions, wrong roles and duplicate event IDs have
distinct errors and stable codes.

## Rationale

This preserves prior state, prevents partial mutation after rejection and keeps
the domain deterministic without adding a framework.

## Evidence

`tests/unit/domain/transfer-operation.test.ts` exercises valid, invalid,
terminal, unauthorized, duplicate and deterministic behavior.

## Consequences

- Callers retain the returned aggregate.
- Later infrastructure must persist the newest snapshot atomically.
- In-memory event-ID tracking is not production replay protection.

**REVERSIBILITY:** MEDIUM  
**REVIEW TRIGGER:** Persistence experiments require concurrent writers or show
that copying transition history is unsuitable.
