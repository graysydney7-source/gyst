/* GYST — get your shit together. A planner for school, grad apps, work, and home. */
'use strict';
const $ = (q, r = document) => r.querySelector(q);
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-5);
const pad = n => String(n).padStart(2, '0');
const ymd = d => { d = new Date(d); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const parse = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const weekStart = d => { const x = new Date(d); x.setHours(0, 0, 0, 0); return addDays(x, -((x.getDay() + 6) % 7)); };
const today = () => ymd(new Date());
const daysBetween = (a, b) => Math.round((parse(b) - parse(a)) / 864e5);
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmtDate = (s, long) => { const d = parse(s); return long ? d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }) : `${MON[d.getMonth()]} ${d.getDate()}`; };
const fmtTime = t => { if (!t) return ''; let [h, m] = t.split(':').map(Number); const ap = h >= 12 ? 'pm' : 'am'; h = h % 12 || 12; return m ? `${h}:${pad(m)}${ap}` : `${h}${ap}`; };
const relDay = s => { const n = daysBetween(today(), s); return n === 0 ? 'Today' : n === 1 ? 'Tomorrow' : n === -1 ? 'Yesterday' : n < 0 ? `${-n}d ago` : n < 7 ? DOW[parse(s).getDay()] : fmtDate(s); };
const money = n => '$' + (+n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 });
const mins = t => { const [h, m] = (t || '0:0').split(':').map(Number); return h * 60 + m; };

/* ---------- icons ---------- */
const sv = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const I = {
  sun: sv('<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4"/>'),
  calendar: sv('<rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>'),
  tasks: sv('<path d="M4 6.5l1.8 1.8L9 5"/><path d="M4 12.5l1.8 1.8L9 11"/><path d="M4 18.5l1.8 1.8L9 17"/><path d="M12 7h8M12 13h8M12 19h8"/>'),
  book: sv('<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11"/><path d="M9 8h6"/>'),
  cap: sv('<path d="M2.5 9.5L12 5l9.5 4.5L12 14z"/><path d="M6.5 11.5v4c0 1.4 2.5 2.8 5.5 2.8s5.5-1.4 5.5-2.8v-4"/><path d="M21.5 9.5v5"/>'),
  bag: sv('<rect x="3.5" y="7.5" width="17" height="12" rx="2.5"/><path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5"/><path d="M3.5 12.5h17"/>'),
  house: sv('<path d="M3.5 11L12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5h4v5"/>'),
  flower: sv('<circle cx="12" cy="10" r="2.2"/><path d="M12 7.8c0-2.4 1-3.8 2.5-3.8s2 2 0 4.2M14.2 10c2.4 0 3.8 1 3.8 2.5s-2 2-4.2 0M12 12.2c0 2.4-1 3.8-2.5 3.8s-2-2 0-4.2M9.8 10C7.4 10 6 9 6 7.5s2-2 4.2 0"/><path d="M12 16v5M12 19c-1.5-1.5-3-1.5-4-1"/>'),
  star: sv('<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>'),
  sparkle: sv('<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>'),
  pen: sv('<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>'),
  timer: sv('<circle cx="12" cy="13" r="7.5"/><path d="M12 9v4l2.5 2"/><path d="M10 2.5h4"/>'),
  plus: sv('<path d="M12 5v14M5 12h14"/>'),
  x: sv('<path d="M6 6l12 12M18 6L6 18"/>'),
  left: sv('<path d="M15 6l-6 6 6 6"/>'),
  right: sv('<path d="M9 6l6 6-6 6"/>'),
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`,
  edit: sv('<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>'),
  trash: sv('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'),
  eye: sv('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
  play: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>`,
  pause: `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4.2" height="14" rx="1.2"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.2"/></svg>`,
  reset: sv('<path d="M4 12a8 8 0 1 0 2.5-5.8"/><path d="M4 4v4h4"/>'),
  skip: sv('<path d="M6 6l8 6-8 6z"/><path d="M18 6v12"/>'),
  cart: sv('<path d="M3 4h2l2.5 11h11L21 8H7"/><circle cx="9" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/>'),
  coin: sv('<circle cx="12" cy="12" r="8.5"/><path d="M14.5 9c-.5-1-1.5-1.5-2.5-1.5-1.5 0-2.5.8-2.5 2s1 1.7 2.5 2 2.5.8 2.5 2-1 2-2.5 2c-1.1 0-2-.5-2.5-1.5M12 6v1.5M12 16.5V18"/>'),
  broom: sv('<path d="M19 3l-7.5 7.5"/><path d="M11.5 10.5c-2.5-1-5 0-6 2.5L3 20.5l7.5-2.5c2.5-1 3.5-3.5 2.5-6z"/><path d="M6.5 15.5L9 18"/>'),
  heart: sv('<path d="M12 20s-7.5-4.5-7.5-10A4.3 4.3 0 0 1 12 7.2 4.3 4.3 0 0 1 19.5 10C19.5 15.5 12 20 12 20z"/>'),
  drop: `<svg viewBox="0 0 30 36" fill="currentColor"><path d="M6 6h18l-2.4 24a3 3 0 0 1-3 2.7h-7.2a3 3 0 0 1-3-2.7z" opacity=".95"/><path d="M5 6h20" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  reset2: sv('<path d="M4 5v14"/><path d="M8 12h11"/><path d="M15 7l5 5-5 5"/>'),
  backup: sv('<path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>'),
  link: sv('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'),
  bell: sv('<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>'),
  alarm: sv('<circle cx="12" cy="13" r="7.5"/><path d="M12 9.5V13h3"/><path d="M4 4.5l2.5-2M20 4.5l-2.5-2"/>'),
};

/* ---------- state ---------- */
const NATIVE = !!window.__GY_NATIVE;
let READONLY = false;
const DEFAULT_REQS = ['Statement of purpose', 'Personal / diversity statement', 'CV / resume', 'Transcripts sent', 'Letters of rec submitted', 'Test scores sent (if required)', 'Writing sample', 'Application fee paid'];
const reqs = list => list.map(text => ({ id: uid(), text, done: false }));
function seed() {
  const t = today(), d = n => ymd(addDays(new Date(), n));
  const c1 = uid(), c2 = uid();
  return {
    v: 1, name: '', created: t,
    tasks: [
      { id: uid(), text: 'Make an iced coffee & clear my inbox', date: t, list: 'personal', pri: 1, done: false },
      { id: uid(), text: 'Email professor about a rec letter', date: t, list: 'grad', pri: 2, done: false },
      { id: uid(), text: 'Pick up my work schedule for next week', date: d(1), list: 'work', pri: 1, done: false },
      { id: uid(), text: 'Return library books', date: d(2), list: 'errands', pri: 1, done: false },
      { id: uid(), text: 'Deep clean my room & reorganize the vanity', date: null, list: 'home', pri: 1, done: false },
    ],
    events: [
      { id: uid(), title: 'Study group', date: d(1), time: '18:00', end: '19:30', color: '#a3bdd3', notes: '' },
      { id: uid(), title: 'Pilates w/ the girls 🎀', date: d(3), time: '08:30', end: '09:30', color: '#e58fa6', notes: '' },
    ],
    courses: [
      { id: c1, name: 'Research Methods', code: 'PSY 340', color: '#e58fa6', days: [1, 3], start: '10:00', end: '11:15', room: 'Hall 204', prof: '' },
      { id: c2, name: 'Senior Seminar', code: 'PSY 490', color: '#c8a284', days: [2, 4], start: '13:00', end: '14:15', room: '', prof: '' },
    ],
    assignments: [
      { id: uid(), course: c1, title: 'Read chapter 5', type: 'reading', due: d(1), done: false, grade: '' },
      { id: uid(), course: c1, title: 'Lit review draft', type: 'paper', due: d(4), done: false, grade: '' },
      { id: uid(), course: c2, title: 'Midterm exam', type: 'exam', due: d(9), done: false, grade: '' },
    ],
    apps: [
      { id: uid(), school: 'Dream School', program: 'M.A. program (example)', deadline: d(42), status: 'progress', fee: 75, link: '', notes: '', reqs: reqs(DEFAULT_REQS) },
      { id: uid(), school: 'Safety-but-still-cute School', program: 'M.S. program (example)', deadline: d(60), status: 'research', fee: 60, link: '', notes: '', reqs: reqs(DEFAULT_REQS) },
    ],
    recs: [
      { id: uid(), name: 'Favorite professor', role: 'Research advisor', status: 'toask', asked: '', notes: '' },
    ],
    shifts: [
      { id: uid(), date: d(1), start: '16:00', end: '21:00', role: 'Closing', notes: '' },
      { id: uid(), date: d(4), start: '10:00', end: '16:00', role: '', notes: '' },
    ],
    weekNotes: {}, weekPri: {}, planned: {},
    chores: [
      { id: uid(), text: 'Make my bed', room: 'My room', freq: 1, last: d(-1), who: 'me' },
      { id: uid(), text: 'Laundry', room: 'Laundry', freq: 7, last: d(-5), who: 'me' },
      { id: uid(), text: 'Reset my desk & vanity', room: 'My room', freq: 7, last: d(-6), who: 'me' },
      { id: uid(), text: 'Unload the dishwasher', room: 'Kitchen', freq: 2, last: d(-2), who: 'shared' },
      { id: uid(), text: 'Take out the trash', room: 'Kitchen', freq: 7, last: d(-3), who: 'shared' },
      { id: uid(), text: 'Clean the bathroom', room: 'Bathroom', freq: 7, last: d(-7), who: 'shared' },
    ],
    grocery: [
      { id: uid(), text: 'Oat milk', cat: 'Dairy', done: false },
      { id: uid(), text: 'Matcha', cat: 'Pantry', done: false },
      { id: uid(), text: 'Berries', cat: 'Produce', done: false },
    ],
    bills: [
      { id: uid(), name: 'Phone', amount: 0, day: 5, paid: {} },
      { id: uid(), name: 'Subscriptions', amount: 0, day: 12, paid: {} },
      { id: uid(), name: 'Car insurance', amount: 0, day: 20, paid: {} },
    ],
    workouts: [
      { id: uid(), date: t, title: 'Hot girl walk', type: 'walk', mins: 30, done: false },
      { id: uid(), date: d(1), title: 'Mat pilates', type: 'pilates', mins: 30, done: false },
      { id: uid(), date: d(3), title: 'Yoga flow', type: 'yoga', mins: 20, done: false },
    ],
    goals: [
      { id: uid(), title: 'Submit every grad application', cat: 'Career', why: 'Future me is going to be so proud.', target: '', color: '#e58fa6', progress: 0,
        ms: [{ id: uid(), text: 'Finalize my program list', done: true }, { id: uid(), text: 'Ask my recommenders', done: false }, { id: uid(), text: 'Write my statement of purpose', done: false }, { id: uid(), text: 'Hit submit on all of them', done: false }] },
      { id: uid(), title: 'Save $1,000', cat: 'Money', why: 'Application fees + a little cushion.', target: '', color: '#c8a284', progress: 0,
        ms: [{ id: uid(), text: 'Open a high-yield savings account', done: false }, { id: uid(), text: 'Auto-save part of every paycheck', done: false }] },
    ],
    habits: [
      { id: uid(), name: 'Drink water', icon: '💧', log: {} },
      { id: uid(), name: 'Skincare', icon: '🧴', log: {} },
      { id: uid(), name: 'Move my body', icon: '🧘‍♀️', log: {} },
      { id: uid(), name: 'Study 1 hour', icon: '📚', log: {} },
      { id: uid(), name: 'Make my bed', icon: '🛏️', log: {} },
      { id: uid(), name: 'Read 10 pages', icon: '📖', log: {} },
    ],
    journal: {}, water: {}, focus: {},
    settings: { view: 'today', sound: {}, sparkles: true, weeklyMins: 150, waterGoal: 8, payRate: 0, remindersOn: false, rem: {} }
  };
}
function migrate(s) {
  const d = seed();
  for (const k in d) if (s[k] === undefined) s[k] = Array.isArray(d[k]) ? [] : (typeof d[k] === 'object' ? {} : d[k]);
  s.settings = Object.assign({}, d.settings, s.settings || {});
  return s;
}
function load() {
  if (NATIVE) {
    const raw = window.__GY_SAVED_RAW;
    if (raw == null || raw === '') return seed();
    try { return migrate(JSON.parse(raw)); }
    catch (e) { READONLY = true; setTimeout(() => toast('⚠️ Couldn’t read your saved data — changes won’t be saved. A daily backup is in ~/Library/Application Support/GYST/backups'), 800); return seed(); }
  }
  try { const r = localStorage.getItem('gyst'); if (r) return migrate(JSON.parse(r)); } catch (e) { }
  return seed();
}
let S = load();
let saveT;
function save() {
  if (READONLY) return;
  clearTimeout(saveT);
  saveT = setTimeout(() => {
    const json = JSON.stringify(S);
    try { window.webkit.messageHandlers.save.postMessage(json); } catch (e) { }
    try { localStorage.setItem('gyst', json); } catch (e) { }
    queueReminders();
  }, 250);
}
window.GY = {
  flush() {
    if (READONLY) return; clearTimeout(saveT); const json = JSON.stringify(S);
    try { window.webkit.messageHandlers.save.postMessage(json); } catch (e) { }
    try { localStorage.setItem('gyst', json); } catch (e) { }
  },
  importData(json) {
    try { const d = JSON.parse(json); if (!d || !Array.isArray(d.tasks)) throw 0; S = migrate(d); READONLY = false; save(); render(); toast('🎀 Backup restored'); }
    catch (e) { toast('That file doesn’t look like a GYST backup'); }
  }
};

/* ---------- ui state ---------- */
const UI = { view: S.settings.view || 'today', week: 0, ahead: 1, shiftWeek: 0, moveWeek: 0, taskFilter: 'today', showDone: false, jDate: today(), aFilter: 'upcoming', aCourse: '', choreWho: 'all' };
const VIEWS = [
  { id: 'today', name: 'Today', icon: 'sun' },
  { id: 'planner', name: 'Planner', icon: 'calendar' },
  { id: 'ahead', name: 'Sunday Reset', icon: 'reset2', hint: 'plan' },
  { id: 'tasks', name: 'To-dos', icon: 'tasks' },
  { sep: true },
  { id: 'school', name: 'School', icon: 'book' },
  { id: 'grad', name: 'Grad Apps', icon: 'cap' },
  { id: 'work', name: 'Work & Money', icon: 'bag' },
  { id: 'home', name: 'Home', icon: 'house' },
  { sep: true },
  { id: 'wellness', name: 'Wellness', icon: 'flower' },
  { id: 'goals', name: 'Goals', icon: 'star' },
  { id: 'habits', name: 'Habits', icon: 'sparkle' },
  { id: 'journal', name: 'Journal', icon: 'pen' },
  { id: 'focus', name: 'Study Timer', icon: 'timer' },
];
if (!VIEWS.some(v => v.id === UI.view)) UI.view = 'today';

/* ---------- derived ---------- */
const byId = (arr, id) => arr.find(x => x.id === id);
const tasksDue = () => S.tasks.filter(t => !t.done && t.date && t.date <= today());
const choreDue = c => { if (!c.last) return 0; return c.freq - daysBetween(c.last, today()); }; // <=0 due
const choresDue = () => S.chores.filter(c => choreDue(c) <= 0);
function habitStreak(h) {
  let n = 0, d = new Date();
  if (!h.log[ymd(d)]) d = addDays(d, -1);
  while (h.log[ymd(d)]) { n++; d = addDays(d, -1); }
  return n;
}
const goalPct = g => g.ms && g.ms.length ? Math.round(g.ms.filter(m => m.done).length / g.ms.length * 100) : (g.progress || 0);
const appPct = a => a.reqs && a.reqs.length ? Math.round(a.reqs.filter(r => r.done).length / a.reqs.length * 100) : 0;
const course = id => byId(S.courses, id) || { name: 'General', code: '', color: '#c8a284' };
const classesOn = k => { const wd = parse(k).getDay(); return S.courses.filter(c => (c.days || []).includes(wd)).sort((a, b) => (a.start || '99').localeCompare(b.start || '99')); };
const dueOn = k => S.assignments.filter(a => a.due === k);
const openAssign = () => S.assignments.filter(a => !a.done);
const appsOpen = () => S.apps.filter(a => ['research', 'progress'].includes(a.status));
const shiftHrs = s => { let m = mins(s.end) - mins(s.start); if (m < 0) m += 1440; return m / 60; };
const hrsIn = days => S.shifts.filter(s => days.includes(s.date)).reduce((a, s) => a + shiftHrs(s), 0);
const fmtHrs = h => (Math.round(h * 10) / 10).toString().replace(/\.0$/, '');
const weekDays = off => { const ws = addDays(weekStart(new Date()), off * 7); return Array.from({ length: 7 }, (_, i) => ymd(addDays(ws, i))); };
const ordinal = n => n + (['th', 'st', 'nd', 'rd'][(n % 10 > 3 || [11, 12, 13].includes(n % 100)) ? 0 : n % 10]);

const QUOTES = [
  'Romanticize the boring parts.', 'Discipline is self-love in disguise.', 'You don’t have to do it all today — just the next thing.',
  'Clean space, clear mind.', 'Future you is already proud.', 'Hydrate, prioritize, romanticize.', 'Done is better than perfect.',
  'She believed she could, so she made a to-do list.', 'Soft life, sharp plans.', 'It’s giving organized.', 'Rest is productive too.',
  'Every application is a door you opened yourself.', 'Small steps, every single day.', 'Main character energy, side-quest discipline.',
  'You’re allowed to be a work in progress and a masterpiece.', 'Stay focused and extra sparkly.'
];
const PROMPTS = [
  'What made today feel like a good day?', 'What am I proud of this week?', 'What’s stressing me out — and what’s one tiny step I can take?',
  'Why do I want to go to grad school? (Hello, future statement of purpose.)', 'What does my dream life look like five years from now?',
  'Something I’m ready to let go of…', 'A little win from today…', 'What does future me need from me right now?', 'Who do I want to thank, and why?'
];
const doy = () => Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 864e5);
const MOODS = [['🌧️', 'rough'], ['😮‍💨', 'stressed'], ['🙂', 'okay'], ['☕', 'good'], ['✨', 'thriving']];
const LISTS = { personal: 'Personal', school: 'School', grad: 'Grad apps', work: 'Work', home: 'Home', errands: 'Errands' };
const CATS = ['Produce', 'Pantry', 'Dairy', 'Meat & Fish', 'Bakery', 'Frozen', 'Snacks', 'Beauty & care', 'Household', 'Other'];
const FREQ = [[1, 'Daily'], [2, 'Every 2 days'], [3, 'Every 3 days'], [7, 'Weekly'], [14, 'Every 2 weeks'], [30, 'Monthly']];
const WHO = { me: 'Me', shared: 'Shared' };
const COLORS = ['#e58fa6', '#d0607f', '#c8a284', '#8a6450', '#9fb08f', '#a3bdd3', '#e8c98a', '#b9a3cf'];
const WTYPES = { pilates: ['🤍', '#e58fa6'], yoga: ['🧘‍♀️', '#b9a3cf'], walk: ['🚶‍♀️', '#9fb08f'], run: ['🏃‍♀️', '#d0607f'], strength: ['🏋️‍♀️', '#8a6450'], stretch: ['🌿', '#9fb08f'], dance: ['💃', '#e8c98a'], other: ['✨', '#c8a284'] };
const GCATS = ['School', 'Career', 'Money', 'Health', 'Glow-up', 'Home', 'Mind', 'Relationships', 'Fun'];
const ATYPES = { assignment: ['📝', 'Assignment'], reading: ['📖', 'Reading'], quiz: ['✏️', 'Quiz'], exam: ['🧠', 'Exam'], paper: ['📄', 'Paper'], project: ['🗂️', 'Project'], lab: ['🔬', 'Lab'], presentation: ['🎤', 'Presentation'] };
const BIG = ['exam', 'paper', 'project', 'presentation'];
const STATUS = {
  research: ['Researching', '#f1ece6', '#7a6457'], progress: ['In progress', '#f6ead0', '#8d6a2c'], submitted: ['Submitted', '#e3ebf3', '#4f6d8a'],
  interview: ['Interview', '#ece4f4', '#6f5a8f'], accepted: ['Accepted 🎉', '#fbe0e7', '#c24a6c'], waitlist: ['Waitlisted', '#efefe4', '#6d6d4a'], rejected: ['Not this time', '#efe9e7', '#8a7b77']
};
const RSTATUS = { toask: ['To ask', '#f1ece6', '#7a6457'], asked: ['Asked', '#f6ead0', '#8d6a2c'], agreed: ['Said yes 🤍', '#fbe0e7', '#c24a6c'], submitted: ['Submitted ✓', '#e4ecdb', '#5b7148'] };
const pill = (map, k) => { const [l, bg, fg] = map[k] || map[Object.keys(map)[0]]; return `style="--s-bg:${bg};--s-fg:${fg}"`; };

/* ---------- small renderers ---------- */
const check = (on, act, id, extra = '') => `<button class="check ${on ? 'on' : ''}" data-act="${act}" data-id="${id}" ${extra}>${I.check}</button>`;
const cardH = (icon, title, meta = '', right = '') => `<div class="card-h"><div class="ico">${I[icon]}</div><h2>${title}</h2>${meta ? `<span class="meta">${meta}</span>` : ''}${right}</div>`;
const empty = t => `<div class="empty">${t}</div>`;
const chev = d => (d < 0 ? I.left : I.right).replace('<svg', '<svg width="14" height="14"');
function dueChip(k, done) {
  const n = daysBetween(today(), k);
  return `<span class="chip ${done ? '' : n < 0 ? 'warn' : n <= 2 ? 'gold' : ''}">${n < 0 && !done ? `${-n}d late` : relDay(k)}</span>`;
}
function taskRow(t, opts = {}) {
  const chips = [];
  if (t.date && opts.showDate !== false) {
    const n = daysBetween(today(), t.date);
    chips.push(`<span class="chip ${n < 0 && !t.done ? 'warn' : ''}">${relDay(t.date)}</span>`);
  }
  if (opts.showList) chips.push(`<span class="chip ${t.list === 'grad' ? 'pink' : ''}">${LISTS[t.list] || 'Personal'}</span>`);
  return `<div class="row ${t.done ? 'done' : ''} pri-${t.pri || 1}">${check(t.done, 'toggleTask', t.id)}<span class="txt">${esc(t.text)}</span>${chips.join('')}
    <span class="acts"><button class="icon-btn" data-act="editTask" data-id="${t.id}" title="Edit">${I.edit}</button><button class="icon-btn" data-act="delTask" data-id="${t.id}" title="Delete">${I.x}</button></span></div>`;
}
function assignRow(a, opts = {}) {
  const c = course(a.course), [em, tl] = ATYPES[a.type] || ATYPES.assignment;
  return `<div class="row ${a.done ? 'done' : ''}">${check(a.done, 'toggleAssign', a.id)}<span class="type-ico" style="--c:${c.color}" title="${tl}">${em}</span>
    <span class="txt">${esc(a.title)}${opts.showCourse !== false ? `<br><small class="muted">${esc(c.code || c.name)}${a.time ? ` · ${fmtTime(a.time)}` : ''}</small>` : ''}</span>
    ${a.done && a.grade ? `<span class="grade">${esc(a.grade)}</span>` : ''}${a.due ? dueChip(a.due, a.done) : ''}
    <span class="acts"><button class="icon-btn" data-act="editAssign" data-id="${a.id}" title="Edit">${I.edit}</button><button class="icon-btn" data-act="delAssign" data-id="${a.id}" title="Delete">${I.x}</button></span></div>`;
}
function ring(pct, size = 74, stroke = 7) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return `<div class="ring" style="width:${size}px;height:${size}px"><svg viewBox="0 0 ${size} ${size}"><circle class="bg" cx="${size / 2}" cy="${size / 2}" r="${r}"/><circle class="fg" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - pct / 100)}"/></svg><b>${pct}%</b></div>`;
}
function weekNav(key, label) {
  return `<div class="seg"><button data-act="weekNav" data-k="${key}" data-d="-1">${chev(-1)}</button><button data-act="weekNav" data-k="${key}" data-d="0" class="${UI[key] === 0 ? 'on' : ''}">${label}</button><button data-act="weekNav" data-k="${key}" data-d="1">${chev(1)}</button></div>`;
}
function weekLabel(ws) {
  const we = addDays(ws, 6);
  return ws.getMonth() === we.getMonth() ? `${MON[ws.getMonth()]} ${ws.getDate()} – ${we.getDate()}` : `${MON[ws.getMonth()]} ${ws.getDate()} – ${MON[we.getMonth()]} ${we.getDate()}`;
}
const classTime = c => c.start ? `${fmtTime(c.start)}${c.end ? '–' + fmtTime(c.end) : ''}` : '';
const classDays = c => (c.days || []).slice().sort((a, b) => ((a + 6) % 7) - ((b + 6) % 7)).map(d => DOW[d]).join('/');
// classes, shifts and events for one day, in time order
function agendaFor(k) {
  const items = [
    ...classesOn(k).map(c => ({ t: c.start, html: `<div class="agenda-item" data-act="editCourse" data-id="${c.id}" style="cursor:pointer"><span class="agenda-time">${c.start ? fmtTime(c.start) : 'class'}</span><span class="ev-bar" style="background:${c.color}"></span><span class="txt">${esc(c.name)}<br><small>${esc([c.code, c.room].filter(Boolean).join(' · '))}</small></span></div>` })),
    ...S.shifts.filter(s => s.date === k).map(s => ({ t: s.start, html: `<div class="agenda-item" data-act="editShift" data-id="${s.id}" style="cursor:pointer"><span class="agenda-time">${fmtTime(s.start)}</span><span class="ev-bar" style="background:var(--mocha)"></span><span class="txt">Work${s.role ? ` — ${esc(s.role)}` : ''}<br><small>until ${fmtTime(s.end)} · ${fmtHrs(shiftHrs(s))}h</small></span></div>` })),
    ...S.events.filter(e => e.date === k).map(e => ({ t: e.time, html: `<div class="agenda-item" data-act="editEvent" data-id="${e.id}" style="cursor:pointer"><span class="agenda-time">${e.time ? fmtTime(e.time) : 'all day'}</span><span class="ev-bar" style="background:${e.color}"></span><span class="txt">${esc(e.title)}${e.end ? `<br><small>until ${fmtTime(e.end)}</small>` : ''}</span></div>` })),
  ];
  return items.sort((a, b) => (a.t || '00').localeCompare(b.t || '00')).map(x => x.html);
}
// class/shift/deadline chips for planner days
function fixedFor(k) {
  return [
    ...classesOn(k).map(c => `<button class="ev cls" style="--c:${c.color}" data-act="editCourse" data-id="${c.id}"><small>${classTime(c)}</small>${esc(c.code || c.name)}</button>`),
    ...S.shifts.filter(s => s.date === k).map(s => `<button class="ev shift" data-act="editShift" data-id="${s.id}"><small>${fmtTime(s.start)} – ${fmtTime(s.end)}</small>Work${s.role ? ` · ${esc(s.role)}` : ''}</button>`),
  ].join('') + dueOn(k).map(a => `<div class="day-extra ${a.done ? '' : 'due'}">${(ATYPES[a.type] || ATYPES.assignment)[0]} ${esc(a.title)}${a.done ? ' ✓' : ' due'}</div>`).join('')
    + S.apps.filter(a => a.deadline === k).map(a => `<div class="day-extra due">🎓 ${esc(a.school)} deadline</div>`).join('');
}

