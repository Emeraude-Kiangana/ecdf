import { describe, expect, it } from "vitest";

import {
  PROJECT_NAME,
  PROJECT_VERSION,
  createHealthReport,
} from "../src/index.js";

describe("TEST-eCDF-001 — Repository Bootstrap Health", () => {
  it("imports the project and returns safe bootstrap metadata", () => {
    const report = createHealthReport({});

    expect(report).toEqual({
      project: PROJECT_NAME,
      version: PROJECT_VERSION,
      runtime: process.version,
      network: "testnet",
      networkConfigured: false,
      rpcConfigured: false,
      status: "ok",
    });
  });

  it("accepts testnet configuration without making a network call", () => {
    const report = createHealthReport({
      STELLAR_NETWORK: "testnet",
      STELLAR_RPC_URL: "https://REPLACE_WITH_TESTNET_RPC_ENDPOINT",
    });

    expect(report.networkConfigured).toBe(true);
    expect(report.rpcConfigured).toBe(false);
  });

  it("rejects mainnet before signer or network initialization", () => {
    expect(() =>
      createHealthReport({ STELLAR_NETWORK: "mainnet" }),
    ).toThrow("Prototype permits testnet only");
  });
});
