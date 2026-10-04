// Open EPIP's two public example markets on the deployed Studionet contract.
// Existing kinds are detected first, so rerunning this script does not create
// duplicate markets.

import { connect, readRecord, settle } from "./client.mjs";

const GEN = 10n ** 18n;
const DAY = 24 * 60 * 60;
const RESERVE = 5n * GEN;

const MARKETS = [
  {
    category: 3,
    kind: "container-water-ingress",
    definition:
      "Water ingress damaged goods inside a named shipping container, visible on the container interior, packaging, or cargo.",
    exclusions:
      "Pre-existing damage, condensation without damaged goods, and an empty container.",
    criteria: [
      "The named container or its identifier is visible in the frames.",
      "Water ingress or resulting cargo damage is visible.",
      "The visible damage fits the declared water event.",
    ],
    min_frames: 2,
    required_views: ["wide", "detail"],
    paper_required: true,
    paper_kind: "bill of lading or incident report",
    award: GEN,
    stake: GEN / 10n,
    evidence_window: 3 * DAY,
    appeal_window: DAY,
    assessor: "",
  },
  {
    category: 2,
    kind: "stage-truck-collision",
    definition:
      "Collision damage to a named stage or support truck, visible on the vehicle body, cargo area, or attached equipment.",
    exclusions:
      "Wear, mechanical failure without visible impact, and damage outside the declared event.",
    criteria: [
      "The named vehicle or its identifier is visible in the frames.",
      "Impact damage is visible on the vehicle or attached equipment.",
      "The visible impact pattern fits the declared collision.",
    ],
    min_frames: 2,
    required_views: ["wide", "detail"],
    paper_required: true,
    paper_kind: "vehicle or incident document",
    award: GEN,
    stake: GEN / 10n,
    evidence_window: 3 * DAY,
    appeal_window: DAY,
    assessor: "",
  },
];

async function count(client, address) {
  return Number(
    await client.readContract({
      address,
      functionName: "programme_count",
      args: [],
    }),
  );
}

async function main() {
  const { client, account } = await connect();
  const record = await readRecord();
  const address = record.address;
  const existing = new Map();

  for (let id = 0, total = await count(client, address); id < total; id += 1) {
    const programme = await client.readContract({
      address,
      functionName: "programme",
      args: [id],
    });
    existing.set(programme.kind, { id, programme });
  }

  const opened = [];
  for (const market of MARKETS) {
    if (existing.has(market.kind)) {
      const held = existing.get(market.kind);
      console.log(`- ${market.kind} already exists as programme ${held.id}`);
      continue;
    }

    const id = await count(client, address);
    const hash = await client.writeContract({
      account,
      address,
      functionName: "open_programme",
      kwargs: market,
      value: RESERVE,
    });
    console.log(`- ${market.kind}: ${hash}`);
    await settle(client, hash, `open programme ${id}`);

    const after = await count(client, address);
    if (after !== id + 1) {
      throw new Error(`${market.kind} finalized but programme count is ${after}, expected ${id + 1}`);
    }
    const programme = await client.readContract({
      address,
      functionName: "programme",
      args: [id],
    });
    const version = await client.readContract({
      address,
      functionName: "programme_version",
      args: [id, 1],
    });
    if (programme.kind !== market.kind || version.definition !== market.definition) {
      throw new Error(`${market.kind} did not read back with the submitted terms`);
    }
    opened.push({ id, kind: market.kind, hash, programme, version });
  }

  console.log(JSON.stringify({ address, opened }, (_, value) =>
    typeof value === "bigint" ? value.toString() : value, 2));
}

main().catch((error) => {
  console.error(`market opening failed: ${error.message}`);
  process.exitCode = 1;
});
