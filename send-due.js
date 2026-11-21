// Runs on GitHub Actions on the 1st of every month.
// Sends each student a push notification with their total due.
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) });
const db = admin.firestore();

const ist = new Date(Date.now() + 5.5 * 3600 * 1000);
const cur = ist.toISOString().slice(0, 7);
const MN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const mName = m => MN[+m.slice(5) - 1] + ' ' + m.slice(0, 4);
function monthsFrom(m) {
  const r = []; let y = +m.slice(0, 4), mo = +m.slice(5);
  const cy = +cur.slice(0, 4), cm = +cur.slice(5);
  while (y < cy || (y === cy && mo <= cm)) { r.push(y + '-' + String(mo).padStart(2, '0')); if (++mo > 12) { mo = 1; y++; } }
  return r;
}

(async () => {
  const [st, ok, pay, dues, tok] = await Promise.all(['students', 'ok', 'pay', 'dues', 'tokens'].map(c => db.collection(c).get()));
  const okSet = new Set(ok.docs.map(d => d.id));
  const paySet = new Set(pay.docs.map(d => d.id));
  const tokens = {}; tok.docs.forEach(d => tokens[d.id] = d.data().tokens || []);
  let sent = 0;

  for (const d of st.docs) {
    const s = d.data(), id = d.id;
    if (!(tokens[id] || []).length) continue;
    const joined = new Date(s.ts || Date.now()).toISOString().slice(0, 7);
    const items = monthsFrom(joined).map(m => ({ k: id + '_' + m, t: mName(m), a: +s.fee || 0 }));
    dues.docs.filter(x => x.data().sid === id).forEach(x => items.push({ k: 'due_' + x.id, t: x.data().title, a: +x.data().amt || 0 }));
    const pending = items.filter(i => !okSet.has(i.k) && !paySet.has(i.k));
    const total = pending.reduce((t, i) => t + i.a, 0);
    if (total <= 0) continue;
    const parts = pending.slice(0, 3).map(i => i.t).join(', ') + (pending.length > 3 ? ' +' + (pending.length - 3) + ' more' : '');
    const res = await admin.messaging().sendEachForMulticast({
      tokens: tokens[id],
      data: { title: 'SS Class 2.0: fee due', body: `Hi ${s.name}, your total due is Rs ${total} (${parts}). Please pay.` }
    });
    sent += res.successCount;
    const bad = tokens[id].filter((t, i) => !res.responses[i].success && /not-registered|invalid-registration/.test(res.responses[i].error?.code || ''));
    if (bad.length) await db.collection('tokens').doc(id).update({ tokens: admin.firestore.FieldValue.arrayRemove(...bad) });
  }
  console.log('Notifications sent:', sent);
})().catch(e => { console.error(e); process.exit(1); });
