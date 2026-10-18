// Question flags: Supabase → GitHub issues (run by .github/workflows/question-flags.yml).
//  • Scheduled / manual run: new flags are filed as issues, one open issue per question (later flags become comments).
//  • Issue closed: its flags are marked resolved (or wontfix if closed as "not planned"). Reopened: back to filed.
const { SUPABASE_URL, SUPABASE_SECRET_KEY, GITHUB_TOKEN, REPO, EVENT, ISSUE_NUMBER, ISSUE_ACTION, ISSUE_STATE_REASON } = process.env;
if (!SUPABASE_SECRET_KEY) { console.log('::warning::SUPABASE_SECRET_KEY is not set yet (Settings → Secrets and variables → Actions), so flags were not checked.'); process.exit(0); }

const LABEL = 'question-flag';
const REASONS = {
  wrong: { label: 'flag: wrong answer', icon: '❌', text: 'Wrong answer', color: 'd73a4a' },
  confusing: { label: 'flag: confusing', icon: '🤔', text: 'Confusing', color: 'fbca04' },
  easy: { label: 'flag: too easy', icon: '😴', text: 'Too easy', color: '0e8a16' },
  hard: { label: 'flag: too hard', icon: '🧗', text: 'Too hard', color: '5319e7' },
  outdated: { label: 'flag: outdated', icon: '📅', text: 'Outdated', color: 'c5def5' },
  other: { label: 'flag: other', icon: '💬', text: 'Other', color: 'bfdadc' },
};

async function supa(path, opts = {}) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { ...opts, headers: { apikey: SUPABASE_SECRET_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal', ...opts.headers } });
  if (!r.ok) throw new Error(`Supabase ${opts.method || 'GET'} ${path}: ${r.status} ${await r.text()}`);
  return r.status === 204 ? null : r.json();
}
async function gh(path, opts = {}) {
  const r = await fetch(`https://api.github.com/repos/${REPO}/${path}`, { ...opts, headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json', ...opts.headers } });
  if (!r.ok && !(opts.okStatus || []).includes(r.status)) throw new Error(`GitHub ${opts.method || 'GET'} ${path}: ${r.status} ${await r.text()}`);
  return r.status === 204 ? null : r.json();
}
const patchFlags = (filter, body) => supa(`question_flags?${filter}`, { method: 'PATCH', body: JSON.stringify(body) });

// --- an issue was closed or reopened: update its flags ---
if (EVENT === 'issues') {
  const n = Number(ISSUE_NUMBER);
  if (ISSUE_ACTION === 'closed') await patchFlags(`issue_number=eq.${n}`, { status: ISSUE_STATE_REASON === 'not_planned' ? 'wontfix' : 'resolved', resolved_at: new Date().toISOString() });
  else if (ISSUE_ACTION === 'reopened') await patchFlags(`issue_number=eq.${n}`, { status: 'filed', resolved_at: null });
  console.log(`Issue #${n} ${ISSUE_ACTION}: flags updated.`);
  process.exit(0);
}

// --- file new flags ---
const flags = await supa('question_flags?status=eq.new&order=created_at.asc&limit=500&select=*', { headers: { Prefer: '' } });
if (!flags.length) { console.log('No new flags.'); process.exit(0); }

for (const [name, color, description] of [[LABEL, 'b60205', 'Reported by players from inside the game'], ...Object.values(REASONS).map(r => [r.label, r.color, `Players flagged: ${r.text.toLowerCase()}`])])
  await gh('labels', { method: 'POST', body: JSON.stringify({ name, color, description }), okStatus: [422] }); // 422 = already exists

// open flag issues, found by the hidden question-id marker in their body
const open = new Map();
for (let page = 1; ; page++) {
  const list = await gh(`issues?labels=${encodeURIComponent(LABEL)}&state=open&per_page=100&page=${page}`);
  for (const i of list) { const m = /<!-- qid:(.+?) -->/.exec(i.body || ''); if (m) open.set(m[1], i.number); }
  if (list.length < 100) break;
}

const byQuestion = new Map();
for (const f of flags) { if (!byQuestion.has(f.question_id)) byQuestion.set(f.question_id, []); byQuestion.get(f.question_id).push(f); }

const cell = s => String(s ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
const rows = list => list.map(f => `| ${REASONS[f.reason]?.icon || ''} ${REASONS[f.reason]?.text || f.reason} | ${cell(f.note) || '—'} | ${f.source === 'phone' ? '📱 phone' : '🖥️ host'} | ${cell(f.app_version)} | ${f.created_at.slice(0, 10)} |`).join('\n');
const table = list => `| Reason | Note from the player | From | Version | Date |\n|---|---|---|---|---|\n${rows(list)}`;

for (const [qid, list] of byQuestion) {
  const f = list[0], labels = [LABEL, ...new Set(list.map(x => REASONS[x.reason]?.label).filter(Boolean))];
  let number = open.get(qid);
  if (number) {
    await gh(`issues/${number}/comments`, { method: 'POST', body: JSON.stringify({ body: `${list.length} more flag${list.length > 1 ? 's' : ''}:\n\n${table(list)}` }) });
    await gh(`issues/${number}/labels`, { method: 'POST', body: JSON.stringify({ labels }) });
  } else {
    const short = f.question && f.question.length > 80 ? f.question.slice(0, 77) + '…' : f.question || qid;
    const body = `**Question:** ${f.question || '(not sent)'}\n**Answer:** ${f.answer || '(not sent)'}\n**Category:** ${f.category || '?'} · **Difficulty:** ${f.tier || '?'}\n**Question id:** \`${qid}\` · bank v${f.bank_version ?? '?'}\n\n${table(list)}\n\nClose this issue once the question is fixed (or close it as *not planned* if no change is needed). Closing marks these flags resolved.\n<!-- qid:${qid} -->`;
    number = (await gh('issues', { method: 'POST', body: JSON.stringify({ title: `🚩 ${short}`, body, labels }) })).number;
    open.set(qid, number);
  }
  await patchFlags(`id=in.(${list.map(x => x.id).join(',')})`, { status: 'filed', issue_number: number });
  console.log(`${qid}: ${list.length} flag(s) → #${number}`);
}
