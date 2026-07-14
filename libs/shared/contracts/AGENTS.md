# Contract Guidance

Follow the root `AGENTS.md`.

- Contracts describe serialized boundaries, not Nest classes or React props.
- Keep types platform-neutral and free of service/UI imports.
- Prefer explicit discriminators such as `kind: 'exhibition'` when trust or behavior differs.
- Model tuples only when cardinality and ordering are true parts of the contract.
- Changing a browser-facing contract is a behavioral change: update OpenSpec, API producers, web consumers, and boundary tests together.
- TypeScript does not validate external JSON. Add a runtime schema at the first untrusted boundary rather than adding unsafe casts throughout consumers.