/* ---------- reminders (macOS notifications) ---------- */
// the native shell only schedules what it's handed; everything about *what* to remind lives here so it can ship as an update
const CAN_NOTIFY = NATIVE && !!(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.notifySchedule);
const REM_DEFAULTS = { morning: '08:00', classMins: 15, shiftMins: 30, eventMins: 15, dueNight: '19:00', apps: true, sunday: '18:00', water: false };
const rem = () => Object.assign({}, REM_DEFAULTS, S.settings.rem || {});
const post = (name, body = '') => { try { window.webkit.messageHandlers[name].postMessage(body); } catch (e) { } };
window.GYNotify = {
  status(st) {
    const was = UI.notify; UI.notify = st;
    if (st === 'granted' && S.settings.remindersOn) syncReminders();
    if (was !== st) { if (UI.view === 'today') render(); if (UI.remOpen && $('#modal-root').innerHTML) A.reminders(); }
  }
};
const at = (k, hm, minsBefore = 0) => { const [h, m] = (hm || '09:00').split(':').map(Number); const d = parse(k); d.setHours(h, m - minsBefore, 0, 0); return +d; };
function buildReminders() {
  const r = rem(), out = [], now = Date.now(), days = Array.from({ length: 8 }, (_, i) => ymd(addDays(new Date(), i)));
  const add = (id, when, title, body) => { if (when > now + 30000) out.push({ id, at: when, title, body }); };
  for (const k of days) {
    const cls = classesOn(k), sh = S.shifts.filter(x => x.date === k), dueT = S.assignments.filter(a => !a.done && a.due === k), todos = S.tasks.filter(t => !t.done && t.date === k);
    if (r.morning) {
      const bits = [];
      if (cls.length) bits.push(`${cls.length} class${cls.length > 1 ? 'es' : ''} (first at ${fmtTime(cls[0].start)})`);
      sh.forEach(x => bits.push(`work ${fmtTime(x.start)}–${fmtTime(x.end)}`));
      if (dueT.length) bits.push(`${dueT.length} thing${dueT.length > 1 ? 's' : ''} due`);
      if (todos.length) bits.push(`${todos.length} to-do${todos.length > 1 ? 's' : ''}`);
      add(`morning-${k}`, at(k, r.morning), 'Good morning ☀️', bits.length ? `Today: ${bits.join(' · ')}.` : 'Nothing on the calendar today. Make it a good one.');
    }
    if (r.classMins) cls.forEach(c => c.start && add(`class-${c.id}-${k}`, at(k, c.start, +r.classMins), `${c.code || c.name} in ${r.classMins} min`, [c.name, c.room].filter(Boolean).join(' · ')));
    if (r.shiftMins) sh.forEach(x => add(`shift-${x.id}`, at(k, x.start, +r.shiftMins), `Work in ${r.shiftMins} min`, `${fmtTime(x.start)} – ${fmtTime(x.end)}${x.role ? ' · ' + x.role : ''}`));
    if (r.eventMins) S.events.filter(e => e.date === k && e.time).forEach(e => add(`event-${e.id}`, at(k, e.time, +r.eventMins), `${e.title}`, `Starts at ${fmtTime(e.time)}`));
    if (r.dueNight) {
      const tomorrow = ymd(addDays(parse(k), 1));
      S.assignments.filter(a => !a.done && a.due === tomorrow).forEach(a => add(`due-${a.id}`, at(k, r.dueNight), `Due tomorrow: ${a.title}`, `${course(a.course).code || course(a.course).name} · ${(ATYPES[a.type] || ATYPES.assignment)[1]}`));
      const in3 = ymd(addDays(parse(k), 3));
      S.assignments.filter(a => !a.done && a.due === in3 && BIG.includes(a.type)).forEach(a => add(`big-${a.id}`, at(k, r.dueNight), `${(ATYPES[a.type] || ATYPES.assignment)[1]} in 3 days: ${a.title}`, 'A little bit each day — you’ve got this.'));
    }
    if (r.apps) appsOpen().filter(a => a.deadline).forEach(a => {
      const left = daysBetween(k, a.deadline);
      if (left === 7 || left === 1) add(`app-${a.id}-${left}`, at(k, '09:00'), `${a.school} is due ${left === 1 ? 'tomorrow' : 'in a week'} 🎓`, `${appPct(a)}% of the checklist done.`);
    });
    if (r.sunday && parse(k).getDay() === 0 && !S.planned[ymd(addDays(parse(k), 1))]) add(`sunday-${k}`, at(k, r.sunday), 'Sunday reset 🎀', 'Ten minutes to plan next week. Future you says thank you.');
    if (r.water) ['11:00', '14:00', '17:00'].forEach(t => add(`water-${k}-${t}`, at(k, t), 'Water check 💧', 'Have a glass of water.'));
  }
  return out.sort((a, b) => a.at - b.at).slice(0, 60);
}
let remT;
function syncReminders() { if (CAN_NOTIFY && UI.notify === 'granted') post('notifySchedule', JSON.stringify(S.settings.remindersOn ? buildReminders() : [])); }
function queueReminders() { clearTimeout(remT); remT = setTimeout(syncReminders, 1500); }

/* ---------- views ---------- */
const R = {};

