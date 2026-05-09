# Troubleshooting - ClarityScan AI

This document helps you resolve common issues encountered while setting up or running ClarityScan AI.

## 1. API Key Issues

### Error: `Failed to generate document analysis output.` or similar AI errors.

- **Cause**: The `GEMINI_API_KEY` is missing or invalid.
- **Solution**:
  1. Ensure you have created a `.env` file from `.env.example`.
  2. Verify that `GEMINI_API_KEY` is set correctly in `.env`.
  3. Make sure you are using a valid key from Google AI Studio.

## 2. Dependency Issues

### Error: `Cannot find module 'next'` or similar.

- **Cause**: Dependencies are not installed.
- **Solution**: Run `npm install` in the project root.

## 3. Port Conflicts

### Error: `Port 9002 is already in use.`

- **Cause**: Another process is running on port 9002.
- **Solution**:
  - Kill the process running on port 9002.
  - Or change the port in `package.json` in the `dev` script: `"dev": "next dev -p <new_port>"`.

## 4. UI/Theme Issues

### Theme not persisting or hydration mismatch.

- **Solution**: We use `next-themes` with a `ThemeProvider` to prevent hydration mismatches. Ensure you are not hardcoding `class="dark"` in the `<html>` tag in `layout.tsx`.
