import { describe, expect, it } from "vitest";

import { createLifecycleDemoReport } from "../../src/demo.js";

describe("eCDF local lifecycle demo", () => {
  it("produces the expected deterministic state sequence", () => {
    const report = createLifecycleDemoReport();

    expect(report.boundary).toBe("LOCAL_DOMAIN_ONLY");
    expect(report.networkSettlement).toBe(false);
    expect(report.snapshots.map((snapshot) => snapshot.state)).toEqual([
      "DRAFT",
      "AUTHORIZED",
      "SUBMITTED",
      "SETTLED",
    ]);
    expect(report.snapshots.at(-1)?.history).toHaveLength(3);
  });

  it("replays to the same JSON output", () => {
    const first = JSON.stringify(createLifecycleDemoReport());
    const second = JSON.stringify(createLifecycleDemoReport());

    expect(second).toBe(first);
  });
});
