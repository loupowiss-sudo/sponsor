// === FIREBASE-INIT.JS ===
// Initialisation unique de Firebase — doit être chargé en premier

const firebaseConfig = {
  apiKey: "AIzaSyATuFiDT8YMov68euJCMB4Ax1eyBOCGqqc",
  authDomain: "sponsor-test-20c6b.firebaseapp.com",
  databaseURL: "https://sponsor-test-20c6b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "sponsor-test-20c6b",
  storageBucket: "sponsor-test-20c6b.firebasestorage.app",
  messagingSenderId: "882035160210",
  appId: "1:882035160210:web:7a7d005155c4ba91bee24b"
};

let auth = null;
let db = null;

function initFirebase() {
  try {
    if (!window.firebase || typeof firebase.initializeApp !== 'function') {
      console.warn('Firebase SDK non chargé');
      _createFallbackAuth();
      return;
    }
    // Éviter le double-init
    if (!firebase.apps || firebase.apps.length === 0) {
      firebase.initializeApp(firebaseConfig);
    }
    auth = firebase.auth();
    window.auth = auth;
    try {
      auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(e => console.warn('Auth persistence:', e));
    } catch (e) {}
  } catch (e) {
    console.error('Firebase init error:', e);
    _createFallbackAuth();
  }
}

function _createFallbackAuth() {
  auth = {
    currentUser: null,
    signInWithEmailAndPassword: async () => { throw new Error('Firebase non chargé'); },
    signOut: async () => {},
    onAuthStateChanged: (cb) => { cb(null); return () => {}; },
    setPersistence: () => Promise.resolve()
  };
  window.auth = auth;
}

function getDb() {
  if (!window.firebase || !firebase.firestore) return null;
  if (!db) {
    try {
      db = firebase.firestore();
      window.db = db;
      db.settings({
        ignoreUndefinedProperties: true,
        experimentalForceLongPolling: true,
        useFetchStreams: false
      });
      db.enablePersistence({ synchronizeTabs: true }).catch(() => {});
    } catch (e) {
      console.warn('Firestore init error:', e);
    }
  }
  return db;
}

// Auto-init immédiatement
initFirebase();

window.initFirebase = initFirebase;
window.getDb = getDb;
window.db = getDb();
