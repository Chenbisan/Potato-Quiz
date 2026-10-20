// Question flags and player feedback: Supabase → GitHub issues (run by .github/workflows/question-flags.yml).
//  • Scheduled / manual run: new flags are filed as issues, one open issue per question (later flags become comments).
//    New feedback is filed as one issue each.
//  • Issue closed: its flags / feedback are marked resolved (or wontfix if closed as "not planned"). Reopened: back to filed.
// Everything players type is treated as untrusted: it can't @mention anyone, link, embed images or break the layout,
// and flagged questions are shown as they are in questions.json, not as the sender described them.
import { readFileSync } from 'node:fs';
const { SUPABASE_URL, SUPABASE_SECRET_KEY, GITHUB_TOKEN, REPO, EVENT, ISSUE_NUMBER, ISSUE_ACTION, ISSUE_STATE_REASON } = process.env;
if (!SUPABASE_SECRET_KEY) { console.log('::warning::SUPABASE_SECRET_KEY is not set yet (Settings → Secrets and variables → Actions), so flags were not checked.'); process.exit(0); }

const LABEL = 'question-flag', FB_LABEL = 'feedback', MAX_NEW_ISSUES = 20; // per run; the rest wait for the next run
const REASONS = {
  wrong: { label: 'flag: wrong answer', icon: '❌', text: 'Wrong answer', color: 'd73a4a' },
  confusing: { label: 'flag: confusing', icon: '🤔', text: 'Confusing', color: 'fbca04' },
  easy: { label: 'flag: too easy', icon: '😴', text: 'Too easy', color: '0e8a16' },
  hard: { label: 'flag: too hard', icon: '🧗', text: 'Too hard', color: '5319e7' },
  outdated: { label: 'flag: outdated', icon: '📅', text: 'Outdated', color: 'c5def5' },
  other: { label: 'flag: other', icon: '💬', text: 'Other', color: 'bfdadc' },
};
const KINDS = {
  suggestion: { label: 'feedback: suggestion', icon: '💡', text: 'Suggestion', color: 'a2eeef' },
  bug: { label: 'feedback: bug', icon: '🐞', text: 'Bug', color: 'd93f0b' },
  other: { label: 'feedback: other', icon: '💬', text: 'Other', color: 'ededed' },
};
const SOURCES = { host: '🖥️ host', phone: '📱 phone', menu: '🏠 menu', game: '🎮 in game' };

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
const patch = (table, filter, body) => supa(`${table}?${filter}`, { method: 'PATCH', body: JSON.stringify(body) });
const isUuid = s => /^[0-9a-f-]{36}$/i.test(s);