R.today = () => {
  const t = today(), h = new Date().getHours();
  const greet = h < 5 ? 'Up late' : h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : h < 21 ? 'Good evening' : 'Good night';
  const agenda = agendaFor(t);
  const due = S.tasks.filter(x => x.date && x.date <= t && (!x.done || x.doneOn === t)).sort((a, b) => a.done - b.done || (b.pri || 1) - (a.pri || 1));
  const soon = S.assignments.filter(a => !a.done && a.due && a.due <= ymd(addDays(new Date(), 7))).sort((a, b) => a.due.localeCompare(b.due));
  const nextApp = appsOpen().filter(a => a.deadline && a.deadline >= t).sort((a, b) => a.deadline.localeCompare(b.deadline))[0];
  const wo = S.workouts.filter(w => w.date === t);
  const water = S.water[t] || 0, wg = S.settings.waterGoal || 8;
  const j = S.journal[t] || {};
  const cd = choresDue();
  const doneH = S.habits.filter(x => x.log[t]).length;
  const wd = weekDays(0), hrs = hrsIn(wd), rate = +S.settings.payRate || 0;
  const shiftToday = S.shifts.filter(s => s.date === t);
  const nextShift = S.shifts.filter(s => s.date > t).sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start))[0];
  const nudgeSunday = [0, 5, 6].includes(new Date().getDay()) && !S.planned[ymd(addDays(weekStart(new Date()), 7))];
  return `<div class="page">
    <div class="head"><div class="titles">
      <div class="eyebrow">${fmtDate(t, true)} · ${Scene.label()}</div>
      <h1>${greet}${S.name ? `, <i>${esc(S.name)}</i>` : ''}.</h1>
      <div class="quote">“${QUOTES[doy() % QUOTES.length]}”</div>
    </div>
    <button class="btn ${nudgeSunday ? 'primary' : ''}" data-act="planAhead">${I.reset2} Sunday reset</button>
    <button class="btn" data-act="sceneMode">${I.eye} Vibe mode</button></div>

    ${CAN_NOTIFY && UI.notify === 'notDetermined' && !S.settings.remAsked ? `<div class="card glass" style="display:flex;align-items:center;gap:14px;margin-bottom:16px;padding:14px 18px"><div class="card-h" style="margin:0"><div class="ico">${I.bell}</div></div><div style="flex:1"><b style="font-weight:500">Want reminders?</b><div class="muted" style="font-size:12.5px">Classes, shifts, due dates, grad deadlines and a good-morning summary — even when GYST is closed.</div></div><button class="btn ghost sm" data-act="remLater">Not now</button><button class="btn primary sm" data-act="notifyOn">Turn on</button></div>` : ''}
    <div class="grid porch-grid">
      <div class="card glass rowspan2 feature">
        ${cardH('sun', 'Today', `${due.filter(x => x.done).length}/${due.length} done`)}
        ${agenda.join('')}
        ${agenda.length && due.length ? '<div class="section-label">to-dos</div>' : ''}
        <div class="list">${due.map(x => taskRow(x, { showDate: x.date < t })).join('')}</div>
        ${!agenda.length && !due.length ? empty('Nothing on the books. A rare and beautiful thing.') : ''}
        <form class="inline-add" data-submit="quickTask"><input name="text" type="text" placeholder="Add something for today…" autocomplete="off"><button class="btn sm">${I.plus}</button></form>
      </div>

      <div class="card glass">
        ${cardH('book', 'Due soon', soon.length ? `${soon.length} this week` : '', `<button class="btn ghost sm" data-go="school">School</button>`)}
        <div class="list">${soon.slice(0, 5).map(a => assignRow(a)).join('') || empty('Nothing due this week. Get ahead or take a breather.')}</div>
      </div>

      <div class="card glass">
        ${cardH('cap', 'Grad apps', `${S.apps.filter(a => !['research', 'progress'].includes(a.status)).length}/${S.apps.length} sent`, `<button class="btn ghost sm" data-go="grad">Open</button>`)}
        ${nextApp ? `<div class="countdown"><b>${daysBetween(t, nextApp.deadline)}</b><span>days until<br><b style="font-size:13px;font-family:var(--sans);color:var(--ink)">${esc(nextApp.school)}</b></span></div>` : ''}
        ${S.apps.filter(a => ['research', 'progress'].includes(a.status)).slice(0, 3).map(a => `<div class="goal-mini"><div class="t"><span>${esc(a.school)}</span><span class="muted">${appPct(a)}%</span></div><div class="bar"><i style="width:${appPct(a)}%"></i></div></div>`).join('') || empty(S.apps.length ? 'Everything’s submitted. Iconic.' : 'Add the programs you’re applying to.')}
      </div>

      <div class="card glass span2">
        ${cardH('sparkle', 'Habits', `${doneH}/${S.habits.length} today`, `<button class="btn ghost sm" data-go="habits">All</button>`)}
        <div class="habit-chips">${S.habits.map(x => `<button class="hchip ${x.log[t] ? 'on' : ''}" data-act="toggleHabit" data-id="${x.id}" data-date="${t}"><span class="em">${x.icon}</span>${esc(x.name)}${habitStreak(x) > 1 ? `<small>${habitStreak(x)}d</small>` : ''}</button>`).join('') || empty('Add a habit in the Habits tab.')}</div>
      </div>

      <div class="card glass">
        ${cardH('heart', 'Check in')}
        <div class="moods">${MOODS.map(([e, l], i) => `<button class="mood ${j.mood === i ? 'on' : ''}" data-act="setMood" data-i="${i}" data-date="${t}">${e}<small>${l}</small></button>`).join('')}</div>
        <input type="text" style="width:100%;margin-top:10px;font-family:var(--serif);font-size:14.5px" placeholder="One thing I’m grateful for…" value="${esc((j.g || [])[0] || '')}" data-input="journal" data-date="${t}" data-field="g0">
      </div>

      <div class="card glass">
        ${cardH('bag', 'Work', hrs ? `${fmtHrs(hrs)}h this week` : '', `<button class="btn ghost sm" data-go="work">Shifts</button>`)}
        ${shiftToday.length ? shiftToday.map(s => `<div class="row"><span class="txt"><b style="font-weight:500">Working today</b><br><small class="muted">${fmtTime(s.start)} – ${fmtTime(s.end)}${s.role ? ` · ${esc(s.role)}` : ''}</small></span><span class="chip">${fmtHrs(shiftHrs(s))}h</span></div>`).join('')
          : nextShift ? `<div class="row"><span class="txt">Next shift<br><small class="muted">${relDay(nextShift.date)} · ${fmtTime(nextShift.start)} – ${fmtTime(nextShift.end)}</small></span></div>` : empty('No shifts on the calendar.')}
        ${rate ? `<div class="bill-total"><div><span class="muted">Est. this week</span><b>${money(hrs * rate)}</b></div></div>` : ''}
      </div>

      <div class="card glass">
        ${cardH('drop', 'Hydration', `${water}/${wg} cups`)}
        <div class="cups">${Array.from({ length: wg }, (_, i) => `<button class="cup ${i < water ? 'on' : ''}" data-act="water" data-i="${i}">${I.drop}</button>`).join('')}</div>
      </div>

      <div class="card glass">
        ${cardH('house', 'Home', cd.length ? `${cd.length} due` : 'all done', `<button class="btn ghost sm" data-go="home">Open</button>`)}
        ${cd.length ? cd.slice(0, 4).map(c => `<div class="row">${check(false, 'doChore', c.id)}<span class="txt">${esc(c.text)}</span><span class="chip ${c.who === 'shared' ? '' : 'pink'}">${WHO[c.who] || 'Me'}</span></div>`).join('') : empty('Home is reset. Light a candle.')}
      </div>

      <div class="card glass">
        ${cardH('flower', 'Wellness', wo.length ? `${wo.filter(w => w.done).length}/${wo.length}` : '', `<button class="btn ghost sm" data-go="wellness">Week</button>`)}
        ${wo.length ? wo.map(w => `<div class="row ${w.done ? 'done' : ''}">${check(w.done, 'toggleWorkout', w.id)}<span class="txt">${WTYPES[w.type]?.[0] || '✨'} ${esc(w.title)}</span><span class="chip">${w.mins} min</span></div>`).join('') : empty('Rest day — or a little hot girl walk?')}
      </div>
    </div></div>`;
};

R.planner = () => {
  const ws = addDays(weekStart(new Date()), UI.week * 7), wk = ymd(ws), t = today();
  const days = Array.from({ length: 7 }, (_, i) => addDays(ws, i));
  return `<div class="page" style="max-width:none">
    <div class="head"><div class="titles"><div class="eyebrow">Planner</div><h1>${weekLabel(ws)}<span class="muted" style="font-size:22px"> ${ws.getFullYear()}</span></h1></div>
      ${weekNav('week', 'This week')}<button class="btn" data-act="planAhead" data-off="${UI.week === 0 ? 1 : UI.week}">${I.reset2} Plan ${UI.week === 0 ? 'next week' : 'this week'}</button><button class="btn primary" data-act="addEvent" data-date="${UI.week === 0 ? t : wk}">${I.plus} Event</button></div>
    <div class="card glass" style="margin-bottom:14px;padding:12px 16px">
      <div class="eyebrow" style="margin-bottom:6px">This week, I’m going to…</div>
      <textarea class="weeknote" rows="2" placeholder="Intentions, focus, a word for the week…" data-input="weekNote" data-k="${wk}">${esc(S.weekNotes[wk] || '')}</textarea>
    </div>
    <div class="week">${days.map(d => {
      const k = ymd(d), evs = S.events.filter(e => e.date === k).sort((a, b) => (a.time || '99').localeCompare(b.time || '99'));
      const tks = S.tasks.filter(x => x.date === k), wo = S.workouts.filter(w => w.date === k);
      return `<div class="day glass ${k === t ? 'today' : ''} ${k < t ? 'past' : ''}">
        <div class="day-h"><b>${d.getDate()}</b><span>${DOW[d.getDay()]}</span></div>
        ${fixedFor(k)}
        ${evs.map(e => `<button class="ev" style="--c:${e.color}" data-act="editEvent" data-id="${e.id}">${e.time ? `<small>${fmtTime(e.time)}${e.end ? ' – ' + fmtTime(e.end) : ''}</small>` : ''}${esc(e.title)}</button>`).join('')}
        ${tks.map(x => `<div class="mini-task ${x.done ? 'done' : ''}">${check(x.done, 'toggleTask', x.id)}<span>${esc(x.text)}</span></div>`).join('')}
        ${wo.map(w => `<div class="day-extra">${WTYPES[w.type]?.[0] || '✨'} ${esc(w.title)}${w.done ? ' ✓' : ''}</div>`).join('')}
        <button class="day-add" data-act="addEvent" data-date="${k}">+ add</button>
      </div>`;
    }).join('')}</div></div>`;
};

R.ahead = () => {
  const t = today(), ws = addDays(weekStart(new Date()), UI.ahead * 7), wk = ymd(ws);
  const days = Array.from({ length: 7 }, (_, i) => ymd(addDays(ws, i)));
  const prev = Array.from({ length: 7 }, (_, i) => ymd(addDays(ws, i - 7)));
  const carry = S.tasks.filter(x => !x.done && x.date && x.date < days[0] && x.date >= ymd(addDays(ws, -60))).sort((a, b) => a.date.localeCompare(b.date));
  const someday = S.tasks.filter(x => !x.done && !x.date);
  const doneLast = S.tasks.filter(x => x.done && prev.includes(x.doneOn)).length + S.assignments.filter(a => a.done && prev.includes(a.doneOn)).length;
  const studyLast = prev.reduce((a, d) => a + (S.focus[d] || 0), 0);
  const habitHits = S.habits.reduce((a, h) => a + prev.filter(d => h.log[d]).length, 0);
  const habitPct = S.habits.length ? Math.round(habitHits / (S.habits.length * 7) * 100) : 0;
  const pri = S.weekPri[wk] || [];
  const planned = S.planned[wk];
  const isThis = UI.ahead === 0;
  const moveSel = x => `<select class="move" data-change="moveTask" data-id="${x.id}"><option value="">Move to…</option>${days.map(k => `<option value="${k}">${DOW[parse(k).getDay()]} ${parse(k).getDate()}</option>`).join('')}<option value="someday">Someday</option></select>`;
  const dueWeek = S.assignments.filter(a => !a.done && days.includes(a.due)).sort((a, b) => a.due.localeCompare(b.due));
  const appWeek = S.apps.filter(a => days.includes(a.deadline) && ['research', 'progress'].includes(a.status));
  const choreDays = S.chores.map(c => {
    let d = c.last ? ymd(addDays(parse(c.last), c.freq)) : t;
    if (d < days[0]) d = days[0];
    return { c, d };
  }).filter(x => x.d <= days[6] && x.c.freq > 1).sort((a, b) => a.d.localeCompare(b.d));
  return `<div class="page" style="max-width:1200px">
    <div class="head"><div class="titles">
      <div class="eyebrow">Sunday reset${planned ? ' · planned ✓' : ''}</div>
      <h1>${isThis ? 'Get <i>this week</i> together.' : 'Get <i>next week</i> together.'}</h1>
      <div class="sub">${weekLabel(ws)}, ${ws.getFullYear()} — look back, set intentions, then lay out each day.</div>
    </div>
    <div class="seg"><button data-act="aheadNav" data-d="-1">${chev(-1)}</button><button class="${UI.ahead === 0 ? 'on' : ''}" data-act="aheadSet" data-v="0">This week</button><button class="${UI.ahead === 1 ? 'on' : ''}" data-act="aheadSet" data-v="1">Next week</button><button data-act="aheadNav" data-d="1">${chev(1)}</button></div></div>

    <div class="grid g3" style="align-items:start;margin-bottom:16px">
      <div class="card glass">
        <div class="step">1</div>${cardH('reset', 'Look back', 'the week before')}
        <div class="lookback">
          <div><b>${doneLast}</b><span>things done</span></div>
          <div><b>${studyLast}</b><span>study sessions</span></div>
          <div><b>${habitPct}%</b><span>habits kept</span></div>
        </div>
        <div class="section-label">Still on your plate${carry.length ? ` (${carry.length})` : ''}</div>
        <div class="list">${carry.map(x => `<div class="row"><span class="txt">${esc(x.text)}<br><small class="muted">${relDay(x.date)}</small></span>${moveSel(x)}<button class="icon-btn" data-act="toggleTask" data-id="${x.id}" title="Mark done">${I.check.replace('stroke-width="3.2"', 'stroke-width="2.4" width="15" height="15"')}</button><button class="icon-btn" data-act="delTask" data-id="${x.id}" title="Let it go">${I.x}</button></div>`).join('') || empty('Nothing left over. Love that for you.')}</div>
        ${someday.length ? `<div class="section-label">Someday list (${someday.length})</div><div class="list">${someday.slice(0, 5).map(x => `<div class="row"><span class="txt">${esc(x.text)}</span>${moveSel(x)}</div>`).join('')}</div>` : ''}
      </div>

      <div class="card glass">
        <div class="step">2</div>${cardH('sparkle', 'Intentions')}
        <div class="eyebrow" style="margin-bottom:6px">Top three priorities</div>
        ${[0, 1, 2].map(i => `<div class="grat"><span>${i + 1}.</span><input type="text" value="${esc(pri[i] || '')}" placeholder="${['The big school thing…', 'A grad app step…', 'Something just for me…'][i]}" data-input="weekPri" data-k="${wk}" data-i="${i}"></div>`).join('')}
        <div class="eyebrow" style="margin:16px 0 6px">A word or note for the week</div>
        <textarea class="weeknote" rows="3" placeholder="Locked in. Early nights. Drink the water…" data-input="weekNote" data-k="${wk}">${esc(S.weekNotes[wk] || '')}</textarea>
      </div>

      <div class="card glass">
        <div class="step">3</div>${cardH('alarm', 'Coming up')}
        <div class="lookback">
          <div><b>${dueWeek.length}</b><span>things due</span></div>
          <div><b>${fmtHrs(hrsIn(days))}h</b><span>at work</span></div>
          <div><b>${appWeek.length}</b><span>app deadlines</span></div>
        </div>
        <div class="section-label">Due this week</div>
        <div class="list">${appWeek.map(a => `<div class="row"><span class="txt">🎓 ${esc(a.school)}</span>${dueChip(a.deadline)}</div>`).join('')}${dueWeek.map(a => assignRow(a)).join('') || (appWeek.length ? '' : empty('Nothing due. Get ahead?'))}</div>
        ${choreDays.length ? `<div class="section-label">Chores</div><div class="list">${choreDays.map(({ c, d }) => `<div class="row"><span class="txt">${esc(c.text)}</span><span class="chip">${relDay(d)}</span></div>`).join('')}</div>` : ''}
      </div>
    </div>

    <div class="section-label" style="margin:6px 4px 10px"><span class="step inline">4</span> Lay out the days</div>
    <div class="ahead-days">${days.map(k => {
      const d = parse(k), evs = S.events.filter(e => e.date === k).sort((a, b) => (a.time || '99').localeCompare(b.time || '99'));
      const tks = S.tasks.filter(x => x.date === k), wo = S.workouts.filter(w => w.date === k), fixed = fixedFor(k);
      return `<div class="ahead-day glass ${k === t ? 'today' : ''}">
        <div class="ad-date"><b>${DOW[d.getDay()]}</b><span>${fmtDate(k)}</span></div>
        <div class="ad-plan">
          ${evs.map(e => `<button class="ev" style="--c:${e.color}" data-act="editEvent" data-id="${e.id}">${e.time ? `<small>${fmtTime(e.time)}${e.end ? ' – ' + fmtTime(e.end) : ''}</small>` : ''}${esc(e.title)}</button>`).join('')}
          ${tks.map(x => `<div class="mini-task ${x.done ? 'done' : ''}">${check(x.done, 'toggleTask', x.id)}<span style="flex:1">${esc(x.text)}</span><button class="icon-btn mini-x" data-act="delTask" data-id="${x.id}">${I.x}</button></div>`).join('')}
          <form class="inline-add" data-submit="aheadAdd" data-date="${k}"><input name="text" type="text" placeholder="Add a to-do, or “7pm study group”" autocomplete="off"></form>
        </div>
        <div class="ad-fixed">${fixed || '<span class="muted" style="font-size:12.5px;font-style:italic;font-family:var(--serif)">no classes or shifts</span>'}</div>
        <div class="ad-move">
          ${wo.map(w => `<div class="wk-item ${w.done ? 'done' : ''}"><span>${WTYPES[w.type]?.[0] || '✨'} ${esc(w.title)}</span><span class="chip">${w.mins}m</span><button class="icon-btn x" data-act="delWorkout" data-id="${w.id}">${I.x}</button></div>`).join('')}
          <button class="btn ghost sm" data-act="addWorkout" data-date="${k}">${I.plus} Movement</button>
        </div>
      </div>`;
    }).join('')}</div>

    <div style="display:flex;justify-content:center;margin-top:22px">
      <button class="btn primary" data-act="finishPlan" data-wk="${wk}" style="padding:11px 24px;font-size:14px">🎀 ${planned ? 'Update my plan' : 'I’m ready for the week'}</button>
    </div>
  </div>`;
};

