// Builds the Quizmaster Bob Host site (quizhost.izeus.org): node build.mjs
// Same layout and look as quizmasterbob.izeus.org (the player app's site).
import { writeFileSync } from 'node:fs';

const SUPPORT_ENDPOINT = 'https://www.izeus.org/_functions/support';
const ORIGIN = 'https://quizhost.izeus.org';
const PLAYER_SITE = 'https://quizmasterbob.izeus.org';
const PLAYER_APP = 'https://apps.apple.com/au/app/quizmaster-bob/id6778641163';
const V = Date.now().toString(36);
const UPDATED = '12 October 2026';

// Until Apple approves the app the badge says "Coming soon" and points at #get.
const APP_STORE = null;
const appleLogo = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.1-1.2 2.9-2.4.9-1.4 1.3-2.7 1.3-2.8-.1 0-2.4-.9-2.4-3.9zM14 5.5c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.1-.6 2.8-1.4z"/></svg>';
const storeBadge = APP_STORE
  ? `<a class="store" href="${APP_STORE}">${appleLogo}<span><small>Download on the</small><b>App Store</b></span></a>`
  : `<a class="store soon" href="#get">${appleLogo}<span><small>Coming soon on the</small><b>App Store</b></span></a>`;
const plansLink = `<a class="btn btn-ghost" href="#pricing">See the plans</a>`;

const icon = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const icons = {
  screen: icon('<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>'),
  mic: icon('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4"/>'),
  wheel: icon('<circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4"/>'),
  phone: icon('<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>'),
  trophy: icon('<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4zM7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4"/>'),
  edit: icon('<path d="M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4"/>'),
};

const tab = (name, alt, lazy = true) =>
  `<div class="frame tab"><img src="assets/shots/${name}.webp" alt="${alt}" width="900" height="675"${lazy ? ' loading="lazy"' : ''}></div>`;
const shot = (name, alt, title, sub) =>
  `<figure class="shot wide">${tab(name, alt)}<figcaption>${title}<span>${sub}</span></figcaption></figure>`;

const background = `<div class="bg" aria-hidden="true">
  <div class="bg-art"></div>
  <img class="bg-mark" src="assets/logo-full.png" alt="">
  <div class="orb o1"></div><div class="orb o2"></div><div class="orb o3"></div><div class="orb o4"></div>
  <div class="grid"></div>
  <div class="mist"></div>
</div>`;

const NAV = [
  ['index.html', 'Home'],
  ['support.html', 'Support'],
  ['privacy.html', 'Privacy'],
  ['terms.html', 'Terms'],
];

