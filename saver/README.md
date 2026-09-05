# Call for Quiet — static website

A simple responsive one-page site for Quiet LLC, designed for deployment through Cloudflare Pages from a GitHub repository.

## Files
- `index.html`
- `styles.css`
- `script.js`

## Deploy to Cloudflare Pages
1. Create a GitHub repository and add these files at the repository root.
2. In Cloudflare, go to **Workers & Pages → Create → Pages → Connect to Git**.
3. Select the repository.
4. Framework preset: **None**.
5. Build command: leave blank.
6. Build output directory: `/`.
7. Deploy.
8. Add `callforquiet.com` under **Custom domains**.

## Before launch
- Confirm the preferred contact email. The current prototype uses `hello@callforquiet.com`.
- Replace or remove the Google Fonts links if you want a completely self-contained site.
- Add analytics only if desired.
- Add a privacy page if you later add forms, analytics, or tracking.
