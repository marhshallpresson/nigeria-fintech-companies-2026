# Nigeria's Fintech Companies, Mapped (2026)

About 90 of Nigeria's most important fintech companies, grouped by category, with 2026 signals for the leaders. Static site with a "Suggest an Update" contact form.

## Structure

- `index.html` – the page (renders from `data.json`)
- `data.json` – all content: stats, leaders, categories, exits, registers
- `api/contact.js` – Vercel serverless function behind the contact form

## Updating the list

1. Visitors send updates through the **Suggest an Update** form on the site.
2. Each submission becomes a GitHub issue in this repo, labelled `update`.
3. Edit `data.json`, commit, and push. Vercel redeploys automatically. Close the issue.

## Form setup (Vercel environment variables)

| Name | Value |
| --- | --- |
| `GITHUB_TOKEN` | Fine-grained token with **Issues: Read and write** on this repo only |
| `GITHUB_REPO` | `owner/nigeria-fintech-companies-2026` |

## Local preview

```
npx vercel dev
```

Sources: Nigeria Fintech Map 2024 (Segun Adeyemi), Techpoint, 2026 press reporting. Check current status before relying on any listing.
