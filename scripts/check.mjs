// Compile the standalone source against Studionet without a signer.

import { createClient } from "genlayer-js-stable";
import { studionet } from "genlayer-js-stable/chains";

import { contractSource } from "./client.mjs";

const EXPECTED = new Set([
  "open_programme",
  "lodge",
  "attach_exhibit",
  "attach_observation",
  "convene",
  "appeal",
  "rehear",
  "seal",
  "receipt",
]);

async function main() {
  const endpoint = process.env.EPIP_RPC || studionet.rpcUrls.default.http[0];
  const client = createClient({ chain: studionet, endpoint });
  const schema = await client.getContractSchemaForCode(await contractSource());
  const methods = Object.keys(schema?.methods ?? {}).sort();
  const missing = [...EXPECTED].filter((name) => !methods.includes(name));
  if (missing.length) {
    throw new Error(`compiled schema is missing: ${missing.join(", ")}`);
  }
  console.log(`EPIP compiles for Studionet with ${methods.length} public entry points.`);
}

main().catch((error) => {
  console.error(`source check failed: ${error.message}`);
  process.exitCode = 1;
});
