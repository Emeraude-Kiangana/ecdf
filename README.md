# eCDF

A TypeScript research prototype for deterministic digital-value transfer experiments, demonstrating an explicit local transfer lifecycle while keeping future Stellar Testnet settlement outside the implemented boundary.

| Field | Value |
|---|---|
| Status | **TESTED · PUBLIC** |
| Version | `0.1.0-alpha.0` |
| Repository | [Emeraude-Kiangana/ecdf](https://github.com/Emeraude-Kiangana/ecdf) |
| CI | [GitHub Actions — verify](https://github.com/Emeraude-Kiangana/ecdf/actions/workflows/verify.yml) |
| Demo | Not publicly available yet |
| License | Apache-2.0 |
| Maintainer | Emeraude Kiangana |

## What it does

eCDF currently implements a local, infrastructure-independent transfer domain model. A `TransferOperation` moves through explicit states, validates participants and atomic-unit amounts, enforces role-based transition rules, rejects invalid or duplicate events, and produces deterministic snapshots.

The implemented behavior is local. A `SETTLED` domain state is not proof of network settlement.

## Why it exists

eCDF studies how a digital-value transfer can be modeled so that its lifecycle, authorization rules, invariants and outcomes are explicit and testable before any network or financial integration is attempted.

The repository separates demonstrated behavior from future research. Stellar Testnet settlement is documented as a possible later experiment, not as a current capability.

## Current capabilities

- immutable `TransferOperation` aggregate;
- explicit `DRAFT`, `AUTHORIZED`, `SUBMITTED`, `SETTLED`, `REJECTED`, `FAILED` and `RECONCILIATION_REQUIRED` states;
- role-constrained state transitions;
- validation of identifiers, participants and positive atomic-unit amounts;
- exact amount handling with `bigint`;
- local duplicate-event rejection by `EventId`;
- deterministic operation history and snapshots;
- safe health report with no network call;
- automated type checking, tests and health verification.

## Quick start

Requirements: Node.js 24.x, npm 11.x and Git.

```bash
git clone https://github.com/Emeraude-Kiangana/ecdf.git
cd ecdf
npm ci
npm run verify
```

Individual checks:

```bash
npm test
npm run typecheck
npm run health
```

`npm run verify` runs type checking, 27 automated tests and the local health command. It does not call Stellar or prove live settlement.

## Evidence

| Claim | Inspectable evidence |
|---|---|
| Tested domain foundation | [Foundation commit `34814b06ae28fe5e3a62b9866cb9781332312b7b`](https://github.com/Emeraude-Kiangana/ecdf/commit/34814b06ae28fe5e3a62b9866cb9781332312b7b) |
| 27 automated tests pass | [GitHub Actions run `35324657015`](https://github.com/Emeraude-Kiangana/ecdf/actions/runs/35324657015) |
| CI contract | [`.github/workflows/verify.yml`](.github/workflows/verify.yml) |
| Domain implementation | [`src/domain/`](src/domain/) |
| Test implementation | [`tests/`](tests/) |
| Locked dependencies | [`package-lock.json`](package-lock.json) |
| Security boundary | [`SECURITY.md`](SECURITY.md) |
| Factual maturity snapshot | [`docs/PROJECT-STATUS.md`](docs/PROJECT-STATUS.md) |

The cited CI run checked out commit `7305b304bd5956a2d67fb68987c2656a53c71a07` on Ubuntu, installed locked dependencies with `npm ci`, and completed `npm run verify` successfully: 2 test files, 27 tests passed, typecheck passed and health returned `status: "ok"`.

No independent clean reproduction has been recorded, so this README does not claim `REPRODUCIBLE` or `EXTERNALLY VALIDATED`.

## Architecture

```text
Transfer intent
    ↓
Domain validation and invariants
    ↓
Deterministic state machine
    ↓
Role authorization
    ↓
Future settlement adapter — NOT IMPLEMENTED
```

See [`docs/architecture/`](docs/architecture/) for the detailed architecture and [`docs/README.md`](docs/README.md) for the documentation map.

## Limitations

- Stellar live settlement adapter: **NOT IMPLEMENTED**.
- No public demo.
- No real funds or Mainnet.
- No production custody.
- No CDF backing or redemption claim.
- No official-currency, CBDC or banking claim.
- No mobile-money integration.
- No production KYC.
- No regulator approval.
- No production security audit.
- No product-market or external validation.
- Local duplicate-event handling is not persistent or cross-process.
- Domain roles are logical rules, not cryptographic authentication.
- The installed Stellar SDK is a dependency only; it does not establish a live integration.

## Security

Do not commit real secrets, Mainnet keys, mnemonics, credentials or sensitive financial data. `.env` is ignored by Git. Disposable Testnet keys may be used only if a live adapter is introduced and reviewed in a future increment. See [`SECURITY.md`](SECURITY.md).

## License

Apache License 2.0 — see [LICENSE](LICENSE).

## Author

**Emeraude Kiangana**  
Founder / Builder — Open Technologies

© EMERAUDE KIANGANA
