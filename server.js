require('dotenv').config();
const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const bcrypt = require('bcryptjs');
const path = require('path');
const { init, findUserByEmail, findUserById, findUserByGithubId, createUser } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

init();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'change_me_in_env',
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({ db: 'data.sqlite', dir: path.join(__dirname, '..') })
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findUserById(id);
    done(null, user || false);
  } catch (e) {
    done(e);
  }
});

passport.use(
  new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, async (email, password, done) => {
    try {
      const user = await findUserByEmail(email);
      if (!user || !user.password_hash) return done(null, false);
      const ok = await bcrypt.compare(password, user.password_hash);
      if (!ok) return done(null, false);
      return done(null, user);
    } catch (e) {
      return done(e);
    }
  })
);

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:' + PORT + '/auth/github/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const existing = await findUserByGithubId(profile.id);
          if (existing) return done(null, existing);
          const created = await createUser({ email: profile.emails?.[0]?.value || null, passwordHash: null, githubId: profile.id });
          return done(null, { id: created.id, email: created.email, github_id: created.github_id });
        } catch (e) {
          done(e);
        }
      }
    )
  );
}

app.use(passport.initialize());
app.use(passport.session());

function requireAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ ok: false });
}

app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ ok: false });
  try {
    const existing = await findUserByEmail(email);
    if (existing) return res.status(409).json({ ok: false });
    const hash = await bcrypt.hash(password, 10);
    const user = await createUser({ email, passwordHash: hash });
    res.json({ ok: true, user: { id: user.id, email: user.email } });
  } catch (e) {
    res.status(500).json({ ok: false });
  }
});

app.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({ ok: true, user: { id: req.user.id, email: req.user.email } });
});

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.json({ ok: true });
  });
});

app.get('/auth/github', (req, res, next) => {
  if (!passport._strategies.github) return res.status(500).json({ ok: false });
  next();
}, passport.authenticate('github', { scope: ['user:email'] }));

app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/profile.html');
});

app.get('/me', requireAuth, (req, res) => {
  res.json({ ok: true, user: { id: req.user.id, email: req.user.email, github_id: req.user.github_id || null } });
});

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(path.join(__dirname, '..')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log('Server on http://localhost:' + PORT);
});