R.tasks = () => {
  const t = today(), f = UI.taskFilter;
  let list = S.tasks.filter(x => !x.done);
  const base = { today: x => x.date && x.date <= t, upcoming: x => x.date && x.date > t, anytime: x => !x.date, all: () => true };
  const filt = base[f] || (x => x.list === f);
  list = list.filter(filt).sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999') || (b.pri || 1) - (a.pri || 1));
  const done = S.tasks.filter(x => x.done && filt(x));
  const count = k => S.tasks.filter(x => !x.done).filter(base[k]).length;
  let body = '';
  if (f === 'upcoming') {
    const groups = {}; list.forEach(x => (groups[x.date] = groups[x.date] || []).push(x));
    body = Object.keys(groups).map(k => `<div class="section-label">${relDay(k)} · ${fmtDate(k)}</div><div class="list">${groups[k].map(x => taskRow(x, { showDate: false, showList: true })).join('')}</div>`).join('');
  } else body = `<div class="list">${list.map(x => taskRow(x, { showList: true })).join('')}</div>`;
  return `<div class="page" style="max-width:860px">
    <div class="head"><div class="titles"><div class="eyebrow">To-dos</div><h1>Brain dump, <i>then</i> conquer.</h1></div></div>
    <div class="card glass feature">
      <form class="addbar" data-submit="addTask" style="margin-bottom:14px">
        <input name="text" type="text" placeholder="What needs doing?" autocomplete="off" required>
        <input name="date" type="date" value="${f === 'anytime' ? '' : t}">
        <select name="list">${Object.entries(LISTS).map(([k, v]) => `<option value="${k}" ${f === k ? 'selected' : ''}>${v}</option>`).join('')}</select>
        <select name="pri"><option value="1">Normal</option><option value="2">Important</option><option value="3">Urgent</option></select>
        <button class="btn primary">${I.plus} Add</button>
      </form>
      <div class="seg" style="margin-bottom:10px">${[['today', `Today ${count('today') || ''}`], ['upcoming', 'Upcoming'], ['anytime', 'Someday'], ['all', 'All'], ...Object.entries(LISTS)].map(([k, v]) => `<button class="${f === k ? 'on' : ''}" data-act="taskFilter" data-f="${k}">${v}</button>`).join('')}</div>
      ${list.length ? body : empty(f === 'today' ? 'Nothing due today. Enjoy it. 🤍' : 'Nothing here yet.')}
      ${done.length ? `<div class="section-label" style="cursor:pointer" data-act="toggleShowDone">${UI.showDone ? '▾' : '▸'} completed (${done.length})</div>
        ${UI.showDone ? `<div class="list">${done.map(x => taskRow(x, { showList: true })).join('')}</div><button class="btn ghost sm" data-act="clearDone" style="margin-top:6px">Clear completed</button>` : ''}` : ''}
    </div></div>`;
};

R.school = () => {
  const t = today(), f = UI.aFilter, cf = UI.aCourse;
  let list = S.assignments.filter(a => !cf || a.course === cf);
  const counts = { upcoming: list.filter(a => !a.done && (!a.due || a.due >= t)).length, overdue: list.filter(a => !a.done && a.due && a.due < t).length, done: list.filter(a => a.done).length };
  list = list.filter({ upcoming: a => !a.done && (!a.due || a.due >= t), overdue: a => !a.done && a.due && a.due < t, done: a => a.done }[f]);
  list.sort((a, b) => f === 'done' ? (b.due || '').localeCompare(a.due || '') : (a.due || '9999').localeCompare(b.due || '9999'));
  const big = S.assignments.filter(a => !a.done && BIG.includes(a.type) && a.due && a.due >= t).sort((a, b) => a.due.localeCompare(b.due)).slice(0, 5);
  const wdays = [1, 2, 3, 4, 5, 6, 0].filter(d => S.courses.some(c => (c.days || []).includes(d)));
  return `<div class="page">
    <div class="head"><div class="titles"><div class="eyebrow">School</div><h1>Academic <i>weapon</i> era.</h1><div class="sub">Your classes, every assignment, and the exams creeping up.</div></div>
      <button class="btn" data-act="editCourse">${I.plus} Class</button><button class="btn primary" data-act="editAssign">${I.plus} Assignment</button></div>
    <div class="courses" style="margin-bottom:16px">${S.courses.map(c => {
      const open = S.assignments.filter(a => a.course === c.id && !a.done).sort((a, b) => (a.due || '9999').localeCompare(b.due || '9999'));
      return `<div class="course" style="--c:${c.color}" data-act="editCourse" data-id="${c.id}">
        <div class="code">${esc(c.code || 'class')}</div><h4>${esc(c.name)}</h4>
        <div class="when">${esc([classDays(c), classTime(c)].filter(Boolean).join(' · ') || 'No schedule set')}${c.room ? ` · ${esc(c.room)}` : ''}</div>
        <div class="next">${open[0] ? `<span class="chip ${open[0].due && open[0].due < t ? 'warn' : 'pink'}">next: ${esc(open[0].title)}${open[0].due ? ` · ${relDay(open[0].due)}` : ''}</span>` : '<span class="chip ok">all caught up</span>'}</div>
      </div>`;
    }).join('') || `<div class="card glass">${empty('Add your classes to see them on your planner automatically.')}</div>`}</div>

    <div class="grid" style="grid-template-columns:minmax(0,2fr) minmax(0,1fr);align-items:start">
      <div class="card glass feature">
        ${cardH('tasks', 'Assignments & exams', '', `<select data-change="aCourse" style="font-size:12px;padding:4px 24px 4px 10px;border-radius:99px"><option value="">All classes</option>${S.courses.map(c => `<option value="${c.id}" ${cf === c.id ? 'selected' : ''}>${esc(c.code || c.name)}</option>`).join('')}</select>`)}
        <form class="addbar" data-submit="addAssign" style="margin-bottom:12px">
          <input name="title" type="text" placeholder="Add an assignment…" required autocomplete="off">
          <select name="course">${S.courses.map(c => `<option value="${c.id}" ${cf === c.id ? 'selected' : ''}>${esc(c.code || c.name)}</option>`).join('')}<option value="">General</option></select>
          <select name="type">${Object.entries(ATYPES).map(([k, [e, l]]) => `<option value="${k}">${e} ${l}</option>`).join('')}</select>
          <input name="due" type="date" value="${ymd(addDays(new Date(), 1))}">
          <button class="btn primary sm">${I.plus}</button>
        </form>
        <div class="seg" style="margin-bottom:8px">${[['upcoming', 'Upcoming'], ['overdue', 'Overdue'], ['done', 'Done']].map(([k, l]) => `<button class="${f === k ? 'on' : ''}" data-act="aFilter" data-f="${k}">${l}${counts[k] ? ` ${counts[k]}` : ''}</button>`).join('')}</div>
        <div class="list">${list.map(a => assignRow(a)).join('') || empty(f === 'overdue' ? 'Nothing overdue. Academic weapon behavior.' : f === 'done' ? 'Finished work will show up here.' : 'Nothing coming up.')}</div>
      </div>
      <div class="grid">
        <div class="card glass">${cardH('alarm', 'Big stuff coming')}
          ${big.map(a => { const n = daysBetween(t, a.due), c = course(a.course); return `<div class="row"><span class="type-ico" style="--c:${c.color}">${ATYPES[a.type][0]}</span><span class="txt">${esc(a.title)}<br><small class="muted">${esc(c.code || c.name)} · ${fmtDate(a.due)}</small></span><span class="chip ${n <= 3 ? 'warn' : n <= 7 ? 'gold' : ''}">${n === 0 ? 'today' : `${n}d`}</span></div>`; }).join('') || empty('No exams, papers or projects on the horizon.')}
        </div>
        <div class="card glass">${cardH('calendar', 'Class schedule')}
          ${wdays.map(d => `<div class="section-label">${DOW[d]}</div>${S.courses.filter(c => (c.days || []).includes(d)).sort((a, b) => (a.start || '').localeCompare(b.start || '')).map(c => `<div class="agenda-item"><span class="agenda-time">${fmtTime(c.start)}</span><span class="ev-bar" style="background:${c.color}"></span><span class="txt">${esc(c.name)}</span></div>`).join('')}`).join('') || empty('Add class days & times to build your schedule.')}
        </div>
      </div>
    </div></div>`;
};

R.grad = () => {
  const t = today();
  const apps = [...S.apps].sort((a, b) => {
    const order = k => ['progress', 'research', 'interview', 'submitted', 'waitlist', 'accepted', 'rejected'].indexOf(k);
    return order(a.status) - order(b.status) || (a.deadline || '9999').localeCompare(b.deadline || '9999');
  });
  const next = appsOpen().filter(a => a.deadline && a.deadline >= t).sort((a, b) => a.deadline.localeCompare(b.deadline))[0];
  const fees = S.apps.reduce((a, x) => a + (+x.fee || 0), 0);
  return `<div class="page">
    <div class="head"><div class="titles"><div class="eyebrow">Grad school applications</div><h1>Future <i>grad student</i> loading…</h1><div class="sub">Every program, deadline, document and recommender — in one place.</div></div>
      <button class="btn primary" data-act="editApp">${I.plus} Add a program</button></div>
    <div class="pipeline">${Object.entries(STATUS).map(([k, [l, bg, fg]]) => `<div style="--s-bg:${bg};--s-fg:${fg}"><b>${S.apps.filter(a => a.status === k).length}</b><span>${l}</span></div>`).join('')}</div>
    <div class="grid" style="grid-template-columns:minmax(0,1fr) 340px;align-items:start">
      <div class="apps">${apps.map(a => {
        const left = a.deadline ? daysBetween(t, a.deadline) : null, open = ['research', 'progress'].includes(a.status);
        return `<div class="card glass app feature">
          <div class="top"><div class="info">
            <select class="status" ${pill(STATUS, a.status)} data-change="appStatus" data-id="${a.id}">${Object.entries(STATUS).map(([k, [l]]) => `<option value="${k}" ${a.status === k ? 'selected' : ''}>${l}</option>`).join('')}</select>
            ${a.deadline ? ` <span class="chip ${!open ? '' : left < 0 ? 'warn' : left <= 14 ? 'gold' : ''}">${!open ? `due ${fmtDate(a.deadline)}` : left < 0 ? 'deadline passed' : left === 0 ? 'due today!' : `${left} days left`}</span>` : ''}
            <h4>${esc(a.school)}</h4><div class="prog">${esc(a.program)}${a.fee ? ` · ${money(a.fee)} fee` : ''}</div>
          </div>${ring(appPct(a), 66, 6)}</div>
          <div class="reqs list">${(a.reqs || []).map(r => `<div class="row ${r.done ? 'done' : ''}">${check(r.done, 'toggleReq', a.id, `data-r="${r.id}"`)}<span class="txt">${esc(r.text)}</span><span class="acts"><button class="icon-btn" data-act="delReq" data-id="${a.id}" data-r="${r.id}">${I.x}</button></span></div>`).join('')}</div>
          <form class="inline-add" data-submit="addReq" data-id="${a.id}"><input name="text" type="text" placeholder="Add a requirement…" autocomplete="off"><button class="btn sm">${I.plus}</button></form>
          ${a.notes ? `<div class="muted" style="font-size:12.5px;margin-top:10px;font-family:var(--serif);font-style:italic">${esc(a.notes)}</div>` : ''}
          <div class="foot">${a.link ? `<button class="btn sm" data-act="openLink" data-url="${esc(a.link)}">${I.link} Portal</button>` : ''}<span style="flex:1"></span><button class="btn ghost sm" data-act="editApp" data-id="${a.id}">${I.edit} Edit</button></div>
        </div>`;
      }).join('') || `<div class="card glass">${empty('Add the first program on your list. You’ve got this.')}</div>`}</div>
      <div class="grid">
        ${next ? `<div class="card glass">${cardH('alarm', 'Next deadline')}<div class="countdown" style="margin:0"><b>${daysBetween(t, next.deadline)}</b><span>days until <b style="font-family:var(--sans);font-size:13px;color:var(--ink)">${esc(next.school)}</b><br>${fmtDate(next.deadline, true)} · ${appPct(next)}% ready</span></div></div>` : ''}
        <div class="card glass">
          ${cardH('heart', 'Recommenders', `${S.recs.filter(r => r.status === 'submitted').length}/${S.recs.length} in`)}
          <div class="list">${S.recs.map(r => `<div class="row"><span class="txt">${esc(r.name)}<br><small class="muted">${esc(r.role)}${r.asked ? ` · asked ${fmtDate(r.asked)}` : ''}</small></span>
            <select class="status" ${pill(RSTATUS, r.status)} data-change="recStatus" data-id="${r.id}">${Object.entries(RSTATUS).map(([k, [l]]) => `<option value="${k}" ${r.status === k ? 'selected' : ''}>${l}</option>`).join('')}</select>
            <span class="acts"><button class="icon-btn" data-act="delRec" data-id="${r.id}">${I.x}</button></span></div>`).join('') || empty('Who’s writing your letters?')}</div>
          <form class="addbar" data-submit="addRec" style="margin-top:10px">
            <input name="name" type="text" placeholder="Name" required autocomplete="off" style="flex:1;min-width:110px">
            <input name="role" type="text" placeholder="Role (e.g. advisor)" autocomplete="off" style="flex:1;min-width:110px">
            <button class="btn sm">${I.plus}</button>
          </form>
          <div class="muted" style="font-size:12px;margin-top:10px">Tip: ask at least 4–6 weeks before your first deadline, and send them your CV + draft statement.</div>
        </div>
        <div class="card glass">${cardH('coin', 'Application fees')}
          <div class="bill-total" style="border:0;margin:0;padding-top:0"><div><span class="muted">Total</span><b>${money(fees)}</b></div><div><span class="muted">Programs</span><b>${S.apps.length}</b></div></div>
          <div class="muted" style="font-size:12px;margin-top:6px">Many programs offer fee waivers — it’s always worth asking.</div>
        </div>
      </div>
    </div></div>`;
};

