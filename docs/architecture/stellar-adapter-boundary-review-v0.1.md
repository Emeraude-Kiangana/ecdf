# Stellar Adapter Boundary Review v0.1

**Checkpoint:** P03-CP03-C

**Date:** 2026-09-24

**Status:** DOCUMENTED

**Implementation status:** NOT IMPLEMENTED

## Decision

The existing TypeScript domain remains the authoritative model for transfer
state, transition validity, domain authorization and deterministic snapshots.
A future Stellar adapter may translate an authorized operation into a Testnet
settlement attempt, but it must not own or redefine domain state.

This review defines a boundary only. It does not authorize or implement a
Stellar adapter, live network command, asset, API, database, wallet or custody
component.

## Evidence reviewed

| Claim | Repository evidence |
|---|---|
| The domain is infrastructure-independent | `src/domain/` imports no Stellar, RPC, HTTP, filesystem, database, clock or randomness dependency. |
| Transfer state is explicit | `TransferOperation` defines `DRAFT`, `AUTHORIZED`, `SUBMITTED`, `SETTLED`, `REJECTED`, `FAILED` and `RECONCILIATION_REQUIRED`. |
| Submission is not settlement | `AUTHORIZED` accepts `SUBMIT`; only a reconciler can later confirm `SETTLED` or `FAILED`. |
| Duplicate domain events are rejected | `processedEventIds` and `DuplicateDomainEventError` enforce aggregate-local event deduplication. |
| Amounts are exact | `TestAmount` stores positive integer atomic units as `bigint`. |
| State evolution is deterministic and immutable | `apply()` returns a new frozen aggregate and tests compare equal snapshots for equal event sequences. |

The manual P03-CP03-B probe separately demonstrated that an official Stellar
Testnet workflow can submit one native XLM payment and expose a public
transaction hash. That probe is feasibility evidence, not adapter evidence.

## Ownership boundary

| Concern | Domain owns | Future adapter owns | Neither proves |
|---|---:|---:|---|
| Operation identity | Yes | Maps it to an idempotency reference | Legal identity |
| Participants | Synthetic actor identifiers | Resolves approved Testnet public accounts | KYC or account ownership |
| Amount | Exact atomic units | Performs explicit asset-scale conversion | CDF value or backing |
| Authorization transition | Yes | Requires an already-authorized request | Authentication or regulatory approval |
| Transaction construction | No | Yes | Economic suitability |
| Signing | No | Accepts a signed envelope from a separate local signer | Production custody safety |
| Submission | Records a valid `SUBMIT` event | Submits and returns a normalized receipt | Final settlement by submission alone |
| Reconciliation decision | Applies a reconciler event | Supplies verifiable network evidence | Production finality guarantees |
| Secrets | Must never receive them | Must never persist or log them | HSM readiness |
| Persistent idempotence | No | Future infrastructure responsibility | Multi-process exactly-once execution |

## Proposed internal contract

The following types are documentation, not an implementation commitment.
They describe the smallest boundary consistent with the current domain.

```ts
type SettlementRequest = Readonly<{
  operationId: string;
  sourceActorId: string;
  destinationActorId: string;
  amountAtomicUnits: string;
  idempotencyKey: string;
}>;

type PreparedSettlement = Readonly<{
  operationId: string;
  network: "stellar-testnet";
  unsignedEnvelopeXdr: string;
  intentDigest: string;
  expiresAt: string;
}>;

type SubmissionReceipt = Readonly<{
  operationId: string;
  network: "stellar-testnet";
  transactionHash: string;
  submissionStatus: "PENDING" | "REJECTED" | "UNKNOWN";
  submittedAt: string;
}>;

type ReconciliationEvidence = Readonly<{
  operationId: string;
  transactionHash: string;
  networkStatus: "SUCCESS" | "FAILED" | "NOT_FOUND" | "UNKNOWN";
  ledger: number | null;
  resultCode: string | null;
  observedAt: string;
  rawEvidenceDigest: string;
}>;

interface SettlementAdapter {
  prepare(request: SettlementRequest): Promise<PreparedSettlement>;
  submit(signedEnvelopeXdr: string): Promise<SubmissionReceipt>;
  reconcile(transactionHash: string): Promise<ReconciliationEvidence>;
}
```

## Required mapping to the state machine

| Adapter observation | Permitted domain event | Required role |
|---|---|---|
| Authorized request accepted for submission | `SUBMIT` | `SYSTEM` |
| Verified network success for the expected transaction | `CONFIRM_SETTLED` | `RECONCILER` |
| Verified terminal network failure | `CONFIRM_FAILED` | `RECONCILER` |
| Timeout, unavailable provider, conflicting response or unknown result | `MARK_RECONCILIATION_REQUIRED` | `RECONCILER` |
| `PENDING` or `NOT_FOUND` inside a bounded observation window | No terminal event | N/A |

