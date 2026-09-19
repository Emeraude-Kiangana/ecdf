# eCDF Project Status

Status date: **2026-09-19**

Overall status: **TESTED · PUBLIC**

Version: `0.1.0-alpha.0`

| Dimension | Status | Evidence |
|---|---|---|
| Research scope | DOCUMENTED | README and `docs/` |
| Repository foundation | IMPLEMENTED | `src/`, package manifest and configuration |
| Transfer domain model | IMPLEMENTED | `src/domain/` |
| Automated tests | TESTED | 27 tests in `tests/` |
| Type safety | TESTED | `npm run typecheck` |
| Foundation verification | TESTED | GitHub Actions run [`35324657015`](https://github.com/Emeraude-Kiangana/ecdf/actions/runs/35324657015) |
| Public repository | PUBLIC | [`Emeraude-Kiangana/ecdf`](https://github.com/Emeraude-Kiangana/ecdf) |
| Dependency lock | IMPLEMENTED | `package-lock.json` |

## Evidence anchors

- Domain foundation: `34814b06ae28fe5e3a62b9866cb9781332312b7b` — `feat(domain): establish tested eCDF foundation`.
- Documentation baseline: `7305b304bd5956a2d67fb68987c2656a53c71a07`.
- Latest verified main-branch run before product normalization: `35324657015` — SUCCESS, 27/27 tests passed.

## Current boundary

The repository demonstrates an executable and tested local domain foundation: explicit transfer states, transition rules, logical roles, invariant enforcement, exact `bigint` amounts, duplicate-event rejection and deterministic snapshots.

The following are not implemented: Stellar live settlement adapter, RPC/Testnet transaction flow, Mainnet, real funds, production custody, API, frontend, database, KYC, mobile-money integration and tokenization.

A local `SETTLED` state is not evidence of network settlement. The presence of `@stellar/stellar-sdk` in the dependency manifest is not evidence of live Stellar integration.

No independent clean reproduction or external validation has been recorded; those maturity levels are not claimed.