R.work = () => {
  const t = today(), days = weekDays(UI.shiftWeek), ws = parse(days[0]);
  const hrs = hrsIn(days), rate = +S.settings.payRate || 0, mk = t.slice(0, 7);
  const monthHrs = S.shifts.filter(s => s.date.slice(0, 7) === mk).reduce((a, s) => a + shiftHrs(s), 0);
  const nextShift = S.shifts.filter(s => s.date > t || (s.date === t && s.end > new Date().toTimeString().slice(0, 5))).sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start))[0];
  const total = S.bills.reduce((a, b) => a + (+b.amount || 0), 0), paid = S.bills.filter(b => b.paid[mk]).reduce((a, b) => a + (+b.amount || 0), 0);
  return `<div class="page">
    <div class="head"><div class="titles"><div class="eyebrow">Work & money</div><h1>Secure the <i>bag</i>.</h1><div class="sub">Shifts, hours, paychecks and the bills that sneak up on you.</div></div>
      ${weekNav('shiftWeek', weekLabel(ws))}<button class="btn primary" data-act="editShift" data-date="${days.includes(t) ? t : days[0]}">${I.plus} Shift</button></div>
    <div class="stats">
      <div class="card glass stat"><div class="k">Hours this week</div><div class="v">${fmtHrs(hrs)}<small>hrs</small></div></div>
      <div class="card glass stat"><div class="k">Est. pay this week</div><div class="v">${rate ? money(hrs * rate) : '—'}</div>${rate ? '' : '<div class="muted" style="font-size:12px;margin-top:6px">Set your hourly rate →</div>'}</div>
      <div class="card glass stat"><div class="k">Hours this month</div><div class="v">${fmtHrs(monthHrs)}<small>${rate ? money(monthHrs * rate) : 'hrs'}</small></div></div>
      <div class="card glass stat"><div class="k">Next shift</div><div class="v" style="font-size:22px">${nextShift ? `${relDay(nextShift.date)}<small>${fmtTime(nextShift.start)}</small>` : '—'}</div></div>
    </div>
    <div class="grid" style="grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);align-items:start">
      <div class="card glass feature">
        ${cardH('bag', 'Shifts', `${fmtHrs(hrs)}h`)}
        ${days.map(k => {
          const items = S.shifts.filter(s => s.date === k).sort((a, b) => a.start.localeCompare(b.start)), dd = parse(k);
          return `<div class="shift-row ${k === t ? 'today' : ''}"><div class="dl"><b>${DOW[dd.getDay()]}</b><small>${fmtDate(k)}</small></div>
            <div class="wk-items">${items.map(s => `<button class="wk-item" data-act="editShift" data-id="${s.id}" style="cursor:pointer"><span>${fmtTime(s.start)} – ${fmtTime(s.end)}${s.role ? ` · ${esc(s.role)}` : ''}</span><span class="chip">${fmtHrs(shiftHrs(s))}h</span></button>`).join('') || '<span class="muted" style="font-size:12.5px;font-style:italic;font-family:var(--serif)">off</span>'}</div>
            <button class="icon-btn" data-act="editShift" data-date="${k}" title="Add shift">${I.plus}</button></div>`;
        }).join('')}
      </div>
      <div class="grid">
        <div class="card glass">${cardH('coin', 'Pay')}
          <div class="addbar"><span class="muted">$</span><input type="number" min="0" step="0.25" value="${rate || ''}" placeholder="0.00" data-change="payRate" style="width:110px"><span class="muted">per hour</span></div>
          <div class="muted" style="font-size:12px;margin-top:8px">Estimates are before taxes and tips.</div>
        </div>
        <div class="card glass">
          ${cardH('coin', 'Bills', new Date().toLocaleDateString(undefined, { month: 'long' }))}
          <div class="list">${[...S.bills].sort((a, b) => a.day - b.day).map(b => {
            const isPaid = !!b.paid[mk], n = b.day - new Date().getDate();
            return `<div class="row ${isPaid ? 'done' : ''}">${check(isPaid, 'payBill', b.id)}<span class="txt">${esc(b.name)}<br><small class="muted">due the ${ordinal(b.day)}</small></span>
              ${!isPaid && b.amount && n < 0 ? '<span class="chip warn">late</span>' : !isPaid && b.amount && n <= 3 ? '<span class="chip gold">soon</span>' : ''}
              <span class="amt">${money(b.amount)}</span><span class="acts"><button class="icon-btn" data-act="editBill" data-id="${b.id}">${I.edit}</button></span></div>`;
          }).join('') || empty('No bills tracked.')}</div>
          <div class="bill-total"><div><span class="muted">Paid</span><b>${money(paid)}</b></div><div><span class="muted">Remaining</span><b>${money(total - paid)}</b></div></div>
          <button class="btn sm" data-act="editBill" style="margin-top:10px">${I.plus} Add bill</button>
        </div>
      </div>
    </div></div>`;
};

R.home = () => {
  const t = today(), w = UI.choreWho;
  const chores = S.chores.filter(c => w === 'all' || (c.who || 'me') === w).sort((a, b) => choreDue(a) - choreDue(b));
  const groc = {}; S.grocery.forEach(g => (groc[g.cat] = groc[g.cat] || []).push(g));
  return `<div class="page">
    <div class="head"><div class="titles"><div class="eyebrow">Home</div><h1>Home <i>sweet</i> home.</h1><div class="sub">Your chores, the shared ones, and the grocery list for the house.</div></div></div>
    <div class="grid g2" style="align-items:start">
      <div class="card glass feature">
        ${cardH('broom', 'Chores', `${choresDue().length} due`, `<div class="seg">${[['all', 'All'], ['me', 'Mine'], ['shared', 'Shared']].map(([k, l]) => `<button class="${w === k ? 'on' : ''}" data-act="choreWho" data-w="${k}">${l}</button>`).join('')}</div>`)}
        <div class="list">${chores.map(c => {
          const n = choreDue(c), doneToday = c.last === t;
          const lab = doneToday ? 'done today' : n < 0 ? `${-n}d overdue` : n === 0 ? 'due today' : `in ${n}d`;
          return `<div class="row ${doneToday ? 'done' : ''}">${check(doneToday, 'doChore', c.id)}<span class="txt">${esc(c.text)}<br><small class="muted">${esc(c.room)} · ${(FREQ.find(f => f[0] == c.freq) || [0, `every ${c.freq}d`])[1]}</small></span><span class="chip ${c.who === 'shared' ? '' : 'pink'}">${WHO[c.who] || 'Me'}</span><span class="chip ${doneToday ? 'ok' : n < 0 ? 'warn' : n === 0 ? 'gold' : ''}">${lab}</span><span class="acts"><button class="icon-btn" data-act="delChore" data-id="${c.id}">${I.x}</button></span></div>`;
        }).join('') || empty('No chores here.')}</div>
        <form class="addbar" data-submit="addChore" style="margin-top:12px">
          <input name="text" type="text" placeholder="New chore…" required autocomplete="off" style="flex-basis:100%">
          <input name="room" type="text" placeholder="Room" style="flex:1;min-width:80px" autocomplete="off">
          <select name="freq">${FREQ.map(([v, l]) => `<option value="${v}" ${v === 7 ? 'selected' : ''}>${l}</option>`).join('')}</select>
          <select name="who">${Object.entries(WHO).map(([k, l]) => `<option value="${k}" ${w === k ? 'selected' : ''}>${l}</option>`).join('')}</select>
          <button class="btn sm">${I.plus}</button>
        </form>
      </div>

      <div class="card glass">
        ${cardH('cart', 'Groceries & essentials', `${S.grocery.filter(g => !g.done).length} to get`, S.grocery.some(g => g.done) ? `<button class="btn ghost sm" data-act="clearGroc">Clear ✓</button>` : '')}
        <form class="addbar" data-submit="addGroc" style="margin-bottom:8px">
          <input name="text" type="text" placeholder="Add an item…" required autocomplete="off">
          <select name="cat">${CATS.map(c => `<option>${c}</option>`).join('')}</select>
          <button class="btn sm">${I.plus}</button>
        </form>
        ${CATS.filter(c => groc[c]).map(c => `<div class="section-label">${c}</div><div class="list">${groc[c].sort((a, b) => a.done - b.done).map(g => `<div class="row ${g.done ? 'done' : ''}">${check(g.done, 'toggleGroc', g.id)}<span class="txt">${esc(g.text)}</span><span class="acts"><button class="icon-btn" data-act="delGroc" data-id="${g.id}">${I.x}</button></span></div>`).join('')}</div>`).join('') || empty('Fully stocked.')}
      </div>
    </div></div>`;
};

R.wellness = () => {
  const ws = addDays(weekStart(new Date()), UI.moveWeek * 7), t = today();
  const days = Array.from({ length: 7 }, (_, i) => ymd(addDays(ws, i)));
  const wk = S.workouts.filter(w => days.includes(w.date));
  const mins = wk.filter(w => w.done).reduce((a, w) => a + (+w.mins || 0), 0), goal = S.settings.weeklyMins || 150;
  const activeDays = new Set(wk.filter(w => w.done).map(w => w.date)).size;
  let streak = 0, d = new Date();
  const doneDates = new Set(S.workouts.filter(w => w.done).map(w => w.date));
  if (!doneDates.has(ymd(d))) d = addDays(d, -1);
  while (doneDates.has(ymd(d))) { streak++; d = addDays(d, -1); }
  const recent = S.workouts.filter(w => w.done).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
  return `<div class="page">
    <div class="head"><div class="titles"><div class="eyebrow">Wellness</div><h1>That girl, <i>in motion</i>.</h1><div class="sub">Pilates, walks, yoga — plan your movement and watch the minutes add up.</div></div>
      ${weekNav('moveWeek', weekLabel(ws))}</div>
    <div class="stats">
      <div class="card glass stat"><div class="k">Minutes this week</div><div class="v">${mins}<small>/ ${goal}</small></div><div class="bar" style="margin-top:12px"><i style="width:${Math.min(100, mins / goal * 100)}%"></i></div></div>
      <div class="card glass stat"><div class="k">Sessions done</div><div class="v">${wk.filter(w => w.done).length}<small>of ${wk.length}</small></div></div>
      <div class="card glass stat"><div class="k">Active days</div><div class="v">${activeDays}<small>/ 7</small></div></div>
      <div class="card glass stat"><div class="k">Streak</div><div class="v">${streak}<small>day${streak === 1 ? '' : 's'} 🤍</small></div></div>
    </div>
    <div class="grid" style="grid-template-columns:minmax(0,2fr) minmax(0,1fr);align-items:start">
      <div class="card glass feature">
        ${cardH('flower', 'This week', '', `<button class="btn primary sm" data-act="addWorkout" data-date="${days.includes(t) ? t : days[0]}">${I.plus} Workout</button>`)}
        ${days.map(k => {
          const items = S.workouts.filter(w => w.date === k), dd = parse(k);
          return `<div class="wk-row ${k === t ? 'today' : ''}"><div class="dl"><b>${DOW[dd.getDay()]}</b><small>${fmtDate(k)}</small></div>
            <div class="wk-items">${items.map(w => `<div class="wk-item ${w.done ? 'done' : ''}">${check(w.done, 'toggleWorkout', w.id)}<span>${WTYPES[w.type]?.[0] || '✨'} ${esc(w.title)}</span><span class="chip">${w.mins}m</span><button class="icon-btn x" data-act="delWorkout" data-id="${w.id}">${I.x}</button></div>`).join('') || '<span class="muted" style="font-size:12.5px;font-style:italic;font-family:var(--serif)">rest</span>'}</div>
            <button class="icon-btn" data-act="addWorkout" data-date="${k}" title="Add">${I.plus}</button></div>`;
        }).join('')}
      </div>
      <div class="grid">
        <div class="card glass">${cardH('sparkle', 'Recent')}
          ${recent.map(w => `<div class="row"><span>${WTYPES[w.type]?.[0] || '✨'}</span><span class="txt">${esc(w.title)}<br><small class="muted">${relDay(w.date)}</small></span><span class="chip">${w.mins}m</span></div>`).join('') || empty('Finished workouts will show up here.')}
        </div>
        <div class="card glass">${cardH('star', 'Weekly goal')}
          <div class="addbar"><input type="number" min="10" step="10" value="${goal}" data-change="weeklyMins" style="width:100px"><span class="muted">minutes / week</span></div>
        </div>
      </div>
    </div></div>`;
};

R.goals = () => `<div class="page">
  <div class="head"><div class="titles"><div class="eyebrow">Goals</div><h1>Manifest it, <i>then</i> plan it.</h1><div class="sub">Big dreams, broken into small, check-off-able steps.</div></div>
    <button class="btn primary" data-act="editGoal">${I.plus} New goal</button></div>
  <div class="goals">${S.goals.map(g => {
    const pct = goalPct(g), left = g.target ? daysBetween(today(), g.target) : null;
    return `<div class="card glass goal" style="--c:${g.color}">
      <div class="goal-top"><div class="info">
        <span class="chip">${esc(g.cat)}</span>${left !== null ? ` <span class="chip ${left < 0 ? 'warn' : left < 14 ? 'gold' : ''}">${left < 0 ? 'past target' : left === 0 ? 'today!' : `${left} days left`}</span>` : ''}
        <h4>${esc(g.title)}</h4>${g.why ? `<div class="why">${esc(g.why)}</div>` : ''}
      </div>${ring(pct)}</div>
      <div class="ms list">${(g.ms || []).map(m => `<div class="row ${m.done ? 'done' : ''}">${check(m.done, 'toggleMs', g.id, `data-m="${m.id}"`)}<span class="txt">${esc(m.text)}</span><span class="acts"><button class="icon-btn" data-act="delMs" data-id="${g.id}" data-m="${m.id}">${I.x}</button></span></div>`).join('')}</div>
      ${!(g.ms || []).length ? `<div class="addbar" style="margin-top:10px"><span class="muted" style="font-size:12px">Progress</span><input type="range" min="0" max="100" step="5" value="${g.progress || 0}" data-change="goalProgress" data-id="${g.id}" style="flex:1"></div>` : ''}
      <form class="inline-add" data-submit="addMs" data-id="${g.id}"><input name="text" type="text" placeholder="Add a step…" autocomplete="off"><button class="btn sm">${I.plus}</button></form>
      <div style="display:flex;gap:4px;margin-top:10px;justify-content:flex-end"><button class="btn ghost sm" data-act="editGoal" data-id="${g.id}">${I.edit} Edit</button></div>
    </div>`;
  }).join('') || `<div class="card glass">${empty('What do you want this year to be about?')}</div>`}</div></div>`;

R.habits = () => {
  const N = 21, t = today(), days = Array.from({ length: N }, (_, i) => ymd(addDays(new Date(), i - N + 1)));
  return `<div class="page">
    <div class="head"><div class="titles"><div class="eyebrow">Habits</div><h1>Consistency is <i>cute</i>.</h1><div class="sub">Tap a circle to mark a day. Watch the cheetah spots stack up.</div></div></div>
    <div class="card glass feature" style="overflow-x:auto">
      <table class="htable"><tr><th></th>${days.map(k => { const d = parse(k); return `<th class="${k === t ? 'today' : ''}">${DOW[d.getDay()][0]}<br>${d.getDate()}</th>`; }).join('')}<th>streak</th><th>30d</th><th></th></tr>
      ${S.habits.map(h => {
        const pct = Math.round(Array.from({ length: 30 }, (_, i) => h.log[ymd(addDays(new Date(), -i))]).filter(Boolean).length / 30 * 100);
        return `<tr><td class="name"><span>${h.icon}</span>${esc(h.name)}</td>${days.map(k => `<td><button class="hcell ${h.log[k] ? 'on' : ''} ${k === t ? 'today' : ''}" data-act="toggleHabit" data-id="${h.id}" data-date="${k}" title="${fmtDate(k)}"></button></td>`).join('')}
          <td style="padding:0 8px;white-space:nowrap">${habitStreak(h)} 🔥</td><td class="muted" style="padding:0 6px">${pct}%</td><td><button class="icon-btn del" data-act="delHabit" data-id="${h.id}">${I.trash}</button></td></tr>`;
      }).join('')}</table>
      ${!S.habits.length ? empty('No habits yet — what’s one small thing you want to do every day?') : ''}
      <form class="addbar" data-submit="addHabit" style="margin-top:14px;max-width:520px">
        <input name="icon" type="text" value="🎀" maxlength="4" style="width:52px;text-align:center;font-size:16px">
        <input name="name" type="text" placeholder="New habit, e.g. ‘Retinol at night’" required autocomplete="off">
        <button class="btn primary sm">${I.plus} Add</button>
      </form>
    </div></div>`;
};

R.journal = () => {
  const k = UI.jDate, j = S.journal[k] || {}, g = j.g || [];
  const entries = Object.keys(S.journal).filter(d => { const e = S.journal[d]; return e && (e.text || (e.g || []).some(Boolean) || e.mood != null); }).sort().reverse();
  return `<div class="page">
    <div class="head"><div class="titles"><div class="eyebrow">Journal</div><h1>Dear diary…</h1></div>
      <div class="seg"><button data-act="jNav" data-d="-1">${chev(-1)}</button><button data-act="jNav" data-d="0" class="${k === today() ? 'on' : ''}">${k === today() ? 'Today' : fmtDate(k)}</button><button data-act="jNav" data-d="1">${chev(1)}</button></div></div>
    <div class="journal-wrap">
      <div class="card glass feature" style="padding:24px 26px">
        <div class="eyebrow">${fmtDate(k, true)}</div>
        <div class="moods" style="margin:12px 0 18px;max-width:420px">${MOODS.map(([e, l], i) => `<button class="mood ${j.mood === i ? 'on' : ''}" data-act="setMood" data-i="${i}" data-date="${k}">${e}<small>${l}</small></button>`).join('')}</div>
        <div class="eyebrow" style="margin-bottom:6px">Three good things</div>
        ${[0, 1, 2].map(i => `<div class="grat"><span>${i + 1}.</span><input type="text" value="${esc(g[i] || '')}" placeholder="${['Something small…', 'Someone kind…', 'Something I did well…'][i]}" data-input="journal" data-date="${k}" data-field="g${i}"></div>`).join('')}
        <div class="prompt" style="margin-top:20px">${PROMPTS[(parse(k).getDate() + parse(k).getMonth()) % PROMPTS.length]}</div>
        <textarea class="paper" placeholder="Write freely…" data-input="journal" data-date="${k}" data-field="text">${esc(j.text || '')}</textarea>
      </div>
      <div class="card glass scroll" style="max-height:calc(100vh - 200px);overflow-y:auto;padding:12px">
        <div class="section-label" style="margin-top:4px">Past pages</div>
        ${entries.map(d => { const e = S.journal[d]; return `<button class="entry-link ${d === k ? 'on' : ''}" data-act="jOpen" data-d="${d}"><b><span>${fmtDate(d)}</span><span>${e.mood != null ? MOODS[e.mood][0] : ''}</span></b><small>${esc(e.text || (e.g || []).filter(Boolean)[0] || '…')}</small></button>`; }).join('') || empty('Your pages will collect here.')}
      </div>
    </div></div>`;
};

