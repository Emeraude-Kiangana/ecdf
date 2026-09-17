# eCDF

Experimental eCDF technology prototype.

## Current status

This repository is a clean reconstruction of the locally tested eCDF core-domain prototype state recorded on 2026-09-17. It is **not** a production financial system and does not currently perform real settlement, custody, KYC/AML, or mainnet operations.

### Implemented target for v0.1

- TypeScript core domain
- immutable transfer identity and amount
- explicit local state machine
- role-gated actions
- bigint-safe amounts
- local action de-duplication
- deterministic snapshots
- automated tests

### Explicitly not implemented yet

- Stellar adapter
- RPC / testnet integration
- cryptographic transaction signing
- network reconciliation
- end-to-end settlement prototype

## Verification target

```bash
npm install
npm run verify
```

The reconstruction branch is expected to prove the local domain model before any network integration is added.
