// === UTILS.JS ===

/**
 * Génère un ID unique avec un préfixe
 * @param {string} prefix 
 * @returns {string}
 */
window.generateId = function(prefix = 'id') {
  const uuid = (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID().replace(/-/g, '').slice(0, 16)
    : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 9)}`;
  return `${prefix}_${uuid}`;
};

/**
 * === SÉCURITÉ : hachage des mots de passe (employés/clients) ===
 * Utilise SHA-256 (Web Crypto, natif navigateur, aucune dépendance) + un sel
 * unique par compte. Ce n'est pas destiné à remplacer une vraie authentification
 * serveur, mais évite de stocker et transmettre les mots de passe en clair.
 */
window.generateSalt = function() {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
};

window.hashPassword = async function(password, salt) {
  const text = `${salt}:${password}`;
  if (typeof crypto !== 'undefined' && crypto.subtle && crypto.subtle.digest) {
    try {
      const data = new TextEncoder().encode(text);
      const digest = await crypto.subtle.digest('SHA-256', data);
      return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      console.error('Erreur de hachage, fallback non sécurisé:', e);
    }
  }
  // Fallback (navigateurs très anciens / contexte non sécurisé) : ne devrait
  // normalement jamais être utilisé sur une app servie en HTTPS.
  let hash = 0;
  for (let i = 0; i < text.length; i++) { hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0; }
  return 'fallback_' + Math.abs(hash).toString(16);
};

/**
 * Vérifie un mot de passe saisi contre un compte (employé ou client) qui peut
 * être soit déjà migré (passwordHash + passwordSalt), soit encore en ancien
 * format (password en clair, comptes créés avant la mise à jour sécurité).
 * Retourne { ok, needsMigration } — needsMigration=true signifie qu'il faut
 * réenregistrer le compte avec un hash pour ne plus jamais stocker le clair.
 */
window.verifyAccountPassword = async function(account, password) {
  if (!account) return { ok: false, needsMigration: false };
  if (account.passwordHash && account.passwordSalt) {
    const computed = await hashPassword(password, account.passwordSalt);
    return { ok: computed === account.passwordHash, needsMigration: false };
  }
  // Ancien format en clair (compte créé avant la mise à jour sécurité)
  if (account.password !== undefined) {
    return { ok: account.password === password, needsMigration: account.password === password };
  }
  return { ok: false, needsMigration: false };
};

/**
 * Formate un montant en monnaie (DZD)
 * @param {number} amount 
 * @returns {string}
 */
window.formatCurrency = function(amount) {
  const num = Number(amount);
  if (!Number.isFinite(num)) return '—';
  return new Intl.NumberFormat('fr-DZ', {
    style: 'currency',
    currency: 'DZD',
    maximumFractionDigits: 0
  }).format(num);
};

/**
 * Formate un nombre avec un nombre fixe de décimales en toute sécurité
 * @param {any} value 
 * @param {number} digits 
 * @returns {string}
 */
window.safeToFixed = function(value, digits = 2) {
  const num = Number(value || 0);
  if (Number.isNaN(num)) return (0).toFixed(digits);
  return num.toFixed(digits);
};

/**
 * Normalise un numéro de téléphone pour WhatsApp (Algérie)
 * @param {string} phone 
 * @returns {string}
 */
window.normalizePhoneForWhatsApp = function(phone) {
  let digits = String(phone || '').replace(/\D+/g, '');
  if (!digits) return '';
  if (digits.startsWith('213') && digits.length === 12) return digits;
  if (digits.startsWith('0') && digits.length === 10) return '213' + digits.slice(1);
  if (digits.length === 9) return '213' + digits;
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.startsWith('0') && digits.length > 9) digits = digits.slice(1);
  return digits;
};

/**
 * Construit un lien WhatsApp pour un client
 * @param {object} client 
 * @returns {string}
 */
window.buildClientWhatsAppLink = function(client) {
  const phone = client.phone || client.contact || '';
  const normalized = normalizePhoneForWhatsApp(phone);
  if (!normalized) return '';
  const msg = encodeURIComponent('Bonjour ' + (client.name || '') + ' ');
  return 'https://wa.me/' + normalized + '?text=' + msg;
};

/**
 * Construit un lien Instagram pour un client
 * @param {object} client 
 * @returns {string}
 */
window.buildClientInstagramLink = function(client) {
  let handle = client.username;
  if (!handle && client.social && Array.isArray(client.social.instagram) && client.social.instagram.length > 0) {
    handle = client.social.instagram[0];
  }
  if (!handle) return '';
  handle = String(handle).trim().replace(/^@+/, '');
  if (!handle) return '';
  return 'https://instagram.com/' + handle;
};

/**
 * Formate une date au format fr-FR
 * @param {any} date 
 * @returns {string}
 */
window.formatDate = function(date) {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

/**
 * Retourne la date locale au format YYYY-MM-DD
 * @param {Date} date 
 * @returns {string}
 */
window.getLocalDateString = function(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
};

/**
 * Affiche un toast de notification moderne et non bloquant
 * @param {string} message 
 * @param {string} type 'success' | 'error' | 'info' | 'warning'
 */
window.showToast = function(message, type = 'info') {
  // Créer le conteneur de toasts s'il n'existe pas
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed bottom-4 right-4 z-[9999] flex flex-col gap-2';
    document.body.appendChild(container);
  }

  // Définir les styles selon le type
  const styles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
    warning: 'bg-yellow-500 text-white'
  };

  const icons = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    info: 'fa-info-circle',
    warning: 'fa-exclamation-triangle'
  };

  // Créer l'élément toast
  const toast = document.createElement('div');
  toast.className = `${styles[type] || styles.info} px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px] transform transition-all duration-300 translate-y-10 opacity-0`;
  toast.innerHTML = `
    <i class="fas ${icons[type] || icons.info} text-xl"></i>
    <span class="font-bold text-sm">${message}</span>
  `;

  // Ajouter au DOM
  container.appendChild(toast);

  // Animation d'entrée
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-10', 'opacity-0');
  });

  // Suppression automatique
  setTimeout(() => {
    toast.classList.add('translate-y-10', 'opacity-0');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 4000);
};

/**
 * Copie du texte dans le presse-papier
 * @param {string} text 
 */
window.copyToClipboard = function(text) {
  if (!text) return;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => { showToast('Copié'); }).catch(() => {});
  } else {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); showToast('Copié'); } catch (e) {}
    document.body.removeChild(ta);
  }
};

/**
 * Vérifie si la session actuelle est Admin
 * @returns {boolean}
 */
window.isAdminSession = function() {
  return !!auth.currentUser;
};

/**
 * Vérifie si la session actuelle est Admin OU Employé (accès espace pro)
 * @returns {boolean}
 */
window.isStaffSession = function() {
  return !!auth.currentUser || (appState.session && (appState.session.type === 'employee' || appState.session.type === 'admin'));
};

/**
 * Lit un fichier en tant que Data URL (Base64)
 * @param {File} file 
 * @returns {Promise<string>}
 */
window.readFileAsDataURL = function(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