/* study timer */
const FT = { mode: 'focus', len: { focus: 25, short: 5, long: 15 }, left: 25 * 60, total: 25 * 60, running: false, int: null, task: '' };
R.focus = () => {
  const n = S.focus[today()] || 0, C = 2 * Math.PI * 150;
  return `<div class="page"><div class="focus-wrap">
    <div class="eyebrow">Study timer</div><h1 style="text-align:center">${FT.mode === 'focus' ? 'Locked <i>in</i>.' : 'Hydrate. Stretch. Breathe.'}</h1>
    <div class="seg" style="margin-top:8px">${[['focus', 'Study'], ['short', 'Short break'], ['long', 'Long break']].map(([k, l]) => `<button class="${FT.mode === k ? 'on' : ''}" data-act="ftMode" data-m="${k}">${l} · ${FT.len[k]}m</button>`).join('')}</div>
    <div class="focus-ring"><svg viewBox="0 0 330 330"><defs><linearGradient id="fgrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eea3b6"/><stop offset="1" stop-color="#d0607f"/></linearGradient></defs>
      <circle class="bg" cx="165" cy="165" r="150"/><circle id="ft-ring" class="fg" cx="165" cy="165" r="150" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - FT.left / FT.total)}"/></svg>
      <div class="focus-center glass" style="inset:30px;border-radius:50%"><div class="time" id="ft-time">${ftFmt()}</div><div class="lbl">${FT.mode === 'focus' ? 'study' : 'break'}</div></div></div>
    <div class="focus-ctrls"><button class="btn ghost" data-act="ftReset" title="Reset">${I.reset}</button><button class="btn primary play" data-act="ftToggle" id="ft-play">${FT.running ? I.pause : I.play}</button><button class="btn ghost" data-act="ftSkip" title="Skip">${I.skip}</button></div>
    <input class="focus-task" type="text" placeholder="What are you working on?" value="${esc(FT.task)}" data-input="ftTask">
    <div class="sessions">${n ? Array.from({ length: Math.min(n, 12) }, () => '<i class="spot"></i>').join('') : ''} <span>${n} session${n === 1 ? '' : 's'} today</span></div>
    <div class="muted" style="margin-top:14px;font-size:12.5px">Tip: turn on lofi + rain (bottom right), then try Vibe mode.</div>
  </div></div>`;
};
function ftFmt() { const m = Math.floor(FT.left / 60), s = FT.left % 60; return `${pad(m)}:${pad(s)}`; }
function ftPaint() {
  const t = $('#ft-time'), r = $('#ft-ring'), C = 2 * Math.PI * 150;
  if (t) t.textContent = ftFmt();
  if (r) r.style.strokeDashoffset = C * (1 - FT.left / FT.total);
  const st = $('#side-timer'); if (st) { st.classList.toggle('on', FT.running); st.querySelector('b').textContent = ftFmt(); }
  const vt = $('#vibe-ft'); if (vt) vt.textContent = FT.running ? `${FT.mode === 'focus' ? 'studying' : 'on a break'} · ${ftFmt()} left` : '';
  document.title = FT.running ? `${ftFmt()} · GYST` : 'GYST';
}
function ftSet(mode) { FT.mode = mode; FT.total = FT.left = FT.len[mode] * 60; }
function ftTick() {
  FT.left = Math.max(0, Math.round((FT.endAt - Date.now()) / 1000));
  if (FT.left <= 0) {
    clearInterval(FT.int); FT.running = false; Amb.chime();
    if (FT.mode === 'focus') { S.focus[today()] = (S.focus[today()] || 0) + 1; save(); toast('🎀 Study session done — you ate that. Take a break.'); ftSet((S.focus[today()] % 4 === 0) ? 'long' : 'short'); }
    else { toast('☕ Break’s over. Back to it, academic weapon.'); ftSet('focus'); }
    if (UI.view === 'focus') render();
  }
  ftPaint();
}

/* ---------- sidebar, vibe & radio ---------- */
function renderSidebar() {
  const t = today();
  const badge = { tasks: tasksDue().length, home: choresDue().length, school: S.assignments.filter(a => !a.done && a.due && a.due <= t).length };
  $('#sidebar').innerHTML = `
    <div class="brand"><div class="mark"><i>✦</i></div><div><b>GYST</b><small>get your shit together</small></div></div>
    ${VIEWS.map(v => v.sep ? '<div class="nav-sep"></div>' : `<button class="nav-btn ${UI.view === v.id ? 'active' : ''}" data-go="${v.id}">${I[v.icon]}<span>${v.name}</span>${badge[v.id] ? `<i class="badge">${badge[v.id]}</i>` : v.hint ? `<em>${v.hint}</em>` : ''}</button>`).join('')}
    <div class="side-foot">
      <div class="side-timer ${FT.running ? 'on' : ''}" id="side-timer" data-go="focus" style="cursor:pointer">⏳ <b>${ftFmt()}</b> <span class="muted">studying</span></div>
      <div class="side-clock"><b id="clock"></b><span id="clock-sub"></span></div>
      <div style="display:flex;gap:4px">
        <button class="nav-btn" data-act="sceneMode" style="flex:1">${I.eye}<span>Vibe mode</span></button>
        ${CAN_NOTIFY ? `<button class="icon-btn" data-act="reminders" title="Reminders" style="width:36px;height:36px">${I.bell}</button>` : ''}
        <button class="icon-btn" data-act="settings" title="Settings & backup" style="width:36px;height:36px">${I.backup}</button>
      </div>
    </div>`;
  tickClock();
}
function tickClock() {
  const d = new Date(), time = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  const c = $('#clock'); if (c) { c.textContent = time; $('#clock-sub').textContent = `${d.toLocaleDateString(undefined, { weekday: 'long' })} · ${Scene.label()}`; }
  const v = $('#vibe-time'); if (v) v.textContent = time;
}
function renderVibe() {
  $('#vibe').innerHTML = `<div class="vibe-card">
    <div class="eyebrow">${fmtDate(today(), true)} · ${Scene.label()}</div>
    <div class="vibe-time" id="vibe-time"></div>
    <div class="vibe-q">“${QUOTES[doy() % QUOTES.length]}”</div>
    <div class="vibe-ft" id="vibe-ft"></div>
  </div>`;
  tickClock(); ftPaint();
}
const AMB = [['music', '🎧', 'Lofi beats', 'study vibes'], ['rain', '🌧️', 'Rain on the window', ''], ['fire', '🕯️', 'Cozy fireplace', ''], ['forest', '🌿', 'Nature', 'breeze & birds']];
function renderRadio() {
  const any = Amb.anyOn();
  $('#radio').innerHTML = `
    <div class="radio-panel glass">
      <h4>Soundscape</h4><p>Mix your own study ambience.</p>
      ${AMB.map(([k, e, n, d]) => { const c = Amb.get(k); return `<div class="amb"><button class="tg ${c.on ? 'on' : ''}" data-act="amb" data-k="${k}">${e}</button><div class="nm"><span>${n}</span><small>${d}</small></div><input type="range" min="0" max="1" step="0.01" value="${c.vol}" data-change="ambVol" data-k="${k}"></div>`; }).join('')}
      ${any && Amb.state() !== 'running' ? `<p style="color:var(--rose);margin:4px 0 0">Sound engine: ${Amb.state()} — click any sound to resume.</p>` : ''}
      <div class="radio-sec"><button class="btn sm ${S.settings.sparkles ? '' : 'ghost'}" data-act="sparkles">✨ Sparkles: ${S.settings.sparkles ? 'on' : 'off'}</button></div>
    </div>
    <button class="radio-btn glass ${any ? 'playing' : ''}" data-act="radio"><span class="disc"></span><span>${any ? 'Now playing' : 'Ambience'}</span><span class="eq"><i></i><i></i><i></i></span></button>`;
}
function saveSound() { S.settings.sound = Object.fromEntries(Amb.names.map(n => [n, { on: Amb.get(n).on, vol: Amb.get(n).vol }])); save(); }

/* ---------- render ---------- */
function render() {
  const v = $('#view'), same = v.dataset.view === UI.view, st = v.scrollTop;
  v.innerHTML = R[UI.view]();
  v.dataset.view = UI.view;
  if (same) { v.style.scrollBehavior = 'auto'; v.scrollTop = st; v.style.scrollBehavior = ''; const p = v.querySelector('.page'); if (p) p.style.animation = 'none'; }
  renderSidebar();
}
function go(view) { UI.view = view; S.settings.view = view; save(); $('#view').scrollTop = 0; render(); }

/* ---------- feedback ---------- */
let toastT;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 3200); }
function burst(el) {
  if (!el) return; const r = el.getBoundingClientRect();
  for (let i = 0; i < 7; i++) {
    const s = document.createElement('div'); s.className = 'leaf-burst'; s.textContent = ['🎀', '✨', '🤍', '🐆'][i % 4];
    s.style.left = r.left + r.width / 2 - 8 + 'px'; s.style.top = r.top + r.height / 2 - 10 + 'px';
    s.style.setProperty('--dx', (Math.random() - .5) * 90 + 'px'); s.style.setProperty('--dy', (-20 - Math.random() * 50) + 'px'); s.style.setProperty('--r', (Math.random() - .5) * 120 + 'deg');
    document.body.appendChild(s); setTimeout(() => s.remove(), 950);
  }
  Amb.pop();
}

