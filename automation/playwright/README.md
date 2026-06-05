# ILLUVRSE Playwright Automation Lab

This lab gives ILLUVRSE safe browser hands and eyes for localhost-only training.

## Safety Boundary

- Use Chromium only for now.
- Use `http://localhost:3000` or `http://127.0.0.1:3000` only.
- Do not automate account logins.
- Do not post, upload, purchase, message, or publish.
- Do not delete files or perform destructive actions.
- Do not browse external websites from these scripts.

## Commands

```bash
npm run playwright:install
npm run browser:check
npm run browser:screenshot
npm run browser:local-test
```

## Training Flow

1. Start the local app with `npm run dev`.
2. Open the safe canvas lab at `/lab/canvas`.
3. Click drawing and animation buttons.
4. Capture screenshots into `automation/output/`.
5. Record lessons in `automation/training/`.
