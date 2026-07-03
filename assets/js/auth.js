// === AUTHENTIFICATION LOGIC ===

/**
 * Retourne le rôle de l'utilisateur connecté
 * @returns {string} 'admin' | 'employee' | 'client' | 'none'
 */
window.getUserRole = function () {
  const rawUser = auth ? auth.currentUser : null;
  // Un utilisateur Firebase "anonyme" (ajouté pour sécuriser l'accès Firestore
  // des employés/clients) ne doit jamais être traité comme un admin : seul un
  // vrai compte email/mot de passe compte ici.
  const user = (rawUser && !rawUser.isAnonymous) ? rawUser : null;
  const sess = (window.appState && window.appState.session) ? window.appState.session : null;

  if (user) {
    // Liste blanche des emails admin. Le compte historique reste toujours
    // autorisé ; d'autres emails peuvent être ajoutés via
    // appState.globalConfig.adminEmails (à configurer uniquement par un
    // admin déjà connecté, dans les Paramètres).
    const defaultAdmins = ['loupotec@outlook.fr', 'hichem@sponsor.com'];
    const extraAdmins = (window.appState && window.appState.globalConfig && Array.isArray(window.appState.globalConfig.adminEmails))
      ? window.appState.globalConfig.adminEmails
      : [];
    const allowlist = [...defaultAdmins, ...extraAdmins].map(e => String(e || '').toLowerCase());
    const userEmail = (user.email || '').toLowerCase();

    if (allowlist.includes(userEmail)) return 'admin';

    // Sécurité : un compte Firebase Auth authentifié mais absent de la
    // liste blanche n'obtient AUCUN rôle. Avant cette correction, tout
    // utilisateur authentifié devenait automatiquement admin.
    console.warn('Connexion Firebase Auth refusée : email non autorisé en tant qu\'admin ->', userEmail);
    return 'none';
  }

  if (sess && sess.type === 'employee') return 'employee';
  if (sess && sess.type === 'client') return 'client';

  return 'none';
};

window.updateAuthUI = function (user) {
  const appContainer = document.getElementById('appContainer');
  const loginContainer = document.getElementById('loginContainer');
  const clientSpace = document.getElementById('clientSpaceContainer');

  const sess = (window.appState && window.appState.session) ? window.appState.session : null;
  const isEmployee = (sess && sess.type === 'employee');

  // Appliquer les restrictions d'accès dynamiques pour les employés
  const adminTabs = ['expenses', 'paiements', 'achats', 'settings'];
  adminTabs.forEach(tab => {
    const el = document.getElementById('tabBtn-' + tab);
    if (el) {
       if (isEmployee) {
           const hasAccess = sess.permissions && sess.permissions[tab] === true;
           el.style.display = hasAccess ? 'block' : 'none';
       } else {
           el.style.display = 'block';
       }
    }
  });

  if (user || isEmployee || window.authTransitionFlag) {
    if (appContainer) appContainer.style.display = 'block';
    if (loginContainer) loginContainer.style.display = 'none';
    if (clientSpace) clientSpace.style.display = 'none';
  } else if (sess && sess.type === 'client') {
    if (appContainer) appContainer.style.display = 'none';
    if (loginContainer) loginContainer.style.display = 'none';
    if (clientSpace) clientSpace.style.display = 'block';
  } else {
    if (appContainer) appContainer.style.display = 'none';
    if (loginContainer) loginContainer.style.display = 'flex';
    if (clientSpace) clientSpace.style.display = 'none';
  }
};

window.loginWithEmailPassword = async function (email, password) {
  try {
    window.authTransitionFlag = true;
    await auth.signInWithEmailAndPassword(email, password);
    showToast('Connexion réussie', 'success');
    updateAuthUI(auth.currentUser);
    if (typeof loadFromCloud === 'function') await loadFromCloud();
    if (typeof renderTables === 'function') renderTables();
  } catch (error) {
    console.error('Erreur de connexion:', error);
    showToast(firebaseErrorMessage(error), 'error');
  } finally {
    setTimeout(() => { window.authTransitionFlag = false; }, 5000);
  }
};

window.logout = async function () {
  try {
    const wasDemo = (appState && appState.session && appState.session.employeeId === 'admin_demo');
    
    if (auth) await auth.signOut();
    if (appState) appState.session = null;
    
    if (wasDemo) {
        // Purge completely the mock data to prevent mixing with real database
        localStorage.removeItem('sponsorAppState');
        window.appState = null;
    } else {
        saveToLocalStorage();
    }
    
    showToast('Déconnexion réussie', 'success');
    window.location.reload();
  } catch (error) {
    console.error('Erreur de déconnexion:', error);
  }
};

function firebaseErrorMessage(err) {
  const code = err?.code || '';
  switch (code) {
    case 'auth/invalid-email': return 'L\'adresse email est invalide.';
    case 'auth/user-not-found': return 'Aucun compte trouvé avec cet email.';
    case 'auth/wrong-password': return 'Le mot de passe est incorrect.';
    case 'auth/network-request-failed': return 'Problème de connexion internet.';
    case 'auth/too-many-requests': return 'Trop de tentatives. Réessayez plus tard.';
    case 'auth/email-already-in-use': return 'Cet email est déjà utilisé.';
    case 'auth/weak-password': return 'Le mot de passe est trop faible.';
    default: return 'Erreur de connexion : ' + (err.message || 'Inconnue');
  }
}