/* ---------- modal ---------- */
function modal({ title, body, submit = 'Save', onSubmit, del }) {
  const root = $('#modal-root');
  root.innerHTML = `<div class="modal-back"><form class="modal glass"><h3>${title}</h3>${body}
    <div class="modal-actions">${del ? `<button type="button" class="btn ghost danger" data-modal-del>${I.trash} Delete</button>` : ''}<span style="flex:1"></span><button type="button" class="btn ghost" data-act="closeModal">Cancel</button><button class="btn primary">${submit}</button></div></form></div>`;
  const form = root.querySelector('form');
  form.addEventListener('submit', e => { e.preventDefault(); const fd = Object.fromEntries(new FormData(form)); fd._all = new FormData(form); if (onSubmit(fd, form) !== false) { closeModal(); save(); render(); } });
  if (del) form.querySelector('[data-modal-del]').addEventListener('click', e => confirmTap(e.currentTarget, 'Tap again to delete', () => { del(); closeModal(); save(); render(); }));
  root.querySelector('.modal-back').addEventListener('mousedown', e => { if (e.target.classList.contains('modal-back')) closeModal(); });
  setTimeout(() => { const f = form.querySelector('input:not([type=hidden]):not([type=radio]):not([type=checkbox]),textarea'); if (f) f.focus(); }, 30);
  return form;
}
function closeModal() { $('#modal-root').innerHTML = ''; }
// two-tap confirm: the app's web view can't show confirm() dialogs, so the button asks instead
function confirmTap(btn, label, onYes) {
  if (btn.dataset.armed) { clearTimeout(btn._t); onYes(); return; }
  btn.dataset.armed = '1'; btn._html = btn.innerHTML; btn.classList.add('armed'); btn.innerHTML = `${I.trash} ${label}`;
  btn._t = setTimeout(() => { delete btn.dataset.armed; btn.classList.remove('armed'); btn.innerHTML = btn._html; }, 3500);
}
const fld = (label, html) => `<label class="f"><span>${label}</span>${html}</label>`;
const swatches = (name, val) => `<div class="swatches">${COLORS.map(c => `<label><input type="radio" name="${name}" value="${c}" ${c === val ? 'checked' : ''}><i style="--c:${c}"></i></label>`).join('')}</div>`;
const safeUrl = u => { u = (u || '').trim(); if (!u) return ''; if (!/^https?:\/\//i.test(u)) u = 'https://' + u; return u; };

/* ---------- actions ---------- */
const A = {
  closeModal,
  sceneMode() { renderVibe(); document.body.classList.add('scene-mode'); $('#radio').classList.remove('open'); },
  exitScene() { document.body.classList.remove('scene-mode'); },
  radio() { $('#radio').classList.toggle('open'); },
  amb(el) { const k = el.dataset.k; Amb.set(k, !Amb.get(k).on); if (Amb.get(k).on) setTimeout(() => { if (Amb.state() !== 'running') toast('🔇 Sound is paused — click the button once more to start it.'); renderRadio(); $('#radio').classList.add('open'); }, 900); if (k === 'rain') Scene.setRain(Amb.get('rain').on); saveSound(); renderRadio(); $('#radio').classList.add('open'); },
  sparkles() { S.settings.sparkles = !S.settings.sparkles; Scene.setSparkles(S.settings.sparkles); save(); renderRadio(); $('#radio').classList.add('open'); },
  planAhead(el) { UI.ahead = el.dataset.off ? +el.dataset.off : 1; go('ahead'); },
  aheadNav(el) { UI.ahead += +el.dataset.d; render(); },
  aheadSet(el) { UI.ahead = +el.dataset.v; render(); },
  finishPlan(el) {
    S.planned[el.dataset.wk] = today(); burst(el); save();
    const n = S.tasks.filter(x => !x.done && x.date >= el.dataset.wk && x.date <= ymd(addDays(parse(el.dataset.wk), 6))).length;
    toast(`🎀 Week planned — ${n} to-do${n === 1 ? '' : 's'} laid out. You officially have your shit together.`);
    setTimeout(render, 300);
  },
  weekNav(el) { const d = +el.dataset.d; UI[el.dataset.k] = d === 0 ? 0 : UI[el.dataset.k] + d; render(); },
  openLink(el) {
    const u = safeUrl(el.dataset.url); if (!u) return;
    if (NATIVE) { try { window.webkit.messageHandlers.openURL.postMessage(u); return; } catch (e) { } }
    window.open(u, '_blank');
  },

  toggleTask(el) { const t = byId(S.tasks, el.dataset.id); t.done = !t.done; t.doneOn = t.done ? today() : null; if (t.done) burst(el); save(); setTimeout(render, t.done ? 260 : 0); },
  delTask(el) { S.tasks = S.tasks.filter(t => t.id !== el.dataset.id); save(); render(); },
  editTask(el) {
    const t = byId(S.tasks, el.dataset.id);
    modal({
      title: 'Edit to-do', body: fld('Task', `<input name="text" type="text" value="${esc(t.text)}" required>`) +
        `<div class="two">${fld('Date', `<input name="date" type="date" value="${t.date || ''}">`)}${fld('List', `<select name="list">${Object.entries(LISTS).map(([k, v]) => `<option value="${k}" ${t.list === k ? 'selected' : ''}>${v}</option>`).join('')}</select>`)}</div>` +
        fld('Priority', `<select name="pri">${[[1, 'Normal'], [2, 'Important'], [3, 'Urgent']].map(([v, l]) => `<option value="${v}" ${t.pri == v ? 'selected' : ''}>${l}</option>`).join('')}</select>`),
      onSubmit: d => { Object.assign(t, { text: d.text.trim(), date: d.date || null, list: d.list, pri: +d.pri }); },
      del: () => { S.tasks = S.tasks.filter(x => x !== t); }
    });
  },
  taskFilter(el) { UI.taskFilter = el.dataset.f; render(); },
  toggleShowDone() { UI.showDone = !UI.showDone; render(); },
  clearDone() { S.tasks = S.tasks.filter(t => !t.done); save(); render(); },

  addEvent(el) { A.editEvent(el, null, el.dataset.date); },
  editEvent(el, _e, date) {
    const ev = el && el.dataset.id ? byId(S.events, el.dataset.id) : null;
    const v = ev || { title: '', date: date || today(), time: '', end: '', color: COLORS[0], notes: '' };
    modal({
      title: ev ? 'Edit event' : 'New event',
      body: fld('What', `<input name="title" type="text" value="${esc(v.title)}" required placeholder="Coffee with Maya">`) +
        `<div class="two">${fld('Date', `<input name="date" type="date" value="${v.date}" required>`)}<div class="two">${fld('Start', `<input name="time" type="time" value="${v.time || ''}">`)}${fld('End', `<input name="end" type="time" value="${v.end || ''}">`)}</div></div>` +
        fld('Color', swatches('color', v.color)) + fld('Notes', `<textarea name="notes" rows="2">${esc(v.notes || '')}</textarea>`) +
        (!ev ? `<label style="display:flex;gap:8px;align-items:center;font-size:13px;color:var(--ink-2)"><input type="checkbox" name="asTask"> Add as a to-do instead</label>` : ''),
      onSubmit: d => {
        if (d.asTask) { S.tasks.push({ id: uid(), text: d.title.trim(), date: d.date, list: 'personal', pri: 1, done: false }); return; }
        const o = { title: d.title.trim(), date: d.date, time: d.time, end: d.end, color: d.color || COLORS[0], notes: d.notes };
        if (ev) Object.assign(ev, o); else S.events.push({ id: uid(), ...o });
      },
      del: ev ? () => { S.events = S.events.filter(x => x !== ev); } : null
    });
  },

  /* school */
  editCourse(el) {
    const c = el && el.dataset.id ? byId(S.courses, el.dataset.id) : null;
    const v = c || { name: '', code: '', color: COLORS[S.courses.length % COLORS.length], days: [], start: '', end: '', room: '', prof: '' };
    modal({
      title: c ? esc(c.name) : 'Add a class',
      body: `<div class="two">${fld('Class name', `<input name="name" type="text" value="${esc(v.name)}" required placeholder="Developmental Psych">`)}${fld('Course code', `<input name="code" type="text" value="${esc(v.code)}" placeholder="PSY 210">`)}</div>` +
        fld('Meets on', `<div class="days-pick">${[1, 2, 3, 4, 5, 6, 0].map(d => `<label><input type="checkbox" name="days" value="${d}" ${(v.days || []).includes(d) ? 'checked' : ''}><i>${DOW[d].slice(0, 2)}</i></label>`).join('')}</div>`) +
        `<div class="two"><div class="two">${fld('Starts', `<input name="start" type="time" value="${v.start || ''}">`)}${fld('Ends', `<input name="end" type="time" value="${v.end || ''}">`)}</div>${fld('Room', `<input name="room" type="text" value="${esc(v.room)}" placeholder="Building & room">`)}</div>` +
        fld('Professor & office hours', `<input name="prof" type="text" value="${esc(v.prof)}" placeholder="Dr. Lee · Tue 2–4pm">`) + fld('Color', swatches('color', v.color)),
      onSubmit: (d) => {
        const o = { name: d.name.trim(), code: d.code.trim(), days: d._all.getAll('days').map(Number), start: d.start, end: d.end, room: d.room.trim(), prof: d.prof.trim(), color: d.color || COLORS[0] };
        if (c) Object.assign(c, o); else S.courses.push({ id: uid(), ...o });
      },
      del: c ? () => { S.courses = S.courses.filter(x => x !== c); S.assignments.forEach(a => { if (a.course === c.id) a.course = ''; }); } : null
    });
  },
  editAssign(el) {
    const a = el && el.dataset.id ? byId(S.assignments, el.dataset.id) : null;
    const v = a || { title: '', course: UI.aCourse || (S.courses[0] || {}).id || '', type: 'assignment', due: ymd(addDays(new Date(), 1)), time: '', grade: '', notes: '' };
    modal({
      title: a ? 'Edit assignment' : 'New assignment',
      body: fld('What', `<input name="title" type="text" value="${esc(v.title)}" required placeholder="Problem set 4">`) +
        `<div class="two">${fld('Class', `<select name="course">${S.courses.map(c => `<option value="${c.id}" ${v.course === c.id ? 'selected' : ''}>${esc(c.code || c.name)}</option>`).join('')}<option value="" ${!v.course ? 'selected' : ''}>General</option></select>`)}${fld('Type', `<select name="type">${Object.entries(ATYPES).map(([k, [e, l]]) => `<option value="${k}" ${v.type === k ? 'selected' : ''}>${e} ${l}</option>`).join('')}</select>`)}</div>` +
        `<div class="three">${fld('Due', `<input name="due" type="date" value="${v.due || ''}">`)}${fld('Time', `<input name="time" type="time" value="${v.time || ''}">`)}${fld('Grade', `<input name="grade" type="text" value="${esc(v.grade)}" placeholder="A-, 94%">`)}</div>` +
        fld('Notes', `<textarea name="notes" rows="2" placeholder="Rubric, page count, submit on Canvas…">${esc(v.notes || '')}</textarea>`),
      onSubmit: d => {
        const o = { title: d.title.trim(), course: d.course, type: d.type, due: d.due || null, time: d.time, grade: d.grade.trim(), notes: d.notes };
        if (a) Object.assign(a, o); else S.assignments.push({ id: uid(), done: false, ...o });
      },
      del: a ? () => { S.assignments = S.assignments.filter(x => x !== a); } : null
    });
  },
  toggleAssign(el) { const a = byId(S.assignments, el.dataset.id); a.done = !a.done; a.doneOn = a.done ? today() : null; if (a.done) { burst(el); if (a.type === 'exam') toast('🧠 Exam done. Go treat yourself.'); } save(); setTimeout(render, a.done ? 260 : 0); },
  delAssign(el) { S.assignments = S.assignments.filter(a => a.id !== el.dataset.id); save(); render(); },
  aFilter(el) { UI.aFilter = el.dataset.f; render(); },

  /* grad apps */
  editApp(el) {
    const a = el && el.dataset.id ? byId(S.apps, el.dataset.id) : null;
    const v = a || { school: '', program: '', deadline: '', status: 'research', fee: '', link: '', notes: '' };
    modal({
      title: a ? esc(a.school) : 'Add a program',
      body: `<div class="two">${fld('School', `<input name="school" type="text" value="${esc(v.school)}" required placeholder="University name">`)}${fld('Program', `<input name="program" type="text" value="${esc(v.program)}" placeholder="M.S. in …">`)}</div>` +
        `<div class="three">${fld('Deadline', `<input name="deadline" type="date" value="${v.deadline || ''}">`)}${fld('Status', `<select name="status">${Object.entries(STATUS).map(([k, [l]]) => `<option value="${k}" ${v.status === k ? 'selected' : ''}>${l}</option>`).join('')}</select>`)}${fld('Fee ($)', `<input name="fee" type="number" min="0" step="1" value="${v.fee}">`)}</div>` +
        fld('Application portal link', `<input name="link" type="url" value="${esc(v.link)}" placeholder="https://apply.school.edu/…">`) +
        fld('Notes', `<textarea name="notes" rows="3" placeholder="Faculty I want to work with, funding, vibes…">${esc(v.notes || '')}</textarea>`) +
        (!a ? `<label style="display:flex;gap:8px;align-items:center;font-size:13px;color:var(--ink-2)"><input type="checkbox" name="std" checked> Start with the usual checklist (SOP, CV, transcripts, recs…)</label>` : ''),
      onSubmit: d => {
        const o = { school: d.school.trim(), program: d.program.trim(), deadline: d.deadline || '', status: d.status, fee: +d.fee || 0, link: d.link.trim(), notes: d.notes };
        if (a) Object.assign(a, o); else S.apps.push({ id: uid(), reqs: d.std ? reqs(DEFAULT_REQS) : [], ...o });
      },
      del: a ? () => { S.apps = S.apps.filter(x => x !== a); } : null
    });
  },
  toggleReq(el) { const a = byId(S.apps, el.dataset.id), r = byId(a.reqs, el.dataset.r); r.done = !r.done; if (r.done) burst(el); if (r.done && appPct(a) === 100 && ['research', 'progress'].includes(a.status)) toast(`🎓 ${a.school} is ready — go hit submit!`); save(); render(); },
  delReq(el) { const a = byId(S.apps, el.dataset.id); a.reqs = a.reqs.filter(r => r.id !== el.dataset.r); save(); render(); },
  delRec(el) { S.recs = S.recs.filter(r => r.id !== el.dataset.id); save(); render(); },

  /* work */
  editShift(el) {
    const s = el && el.dataset.id ? byId(S.shifts, el.dataset.id) : null;
    const last = S.shifts[S.shifts.length - 1];
    const v = s || { date: el.dataset.date || today(), start: last ? last.start : '09:00', end: last ? last.end : '17:00', role: '', notes: '' };
    modal({
      title: s ? 'Edit shift' : 'Add a shift',
      body: `<div class="three">${fld('Date', `<input name="date" type="date" value="${v.date}" required>`)}${fld('Start', `<input name="start" type="time" value="${v.start}" required>`)}${fld('End', `<input name="end" type="time" value="${v.end}" required>`)}</div>` +
        fld('Role / location', `<input name="role" type="text" value="${esc(v.role)}" placeholder="Opening, front desk…">`) +
        fld('Notes', `<input name="notes" type="text" value="${esc(v.notes)}" placeholder="Covering for Jess">`) +
        (!s ? fld('Repeat weekly for', `<select name="rep"><option value="1">Just once</option><option value="2">2 weeks</option><option value="4">4 weeks</option><option value="8">8 weeks</option><option value="16">16 weeks</option></select>`) : ''),
      onSubmit: d => {
        const o = { date: d.date, start: d.start, end: d.end, role: d.role.trim(), notes: d.notes.trim() };
        if (s) Object.assign(s, o); else for (let i = 0; i < (+d.rep || 1); i++) S.shifts.push({ id: uid(), ...o, date: ymd(addDays(parse(d.date), i * 7)) });
      },
      del: s ? () => { S.shifts = S.shifts.filter(x => x !== s); } : null
    });
  },
  payBill(el) { const b = byId(S.bills, el.dataset.id), mk = today().slice(0, 7); if (b.paid[mk]) delete b.paid[mk]; else { b.paid[mk] = true; burst(el); } save(); render(); },
  editBill(el) {
    const b = el.dataset.id ? byId(S.bills, el.dataset.id) : null, v = b || { name: '', amount: '', day: 1 };
    modal({
      title: b ? 'Edit bill' : 'New bill',
      body: fld('Name', `<input name="name" type="text" value="${esc(v.name)}" required placeholder="Phone">`) + `<div class="two">${fld('Amount', `<input name="amount" type="number" step="0.01" min="0" value="${v.amount}">`)}${fld('Due day of month', `<input name="day" type="number" min="1" max="31" value="${v.day}" required>`)}</div>`,
      onSubmit: d => { const o = { name: d.name.trim(), amount: +d.amount || 0, day: Math.min(31, Math.max(1, +d.day || 1)) }; if (b) Object.assign(b, o); else S.bills.push({ id: uid(), paid: {}, ...o }); },
      del: b ? () => { S.bills = S.bills.filter(x => x !== b); } : null
    });
  },

  /* home */
  doChore(el) { const c = byId(S.chores, el.dataset.id), t = today(); if (c.last === t) { c.last = c.prev || null; } else { c.prev = c.last; c.last = t; burst(el); } save(); setTimeout(render, 200); },
  delChore(el) { S.chores = S.chores.filter(c => c.id !== el.dataset.id); save(); render(); },
  choreWho(el) { UI.choreWho = el.dataset.w; render(); },
  toggleGroc(el) { const g = byId(S.grocery, el.dataset.id); g.done = !g.done; save(); render(); },
  delGroc(el) { S.grocery = S.grocery.filter(g => g.id !== el.dataset.id); save(); render(); },
  clearGroc() { S.grocery = S.grocery.filter(g => !g.done); save(); render(); },

  toggleHabit(el) { const h = byId(S.habits, el.dataset.id), k = el.dataset.date; if (h.log[k]) delete h.log[k]; else { h.log[k] = true; burst(el); } save(); render(); },
  delHabit(el) { confirmTap(el, 'Delete?', () => { S.habits = S.habits.filter(h => h.id !== el.dataset.id); save(); render(); }); },
  water(el) { const t = today(), i = +el.dataset.i; S.water[t] = (S.water[t] || 0) === i + 1 ? i : i + 1; if (S.water[t] === (S.settings.waterGoal || 8)) { burst(el); toast('💧 Hydration goal reached. Glowing.'); } save(); render(); },
  setMood(el) { const k = el.dataset.date, j = S.journal[k] = S.journal[k] || {}, i = +el.dataset.i; j.mood = j.mood === i ? null : i; save(); render(); },

  addWorkout(el) {
    const date = el.dataset.date;
    const T = [['pilates', 'Mat pilates', 30], ['walk', 'Hot girl walk', 30], ['yoga', 'Yoga flow', 20], ['strength', 'Strength', 40], ['dance', 'Dance cardio', 25], ['stretch', 'Stretch & breathe', 15]];
    const form = modal({
      title: 'Add movement',
      body: `<div class="tpl-grid">${T.map(([k, n, m]) => `<button type="button" class="tpl" data-tpl="${k}|${n}|${m}"><span>${WTYPES[k][0]}</span>${n}<br><small>${m} min</small></button>`).join('')}</div>` +
        fld('Title', `<input name="title" type="text" required placeholder="Reformer class">`) +
        `<div class="two">${fld('Type', `<select name="type">${Object.keys(WTYPES).map(k => `<option value="${k}">${WTYPES[k][0]} ${k}</option>`).join('')}</select>`)}${fld('Minutes', `<input name="mins" type="number" min="1" value="30">`)}</div>` +
        `<div class="two">${fld('Date', `<input name="date" type="date" value="${date}" required>`)}${fld('Repeat weekly for', `<select name="rep"><option value="1">Just once</option><option value="4">4 weeks</option><option value="8">8 weeks</option><option value="12">12 weeks</option></select>`)}</div>`,
      onSubmit: d => { for (let i = 0; i < +d.rep; i++) S.workouts.push({ id: uid(), date: ymd(addDays(parse(d.date), i * 7)), title: d.title.trim(), type: d.type, mins: +d.mins || 30, done: false }); }
    });
    form.querySelectorAll('[data-tpl]').forEach(b => b.addEventListener('click', () => { const [k, n, m] = b.dataset.tpl.split('|'); form.title.value = n; form.type.value = k; form.mins.value = m; }));
  },
  toggleWorkout(el) { const w = byId(S.workouts, el.dataset.id); w.done = !w.done; if (w.done) burst(el); save(); setTimeout(render, 200); },
  delWorkout(el) { S.workouts = S.workouts.filter(w => w.id !== el.dataset.id); save(); render(); },

  editGoal(el) {
    const g = el.dataset.id ? byId(S.goals, el.dataset.id) : null, v = g || { title: '', cat: 'School', why: '', target: '', color: COLORS[0] };
    modal({
      title: g ? 'Edit goal' : 'New goal',
      body: fld('Goal', `<input name="title" type="text" value="${esc(v.title)}" required placeholder="Get into my dream program">`) +
        `<div class="two">${fld('Area of life', `<select name="cat">${GCATS.map(c => `<option ${v.cat === c ? 'selected' : ''}>${c}</option>`).join('')}</select>`)}${fld('Target date', `<input name="target" type="date" value="${v.target || ''}">`)}</div>` +
        fld('Why it matters', `<input name="why" type="text" value="${esc(v.why)}" placeholder="The reason you’ll come back to on hard days">`) + fld('Color', swatches('color', v.color)),
      onSubmit: d => { const o = { title: d.title.trim(), cat: d.cat, target: d.target, why: d.why, color: d.color || COLORS[0] }; if (g) Object.assign(g, o); else S.goals.push({ id: uid(), ms: [], progress: 0, ...o }); },
      del: g ? () => { S.goals = S.goals.filter(x => x !== g); } : null
    });
  },
  toggleMs(el) { const g = byId(S.goals, el.dataset.id), m = byId(g.ms, el.dataset.m); m.done = !m.done; if (m.done) burst(el); if (m.done && goalPct(g) === 100) toast(`🎀 “${g.title}” — done. You did that.`); save(); render(); },
  delMs(el) { const g = byId(S.goals, el.dataset.id); g.ms = g.ms.filter(m => m.id !== el.dataset.m); save(); render(); },

  jNav(el) { const d = +el.dataset.d; UI.jDate = d === 0 ? today() : ymd(addDays(parse(UI.jDate), d)); render(); },
  jOpen(el) { UI.jDate = el.dataset.d; render(); },

  ftToggle() {
    if (FT.running) { clearInterval(FT.int); FT.running = false; }
    else { FT.running = true; FT.endAt = Date.now() + FT.left * 1000; FT.int = setInterval(ftTick, 500); }
    const p = $('#ft-play'); if (p) p.innerHTML = FT.running ? I.pause : I.play; ftPaint();
  },
  ftReset() { clearInterval(FT.int); FT.running = false; ftSet(FT.mode); render(); ftPaint(); },
  ftSkip() { clearInterval(FT.int); FT.running = false; ftSet(FT.mode === 'focus' ? 'short' : 'focus'); render(); ftPaint(); },
  ftMode(el) { clearInterval(FT.int); FT.running = false; ftSet(el.dataset.m); render(); ftPaint(); },

  settings() {
    modal({
      title: 'Settings',
      body: fld('Your name', `<input name="name" type="text" value="${esc(S.name)}" placeholder="What should we call you?">`) +
        `<div class="three">${fld('Water goal (cups)', `<input name="waterGoal" type="number" min="1" max="16" value="${S.settings.waterGoal || 8}">`)}${fld('Movement / week', `<input name="weeklyMins" type="number" min="10" step="10" value="${S.settings.weeklyMins || 150}">`)}${fld('Hourly pay ($)', `<input name="payRate" type="number" min="0" step="0.25" value="${S.settings.payRate || ''}">`)}</div>` +
        `<div class="eyebrow" style="margin:8px 0">Your data</div>
         <p class="muted" style="font-size:12.5px;margin:0 0 10px">${NATIVE ? 'Everything is saved on this Mac in ~/Library/Application Support/GYST (with a daily backup). Nothing leaves your computer.' : 'Saved in this browser.'}</p>
         ${NATIVE ? `<div class="eyebrow" style="margin:14px 0 8px">Updates</div><div style="display:flex;gap:10px;align-items:center;margin-bottom:12px"><span class="muted" style="font-size:12.5px">Version ${window.GYUpdate ? GYUpdate.version : '?'} · updates install automatically</span><button type="button" class="btn sm" data-act="checkUpdates">Check now</button></div>` : ''}
         ${NATIVE && !CAN_NOTIFY ? `<p class="muted" style="font-size:12.5px;margin:0 0 12px">🔔 Reminders need the newest GYST download — reinstall from the latest GYST.dmg to turn them on.</p>` : ''}
         <div style="display:flex;gap:8px"><button type="button" class="btn sm" data-act="exportData">${I.backup} Export backup…</button>${NATIVE ? `<button type="button" class="btn sm" data-act="importData">Restore from backup…</button>` : ''}</div>`,
      onSubmit: d => { S.name = d.name.trim(); S.settings.waterGoal = Math.max(1, Math.min(16, +d.waterGoal || 8)); S.settings.weeklyMins = Math.max(10, +d.weeklyMins || 150); S.settings.payRate = Math.max(0, +d.payRate || 0); }
    });
  },
  exportData() {
    const json = JSON.stringify(S, null, 2);
    if (NATIVE) { try { window.webkit.messageHandlers.exportData.postMessage(json); return; } catch (e) { } }
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([json], { type: 'application/json' })); a.download = `gyst-backup-${today()}.json`; a.click();
  },
  importData() { try { window.webkit.messageHandlers.importData.postMessage(''); } catch (e) { } },
  notifyOn() { S.settings.remindersOn = true; S.settings.remAsked = true; save(); post('notifyRequest'); if (!UI.remOpen) render(); },
  remLater() { S.settings.remAsked = true; save(); render(); },
  notifySettings() { post('notifySettings'); },
  notifyTest() { post('notifyTest'); toast('Sending a test notification…'); },
  reminders() {
    UI.remOpen = true; const r = rem(), st = UI.notify, on = S.settings.remindersOn && st === 'granted';
    const mins = (name, val, opts) => `<select name="${name}">${opts.map(([v, l]) => `<option value="${v}" ${String(val) === String(v) ? 'selected' : ''}>${l}</option>`).join('')}</select>`;
    const off = [0, 'Off'], m = n => [n, `${n} min before`];
    const status = st === 'granted' ? '' : st === 'denied'
      ? `<p class="muted" style="font-size:13px;margin:0 0 12px">Notifications are turned off for GYST in System Settings.</p><button type="button" class="btn primary sm" data-act="notifySettings">Open Notification Settings</button><p class="muted" style="font-size:12px;margin-top:10px">Turn on “Allow notifications” for GYST, then come back here.</p>`
      : `<p class="muted" style="font-size:13px;margin:0 0 12px">GYST can remind you about classes, shifts, due dates and grad deadlines — even when the app is closed.</p><button type="button" class="btn primary sm" data-act="notifyOn">${I.bell} Turn on notifications</button><p class="muted" style="font-size:12px;margin-top:10px">macOS will ask once — click <b>Allow</b>.</p>`;
    const form = modal({
      title: 'Reminders 🔔', submit: st === 'granted' ? 'Save' : 'Done',
      body: status + (st === 'granted' ? `
        <label style="display:flex;gap:8px;align-items:center;font-size:14px;margin:-4px 0 14px"><input type="checkbox" name="on" ${on ? 'checked' : ''}> Send me reminders</label>
        <div class="two">${fld('Good-morning summary', mins('morning', r.morning, [['', 'Off'], ['06:30', '6:30am'], ['07:00', '7am'], ['07:30', '7:30am'], ['08:00', '8am'], ['08:30', '8:30am'], ['09:00', '9am'], ['10:00', '10am']]))}${fld('Classes', mins('classMins', r.classMins, [off, m(5), m(10), m(15), m(30)]))}</div>
        <div class="two">${fld('Work shifts', mins('shiftMins', r.shiftMins, [off, m(15), m(30), m(45), m(60)]))}${fld('Events', mins('eventMins', r.eventMins, [off, m(10), m(15), m(30), m(60)]))}</div>
        <div class="two">${fld('Due tomorrow (night before)', mins('dueNight', r.dueNight, [['', 'Off'], ['17:00', '5pm'], ['18:00', '6pm'], ['19:00', '7pm'], ['20:00', '8pm'], ['21:00', '9pm']]))}${fld('Sunday reset nudge', mins('sunday', r.sunday, [['', 'Off'], ['10:00', '10am'], ['14:00', '2pm'], ['17:00', '5pm'], ['18:00', '6pm'], ['19:00', '7pm']]))}</div>
        <label style="display:flex;gap:8px;align-items:center;font-size:13px;color:var(--ink-2);margin-bottom:6px"><input type="checkbox" name="apps" ${r.apps ? 'checked' : ''}> Grad app deadlines (a week before and the day before)</label>
        <label style="display:flex;gap:8px;align-items:center;font-size:13px;color:var(--ink-2);margin-bottom:12px"><input type="checkbox" name="water" ${r.water ? 'checked' : ''}> Water reminders (11am, 2pm, 5pm)</label>
        <div style="display:flex;gap:8px;align-items:center"><button type="button" class="btn sm" data-act="notifyTest">Send a test</button><span class="muted" style="font-size:12px">Reminders cover the next week and refresh whenever you open GYST.</span></div>` : ''),
      onSubmit: d => {
        UI.remOpen = false;
        if (st !== 'granted') return;
        S.settings.remindersOn = !!d.on;
        S.settings.rem = { morning: d.morning, classMins: +d.classMins, shiftMins: +d.shiftMins, eventMins: +d.eventMins, dueNight: d.dueNight, apps: !!d.apps, sunday: d.sunday, water: !!d.water };
        toast(d.on ? '🔔 Reminders saved' : 'Reminders are off');
      }
    });
    form.querySelector('[data-act="closeModal"]').addEventListener('click', () => { UI.remOpen = false; });
  },
  async checkUpdates() {
    toast('Checking for updates…');
    const r = await GYUpdate.check();
    toast(r === 'updated' ? '✨ Update downloaded — hit Refresh at the bottom.' : r === 'current' ? 'You’re on the latest version 🤍' : 'Couldn’t reach the update server — try again later.');
  },
};
function guessCat(x) {
  x = x.toLowerCase();
  const m = [['Produce', /apple|onion|garlic|potato|pear|carrot|kale|spinach|lettuce|tomato|lemon|lime|ginger|berr|banana|avocado|cucumber|pepper|mushroom|herb/],
    ['Dairy', /milk|cheese|butter|yogurt|cream|egg/], ['Meat & Fish', /chicken|beef|pork|turkey|salmon|fish|sausage|bacon|shrimp/],
    ['Bakery', /bread|bagel|tortilla|bun|roll|croissant/], ['Frozen', /frozen|ice cream/], ['Snacks', /chip|cracker|popcorn|chocolate|granola|bar$/],
    ['Beauty & care', /shampoo|conditioner|lotion|serum|sunscreen|spf|toothpaste|floss|razor|deodorant|cleanser|moistur|lip|tampon|pad$/],
    ['Household', /paper towel|toilet|detergent|soap|trash bag|sponge|candle/]];
  for (const [c, re] of m) if (re.test(x)) return c;
  return 'Pantry';
}

const SUB = {
  aheadAdd(f, d) {
    const text = (d.text || '').trim(), date = f.dataset.date; if (!text) return;
    // "3pm coffee", "9:30 dentist", "14:00 call" become events; anything else is a to-do
    const m = text.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\s+(.+)$/i);
    if (m && (m[2] || m[3])) {
      let h = +m[1]; const mi = +(m[2] || 0);
      if (m[3]) h = h % 12 + (m[3].toLowerCase() === 'pm' ? 12 : 0);
      if (h < 24 && mi < 60) { S.events.push({ id: uid(), title: m[4], date, time: `${pad(h)}:${pad(mi)}`, end: '', color: COLORS[S.events.length % COLORS.length], notes: '' }); return; }
    }
    S.tasks.push({ id: uid(), text, date, list: 'personal', pri: 1, done: false });
  },
  quickTask(f, d) { if (!d.text.trim()) return; S.tasks.push({ id: uid(), text: d.text.trim(), date: today(), list: 'personal', pri: 1, done: false }); },
  addTask(f, d) { S.tasks.push({ id: uid(), text: d.text.trim(), date: d.date || null, list: d.list, pri: +d.pri, done: false }); },
  addAssign(f, d) { S.assignments.push({ id: uid(), title: d.title.trim(), course: d.course, type: d.type, due: d.due || null, time: '', grade: '', notes: '', done: false }); },
  addReq(f, d) { if (!d.text.trim()) return; const a = byId(S.apps, f.dataset.id); (a.reqs = a.reqs || []).push({ id: uid(), text: d.text.trim(), done: false }); },
  addRec(f, d) { S.recs.push({ id: uid(), name: d.name.trim(), role: d.role.trim(), status: 'toask', asked: '', notes: '' }); },
  addChore(f, d) { S.chores.push({ id: uid(), text: d.text.trim(), room: d.room.trim() || 'Home', freq: +d.freq, last: null, who: d.who || 'me' }); },
  addGroc(f, d) { const text = d.text.trim(); S.grocery.push({ id: uid(), text, cat: d.cat === 'Produce' && !f.dataset.touched ? guessCat(text) : d.cat, done: false }); },
  addHabit(f, d) { S.habits.push({ id: uid(), name: d.name.trim(), icon: d.icon.trim() || '🎀', log: {} }); },
  addMs(f, d) { if (!d.text.trim()) return; const g = byId(S.goals, f.dataset.id); (g.ms = g.ms || []).push({ id: uid(), text: d.text.trim(), done: false }); },
};
const CH = {
  moveTask(el) {
    if (!el.value) return; const x = byId(S.tasks, el.dataset.id);
    x.date = el.value === 'someday' ? null : el.value; save();
    toast(x.date ? `Moved to ${DOW[parse(x.date).getDay()]} ${fmtDate(x.date)}` : 'Moved to your someday list'); render();
  },
  ambVol(el) { Amb.vol(el.dataset.k, +el.value); saveSound(); },
  weeklyMins(el) { S.settings.weeklyMins = Math.max(10, +el.value || 150); save(); render(); },
  goalProgress(el) { byId(S.goals, el.dataset.id).progress = +el.value; save(); render(); },
  payRate(el) { S.settings.payRate = Math.max(0, +el.value || 0); save(); render(); },
  aCourse(el) { UI.aCourse = el.value; render(); },
  appStatus(el) {
    const a = byId(S.apps, el.dataset.id); a.status = el.value; save();
    if (a.status === 'submitted') { burst(el); toast(`🎓 Submitted to ${a.school}! Proud of you.`); }
    if (a.status === 'accepted') { burst(el); setTimeout(() => burst(el), 300); toast(`🎉 ACCEPTED to ${a.school}!! Screaming.`); }
    render();
  },
  recStatus(el) { const r = byId(S.recs, el.dataset.id); r.status = el.value; if (r.status === 'asked' && !r.asked) r.asked = today(); if (r.status === 'submitted') burst(el); save(); render(); },
};
const IN = {
  weekPri(el) { const k = el.dataset.k; S.weekPri[k] = S.weekPri[k] || []; S.weekPri[k][+el.dataset.i] = el.value; save(); },
  weekNote(el) { S.weekNotes[el.dataset.k] = el.value; save(); },
  journal(el) {
    const k = el.dataset.date, j = S.journal[k] = S.journal[k] || {}, fl = el.dataset.field;
    if (fl === 'text') j.text = el.value; else { j.g = j.g || []; j.g[+fl.slice(1)] = el.value; }
    save();
  },
  ftTask(el) { FT.task = el.value; },
};

