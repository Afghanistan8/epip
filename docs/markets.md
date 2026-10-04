# Live EPIP markets

These funded programmes are live on the EPIP contract at
[`0xc3015f1b4c2Ffa55Df84d0F3b396bAb8Ed7a29ec`](https://explorer-studio.genlayer.com/address/0xc3015f1b4c2Ffa55Df84d0F3b396bAb8Ed7a29ec)
on GenLayer Studionet, chain `61999`.

| Programme | Kind | Category | Reserve | Award | Stake | Transaction |
| --- | --- | --- | ---: | ---: | ---: | --- |
| `0` | `container-water-ingress` | cargo damage or loss | 5 GEN | 1 GEN | 0.1 GEN | `0x53c171c28a481c0fda287682111c61e719138ecab428a5b267906d5b0f5aad0c` |
| `1` | `stage-truck-collision` | vehicle damage | 5 GEN | 1 GEN | 0.1 GEN | `0x3baaabc936979bb9541cd6643452050bf7d260909d9a86f8b1343a79ae609c25` |

Both programmes use version `1`, require wide and detail frames plus a supporting document, allow three days for evidence, and allow one day for an appeal. Each opening transaction finalized with `MAJORITY_AGREE / SUCCESS`.

The definitions, exclusions, criteria, and idempotent opening routine are in
[`scripts/open-markets.mjs`](../scripts/open-markets.mjs).
