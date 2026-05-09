# Contributing to ClarityScan AI

Thank you for your interest in contributing to ClarityScan AI! We welcome contributions from the community.

## How to Contribute

### 1. Reporting Bugs

- Search existing issues to see if the bug has already been reported.
- If not, open a new issue with a clear title and description, steps to reproduce, and expected behavior.

### 2. Suggesting Enhancements

- Open an issue describing the enhancement you'd like to see.
- Explain why it would be useful and how it should work.

### 3. Pull Requests

- Fork the repository.
- Create a new branch for your feature or bugfix: `git checkout -b feat/your-feature` or `git checkout -b fix/your-bugfix`.
- Make your changes.
- Ensure code quality (run linting and tests).
- Commit your changes using conventional commits:
  - `feat: add new feature`
  - `fix: fix bug`
  - `docs: update documentation`
- Push to your fork and submit a Pull Request.

## Coding Standards

- **TypeScript**: We use TypeScript for all code. Ensure types are used correctly.
- **Linting**: Run `npm run lint` before committing.
- **Formatting**: We use Prettier. Run `npm run format` (if available) or ensure your editor formats on save.
- **Git Commits**: Follow the Conventional Commits specification.

## Branch Strategy

- `main`: Production-ready code.
- `develop`: Integration branch for new features.
- Feature branches: Created from `develop` and merged back via PR.

Thank you for making ClarityScan AI better!
