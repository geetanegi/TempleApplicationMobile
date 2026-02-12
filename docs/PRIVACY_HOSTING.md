# Hosting the Privacy Policy for Google Play

Google Play **requires** a publicly accessible URL for your app's Privacy Policy.

## Option 1: Your own website

Upload `privacy-policy.html` to your website, e.g. `https://yoursite.com/privacy-policy.html`.

Then update in `src/utils/constant/index.js`:

```js
Privacy_policy: 'https://yoursite.com/privacy-policy.html',
```

## Option 2: GitHub Pages

1. Create a repo (e.g. `jainsansaar-website`) or use your existing org site.
2. Enable GitHub Pages: Repo → Settings → Pages → Source: main branch.
3. Add `privacy-policy.html` to the repo (e.g. in root or `/docs`).
4. URL will be like: `https://yourusername.github.io/jainsansaar-website/privacy-policy.html`

Update the constant with that URL.

## Option 3: Google Sites / Notion / similar

Create a page with the privacy policy content and use that public URL.

## Play Store submission

In Google Play Console → Your app → Policy → App content → Privacy policy, enter the URL.