// Player text, made inert for Markdown: HTML and Markdown punctuation escaped, @mentions, #refs and URLs broken
// with an invisible character, and kept to one line (for table cells and titles)
const ZW = '​';
const inert = s => String(s ?? '').replace(/[\u0000-\u0008\u000b-\u001f\u007f‪-‮⁦-⁩]/g, '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/([\\`*_{}\[\]()#+!|~^-])/g, '\\$1')
  .replace(/@/g, `@${ZW}`).replace(/:\/\//g, `:${ZW}//`).replace(/\bwww\./gi, m => `${m.slice(0, 3)}${ZW}.`);
const line = s => inert(s).replace(/\s*\r?\n\s*/g, ' ').trim();
const title = s => String(s ?? '').replace(/[\u0000-\u001f\u007f‪-‮⁦-⁩]/g, ' ').replace(/@/g, `@${ZW}`).replace(/\s+/g, ' ').trim();
// a longer message: shown in a code block, where nothing is rendered (a fence inside the text can't close it early)
const block = s => '````text\n' + String(s ?? '').replace(/[\u0000-\u0008\u000b-\u001f\u007f‪-‮⁦-⁩]/g, '').replace(/`{3,}|~{3,}/g, m => m.split('').join(ZW)) + '\n````';
const short = (s, n) => s.length > n ? s.slice(0, n - 1) + '…' : s;

const ensureLabels = list => Promise.all(list.map(([name, color, description]) =>
  gh('labels', { method: 'POST', body: JSON.stringify({ name, color, description }), okStatus: [422] }))); // 422 = already exists

// --- an issue was closed or reopened: update what it was filed from ---
if (EVENT === 'issues') {
  const n = Number(ISSUE_NUMBER);
  const body = ISSUE_ACTION === 'closed' ? { status: ISSUE_STATE_REASON === 'not_planned' ? 'wontfix' : 'resolved', resolved_at: new Date().toISOString() }
    : ISSUE_ACTION === 'reopened' ? { status: 'filed', resolved_at: null } : null;
  if (body && Number.isInteger(n)) for (const table of ['question_flags', 'player_feedback']) await patch(table, `issue_number=eq.${n}`, body).catch(e => console.log(`::warning::${e.message}`));
  console.log(`Issue #${n} ${ISSUE_ACTION}: updated.`);
  process.exit(0);
}

let budget = MAX_NEW_ISSUES;

// --- file new flags ---
const flags = await supa('question_flags?status=eq.new&order=created_at.asc&limit=500&select=*', { headers: { Prefer: '' } });
if (flags.length) {
  const bank = new Map(JSON.parse(readFileSync('questions.json', 'utf8')).questions.map(q => [q.id, q]));
  await ensureLabels([[LABEL, 'b60205', 'Reported by players from inside the game'], ...Object.values(REASONS).map(r => [r.label, r.color, `Players flagged: ${r.text.toLowerCase()}`])]);

  // open flag issues, found by the hidden question-id marker in their body
  const open = new Map();
  for (let page = 1; ; page++) {
    const list = await gh(`issues?labels=${encodeURIComponent(LABEL)}&state=open&per_page=100&page=${page}`);
    for (const i of list) { const m = /<!-- qid:([\w-]+) -->/.exec(i.body || ''); if (m) open.set(m[1], i.number); }
    if (list.length < 100) break;
  }

  const byQuestion = new Map();
  for (const f of flags) { if (!byQuestion.has(f.question_id)) byQuestion.set(f.question_id, []); byQuestion.get(f.question_id).push(f); }

  const TIERS = { t1: 'Easy', t2: 'Medium', t3: 'Hard', t4: 'Obscure' };
  const rows = list => list.map(f => `| ${REASONS[f.reason]?.icon || ''} ${REASONS[f.reason]?.text || line(f.reason)} | ${line(f.note) || '—'} | ${SOURCES[f.source] || line(f.source)} | ${line(f.app_version)} | ${String(f.created_at).slice(0, 10)} |`).join('\n');
  const table = list => `| Reason | Note from the player | From | Version | Date |\n|---|---|---|---|---|\n${rows(list)}`;

  for (const [qid, list] of byQuestion) {
    const q = bank.get(qid), ids = list.map(x => x.id).filter(isUuid);
    if (!ids.length) continue;
    if (!q) { // a host's own question, or one since removed from the bank: nothing for us to fix
      await patch('question_flags', `id=in.(${ids.join(',')})`, { status: 'wontfix', resolved_at: new Date().toISOString() });
      console.log(`${line(qid)}: not in the bank, skipped`); continue;
    }
    const labels = [LABEL, ...new Set(list.map(x => REASONS[x.reason]?.label).filter(Boolean))];
    let number = open.get(qid);
    if (number) {
      await gh(`issues/${number}/comments`, { method: 'POST', body: JSON.stringify({ body: `${list.length} more flag${list.length > 1 ? 's' : ''}:\n\n${table(list)}` }) });
      await gh(`issues/${number}/labels`, { method: 'POST', body: JSON.stringify({ labels }) });
    } else {
      if (budget <= 0) continue;
      budget--;
      const body = `**Question:** ${line(q.q)}\n**Answer:** ${line(q.a)}\n**Wrong choices:** ${(q.wrong || []).map(line).join(' · ')}\n**Category:** \`${q.cat}\` · **Difficulty:** ${TIERS[q.tier] || q.tier}\n**Question id:** \`${qid}\` · as of this repo's questions.json\n\n${table(list)}\n\nClose this issue once the question is fixed (or close it as *not planned* if no change is needed). Closing marks these flags resolved.\n<!-- qid:${qid} -->`;
      number = (await gh('issues', { method: 'POST', body: JSON.stringify({ title: `🚩 ${short(title(q.q), 80)}`, body, labels }) })).number;
      open.set(qid, number);
    }
    await patch('question_flags', `id=in.(${ids.join(',')})`, { status: 'filed', issue_number: number });
    console.log(`${qid}: ${list.length} flag(s) → #${number}`);
  }
} else console.log('No new flags.');

// --- file new feedback ---
const feedback = budget > 0 ? await supa(`player_feedback?status=eq.new&order=created_at.asc&limit=${budget}&select=*`, { headers: { Prefer: '' } })
  .catch(e => { console.log(`::warning::Couldn't read player_feedback (has tools/supabase-feedback.sql been run?): ${e.message}`); return []; }) : [];
if (feedback.length) {
  await ensureLabels([[FB_LABEL, '1d76db', 'Sent by players from inside the game'], ...Object.values(KINDS).map(k => [k.label, k.color, `Player feedback: ${k.text.toLowerCase()}`])]);
  for (const f of feedback) {
    if (!isUuid(f.id)) continue;
    const k = KINDS[f.kind] || KINDS.other;
    const body = `**${k.icon} ${k.text}** from ${SOURCES[f.source] || line(f.source)} · version ${line(f.app_version) || '?'} · ${String(f.created_at).slice(0, 10)}\n\n${block(f.message)}\n\nClose this issue once it's handled (or close it as *not planned*).\n<!-- fid:${f.id} -->`;
    const number = (await gh('issues', { method: 'POST', body: JSON.stringify({ title: `${k.icon} ${short(title(f.message), 70)}`, body, labels: [FB_LABEL, k.label] }) })).number;
    await patch('player_feedback', `id=eq.${f.id}`, { status: 'filed', issue_number: number });
    console.log(`feedback ${f.id} → #${number}`);
  }
} else console.log('No new feedback.');
