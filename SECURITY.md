# Security Policy

## Supported Versions

We support the latest version of ClarityScan AI. Please update to the latest release to ensure you have the latest security patches.

| Version  | Supported |
| -------- | --------- |
| Latest   | Yes       |
| < Latest | No        |

## Reporting a Vulnerability

We take the security of ClarityScan AI seriously. If you believe you have found a security vulnerability, please do NOT open a public issue. Instead, report it to us confidentially.

To report a vulnerability:

1. Send an email to `security@clarityscan.ai` (placeholder).
2. Include a detailed description of the vulnerability, steps to reproduce, and any potential exploit or impact.
3. We will acknowledge receipt of your report within 48 hours and work with you to resolve it.

## Secret Management

- Never commit secrets to the repository.
- Use `.env` files for local development (ignored by Git).
- Use environment variables or secret managers in production.
- If you accidentally commit a secret, rotate it immediately and remove it from the Git history.

## Best Practices

- Keep dependencies up to date.
- Run `npm audit` regularly.
- Use strong, unique passwords for all accounts associated with the project.
