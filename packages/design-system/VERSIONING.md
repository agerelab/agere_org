# Versioning & release policy

`@agere/design-system` follows [Semantic Versioning 2.0](https://semver.org). Releases are automated with Changesets.

| Bump | When | Examples |
|---|---|---|
| **MAJOR** | Breaking API or visual contract | Remove/rename a prop, token or variant; change a default size; drop a deprecated alias |
| **MINOR** | Backwards-compatible features | New component, variant, token, or prop with a safe default |
| **PATCH** | Fixes, no API change | a11y fix, visual bug, dependency patch |

**Tokens are API.** Changing a semantic value is MINOR if the contrast suite still passes (PATCH if it fixes a regression); renaming/removing is MAJOR.

## Deprecation lifecycle
1. **Announce** — `@deprecated` JSDoc + changelog entry.
2. **Warn** — dev-only console warning in the next minor.
3. **Migrate** — MIGRATION.md section + codemod where feasible.
4. **Remove** — next major, no sooner than 90 days after announcement.

## Channels
| Channel | npm tag | Audience |
|---|---|---|
| Stable | `latest` | All production ventures |
| Next | `next` (`4.1.0-next.N`) | Pilot venture validating a feature |
| Canary | `canary` (`0.0.0-<sha>`) | DS team, PR previews |

## Flow
`npx changeset` in the PR → merge to `main` → bot opens "Version Packages" → merge → publish, git tag `vX.Y.Z`, GitHub release notes.
