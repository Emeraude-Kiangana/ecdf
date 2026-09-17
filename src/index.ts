import { pathToFileURL } from "node:url";

export const PROJECT_NAME = "eCDF";
export const PROJECT_VERSION = "0.1.0-alpha.0";
export const SUPPORTED_NETWORK = "testnet";

export interface HealthReport {
  project: string;
  version: string;
  runtime: string;
  network: string;
  networkConfigured: boolean;
  rpcConfigured: boolean;
  status: "ok";
}

export function createHealthReport(
  environment: NodeJS.ProcessEnv = process.env,
): HealthReport {
  const configuredNetwork = environment.STELLAR_NETWORK?.trim().toLowerCase();

  if (configuredNetwork && configuredNetwork !== SUPPORTED_NETWORK) {
    throw new Error(
      `Unsupported STELLAR_NETWORK: ${configuredNetwork}. Prototype permits testnet only.`,
    );
  }

  const rpcUrl = environment.STELLAR_RPC_URL?.trim();
  const rpcConfigured = Boolean(
    rpcUrl && !rpcUrl.includes("REPLACE_WITH_TESTNET_RPC_ENDPOINT"),
  );

  return {
    project: PROJECT_NAME,
    version: PROJECT_VERSION,
    runtime: process.version,
    network: configuredNetwork ?? SUPPORTED_NETWORK,
    networkConfigured: Boolean(configuredNetwork),
    rpcConfigured,
    status: "ok",
  };
}

function run(): void {
  const report = createHealthReport();
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

const invokedPath = process.argv[1];
if (invokedPath && import.meta.url === pathToFileURL(invokedPath).href) {
  try {
    run();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown health error";
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  }
}