`SUBMIT` must not mean network success. `SETTLED` must never be inferred from a
locally computed hash, a successful HTTP response, a dependency being present,
or a transaction merely being accepted for processing.

## Verification rule for settlement

Before emitting `CONFIRM_SETTLED`, a reconciler must establish all of the
following from network evidence:

1. the transaction hash equals the submitted signed envelope hash;
2. the network is explicitly Stellar Testnet;
3. the transaction has a successful terminal result;
4. the operation is the expected native test payment;
5. source, destination and amount match the prepared request;
6. the ledger number and result metadata are captured;
7. stored evidence contains no secret key or recovery phrase.

If any check cannot be completed, the operation remains non-terminal or moves
to `RECONCILIATION_REQUIRED`.

## Idempotency and duplication

The current domain rejects a repeated `EventId` only within one aggregate
instance. A future adapter boundary therefore requires a separate persistent
mapping:

```text
(network, operationId, idempotencyKey)
    -> prepared transaction hash
    -> submission attempts
    -> last observed result
```

The mapping must be checked before building or submitting another transaction.
Automatic resubmission is prohibited while the previous outcome is ambiguous.
No database is selected by this review; persistence remains deferred until an
authorized implementation checkpoint demonstrates the requirement.

## Error normalization

| Infrastructure condition | Normalized outcome | Domain consequence |
|---|---|---|
| Invalid destination or amount conversion | `PREPARATION_REJECTED` | No `SUBMIT` event |
| Signature absent or invalid | `SIGNATURE_REJECTED` | No `SUBMIT` event |
| Network explicitly rejects transaction | `SUBMISSION_REJECTED` | `SUBMIT`, then verified `CONFIRM_FAILED` |
| Request times out after possible acceptance | `SUBMISSION_UNKNOWN` | `SUBMIT`, then `MARK_RECONCILIATION_REQUIRED` |
| Transaction query reports verified success | `SETTLEMENT_VERIFIED` | `CONFIRM_SETTLED` |
| Transaction query reports terminal failure | `FAILURE_VERIFIED` | `CONFIRM_FAILED` |
| Provider unavailable or evidence inconsistent | `RECONCILIATION_UNKNOWN` | Remain or enter `RECONCILIATION_REQUIRED` |

SDK exceptions, HTTP status codes and provider-specific messages must not cross
into the domain as authoritative business states.

## Secret boundary

- Only disposable Testnet keys are permitted.
- The domain accepts no secret-bearing type.
- The adapter must not accept a secret key as a method argument.
- Signing occurs in a separate local signer boundary.
- Logs and evidence may contain public accounts, transaction hashes, ledger
  numbers and redacted responses, but never secrets or recovery phrases.
- `.env` remains untracked and is not an evidence artifact.
- Mainnet passphrases, endpoints and value-bearing keys are prohibited.

## Evidence contract

Each future adapter experiment must preserve, at minimum:

| Evidence | Required fields |
|---|---|
| Environment manifest | Node/npm versions, SDK version, network, redacted endpoint identifier |
| Prepared request | Operation ID, public participants, atomic amount, intent digest |
| Submission receipt | Transaction hash, status, timestamp, attempt number |
| Reconciliation evidence | Hash, terminal status, ledger, result code, observation time |
| Verification result | Each settlement rule as pass/fail |
| Integrity | Deterministic artifact names and SHA-256 digests |

Raw evidence is supporting material. The normalized verification result is the
only adapter output eligible to drive a reconciler domain event.

## Explicitly deferred

- adapter implementation and live network scripts;
- issued assets, trustlines and an asset named eCDF;
- Stellar Mainnet;
- Anchor Platform and Anchor Test Suite;
- SEP-6, SEP-10, SEP-12, SEP-24, SEP-31 and SEP-38;
- PAPSS, banking and mobile-money connectors;
- API, database, queue, dashboard and hosted service;
- KYC, custody, HSM and post-quantum signing;
- retry automation and CI network tests.

## Exit assessment

| Gate | Result |
|---|---|
| Domain preserved without Stellar imports | PASS |
| Submission separated from verified settlement | PASS |
| Reconciliation and ambiguity modeled | PASS |
| Secret boundary explicit | PASS |
| Persistent idempotency requirement identified | PASS |
| Adapter implemented or tested | NOT CLAIMED |

**CP03-C result:** the current domain can support a future minimal settlement
adapter without architectural replacement. Implementation remains unauthorized
and must begin, if approved, with tests for boundary mapping, ambiguity,
idempotency and secret exclusion.