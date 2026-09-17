# Build Deviations — INC-01

## DEV-eCDF-001 — Local repository initialization

**PREVIOUS DECISION:** Verify an existing repository or obtain explicit authority
to initialize a new one.  
**PROBLEM:** No Git repository existed in the workspace and the claimed remote
could not be verified without authentication. Cycle 5 explicitly authorized
creation of a real local executable repository.  
**NEW OPTION:** Initialize a new local Git repository at `ecdf/` with branch
`main`; configure no remote.  
**RATIONALE:** Produces observable local software without inventing GitHub state.  
**IMPACT:** Remote repository, ownership and publication remain UNKNOWN.  
**ADR UPDATE REQUIRED:** NO.

## DEV-eCDF-005 — INC-02 before the first Git commit

**PREVIOUS DECISION:** INC-01 should end with a possible or completed foundation
commit before INC-02.  
**PROBLEM:** The foundation is installed and verified, but its commit failed
because Git author identity is not configured.  
**NEW OPTION:** Implement and verify INC-02 in the same uncommitted repository
while preserving the blocker in all status reports.  
**RATIONALE:** Missing author metadata does not affect compilation or unit-test
validity. No identity is invented.  
**IMPACT:** INC-01 and INC-02 are not yet separated by commits.  
**ADR UPDATE REQUIRED:** NO.

## DEV-eCDF-002 — Provisional Apache-2.0 license

**PREVIOUS DECISION:** Apache-2.0 was proposed but required owner approval before
the first commit.  
**PROBLEM:** Cycle 5 required an actual `LICENSE` file but supplied no alternative
license selection.  
**NEW OPTION:** Create the standard Apache-2.0 license locally, consistent with
the Cycle 4 proposal.  
**RATIONALE:** Makes the local foundation internally consistent while keeping
the choice explicit.  
**IMPACT:** The owner must confirm or replace the license before any remote/public
publication. Local build and tests are unaffected.  
**ADR UPDATE REQUIRED:** NO; repository/legal metadata decision, not system
architecture.

## DEV-eCDF-003 — Stellar SDK installed during INC-01

**PREVIOUS DECISION:** `@stellar/stellar-sdk` was a required prototype dependency
from INC-03, not needed by INC-01 source code.  
**PROBLEM:** Cycle 5 pre-flight explicitly required verifying that the required SDK
is installable and requested the real dependency manifest.  
**NEW OPTION:** Pin and install `@stellar/stellar-sdk@17.1.0` in INC-01 without
importing it into the health source.  
**RATIONALE:** Makes installability observable while preserving the adapter and
network boundaries.  
**IMPACT:** Larger initial dependency tree; no network behavior or Stellar feature
is implemented.  
**ADR UPDATE REQUIRED:** NO.

## DEV-eCDF-004 — Lint and formatter dependencies omitted

**PREVIOUS DECISION:** ESLint and Prettier were conditional/proposed.  
**PROBLEM:** Neither is necessary to prove repository bootstrap health, and adding
them would expand the dependency/configuration surface.  
**NEW OPTION:** INC-01 verifies typecheck, tests and health only.  
**RATIONALE:** BUILD ONLY WHAT THE PROTOTYPE REQUIRES.  
**IMPACT:** CI has no lint/format step; these may be added only after a demonstrated
quality need.  
**ADR UPDATE REQUIRED:** NO.
