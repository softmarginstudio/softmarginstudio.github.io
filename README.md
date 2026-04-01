# Quiet Minimal Personal Site — v5.2

A static landing page with:

- quiet Japanese architect minimalism
- pale gray gradient + wabi-sabi atmosphere
- paper grain + film noise
- subtle pointer movement
- typewriter intro
- looping ellipsis on `to linger...`
- bottom-anchored footer with logo
- Formspree contact form
- submit behavior: the form softly retracts, then `sent` appears

## Files

- `index.html`
- `style.css`
- `script.js`
- `site-config.json`
- `package.json`
- `yi-brand-logo.svg`

## Form setup

This package is already connected to:

`https://formspree.io/f/mzdkgnoj`

No email address is displayed on the page.

## Local preview

From this folder, run:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Deploy on GitHub Pages

1. Create a GitHub repository.
2. Upload all files from this folder to the repository root.
3. In GitHub, go to **Settings → Pages**.
4. Set the source branch (usually `main`) and root folder.
5. Save.
6. Once published, connect your custom domain in GitHub Pages settings.

## Custom domain from Squarespace

In Squarespace domain DNS settings, point the domain to GitHub Pages using the required A / CNAME records from GitHub.

## Notes

- The page is intentionally very minimal.
- The contact form uses JavaScript + Formspree submit.
- On successful submit, the form retracts and `sent` appears quietly.


Updated in v5.6:
- Restored ultra-minimal typography and spacing
- Replaced typewriter with slower upward fade-in sequence
- Preserved Formspree endpoint and sent-state behavior


Update v5.7:
- softened capsule buttons for note toggle and send
- denser footer signature leading