/* ---------- events ---------- */
document.addEventListener('pointerdown', () => Amb.wake(), true);
document.addEventListener('click', e => {
  Amb.wake();
  const g = e.target.closest('[data-go]'); if (g) { go(g.dataset.go); return; }
  const a = e.target.closest('[data-act]'); if (a && A[a.dataset.act]) { e.preventDefault(); A[a.dataset.act](a, e); }
  if (!e.target.closest('#radio')) $('#radio').classList.remove('open');
});
document.addEventListener('submit', e => {
  const f = e.target; if (!f.dataset.submit) return;
  e.preventDefault(); const d = Object.fromEntries(new FormData(f));
  SUB[f.dataset.submit](f, d); save(); render();
  const sel = `form[data-submit="${f.dataset.submit}"]${f.dataset.date ? `[data-date="${f.dataset.date}"]` : ''}${f.dataset.id ? `[data-id="${f.dataset.id}"]` : ''}`;
  const again = $(`${sel} input[name=text], ${sel} input[name=name], ${sel} input[name=title]`); if (again) again.focus();
});
document.addEventListener('change', e => {
  if (e.target.closest('form[data-submit="addGroc"]') && e.target.name === 'cat') e.target.form.dataset.touched = '1';
  const el = e.target.closest('[data-change]'); if (el && CH[el.dataset.change]) CH[el.dataset.change](el);
});
document.addEventListener('input', e => {
  const el = e.target.closest('[data-input]'); if (el && IN[el.dataset.input]) IN[el.dataset.input](el);
  if (e.target.matches('[data-change="ambVol"]')) CH.ambVol(e.target);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { if ($('#modal-root').innerHTML) closeModal(); else if (document.body.classList.contains('scene-mode')) A.exitScene(); else $('#radio').classList.remove('open'); return; }
  if (e.target.matches('input,textarea,select')) return;
  if (e.metaKey && /^[1-9]$/.test(e.key)) { const vs = VIEWS.filter(v => !v.sep); const v = vs[+e.key - 1]; if (v) { e.preventDefault(); go(v.id); } }
  if (e.metaKey && e.key === '0') { e.preventDefault(); go('focus'); }
});

/* ---------- boot ---------- */
if (CAN_NOTIFY) { post('notifyStatus'); setInterval(syncReminders, 6 * 3600e3); addEventListener('focus', () => post('notifyStatus')); }
Scene.setSparkles(S.settings.sparkles !== false);
Amb.restore(S.settings.sound);
Scene.setRain(Amb.get('rain').on);
render(); renderRadio();
setInterval(() => { tickClock(); }, 15000);
let lastDay = today();
setInterval(() => { if (today() !== lastDay) { lastDay = today(); if (UI.jDate < lastDay) UI.jDate = lastDay; render(); } }, 60000);
S.settings.webVersion = window.__GY_WEB_VERSION || 0;
save(); // ensure the data file exists from the very first launch
try { window.webkit.messageHandlers.booted.postMessage(''); } catch (e) { }
if (!S.settings.welcomed && !READONLY) {
  S.settings.welcomed = true; save();
  setTimeout(() => modal({
    title: 'Welcome to GYST 🎀',
    body: `<p style="margin:-6px 0 16px;color:var(--ink-2);font-family:var(--serif);font-size:16px;line-height:1.6">Get your shit together — beautifully. Classes, assignments, grad school apps, work shifts, chores, habits and a journal, all in one calm little place.</p>` +
      fld('What should we call you?', `<input name="name" type="text" placeholder="Your name" autocomplete="off">`) +
      `<label style="display:flex;gap:8px;align-items:center;font-size:13px;color:var(--ink-2);margin:4px 0 10px"><input type="checkbox" name="keep" checked> Show me example items so it doesn’t feel empty</label>` +
      `<p class="muted" style="font-size:12.5px">Examples can be edited or deleted anytime. Tip: open the 🎧 ambience (bottom right) for lofi & rain while you study.</p>`,
    submit: 'Let’s get it together',
    onSubmit: d => {
      S.name = (d.name || '').trim();
      if (!d.keep) ['tasks', 'events', 'courses', 'assignments', 'apps', 'recs', 'shifts', 'chores', 'grocery', 'bills', 'workouts', 'goals'].forEach(k => S[k] = []);
    }
  }), 600);
}