function layout({ file, title, description, body, script = false }) {
  const links = NAV.map(([href, label]) =>
    `<a href="${href}"${href === file ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${description}">
<meta name="theme-color" content="#1a2438">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${ORIGIN}/assets/icon-512.png">
<link rel="icon" type="image/png" sizes="32x32" href="assets/icon-32.png">
<link rel="icon" type="image/png" sizes="512x512" href="assets/icon-512.png">
<link rel="apple-touch-icon" href="assets/icon-180.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/style.css?v=${V}">
</head>
<body>
${background}
<header class="nav">
  <a class="brand" href="index.html"><img src="assets/logo-full.png" alt="" width="40" height="40"><span>Quizmaster Bob Host</span></a>
  <nav class="nav-links">${links}</nav>
</header>
${body}
<footer class="foot">&copy; ${new Date().getFullYear()} iZeus Pty Ltd &middot; <a href="privacy.html">Privacy</a> &middot; <a href="terms.html">Terms</a> &middot; <a href="support.html">Support</a></footer>
${script ? `<script src="assets/site.js?v=${V}"></script>\n` : ''}</body>
</html>
`;
}

const PLANS = [
  { name: 'Weekly Quiz', qty: '1 quiz a week', price: '£24.99', per: '£24.99 per quiz' },
  { name: 'Regular', qty: '3 quizzes a week', price: '£64.99', per: '£21.66 per quiz', best: true },
  { name: 'Every Night', qty: '7 quizzes a week', price: '£129.99', per: '£18.57 per quiz' },
];
const priceCards = PLANS.map((p) => `<div class="price glass${p.best ? ' best' : ''}">
      <h3>${p.name}</h3><div class="qty">${p.qty}</div>
      <div class="amt">${p.price} <small>/ week</small></div>
      <div class="per">${p.per}</div>
    </div>`).join('\n    ');

const pages = {
  'index.html': {
    title: 'Quizmaster Bob Host – Run a pub quiz night from your iPad',
    description: 'Host a full TV-style pub quiz from an iPad: a host voice that reads every question, a spinning question wheel, fire countdowns and live scoreboards on the venue screen, with teams answering on their phones.',
    body: `<main class="wrap wide">
<section class="pitch ipad">
  <div>
    <span class="eyebrow">iPad host app &middot; Venue screen</span>
    <h1>The whole quiz night, <span class="grad">run from an iPad</span></h1>
    <p class="lead">Quizmaster Bob Host puts a TV-style quiz show on the venue screen. Bob reads every question out loud, the wheel spins, the fuse burns down and the scores roll in, while every team answers on their own phone.</p>
    <div class="cta-row">
      ${storeBadge}
      ${plansLink}
    </div>
    <p class="meta">Free to try: host the first 5 questions of any quiz in Test Mode, no payment needed.</p>
  </div>
  <div class="pitch-art">
    ${tab('question', 'A multiple choice question on the venue screen with big coloured answers and a burning countdown', false)}
    <img class="pitch-logo" src="assets/icon-512.png" alt="Quizmaster Bob app icon" width="112" height="112">
  </div>
</section>

<section id="features">
  <h2 class="section-title">A quiz show, not a slideshow</h2>
  <p class="section-sub">Everything a professional quizmaster brings, built into one iPad app.</p>
  <div class="features">
    <div class="feature glass"><div class="icon">${icons.screen}</div><h3>Made for the big screen</h3><p>AirPlay or plug the iPad into the venue TV. The room sees the show; you keep the controls, teams and answers on the iPad.</p></div>
    <div class="feature glass"><div class="icon">${icons.mic}</div><h3>A host voice that never tires</h3><p>Every question, clue and answer is read out in a natural voice, and Ollie, the animated co-host, pops up to keep the energy going.</p></div>
    <div class="feature glass"><div class="icon">${icons.wheel}</div><h3>12 kinds of question</h3><p>Multiple choice, true or false, vanishing answers, picture reveals, breadcrumb clues, put-in-order, nearest answer, bet your points and more.</p></div>
    <div class="feature glass"><div class="icon">${icons.phone}</div><h3>Phones are the answer pads</h3><p>Teams scan the QR code or type a 4-digit code into the free Quizmaster Bob player app. No paper, no pens, no marking.</p></div>
    <div class="feature glass"><div class="icon">${icons.trophy}</div><h3>Scores do themselves</h3><p>Answers are marked the moment the clock runs out, with speed bonuses, team photos on the score cards and a final leaderboard.</p></div>
    <div class="feature glass"><div class="icon">${icons.edit}</div><h3>Write your own quizzes</h3><p>Use a ready-made quiz, pull questions from the library, or build your own on the iPad with pictures and music.</p></div>
  </div>
</section>

<section id="screens">
  <h2 class="section-title">See it in action</h2>
  <p class="section-sub">Real screens from the Quizmaster Bob Host app on iPad.</p>
  <div class="shots">
    ${shot('lobby', 'Lobby screen with a QR code, join code and countdown', 'Teams join', 'Scan the QR code or type the code')}
    ${shot('wheel', 'Spinning wheel landing on the next question type', 'Spin the wheel', 'Every question gets its moment')}
    ${shot('question', 'Multiple choice question with large coloured answers', 'Big, bold questions', 'Readable from the back of the pub')}
    ${shot('wheelboard', 'Wheel of Fortune letter board spelling the answer', 'Wheel of Fortune', 'Letters appear as time runs out')}
    ${shot('reveal', 'Answer reveal with percentages and team photos', 'The big reveal', 'Who picked what, with team photos')}
    ${shot('scores', 'Team score cards with photos and points', 'Scores for every question', 'Team photos and points roll in')}
    ${shot('rounds', 'Round scores with medals for the top three teams', 'Round scores', 'Medals, confetti and bragging rights')}
    ${shot('breadcrumbs', 'Breadcrumb clue cards dealt onto the screen', 'Breadcrumb clues', 'Fewer clues, more points')}
    ${shot('console', 'The host controls on the iPad', 'You stay in control', 'Pause, skip and see every answer')}
  </div>
</section>

<section id="how">
  <h2 class="section-title">How a night works</h2>
  <p class="section-sub">Set up in minutes. Bob does the talking.</p>
  <ol class="steps">
    <li class="glass"><h3>Pick a quiz</h3><p>Choose one of yours or a ready-made quiz, and set your venue.</p></li>
    <li class="glass"><h3>Put it on the TV</h3><p>AirPlay or HDMI to the venue screen. Teams scan the code with the free player app.</p></li>
    <li class="glass"><h3>Bob runs the show</h3><p>Questions are read out, timed and revealed automatically. Pause or skip whenever you like.</p></li>
    <li class="glass"><h3>Crown the winners</h3><p>Round scores, a final leaderboard and confetti for the winning team.</p></li>
  </ol>
</section>

<section id="pricing">
  <h2 class="section-title">Simple weekly plans</h2>
  <p class="section-sub">One token runs one full live quiz. Each plan adds tokens every week, and unused tokens never expire.</p>
  <div class="prices">
    ${priceCards}
  </div>
  <div class="price-notes">
    <div class="plan glass"><h3>Free to try</h3><p>Every account can host the first 5 questions of any quiz in Test Mode, as often as you like. Players always play free.</p></div>
    <div class="plan glass"><h3>Need one more night?</h3><p>Buy a single token for £34.99 whenever you need an extra quiz. Plans work out cheaper per quiz.</p></div>
  </div>
  <p class="meta" style="text-align:center">Prices in pounds sterling including VAT. The App Store shows your local price. Plans renew weekly through your Apple ID until you cancel.</p>
</section>

<section id="get">
  <div class="band glass">
    <img src="assets/logo-full.png" alt="" width="88" height="88">
    <h2>Ready to host your first night?</h2>
    <p>Quizmaster Bob Host for iPad is coming soon to the App Store. Your teams use the free <a href="${PLAYER_SITE}">Quizmaster Bob player app</a>.</p>
    <div class="cta-row" style="justify-content:center">
      ${storeBadge}
      <a class="btn btn-ghost" href="${PLAYER_APP}">Get the player app</a>
    </div>
    <p class="fine">Designed for iPad. Connect it to the venue TV with AirPlay or an HDMI adapter so the whole room can see.</p>
  </div>
</section>
</main>`,
  },

  'support.html': {
    title: 'Quizmaster Bob Host Support',
    description: 'Help hosting a live quiz with the Quizmaster Bob Host app, and a contact form.',
    script: true,
    body: `<main class="wrap"><article class="doc glass">
<h1>Support</h1>
<p class="muted">Quizmaster Bob Host app for iPad</p>
<p>Need help setting up a quiz night, a plan or your account?</p>

<h2 id="contact">Contact us</h2>
<p>Send a message and we will reply by email. If something went wrong during a quiz, tell us the quiz name, the venue and roughly when it happened.</p>
<p class="notice ok" id="sent" role="status" hidden>Thanks. Your message has been sent. We will reply by email.</p>
<p class="notice err" id="error" role="alert" hidden></p>
<form class="contact" method="post" action="${SUPPORT_ENDPOINT}">
  <input type="hidden" name="app" value="QuizmasterBobHost">
  <input type="hidden" name="return" value="${ORIGIN}/support.html">
  <label>Your name<input name="name" required maxlength="80" autocomplete="name"></label>
  <label>Your email<input name="email" type="email" required maxlength="120" autocomplete="email"></label>
  <label>Message<textarea name="message" required minlength="5" maxlength="4000" placeholder="Tell us the quiz, the venue and what you saw on screen."></textarea></label>
  <div class="hp" aria-hidden="true"><label>Leave this empty<input name="website" tabindex="-1" autocomplete="off"></label></div>
  <button class="btn" type="submit">Send message</button>
</form>

<h2>Getting started</h2>
<ol>
  <li>Create an account in the app with your email, or with Sign in with Apple.</li>
  <li>Pick a quiz and choose <strong>Test Mode</strong> to rehearse the first 5 questions for free.</li>
  <li>Connect the iPad to the venue screen with AirPlay or an HDMI adapter. The room sees the quiz; your iPad keeps the controls.</li>
  <li>Teams join with the free Quizmaster Bob player app using the code or QR code on the screen.</li>
</ol>

<h2>Frequently asked questions</h2>
<p class="faq-q">How do plans and tokens work?</p>
<p class="faq-a">One token runs one full live quiz. A weekly plan adds 1, 3 or 7 tokens each week, and unused tokens roll over. You can also buy single tokens. Test Mode is always free.</p>
<p class="faq-q">How do I cancel or change my plan?</p>
<p class="faq-a">Plans are App Store subscriptions. In the app, open Plans &amp; Tokens and tap Manage plan, or go to Settings &rarr; your name &rarr; Subscriptions on your iPad. Cancel at least 24 hours before the renewal date.</p>
<p class="faq-q">Can I get a refund?</p>
<p class="faq-a">Payments are handled by Apple, so refunds are requested through Apple at <a href="https://reportaproblem.apple.com">reportaproblem.apple.com</a>. If Apple refunds a purchase, its tokens are removed from your balance.</p>
<p class="faq-q">I bought a plan on another device</p>
<p class="faq-a">Sign in with the same account and tap Restore purchases on the Plans &amp; Tokens screen.</p>
<p class="faq-q">The internet dropped during a quiz</p>
<p class="faq-a">Open Reconnect in the app to carry on from where you were. You are not charged another token.</p>
<p class="faq-q">Teams can't join</p>
<p class="faq-a">Check the code on the screen, and that the quiz has started. Some venue Wi-Fi blocks new devices, so teams can try mobile data instead.</p>
<p class="faq-q">How do I delete my account?</p>
<p class="faq-a">In the app, open Account &amp; Settings and tap Delete my account. Cancel any weekly plan first, because Apple keeps billing until it is cancelled.</p>

<h2>Privacy</h2>
<p>How your data is handled is in the <a href="privacy.html">privacy policy</a>.</p>
</article></main>`,
  },

  'privacy.html': {
    title: 'Quizmaster Bob Host Privacy Policy',
    description: 'How the Quizmaster Bob Host app handles host accounts, quizzes, game data, purchases and support messages.',
    body: `<main class="wrap"><article class="doc glass">
<h1>Privacy Policy</h1>
<p class="muted">Last updated: ${UPDATED}</p>
<p>Quizmaster Bob Host is an app from iZeus Pty Ltd for running live quiz nights. This policy explains what the host app collects and why. Players who join a quiz with the player app are covered by the <a href="${PLAYER_SITE}/privacy.html">player app privacy policy</a>.</p>

<h2>What we collect</h2>
<ul>
  <li><strong>Your account:</strong> your name and email address, and your password (handled by Google Firebase Authentication and never seen by us). If you use Sign in with Apple, we receive the name and email Apple shares, which can be a private relay address.</li>
  <li><strong>Your quizzes:</strong> the questions, answers, pictures and audio you create or upload, and the quizzes you share with other hosts.</li>
  <li><strong>Quiz nights:</strong> the games you host, the venue name you enter, which library questions were used at that venue, and the team names, optional team photos, answers and scores from players who join.</li>
  <li><strong>Plans and tokens:</strong> your token balance and a record of tokens added and spent. When you buy through the App Store we receive the purchase details Apple provides (product, date and transaction number). We never see your card or payment details.</li>
  <li><strong>On your device:</strong> your host settings, such as voice and music options.</li>
</ul>
<p>The app has no advertising and no third-party tracking.</p>

<h2>How we use it</h2>
<p>To run your quiz nights: signing you in, showing your quizzes, recording answers and scores, avoiding repeated questions at your venue, adding tokens for your purchases, and replying to support messages.</p>

<h2>Services we use</h2>
<ul>
  <li><strong>Google Firebase</strong> (Google Cloud) stores accounts, quizzes, games and media.</li>
  <li><strong>Google Cloud Text-to-Speech</strong> turns question text into the host voice. Only the words being read out are sent.</li>
  <li><strong>Apple</strong> handles App Store payments and Sign in with Apple.</li>
  <li><strong>Wix</strong> stores messages sent through our <a href="support.html#contact">support form</a> (your name, email and message), which we use only to reply.</li>
</ul>
<p>We do not sell personal information.</p>

<h2>Who can see what</h2>
<p>Your quizzes are private to you and to hosts you share them with. During a quiz, the room sees team names, team photos and scores on the venue screen as part of the game.</p>

<h2>Keeping and deleting data</h2>
<p>We keep your data while you have an account. You can delete your account at any time in the app (Account &amp; Settings &rarr; Delete my account). This removes your sign-in and your personal details, such as your name and email. Quizzes you made are kept without your name attached; if you would like those removed too, ask through the <a href="support.html#contact">support form</a>. Deleting your account does not cancel an App Store plan: cancel it in your Apple ID settings.</p>

<h2>Children</h2>
<p>The host app is for adults who run quiz events. Hosts are responsible for appropriate use at their events.</p>

<h2>Contact</h2>
<p>Questions about privacy? Send a message through the <a href="support.html#contact">support form</a>. iZeus Pty Ltd, Australia.</p>
</article></main>`,
  },

  'terms.html': {
    title: 'Quizmaster Bob Host Terms of Use',
    description: 'Terms of use for the Quizmaster Bob Host app, including weekly plans and quiz tokens.',
    body: `<main class="wrap"><article class="doc glass">
<h1>Terms of Use</h1>
<p class="muted">Last updated: ${UPDATED}</p>
<p>Quizmaster Bob Host is an app from iZeus Pty Ltd for running live quiz nights. By using it you agree to these terms and to Apple’s standard Licensed Application End User License Agreement: <a href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/">apple.com/legal/internet-services/itunes/dev/stdeula</a>.</p>

<h2>Tokens and Test Mode</h2>
<p>One quiz token runs one live quiz. Test Mode lets you host the first 5 questions of any quiz for free. A token is used when a live quiz starts; if the connection drops, Reconnect lets you carry on without using another token.</p>

<h2>Weekly plans</h2>
<ul>
  <li>Plans are auto-renewing weekly subscriptions bought through the App Store: Weekly Quiz (1 token a week), Regular (3 a week) and Every Night (7 a week). Prices are shown in the app before you buy.</li>
  <li>Payment is charged to your Apple ID when you confirm. A plan renews each week unless you cancel at least 24 hours before the end of the current week. Your Apple ID is charged for the next week within 24 hours of renewal.</li>
  <li>Manage or cancel in the app (Plans &amp; Tokens &rarr; Manage plan) or in your Apple ID settings. Cancelling stops future renewals; the current week continues until it ends.</li>
  <li>Each renewal adds that plan’s tokens. Unused tokens do not expire, including after you cancel.</li>
  <li>Single tokens can also be bought as one-off purchases.</li>
  <li>Refunds are handled by Apple. If Apple refunds a purchase, the tokens it added are removed from your balance.</li>
</ul>

<h2>Your content</h2>
<p>You are responsible for the quizzes, pictures and audio you upload, and must have the right to use them. Don’t upload anything unlawful or abusive. Team names and photos from players appear on the venue screen during a quiz.</p>

<h2>Availability</h2>
<p>We work to keep the service running, but a quiz night depends on your internet connection and devices. Rehearse in Test Mode before a big night.</p>

<h2>Privacy</h2>
<p>How information is handled is described in the <a href="privacy.html">Privacy Policy</a>.</p>

<h2>Contact</h2>
<p>Questions? Send a message through the <a href="support.html#contact">support form</a>.</p>
</article></main>`,
  },
};

for (const [file, page] of Object.entries(pages)) {
  writeFileSync(new URL(file, import.meta.url), layout({ file, ...page }));
}
console.log('built', Object.keys(pages).length, 'pages', V);
