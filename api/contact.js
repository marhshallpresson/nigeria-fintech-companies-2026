// Receives "Suggest an Update" submissions and files each one as a GitHub issue
// in this repository, labelled "update", for review.
// Required env vars on Vercel: GITHUB_TOKEN (issues: write on this repo), GITHUB_REPO ("owner/name").

const clip = (v, n) => String(v ?? '').trim().slice(0, n);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body || {};
  if (body.website) return res.status(200).json({ ok: true }); // honeypot: silently drop bots

  const name = clip(body.name, 100);
  const email = clip(body.email, 200);
  const type = clip(body.type, 60) || 'Other';
  const company = clip(body.company, 120);
  const message = clip(body.message, 4000);

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please fill in your name, a valid email and the details.' });
  }

  const { GITHUB_TOKEN, GITHUB_REPO } = process.env;
  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    return res.status(500).json({ error: 'The form is not configured yet.' });
  }

  const quote = s => s.split('\n').map(l => '> ' + l).join('\n');
  const issue = {
    title: `[${type}] ${company || 'General'}`.slice(0, 200),
    body: [
      `**Type:** ${type}`,
      `**Company:** ${company || '-'}`,
      `**From:** ${name}`,
      `**Email:** ${email}`,
      '',
      '**Details:**',
      quote(message),
      '',
      '_Sent from the site\'s Suggest an Update form. To apply it, edit `data.json` and close this issue._',
    ].join('\n'),
    labels: ['update'],
  };

  const gh = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/issues`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'fintech-map-contact-form',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify(issue),
  });

  if (!gh.ok) {
    console.error('GitHub issue create failed', gh.status, await gh.text());
    return res.status(502).json({ error: 'Could not send right now. Please try again later.' });
  }
  return res.status(200).json({ ok: true });
}

function safeParse(s) {
  try { return JSON.parse(s); } catch { return {}; }
}
