# EPIP

EPIP is a standalone GenLayer intelligent contract for evidence-based findings. It lets another application create a funded programme, bind a filing to immutable terms, collect scene evidence, ask independent validators to rate explicit criteria, and turn their ratings into a deterministic outcome and settlement receipt.

It is designed as a reusable primitive for claims, escrow, assurance, incident review, and other workflows where a decision depends on visual evidence rather than a price feed or a single trusted reviewer.

## Why it uses intelligent consensus

The contract's panel is its only nondeterministic write. Each validator receives the same bounded file: the claim, required criteria, admitted frames, assessor observations, and stored document bytes. A validator returns structured ratings with the frames it actually used.

EPIP then applies deterministic grounding rules in code. A rating must stand on a frame the validator saw or on an independent assessor observation. Documents provide context but cannot establish the scene. Sponsor frames cannot defeat a filing by themselves. The contract reduces the grounded ratings through fixed outcome rules, while its equivalence function compares normalized records rather than free-form prose.

That split keeps the model's task narrow and makes consensus auditable: validators inspect evidence; code controls admissibility, aggregation, appeals, money, and finality.

## Contract surface

The main lifecycle is:

1. `open_programme` locks the category, evidence requirements, award, stake, windows, and initial reserve.
2. `lodge` binds a claimant to the current immutable programme version and commits the award.
3. `attach_exhibit`, `attach_linked_paper`, and `attach_observation` build the bounded evidence file.
4. `convene` asks validators to rate the scene and records the normalized round.
5. `appeal`, `rehear`, and `seal` provide a bounded path to finality.
6. `receipt` returns the programme version, evidence snapshot, round, rule, and outcome together.

The complete rules are in [docs/rules.md](docs/rules.md), including the state machine, evidence admission, grounding, equivalence, outcome, and settlement invariants. [docs/money.md](docs/money.md) explains reserve accounting and the pull-payment ledger.

## Safety properties

- Programme versions are immutable after publication.
- Each live filing reserves its own award.
- Payable calls require the exact reserve or stake value expected by the method.
- Model output cannot directly move money or select an arbitrary payout.
- Missing evidence is rejected before a panel is called.
- Validator ratings are grounded and normalized before equivalence.
- Appeals must add new evidence, and conflicting evidence must name both exhibits.
- Settlement uses a pull-payment ledger and cannot run twice for one filing.

## Test locally

The test runtime double executes the real contract class and its deterministic helpers:

```bash
python -m pytest
```

The suite covers programmes, filings, evidence admission, media classification, grounding, panel equivalence, outcomes, appeals, receipts, and money invariants.

Compile the source against Studionet's contract schema endpoint without a signer:

```bash
npm run check
```

## Deploy

Install the JavaScript tooling, then provide a funded deployer key only in the process environment:

```bash
npm install
EPIP_PRIVATE_KEY=0x... npm run deploy
```

The default target is GenLayer Studionet, chain `61999`, at `https://studio.genlayer.com/api`. The deploy script compiles the source before submitting it, waits for finalization, verifies successful execution, and writes the resulting address to the ignored `.epip-deploy.json` file.

Read the deployed schema back from the chain with:

```bash
npm run schema
```

## Repository layout

- `contracts/epip.py` — the standalone intelligent contract
- `docs/rules.md` — the normative rule specification
- `docs/money.md` — reserve and settlement accounting
- `tests/` — executable contract and consensus tests
- `scripts/` — chain selection, deployment, and schema verification
