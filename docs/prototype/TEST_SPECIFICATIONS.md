# Initial test specifications

## TEST-eCDF-001 — Repository Bootstrap Health

**PURPOSE:** Demonstrate that the project installs, imports, compiles and executes
its minimal test runner without a network call.

**PRECONDITION:** Supported Node/npm and dependencies installed from lockfile.

**COMMAND:** `npm run verify`

**EXPECTED RESULT:** Typecheck succeeds, three bootstrap assertions pass, the
health command exits 0, reports Testnet as the only supported network and reveals
no secret.

**ACTUAL RESULT:** Final `npm run verify` exited 0 on 2026-09-17 with
typecheck passed, 1 test file passed, 3 tests passed, 0 failed, and health
status `ok`. The health report identified Node `v24.19.0`, Testnet as the only
supported network, and no configured RPC endpoint.

**STATUS:** EXECUTED — PASSED.

## TEST-eCDF-002 — Valid State Transition

**PURPOSE:** Verify that `DRAFT → AUTHORIZED` is allowed only with valid
authorization evidence.

**ACTUAL RESULT:** Executed on 2026-09-17. DRAFT → AUTHORIZED → SUBMITTED →
SETTLED passed, prior states remained unchanged, and rejection/reconciliation
paths passed.

**STATUS:** EXECUTED — PASSED.

## TEST-eCDF-003 — Invalid State Transition Rejected

**PURPOSE:** Verify that direct or terminal-state-invalid transitions are rejected
without mutating history.

**ACTUAL RESULT:** Executed on 2026-09-17. Direct settlement, every event after
SETTLED and wrong-role authorization were rejected without prior-state mutation.

**STATUS:** EXECUTED — PASSED.

## TEST-eCDF-004 — Domain Invariant Enforcement

**PURPOSE:** Verify exact positive amounts, distinct participants, safe
identifiers, immutability and deterministic snapshots.

**ACTUAL RESULT:** Parameterized invalid inputs were rejected; a value above
`Number.MAX_SAFE_INTEGER` remained exact as `bigint`; all assertions passed.

**STATUS:** EXECUTED — PASSED.

## TEST-eCDF-005 — Duplicate / Replay-like Domain Action

**PURPOSE:** Verify that an event ID already applied to one operation cannot be
applied again.

**ACTUAL RESULT:** The second application raised
`DuplicateDomainEventError`; state and history remained unchanged.

**STATUS:** EXECUTED — PASSED.
