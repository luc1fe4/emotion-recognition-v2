# Coding Rules

## TypeScript

- Use strict TypeScript.
- Validate external input with Zod.
- Prefer explicit exported types for API contracts.
- Keep business logic out of route files.

## File Naming

- Backend modules use kebab-case or descriptive dot suffixes such as `emotion.service.ts`.
- Frontend components use PascalCase.
- Shared schemas live in `packages/shared/src`.

## API Rules

- Return stable JSON envelopes.
- Do not expose stack traces or raw infrastructure errors.
- Log technical details internally with Winston.
- Keep user-facing messages friendly and safe.

## Error Handling

- Use centralized Express error middleware.
- Convert expected failures into typed application errors.
- Catch persistence failures around non-critical history writes so inference can still return when appropriate.

## Git Rules

- Do not commit `.env`, dependency folders, virtual environments, build outputs, caches, upload scratch files, or secrets.
- Commit meaningful increments with Conventional Commit messages.
- Never modify the immutable model asset folder unless explicitly instructed.
