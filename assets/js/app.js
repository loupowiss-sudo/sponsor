// === APP.JS ===
// Point d'entrée principal — initialisation au chargement de la page

document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Initialisation de l\'application...');

  // 0. Initialiser les listeners et la langue
  if (typeof window.initClientSpaceListeners === 'function') window.initClientSpaceListeners();

  // 1. Charger la session locale (pas les données complètes — elles viennent du cloud)
  if (typeof loadFromLocalStorage === 'function') loadFromLocalStorage();

  // 2. Initialiser les données par défaut si nécessaire
  if (typeof ensureInitialData === 'function') ensureInitialData();

  // 3. Appliquer les dépenses récurrentes du mois en cours
  if (typeof applyRecurringExpensesForCurrentMonth === 'function') {
    applyRecurringExpensesForCurrentMonth();
  }

  // 4. Mettre à jour le taux d'achat depuis le dernier achat USD
  if (typeof updateDefaultBuyRateFromLastPurchase === 'function') {
    updateDefaultBuyRateFromLastPurchase();
  }

  // 5. Si une session client existe déjà, afficher l'espace client
  if (appState.session && appState.session.type === 'client') {
    if (typeof window.showClientSpace === 'function') window.showClientSpace();
    return;
  }

  // 6. Activer le garde employé si nécessaire
  if (appState.session && appState.session.type === 'employee') {
    if (typeof setEmployeeGuardEnabled === 'function') setEmployeeGuardEnabled(true);
  }

  // 7. Écouter l'état Firebase Auth
  try {
    if (window.firebase && firebase.auth) {
      firebase.auth().onAuthStateChanged(async (user) => {
        if (user && !user.isAnonymous) {
          // Sécurité : vérifier que cet email fait bien partie de la liste
          // blanche des admins avant d'ouvrir l'espace admin. Avant cette
          // correction, n'importe quel compte Firebase Auth authentifié
          // obtenait automatiquement le rôle admin.
          if (typeof getUserRole === 'function' && getUserRole() !== 'admin') {
            console.warn('⛔ Utilisateur Firebase authentifié mais non autorisé, déconnexion:', user.email);
            try { await firebase.auth().signOut(); } catch (e) {}
            const loginEl = document.getElementById('loginContainer');
            const appEl = document.getElementById('appContainer');
            if (loginEl) loginEl.style.display = 'flex';
            if (appEl) appEl.style.display = 'none';
            if (typeof showToast === 'function') showToast('Accès refusé : ce compte n\'est pas autorisé.', 'error');
            return;
          }
          console.log('👤 Admin connecté:', user.email);
          window.showAdminSpace();
          if (typeof loadFromCloud === 'function') await loadFromCloud();
        } else {
          // Pas de user Firebase — vérifier la session employé
          const sess = appState.session;
          if (sess && sess.type === 'employee') {
            window.showAdminSpace();
            if (typeof loadFromCloud === 'function') loadFromCloud();
          } else if (sess && sess.type === 'client') {
            if (typeof window.showClientSpace === 'function') window.showClientSpace();
          } else {
            const loginEl = document.getElementById('loginContainer');
            const appEl = document.getElementById('appContainer');
            if (loginEl) loginEl.style.display = 'flex';
            if (appEl) appEl.style.display = 'none';
          }
        }

        if (typeof renderTables === 'function') renderTables();
        if (typeof recalculateFinanceBalances === 'function') recalculateFinanceBalances();
        if (typeof updateRequestsBadge === 'function') updateRequestsBadge();
      });
    }
  } catch (e) {
    console.error('Firebase Auth listener error:', e);
    // Fallback: afficher le login
    const loginEl = document.getElementById('loginContainer');
    if (loginEl) loginEl.style.display = 'flex';
  }

  // 8. Premier rendu local immédiat
  if (typeof renderTables === 'function') renderTables();
});

// Affiche l'espace admin (cache login et client)
window.showAdminSpace = function () {
  const appEl   = document.getElementById('appContainer');
  const loginEl = document.getElementById('loginContainer');
  const clientEl = document.getElementById('clientSpaceContainer');
  if (appEl)   appEl.style.display   = 'block';
  if (loginEl) loginEl.style.display = 'none';
  if (clientEl) clientEl.style.display = 'none';
};

// Sécurité : si rien n'est visible après 4s, afficher le login
window.emergencyRevealUI = function () {
  const loginEl  = document.getElementById('loginContainer');
  const appEl    = document.getElementById('appContainer');
  const clientEl = document.getElementById('clientSpaceContainer');
  const anyVisible = [loginEl, appEl, clientEl].some(
    el => el && getComputedStyle(el).display !== 'none'
  );
  if (!anyVisible && loginEl) {
    loginEl.style.display = 'flex';
    console.warn('⚠️ emergencyRevealUI: aucun conteneur visible, affichage forcé du login.');
  }
};

setTimeout(window.emergencyRevealUI, 4000);
