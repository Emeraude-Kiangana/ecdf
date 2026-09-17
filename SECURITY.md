# Security Policy

## Prototype status

eCDF v0.1 is an experimental research prototype. It has not been audited and is
not suitable for real funds, Mainnet, production custody or sensitive personal
data.

## Never commit

- private or secret keys;
- mnemonics or recovery phrases;
- passwords, tokens or API credentials;
- `.env` files;
- personal, KYC or real financial data;
- unredacted logs containing sensitive values.

Use disposable Stellar Testnet keys only when network integration is introduced
in a later increment. If a test key is exposed, discard it, mark affected
evidence as compromised and generate a new disposable Testnet account.

## Reporting

Do not publish a suspected secret or vulnerability in an issue. A verified
private reporting channel will be documented only after remote repository
hosting exists.

No statement in this repository is a security warranty, audit result or claim
of production readiness.
