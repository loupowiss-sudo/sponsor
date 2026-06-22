
  // === CRITICAL UI HANDLERS (EXPOSED IMMEDIATELY) ===
  window.openModal = function(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  };
  window.closeModal = function(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  };
  window.prepareAddOffer = function() {
    window.editingOfferId = null;
    const nameInput = document.getElementById('newOfferName');
    const descInput = document.getElementById('newOfferDesc');
    const priceInput = document.getElementById('newOfferPrice');
    const costInput = document.getElementById('newOfferCostPerUnit');
    const durInput = document.getElementById('newOfferDuration');

    if(nameInput) nameInput.value = '';
    if(descInput) descInput.value = '';
    if(priceInput) priceInput.value = '';
    if(costInput) costInput.value = '';
    if(durInput) durInput.value = '';
    
    const title = document.querySelector('#offerModal h3');
    if(title) title.innerHTML = '<i class="fas fa-gift text-purple-600"></i> Ajouter une Offre';
    
    window.openModal('offerModal');
  };
  window.formatCurrency = function(value) {
    return `${Number(value || 0).toLocaleString('fr-DZ')} DZD`;
  };
  window.calculatePreview = function() {
    const buyRateEl = document.getElementById('buyRate');
    const amountEl = document.getElementById('standardDollarAmount');
    const priceDzdEl = document.getElementById('standardPriceDzd');
    if (!buyRateEl || !amountEl || !priceDzdEl) return;

    const buyRate = Number(buyRateEl.value || 0);
    const amount = Number(amountEl.value || 0);
    const priceDzd = Number(priceDzdEl.value || 0);

    const totalDzd = amount * buyRate;
    const profit = priceDzd - totalDzd;
    const percent = totalDzd ? (profit / totalDzd) * 100 : 0;

    const costEl = document.getElementById('previewCost');
    const revEl = document.getElementById('previewRevenue');
    const profEl = document.getElementById('previewProfit');
    const percEl = document.getElementById('profitPercentage');

    if (costEl) costEl.textContent = window.formatCurrency(totalDzd);
    if (revEl) revEl.textContent = window.formatCurrency(priceDzd);
    if (profEl) profEl.textContent = window.formatCurrency(profit);
    if (percEl) percEl.textContent = `Marge: ${percent.toFixed(2)}%`;
    
    // Hide profit/cost/margin details for employees
    if (appState.session && appState.session.type === 'employee') {
         if (costEl && costEl.closest('div')) costEl.closest('div').style.display = 'none';
         if (profEl && profEl.closest('div')) profEl.closest('div').style.display = 'none';
         if (percEl && percEl.closest('div')) percEl.closest('div').style.display = 'none';
         // Hide buyRate input container as well if visible
         const buyRateInput = document.getElementById('buyRate');
         if(buyRateInput && buyRateInput.closest('div')) buyRateInput.closest('div').style.display = 'none';
    }
  };

  // === TRADUCTIONS ===
  const TRANSLATIONS = {
      fr: {
          nav_info: "Informations",
          nav_offers: "Nos Offres",
          nav_method: "Méthode de travail",
          nav_payment: "Paiement",
          nav_order: "Commander un Sponsor",
          nav_custom: "Nos Réalisations",
          client_title: "Espace Client",
          client_subtitle: "Bienvenue dans votre espace dédié",
          btn_back: "Retour Connexion",
          info_title: "Informations Générales",
          info_desc: "Bienvenue sur notre plateforme de sponsoring. Ici, vous pouvez consulter nos offres, comprendre notre fonctionnement et passer commande directement sans avoir besoin de créer un compte.",
          info_speed: "Rapidité",
          info_speed_desc: "Traitement rapide de vos demandes.",
          info_security: "Sécurité",
          info_security_desc: "Paiements et données sécurisés.",
          info_support: "Support",
          info_support_desc: "Assistance disponible pour vous aider.",
          offers_title: "Nos Offres Disponibles",
          offers_subtitle: "Sélectionnez une offre pour voir les détails.",
          btn_details: "Voir détails",
          method_title: "Méthode de Travail",
          payment_title: "Moyens de Paiement",
          payment_subtitle: "Voici les coordonnées pour effectuer vos paiements :",
          order_title: "Commander un Sponsor",
          lbl_platform: "Plateforme",
          opt_choose_platform: "-- Choisir une plateforme --",
          lbl_objective: "Objectif",
          opt_choose_objective: "-- Choisir l'objectif --",
          opt_followers: "Plus d'abonnés",
          opt_messages: "Messages",
          opt_conversion: "Conversion sur site",
          lbl_target_network: "Réseau cible pour les abonnés",
          lbl_msg_dest: "Destination des messages",
          lbl_site_link: "Lien du site web",
          lbl_offer_chosen: "Offre Choisie",
          opt_choose_offer: "-- Choisir une offre --",
          lbl_pub_link: "Lien de la publication (Post/Reel/Video)",
          lbl_payment_method: "Moyen de paiement utilisé",
          opt_choose_payment: "-- Choisir --",
          lbl_proof: "Preuve de Paiement (Photo/Capture)",
          btn_submit: "Envoyer la Commande",
          calc_title: "Calculateur RedotPay",
          calc_desc: "Entrez le montant en DZD que vous souhaitez dépenser, nous calculerons le montant USD à envoyer.",
          lbl_amount_dzd: "Montant DZD",
          lbl_to_send: "Ã€ envoyer (USD)",
          lbl_rate: "Taux: 1 USD = 250 DZD",
          meta_config: "Configuration Meta",
          tiktok_config: "Configuration TikTok",
          ph_insta: "@moncompte",
          ph_fb: "Ma Page",
          ph_website: "https://monsite.com",
          ph_pub_link: "https://...",
          ph_amount: "ex: 5000",
          lbl_insta_name: "Nom du compte Instagram",
          lbl_fb_name: "Nom de la page Facebook",
          lbl_both: "Les deux",
          lbl_pub_link: "Lien de la publication (Post/Reel/Video)",
          opt_cash: "Espèces / Autre",
          lbl_upload_proof_hint: "Cliquez ou déposez votre reÃ§u ici",
          lbl_client_note: "Note (Optionnel)",
          ph_client_note: "Ajoutez une note, une instruction ou une question...",
          lbl_copy: "Copier",
          lbl_copied: "Copié !",
          popup_new_client_title: "Bienvenue !",
          popup_new_client_msg: "Nous avons bien reÃ§u votre première commande. Pour comprendre le déroulement, veuillez consulter notre méthode de travail.",
          btn_go_method: "Voir la Méthode de Travail"
      },
      ar: {
          nav_info: "Ù…Ø¹Ù„ÙˆÙ…Ø§Øª",
          nav_offers: "Ø¹Ø±ÙˆØ¶Ù†Ø§",
          nav_method: "Ø·Ø±ÙŠÙ‚Ø© Ø§Ù„Ø¹Ù…Ù„",
          nav_payment: "Ø¯ÙØ¹",
          nav_order: "Ø·Ù„Ø¨ Ø±Ø¹Ø§ÙŠØ©",
          nav_custom: "Ø¥Ù†Ø¬Ø§Ø²Ø§ØªÙ†Ø§",
          client_title: "Ù…Ù†Ø·Ù‚Ø© Ø§Ù„Ø¹Ù…ÙŠÙ„",
          client_subtitle: "Ù…Ø±Ø­Ø¨Ù‹Ø§ Ø¨Ùƒ ÙÙŠ Ù…Ø³Ø§Ø­ØªÙƒ Ø§Ù„Ø®Ø§ØµØ©",
          btn_back: "Ø§Ù„Ø¹ÙˆØ¯Ø© Ù„ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø¯Ø®ÙˆÙ„",
          info_title: "Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø¹Ø§Ù…Ø©",
          info_desc: "Ù…Ø±Ø­Ø¨Ù‹Ø§ Ø¨Ùƒ ÙÙŠ Ù…Ù†ØµØ© Ø§Ù„Ø±Ø¹Ø§ÙŠØ© Ø§Ù„Ø®Ø§ØµØ© Ø¨Ù†Ø§. Ù‡Ù†Ø§ ÙŠÙ…ÙƒÙ†Ùƒ Ø§Ù„Ø§Ø·Ù„Ø§Ø¹ Ø¹Ù„Ù‰ Ø¹Ø±ÙˆØ¶Ù†Ø§ ÙˆÙÙ‡Ù… ÙƒÙŠÙÙŠØ© Ø¹Ù…Ù„Ù†Ø§ ÙˆØ·Ù„Ø¨ Ø§Ù„Ø±Ø¹Ø§ÙŠØ© Ù…Ø¨Ø§Ø´Ø±Ø© Ø¯ÙˆÙ† Ø§Ù„Ø­Ø§Ø¬Ø© Ù„Ø¥Ù†Ø´Ø§Ø¡ Ø­Ø³Ø§Ø¨.",
          info_speed: "Ø³Ø±Ø¹Ø©",
          info_speed_desc: "Ù…Ø¹Ø§Ù„Ø¬Ø© Ø³Ø±ÙŠØ¹Ø© Ù„Ø·Ù„Ø¨Ø§ØªÙƒÙ….",
          info_security: "Ø£Ù…Ø§Ù†",
          info_security_desc: "Ù…Ø¯ÙÙˆØ¹Ø§Øª ÙˆØ¨ÙŠØ§Ù†Ø§Øª Ø¢Ù…Ù†Ø©.",
          info_support: "Ø¯Ø¹Ù…",
          info_support_desc: "Ù…Ø³Ø§Ø¹Ø¯Ø© Ù…ØªØ§Ø­Ø© Ù„Ø®Ø¯Ù…ØªÙƒÙ….",
          offers_title: "Ø¹Ø±ÙˆØ¶Ù†Ø§ Ø§Ù„Ù…ØªØ§Ø­Ø©",
          offers_subtitle: "Ø§Ø®ØªØ± Ø¹Ø±Ø¶Ù‹Ø§ Ù„Ù…Ø¹Ø±ÙØ© Ø§Ù„ØªÙØ§ØµÙŠÙ„.",
          btn_details: "Ø¹Ø±Ø¶ Ø§Ù„ØªÙØ§ØµÙŠÙ„",
          method_title: "Ø·Ø±ÙŠÙ‚Ø© Ø§Ù„Ø¹Ù…Ù„",
          payment_title: "Ø·Ø±Ù‚ Ø§Ù„Ø¯ÙØ¹",
          payment_subtitle: "Ø¥Ù„ÙŠÙƒ ØªÙØ§ØµÙŠÙ„ Ø§Ù„Ø¯ÙØ¹:",
          order_title: "Ø·Ù„Ø¨ Ø±Ø¹Ø§ÙŠØ©",
          lbl_platform: "Ø§Ù„Ù…Ù†ØµØ©",
          opt_choose_platform: "-- Ø§Ø®ØªØ± Ù…Ù†ØµØ© --",
          lbl_objective: "Ø§Ù„Ù‡Ø¯Ù",
          opt_choose_objective: "-- Ø§Ø®ØªØ± Ø§Ù„Ù‡Ø¯Ù --",
          opt_followers: "Ø²ÙŠØ§Ø¯Ø© Ø§Ù„Ù…ØªØ§Ø¨Ø¹ÙŠÙ†",
          opt_messages: "Ø±Ø³Ø§Ø¦Ù„",
          opt_conversion: "ØªØ­ÙˆÙŠÙ„ Ù„Ù„Ù…ÙˆÙ‚Ø¹",
          lbl_target_network: "Ø§Ù„Ø´Ø¨ÙƒØ© Ø§Ù„Ù…Ø³ØªÙ‡Ø¯ÙØ© Ù„Ù„Ù…ØªØ§Ø¨Ø¹ÙŠÙ†",
          lbl_msg_dest: "ÙˆØ¬Ù‡Ø© Ø§Ù„Ø±Ø³Ø§Ø¦Ù„",
          lbl_site_link: "Ø±Ø§Ø¨Ø· Ø§Ù„Ù…ÙˆÙ‚Ø¹",
          lbl_offer_chosen: "Ø§Ù„Ø¹Ø±Ø¶ Ø§Ù„Ù…Ø®ØªØ§Ø±",
          opt_choose_offer: "-- Ø§Ø®ØªØ± Ø¹Ø±Ø¶Ù‹Ø§ --",
          lbl_pub_link: "Ø±Ø§Ø¨Ø· Ø§Ù„Ù…Ù†Ø´ÙˆØ± (Ø¨ÙˆØ³Øª/Ø±ÙŠÙ„Ø²/ÙÙŠØ¯ÙŠÙˆ)",
          lbl_payment_method: "Ø·Ø±ÙŠÙ‚Ø© Ø§Ù„Ø¯ÙØ¹ Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù…Ø©",
          opt_choose_payment: "-- Ø§Ø®ØªØ± --",
          lbl_proof: "Ø¥Ø«Ø¨Ø§Øª Ø§Ù„Ø¯ÙØ¹ (ØµÙˆØ±Ø©)",
          btn_submit: "Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø·Ù„Ø¨",
          calc_title: "Ø­Ø§Ø³Ø¨Ø© RedotPay",
          calc_desc: "Ø£Ø¯Ø®Ù„ Ø§Ù„Ù…Ø¨Ù„Øº Ø¨Ø§Ù„Ø¯ÙŠÙ†Ø§Ø± Ø§Ù„Ø°ÙŠ ØªØ±ÙŠØ¯ Ø¥Ù†ÙØ§Ù‚Ù‡ØŒ ÙˆØ³Ù†Ø­Ø³Ø¨ Ø§Ù„Ù…Ø¨Ù„Øº Ø¨Ø§Ù„Ø¯ÙˆÙ„Ø§Ø± Ø§Ù„Ø°ÙŠ ÙŠØ¬Ø¨ Ø¥Ø±Ø³Ø§Ù„Ù‡.",
          lbl_amount_dzd: "Ø§Ù„Ù…Ø¨Ù„Øº (DZD)",
          lbl_to_send: "Ù„Ù„Ø¥Ø±Ø³Ø§Ù„ (USD)",
          lbl_rate: "Ø³Ø¹Ø± Ø§Ù„ØµØ±Ù: 1 Ø¯ÙˆÙ„Ø§Ø± = 250 Ø¯Ø¬",
          meta_config: "Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª Meta",
          tiktok_config: "Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª TikTok",
          ph_insta: "@Ø­Ø³Ø§Ø¨ÙŠ",
          ph_fb: "ØµÙØ­ØªÙŠ",
          ph_website: "https://mysite.com",
          ph_pub_link: "https://...",
          ph_amount: "Ù…Ø«Ø§Ù„: 5000",
          lbl_insta_name: "Ø§Ø³Ù… Ø­Ø³Ø§Ø¨ Ø§Ù†Ø³ØªØºØ±Ø§Ù…",
          lbl_fb_name: "Ø§Ø³Ù… ØµÙØ­Ø© ÙÙŠØ³Ø¨ÙˆÙƒ",
          lbl_both: "ÙƒÙ„Ø§Ù‡Ù…Ø§",
          lbl_pub_link: "Ø±Ø§Ø¨Ø· Ø§Ù„Ù…Ù†Ø´ÙˆØ± (Post/Reel/Video)",
          opt_cash: "Ù†Ù‚Ø¯Ø§ / Ø¢Ø®Ø±",
          lbl_upload_proof_hint: "Ø§Ø¶ØºØ· Ø£Ùˆ Ù‚Ù… Ø¨Ø¥Ø³Ù‚Ø§Ø· Ø§Ù„Ø¥ÙŠØµØ§Ù„ Ù‡Ù†Ø§",
          lbl_client_note: "Ù…Ù„Ø§Ø­Ø¸Ø© (Ø§Ø®ØªÙŠØ§Ø±ÙŠ)",
          ph_client_note: "Ø£Ø¶Ù Ù…Ù„Ø§Ø­Ø¸Ø©ØŒ ØªØ¹Ù„ÙŠÙ…Ø§Øª Ø£Ùˆ Ø³Ø¤Ø§Ù„...",
          lbl_copy: "Ù†Ø³Ø®",
          lbl_copied: "ØªÙ… Ø§Ù„Ù†Ø³Ø® !",
          popup_new_client_title: "Ù…Ø±Ø­Ø¨Ø§ Ø¨Ùƒ !",
          popup_new_client_msg: "Ù„Ù‚Ø¯ Ø§Ø³ØªÙ„Ù…Ù†Ø§ Ø·Ù„Ø¨Ùƒ Ø§Ù„Ø£ÙˆÙ„ Ø¨Ù†Ø¬Ø§Ø­. Ù„ÙÙ‡Ù… Ø³ÙŠØ± Ø§Ù„Ø¹Ù…Ù„ØŒ ÙŠØ±Ø¬Ù‰ Ø§Ù„Ø§Ø·Ù„Ø§Ø¹ Ø¹Ù„Ù‰ Ø·Ø±ÙŠÙ‚Ø© Ø§Ù„Ø¹Ù…Ù„.",
          btn_go_method: "Ù…Ø´Ø§Ù‡Ø¯Ø© Ø·Ø±ÙŠÙ‚Ø© Ø§Ù„Ø¹Ù…Ù„"
      }
  };

  function setLanguage(lang) {
      const isAr = lang === 'ar';
      document.documentElement.lang = lang;
      document.documentElement.dir = isAr ? 'rtl' : 'ltr';
      
      const t = TRANSLATIONS[lang] || TRANSLATIONS.fr;
      
      document.querySelectorAll('[data-i18n]').forEach(el => {
          const key = el.getAttribute('data-i18n');
          if(t[key]) {
              if((el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') && key.startsWith('ph_')) {
                  el.placeholder = t[key];
              } else {
                  el.textContent = t[key];
              }
          }
      });

      // Update Custom Tab Title if dynamic
      if(window.appState && window.appState.customSection && window.appState.customSection.title) {
          const customTitle = document.getElementById('clientCustomTabTitle');
          const customHeader = document.getElementById('clientCustomTitle');
          if(customTitle) customTitle.textContent = window.appState.customSection.title;
          if(customHeader) customHeader.textContent = window.appState.customSection.title;
      }
  }

  // === FIREBASE CONFIG & INIT ===
  const firebaseConfig = {
    apiKey: "AIzaSyC-1uQnZRLzqUoTMQ_oaXNZh-QQROfOEqw",
    authDomain: "sponsorhichem.firebaseapp.com",
    projectId: "sponsorhichem",
    storageBucket: "sponsorhichem.firebasestorage.app",
    messagingSenderId: "499965988228",
    appId: "1:499965988228:web:ecdbd5b005c23b6d5c61d1"
  };

  var auth = null;
  try {
    if (window.firebase && typeof firebase.initializeApp === 'function') {
      if (!firebase.apps || !firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
      auth = firebase.auth();
      window.auth = auth;
      try {
        auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(e => console.warn('Persistence Error:', e));
      } catch (e) {
      }
    } else {
      auth = {
        currentUser: null,
        signInWithEmailAndPassword: async function () { throw new Error("Firebase non chargé"); },
        onAuthStateChanged: function () {},
        setPersistence: function () {}
      };
      window.auth = auth;
    }
  } catch (e) {
    auth = {
      currentUser: null,
      signInWithEmailAndPassword: async function () { throw e; },
      onAuthStateChanged: function () {},
      setPersistence: function () {}
    };
    window.auth = auth;
  }
  let db = null;
  function getDb() {
    if (!window.firebase || !firebase.firestore) return null;
    if (!db) {
      db = firebase.firestore();
      window.db = db;
      try {
        // Configuration robuste pour éviter net::ERR_ABORTED
        db.settings({
          ignoreUndefinedProperties: true,
          merge: true,
          experimentalForceLongPolling: true, 
          useFetchStreams: false
        });
        try {
            db.enablePersistence({ synchronizeTabs: true }).catch(function(err) {
                console.log("Persistence failed", err);
            });
        } catch(e) {}
      } catch (e) {}
    }
    return db;
  }
  

    function getCloudUid() {
      try {
        if (window.auth && window.auth.currentUser && window.auth.currentUser.uid) {
          return window.auth.currentUser.uid;
        }
      } catch (e) {}
      if (!window.appState) window.appState = {};
      if (!window.appState.settings) window.appState.settings = {};
      if (!window.appState.settings.cloudOwnerId) {
        window.appState.settings.cloudOwnerId = 'defaultOwner';
      }
      return window.appState.settings.cloudOwnerId;
    }

    window.isAdminSession = function () {
      const hasFirebase = !!(window.auth && window.auth.currentUser);
      const isEmployee = !!(window.appState && window.appState.session && window.appState.session.type === 'employee');
      return hasFirebase || isEmployee;
    };

    function getActor() {
      if (auth && auth.currentUser) {
        return { type: 'admin', uid: auth.currentUser.uid || null, name: auth.currentUser.email || 'Admin' };
      }
      if (appState.session && appState.session.type === 'employee' && appState.session.user) {
        const u = appState.session.user;
        return { type: 'employee', uid: u.uid || null, name: u.displayName || u.email || 'Employé' };
      }
      return { type: 'unknown', uid: null, name: '' };
    }

    function logAudit(action, details) {
      if (!action) return;
      if (!appState.auditLog) appState.auditLog = [];
      const actor = getActor();
      const entry = {
        id: `log_${Date.now()}_${Math.floor(Math.random() * 100000)}`,
        ts: Date.now(),
        date: getLocalDateString(),
        actorUid: actor.uid,
        actorName: actor.name,
        actorType: actor.type,
        action: String(action),
        details: details || {}
      };
      appState.auditLog.unshift(entry);
      if (appState.auditLog.length > 300) appState.auditLog.length = 300;
      try { saveToLocalStorage(); } catch (e) {}
      if (typeof renderAuditLog === 'function') renderAuditLog();
    }

    function renderAuditLog() {
      const body = document.getElementById('auditLogBody');
      const searchEl = document.getElementById('auditSearch');
      const actorSel = document.getElementById('auditActorFilter');
      if (!body) return;

      const logs = Array.isArray(appState.auditLog) ? appState.auditLog : [];
      const search = (searchEl ? searchEl.value.trim().toLowerCase() : '');
      const actor = (actorSel ? actorSel.value : '') || '';

      if (actorSel && !window._auditActorOptionsBound) {
        actorSel.addEventListener('change', () => renderAuditLog());
        window._auditActorOptionsBound = true;
      }
      if (searchEl && !window._auditSearchBound) {
        searchEl.addEventListener('input', () => renderAuditLog());
        window._auditSearchBound = true;
      }

      if (actorSel) {
        const current = actorSel.value || '';
        const unique = new Map();
        logs.forEach(l => {
          const uid = l && l.actorUid ? String(l.actorUid) : '';
          const name = l && l.actorName ? String(l.actorName) : '';
          if (!uid && !name) return;
          unique.set(uid || name, { uid, name: name || uid });
        });
        const opts = ['<option value=\"\">Tous</option>']
          .concat(Array.from(unique.values()).sort((a, b) => a.name.localeCompare(b.name)).map(u => `<option value=\"${u.uid}\">${u.name}</option>`));
        actorSel.innerHTML = opts.join('');
        actorSel.value = current;
      }

      const filtered = logs.filter(l => {
        if (!l) return false;
        if (actor && String(l.actorUid || '') !== String(actor)) return false;
        if (search) {
          const blob = `${l.actorName || ''} ${l.action || ''} ${JSON.stringify(l.details || {})}`.toLowerCase();
          if (!blob.includes(search)) return false;
        }
        return true;
      });

      body.innerHTML = '';
      const frag = document.createDocumentFragment();
      filtered.slice(0, 80).forEach(l => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-gray-50';
        const when = l.date ? formatDate(l.date) : '';
        const tdWhen = document.createElement('td');
        tdWhen.className = 'p-3 text-gray-700 whitespace-nowrap';
        tdWhen.textContent = when;
        const tdActor = document.createElement('td');
        tdActor.className = 'p-3 font-semibold text-gray-800';
        tdActor.textContent = l.actorName || '-';
        const tdAction = document.createElement('td');
        tdAction.className = 'p-3 text-gray-700';
        tdAction.textContent = l.action || '';
        const tdDetails = document.createElement('td');
        tdDetails.className = 'p-3 text-gray-500 text-xs';
        try { tdDetails.textContent = JSON.stringify(l.details || {}); } catch (e) { tdDetails.textContent = ''; }
        tr.appendChild(tdWhen);
        tr.appendChild(tdActor);
        tr.appendChild(tdAction);
        tr.appendChild(tdDetails);
        frag.appendChild(tr);
      });
      body.appendChild(frag);
    }
  

    (function () {
      if (!window.appState) {
        window.appState = {
          clients: [],
          transactions: [],
          offers: [],
          payments: [],
          usdPurchases: [],
          currentTab: 'dashboard',
          lastUpdated: 0,
          sync: { pendingCloudSave: false, retryDelayMs: 5000 },
          syncQueue: [],
          syncTimer: null,
          syncThrottleMs: 2000,
          settings: {
            storageMode: 'cloud',
            cloudProvider: 'firebase',
            autoSaveEnabled: true,
            seedDefaults: true,
            expenseCategories: ['Salaire', 'Téléphone', 'Internet'],
            topClientsWeights: { spent: 0.7, transactions: 0.3, unpaid: -0.2 },
            workMethodSections: []
          },
          expenses: [],
          recurringExpenses: [],
          clientRequests: [],
          session: null
        };
      }
      if (typeof window.showTab !== 'function') {
        window.showTab = function (tabId) {
          document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
          const activeSection = document.getElementById(tabId);
          if (activeSection) activeSection.classList.remove('hidden');
          const appContainer = document.getElementById('appContainer');
          const loginContainer = document.getElementById('loginContainer');
          if (appContainer) appContainer.style.display = 'block';
          if (loginContainer) loginContainer.style.display = 'none';
        };
      }
      if (typeof window.importData !== 'function') {
        window.importData = function () {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'application/json';
          input.onchange = e => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = evt => {
              try {
                const data = JSON.parse(evt.target.result);
                if (window.appState && data) Object.assign(window.appState, data);
                if (typeof renderTables === 'function') renderTables();
                alert('Import réussi');
              } catch (err) {
                alert('Erreur lors de lâ€™import');
              }
            };
            reader.readAsText(file);
          };
          input.click();
        };
      }
      if (typeof window.backupData !== 'function') {
        window.backupData = function () {
          const dataStr = JSON.stringify(window.appState || {}, null, 2);
          const blob = new Blob([dataStr], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'hichem-sponsor-backup.json';
          a.click();
          URL.revokeObjectURL(url);
        };
      }
      if (typeof window.showStats !== 'function') {
        window.showStats = function () {
          alert('Statistiques: à implémenter');
        };
      }
    })();
  

    // === CORE UTILS & INIT (Moved up for availability) ===
    function generateId(prefix = 'id') {
      return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
    }
    window.generateId = generateId;

    // === MIGRATION HELPERS ===
    function backfillReadableIds() {
        if (!appState) return;
        let changed = false;

        // 1. Clients
        if (!appState.settings.clientSeq) appState.settings.clientSeq = 0;
        const clients = (appState.clients || []).sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
        
        clients.forEach(c => {
            if (!c.readableId) {
                appState.settings.clientSeq++;
                c.readableId = `C-${String(appState.settings.clientSeq).padStart(3, '0')}`;
                changed = true;
            } else {
                // Ensure seq is at least as high as existing IDs
                const match = c.readableId.match(/C-(\d+)/);
                if (match) {
                    const num = parseInt(match[1], 10);
                    if (num > appState.settings.clientSeq) appState.settings.clientSeq = num;
                }
            }
        });

        // 2. Transactions
        if (!appState.settings.txnSeq) appState.settings.txnSeq = 0;
        const txns = (appState.transactions || []).sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
        
        txns.forEach(t => {
            if (!t.readableId) {
                appState.settings.txnSeq++;
                t.readableId = `TX-${String(appState.settings.txnSeq).padStart(3, '0')}`;
                changed = true;
            } else {
                 const match = t.readableId.match(/TX-(\d+)/);
                if (match) {
                    const num = parseInt(match[1], 10);
                    if (num > appState.settings.txnSeq) appState.settings.txnSeq = num;
                }
            }
        });

        if (changed) {
            console.log('Migration: IDs lisibles attribués aux anciennes données.');
            saveToLocalStorage();
            // Sync cloud if possible
            if (typeof enqueueCloudSave === 'function') enqueueCloudSave();
        }
    }

    function ensureInitialData() {
      if(!appState.settings) appState.settings = {};
      if(!appState.settings.storageMode) appState.settings.storageMode = 'cloud';
      if (appState.settings.seedDefaults && (!Array.isArray(appState.offers) || appState.offers.length === 0)) {
        appState.offers = [
          { id: generateId('offer'), name: 'USD Standard', description: 'Achat standard de dollars', price: 30000, costPerUnit: 88, duration: 'N/A' },
          { id: generateId('offer'), name: 'Pack 500$', description: 'Pack pour 500 dollars', price: 150000, costPerUnit: 441, duration: 'N/A' },
          { id: generateId('offer'), name: 'Service Premium', description: 'Service premium pour clients VIP', price: 50000, costPerUnit: 147, duration: '30 jours' },
        ];
      }
      if (!Array.isArray(appState.clients)) appState.clients = [];
      if (!Array.isArray(appState.transactions)) appState.transactions = [];
      if (!Array.isArray(appState.payments)) appState.payments = [];
      if (!Array.isArray(appState.usdPurchases)) appState.usdPurchases = [];
      if (!Array.isArray(appState.employees)) appState.employees = [];
      if (!appState.settings.workMethodSections) appState.settings.workMethodSections = [];
      if (!appState.manualBalances) appState.manualBalances = { liquide: 0, baridimob: 0, usdt: 0 };
      
      // Run migration
      backfillReadableIds();
    }
    window.ensureInitialData = ensureInitialData;
  

  // === AUTHENTIFICATION EMAIL / MOT DE PASSE ===

  // Met à jour l'UI selon l'état de connexion
  function updateAuthUI(user) {
    const appContainer   = document.getElementById('appContainer');
    const loginContainer = document.getElementById('loginContainer');
    const clientSpace    = document.getElementById('clientSpaceContainer');

    const sess = (typeof window !== 'undefined' && window.appState && window.appState.session) ? window.appState.session : null;
    if (user || (sess && sess.type === 'employee') || window.authTransitionFlag) {
      // Connecté
      if (appContainer)   appContainer.style.display = 'block';
      if (loginContainer) loginContainer.style.display = 'none';
      if (clientSpace)    clientSpace.style.display = 'none';
    } else {
      // Déconnecté
      if (appContainer)   appContainer.style.display = 'none';
      if (loginContainer) loginContainer.style.display = 'flex';
      if (clientSpace)    clientSpace.style.display = 'none';
    }
    ensureVisibleUI();
  }

  function ensureVisibleUI(){
    const login = document.getElementById('loginContainer');
    const app = document.getElementById('appContainer');
    const client = document.getElementById('clientSpaceContainer');
    function isVisible(el){
      if (!el) return false;
      const cs = window.getComputedStyle ? getComputedStyle(el) : null;
      const disp = cs ? cs.display : el.style.display;
      const vis = cs ? cs.visibility : el.style.visibility;
      const op = cs ? parseFloat(cs.opacity || '1') : 1;
      const rect = el.getBoundingClientRect ? el.getBoundingClientRect() : { width: 0, height: 0 };
      return disp !== 'none' && vis !== 'hidden' && op > 0 && rect.width > 0 && rect.height > 0;
    }
    const anyVisible = [login, app, client].some(isVisible);
    if (!anyVisible && login) {
      login.style.display = 'flex';
    }
    if (!anyVisible && isAdminSession() && app) {
      app.style.display = 'block';
    }
  }

  window.addEventListener('error', function(){ try { ensureVisibleUI(); } catch(e){} });
  function ensureAuthVisibility(){
    const app = document.getElementById('appContainer');
    const login = document.getElementById('loginContainer');
    const client = document.getElementById('clientSpaceContainer');
    const sess = (typeof window !== 'undefined' && window.appState && window.appState.session) ? window.appState.session : null;
    
    // Correction critique : Si une transition d'auth est en cours, forcer l'affichage du Dashboard
    if (window.authTransitionFlag) {
      if (app) app.style.display = 'block';
      if (login) login.style.display = 'none';
      if (client) client.style.display = 'none';
      return;
    }

    if (window.isAdminSession && window.isAdminSession()) {
      if (app) app.style.display = 'block';
      if (login) login.style.display = 'none';
      if (client) client.style.display = 'none';
      return;
    }
    if (login) login.style.display = 'flex';
    if (app) app.style.display = 'none';
    if (client) client.style.display = 'none';
    ensureVisibleUI();
  }
  window.addEventListener('unhandledrejection', function(){ try { ensureAuthVisibility(); ensureVisibleUI(); } catch(e){} });
  function visibilityWatchdog(durationMs){
    const start = Date.now();
    const timer = setInterval(() => {
      ensureAuthVisibility();
      ensureVisibleUI();
      const app = document.getElementById('appContainer');
      const login = document.getElementById('loginContainer');
      const client = document.getElementById('clientSpaceContainer');
      const anyVisible = [app, login, client].some(el => el && getComputedStyle(el).display !== 'none');
      if (anyVisible || (Date.now() - start) > (durationMs || 3000)) {
        clearInterval(timer);
      }
    }, 250);
  }
  function forceAdminView(){
    const app = document.getElementById('appContainer');
    const login = document.getElementById('loginContainer');
    const client = document.getElementById('clientSpaceContainer');
    if (app) app.style.display = 'block';
    if (login) login.style.display = 'none';
    if (client) client.style.display = 'none';

    // Employee specific logic
    const isEmployee = appState.session && appState.session.type === 'employee';
    
    // Hide all tabs first
    const allTabs = document.querySelectorAll('.tab-content');
    allTabs.forEach(el => el.classList.add('hidden'));

    // Apply strict visibility rules
    if (isEmployee) {
        // Hide dashboard tab button and content
        const dashBtn = document.getElementById('tab-dashboard');
        if (dashBtn) {
            dashBtn.classList.add('hidden'); // Also add standard hidden class
            dashBtn.style.display = 'none'; // Force inline style
        }
        
        // Show Clients tab by default for employees
        const clientTab = document.getElementById('clients');
        if (clientTab) clientTab.classList.remove('hidden');
        
        // Ensure other restricted elements are hidden
        document.querySelectorAll('.employee-hidden').forEach(el => {
            el.style.display = 'none';
            el.classList.add('hidden');
        });
        
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active-tab'));
        const clientBtn = document.querySelector('button[onclick*="clients"]');
        if (clientBtn) clientBtn.classList.add('active-tab');
        
        appState.currentTab = 'clients';
    } else {
        // Admin default view -> Dashboard
        const dash = document.getElementById('dashboard');
        if (dash) dash.classList.remove('hidden');
        const dashBtn = document.getElementById('tab-dashboard');
        if (dashBtn) {
            dashBtn.classList.remove('hidden');
            dashBtn.style.display = '';
        }
        appState.currentTab = 'dashboard';
    }
  }
  function emergencyRevealUI(){
    try {
      ensureAuthVisibility();
      ensureVisibleUI();
      const login = document.getElementById('loginContainer');
      const app = document.getElementById('appContainer');
      const client = document.getElementById('clientSpaceContainer');
      const anyVisible = [login, app, client].some(el => el && getComputedStyle(el).display !== 'none');
      if (!anyVisible && login) {
        login.style.display = 'flex';
      }
      if (!anyVisible && isAdminSession() && app) {
        app.style.display = 'block';
        forceAdminView();
      }
    } catch(e){}
  }
  function uiGuardLoop(durationMs){
    const start = Date.now();
    const timer = setInterval(() => {
      ensureAuthVisibility();
      ensureVisibleUI();
      emergencyRevealUI();
      const login = document.getElementById('loginContainer');
      const app = document.getElementById('appContainer');
      const client = document.getElementById('clientSpaceContainer');
      const anyVisible = [login, app, client].some(el => el && getComputedStyle(el).display !== 'none');
      if (anyVisible || (Date.now() - start) > (durationMs || 5000)) clearInterval(timer);
    }, 200);
  }

  function showToast(message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.style.position = 'fixed';
      container.style.top = '16px';
      container.style.right = '16px';
      container.style.zIndex = '9999';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.gap = '8px';
      document.body.appendChild(container);
    }
    const el = document.createElement('div');
    el.className = 'px-4 py-2 rounded-xl shadow-lg border text-sm';
    if (type === 'success') { el.classList.add('bg-green-50','border-green-200','text-green-700'); }
    else if (type === 'error') { el.classList.add('bg-red-50','border-red-200','text-red-700'); }
    else if (type === 'warning') { el.classList.add('bg-yellow-50','border-yellow-200','text-yellow-700'); }
    else { el.classList.add('bg-gray-50','border-gray-200','text-gray-700'); }
    el.textContent = message;
    container.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity 300ms'; }, 2500);
    setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 2800);
  }

  async function forceCloudSave() {
    try {
      if (appState.settings.storageMode === 'cloud') {
        showToast('Début synchronisation...', 'info');
        await saveToCloud();
        scheduleCloudRetry();
        renderSettingsAdmin();
      } else {
        saveToLocalStorage();
        showToast('Sauvegarde locale effectuée (Mode Cloud désactivé)', 'success');
      }
    } catch (e) {
      console.error('Erreur forceCloudSave:', e);
      showToast('Erreur critique sauvegarde: ' + e.message, 'error');
    }
  }

  async function loginWithEmailPassword(email, password) {
    if (!auth || typeof auth.signInWithEmailAndPassword !== 'function') {
      const box = document.getElementById('loginError');
      if (box) box.textContent = "Service d'authentification non disponible";
      showToast("Service d'authentification non disponible", 'error');
      return;
    }
    try {
      window.authTransitionFlag = true;
      await auth.signInWithEmailAndPassword(email, password);
      showToast('Connexion réussie', 'success');

      if (!window.appState) window.appState = {};
      window.appState.session = {
        type: 'admin',
        user: {
          uid: auth.currentUser ? auth.currentUser.uid : null,
          email: auth.currentUser ? auth.currentUser.email : email,
          displayName: auth.currentUser ? (auth.currentUser.displayName || '') : ''
        }
      };
      if (typeof setEmployeeGuardEnabled === 'function') setEmployeeGuardEnabled(false);
      try { saveToLocalStorage(); } catch (e) {}

      updateAuthUI(auth.currentUser);
      forceAdminView();

      if (typeof window.loadFromCloud === 'function') {
        await window.loadFromCloud();
      } else if (typeof loadFromCloud === 'function') {
        await loadFromCloud();
      } else {
        loadFromLocalStorage();
      }
      ensureInitialData();
      if(typeof backfillReadableIds === 'function') backfillReadableIds(); // Backfill after load
      renderTablesAsync();
      populateClientDropdown();
      populateOfferSelect();
      populatePaymentClientSelect();
      recalculateFinanceBalances();
      if(typeof window.setupAdminRealtimeListeners === 'function') window.setupAdminRealtimeListeners();
      showTab('dashboard');

      ensureAuthVisibility();
      visibilityWatchdog(3000);
      uiGuardLoop(5000);
    } catch (error) {
      console.error('Erreur de connexion:', error);
      const box = document.getElementById('loginError');
      if (box) box.textContent = firebaseErrorMessage(error);
      showToast(firebaseErrorMessage(error), 'error');
    } finally {
      // Keep transition flag longer to prevent UI flicker
      setTimeout(() => { window.authTransitionFlag = false; }, 5000);
    }
  }
  // Removed another duplicate login logic
  
  async function signupClient() {
    const nameEl = document.getElementById('signupClientName');
    const userEl = document.getElementById('signupClientUsername');
    const phoneEl = document.getElementById('signupClientPhone');
    const emailEl = document.getElementById('signupClientEmail');
    const passEl = document.getElementById('signupClientPassword');
    const name = nameEl ? nameEl.value.trim() : '';
    const username = userEl ? userEl.value.trim() : '';
    const phone = phoneEl ? phoneEl.value.trim() : '';
    const email = emailEl ? emailEl.value.trim() : '';
    const password = passEl ? passEl.value.trim() : '';

    if (!name) { showToast('Nom requis', 'error'); return; }
    if (!username) { showToast("Nom d'utilisateur requis", 'error'); return; }
    if (!phone) { showToast('TÃ©lÃ©phone requis', 'error'); return; }
    if (!password) { showToast('Mot de passe requis', 'error'); return; }

    ensureInitialData();
    const exists = (appState.clients || []).find(c => {
      return (email && c.email && c.email.toLowerCase() === email.toLowerCase()) || (username && c.username && c.username.toLowerCase() === username.toLowerCase());
    });
    if (exists) { showToast('Ce compte existe dÃ©jÃ ', 'error'); return; }

    const newClient = {
      id: generateId('client'),
      name, email, username, phone, password,
      contact: email || phone || username,
      social: { instagram: [], facebook: [] },
      createdAt: Date.now(),
      notes: 'Compte client crÃ©Ã©',
      totalSpent: 0, transactionsCount: 0, unpaid: 0
    };

    if(!appState.clients) appState.clients = [];
    appState.clients.push(newClient);
    appState.session = { type: 'client', id: newClient.id, name: newClient.name, username: newClient.username, phone: newClient.phone };
    try { saveToLocalStorage(); } catch (e) {}
    updateAuthUI(null);
    showClientSpace();
    showToast('Compte crÃ©Ã©', 'success');

    try {
        if(typeof syncClientAccount === 'function') await syncClientAccount(newClient);
        if(window.auth && window.auth.currentUser) await saveToCloud();
    } catch(e) { console.warn('Sync error', e); }

    if(nameEl) nameEl.value='';
    if(userEl) userEl.value='';
    if(phoneEl) phoneEl.value='';
    if(emailEl) emailEl.value='';
    if(passEl) passEl.value='';
  }

  async function loginClientQuick() {
    const idEl = document.getElementById('clientQuickId');
    const ident = idEl ? idEl.value.trim().toLowerCase() : '';
    if (!ident) { showToast('Entrez tÃ©lÃ©phone ou utilisateur', 'error'); return; }
    
    ensureInitialData();
    let c = (appState.clients || []).find(x => {
      return (x.phone || '').toLowerCase() === ident || (x.username || '').toLowerCase() === ident || (x.email || '').toLowerCase() === ident;
    });
    
    // === TRY CLOUD FETCH ===
    const db = getDb();
    if (!c && db) {
        try {
             let q = await db.collection('clients').where('email', '==', ident).limit(1).get();
             if (q.empty) q = await db.collection('clients').where('username', '==', ident).limit(1).get();
             if (q.empty) q = await db.collection('clients').where('phone', '==', ident).limit(1).get();
             
             if (!q.empty) {
                 c = q.docs[0].data();
                 if(!appState.clients) appState.clients = [];
                 appState.clients.push(c);
                 saveToLocalStorage();
             }
        } catch(e) { console.warn('Client fetch error:', e); }
    }

    if (!c) { showToast('Client introuvable', 'error'); return; }
    appState.session = { type: 'client', id: c.id, name: c.name, username: c.username || '', phone: c.phone || '' };
    try { saveToLocalStorage(); } catch (e) {}
    updateAuthUI(null);
    showClientSpace();
  }

  function logoutClient() {
    if (typeof appState !== 'undefined') {
      appState.session = null;
      try { saveToLocalStorage(); } catch (e) {}
    }
    updateAuthUI(null);
    showToast('Déconnecté', 'success');
  }

  async function handleLoginClick() {
    const isEmp = !!document.getElementById('employeeModeToggle') && document.getElementById('employeeModeToggle').checked;
    const emailEl = document.getElementById('loginEmail');
    const passEl = document.getElementById('loginPassword');
    const btn = document.getElementById('loginButton');
    const box = document.getElementById('loginError');

    const emailOrUser = emailEl ? emailEl.value.trim() : '';
    const password = passEl ? passEl.value.trim() : '';

    if (box) box.textContent = '';
    if (!emailOrUser || !password) { showToast('Identifiants requis', 'error'); return; }

    if (btn) {
      btn.disabled = true;
      btn.classList.add('opacity-60', 'cursor-not-allowed');
    }

    try {
      if (isEmp) {
        loginEmployee(emailOrUser, password);
      } else {
        await loginWithEmailPassword(emailOrUser, password);
      }
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.classList.remove('opacity-60', 'cursor-not-allowed');
      }
    }
  }

  function loginEmployee(username, password) {
    if (!Array.isArray(window.appState.employees)) window.appState.employees = [];
    let emp = window.appState.employees.find(e => (e.username || '').toLowerCase() === username.toLowerCase() && (e.password || '') === password);
    if (!emp) {
      // In production we should probably not auto-create employee accounts like this but for now we keep behavior
      /* 
      const gen = (typeof window.generateId === 'function') 
        ? window.generateId 
        : (prefix) => `${prefix}_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
      emp = { id: gen('emp'), username, password, createdAt: Date.now() };
      window.appState.employees.push(emp);
      try { saveToLocalStorage(); } catch (e) {}
      showToast('Compte employé créé en local', 'success'); 
      */
     // Fail if not found
     showToast('Identifiants employés incorrects', 'error');
     return;
    }
    
    if (emp) {
        appState.session = { type: 'employee', user: { email: emp.email, uid: emp.id, displayName: emp.username } };
        showToast('Connexion Employé réussie', 'success');
        if (typeof setEmployeeGuardEnabled === 'function') setEmployeeGuardEnabled(true);
        updateAuthUI({ email: emp.email });
        forceAdminView();
        loadFromLocalStorage(); 
        ensureInitialData();
        renderTablesAsync();
        updateDashboard(); // Trigger UI hiding logic
        // Redirect to a safe tab since dashboard is hidden
        showTab('clients');
    }
  }

  // Expose to window
  window.handleLoginClick = handleLoginClick;
  window.loginEmployee = loginEmployee;

  window.deleteTodoTransaction = function(id) {
    if(!confirm('Supprimer cette transaction en attente ?')) return;
    const idx = (appState.todoTransactions || []).findIndex(t => t.id === id);
    if (idx > -1) {
        appState.todoTransactions.splice(idx, 1);
        // Call render functions if available
        if(typeof renderTodoTable === 'function') renderTodoTable();
        if(typeof renderTables === 'function') renderTables();
        
        try { saveToLocalStorage(); } catch (e) {}
        showToast('Transaction supprimée', 'info');
    }
  };
  
  function handleGithubClick() {
    loginWithGithub();
  }
  // Duplicate loginEmployee removed
  
  async function logout() {
    try {
      try { await auth.signOut(); } catch (e) {}
      if (typeof appState !== 'undefined') {
        appState.session = null;
        try { saveToLocalStorage(); } catch (e) {}
      }
      showToast('Déconnexion réussie', 'success'); window.location.reload();
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      showToast('Erreur lors de la déconnexion', 'error');
    }
  }

  async function loginWithGithub() {
    try {
      window.authTransitionFlag = true;
      const provider = new firebase.auth.GithubAuthProvider();
      await auth.signInWithPopup(provider);
      showToast('Connexion GitHub réussie', 'success');
      
      updateAuthUI(auth.currentUser);
      forceAdminView();
      
      if (typeof window.loadFromCloud === 'function') {
        await window.loadFromCloud();
      } else if (typeof loadFromCloud === 'function') {
        await loadFromCloud();
      } else {
        loadFromLocalStorage();
      }
      ensureInitialData();
      if(typeof backfillReadableIds === 'function') backfillReadableIds(); // Backfill after load
      renderTablesAsync();
      populateClientDropdown();
      populateOfferSelect();
      populatePaymentClientSelect();
      recalculateFinanceBalances();
      if(typeof window.setupAdminRealtimeListeners === 'function') window.setupAdminRealtimeListeners();
      showTab('dashboard');
      
      forceAdminView();
      ensureAuthVisibility();
      visibilityWatchdog(3000);
      uiGuardLoop(5000);
      setTimeout(emergencyRevealUI, 500);
      
    } catch (error) {
      console.error('Erreur GitHub:', error);
      const box = document.getElementById('loginError');
      if (box) box.textContent = firebaseErrorMessage(error);
      showToast(firebaseErrorMessage(error), 'error');
    } finally {
      setTimeout(() => { window.authTransitionFlag = false; }, 5000);
    }
  }

  async function saveAppData(data) {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const uid = user.uid;
      await db.collection('users').doc(uid).set({ data }, { merge: true });
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
    }
  }

  async function loadAppData() {
    try {
      const user = auth.currentUser;
      if (!user) return null;
      const uid = user.uid;
      const snap = await db.collection('users').doc(uid).get();
      if (!snap.exists) return null;
      return snap.data().data || null;
    } catch (error) {
      console.error('Erreur chargement:', error);
      return null;
    }
  }

  function applyLoadedData(data) {
    if (!data) return;
    window.APP_DATA = data;
    // Ici, applique data à ton UI (listes, tableaux, etc.)
  }

  function firebaseErrorMessage(err) {
    const code = err?.code || '';
    switch (code) {
      case 'auth/invalid-email': return 'Email invalide';
      case 'auth/user-not-found': return 'Utilisateur introuvable';
      case 'auth/wrong-password': return 'Mot de passe incorrect';
      case 'auth/too-many-requests': return 'Trop de tentatives, réessayez plus tard';
      case 'auth/operation-not-allowed': return 'Méthode non activée dans Firebase (activer Email/Mot de passe ou GitHub)';
      case 'auth/popup-blocked': return 'Popup bloquée par le navigateur, autorisez-la';
      case 'auth/popup-closed-by-user': return 'Popup fermée avant la connexion';
      case 'auth/account-exists-with-different-credential': return 'Email déjà utilisé avec un autre fournisseur';
      default: return 'Erreur de connexion';
    }
  }

  

    window.addAdAccount = function() {
      const input = document.getElementById('newAdAccountName');
      if (!input) return;
      const name = input.value.trim();
      if (!name) {
        showToast('Nom du compte requis', 'error');
        return;
      }
      if (!appState.adAccounts) appState.adAccounts = [];
      const id = generateId('adacc');
      appState.adAccounts.push({ id, name, createdAt: Date.now() });
      input.value = '';
      renderAdAccountsList();
      populateAdAccountSelect();
      autoSave();
      showToast('Compte publicitaire ajouté', 'success');
    };

    window.deleteAdAccount = function(id) {
      if (!confirm('Supprimer ce compte publicitaire ?')) return;
      appState.adAccounts = (appState.adAccounts || []).filter(a => a.id !== id);
      renderAdAccountsList();
      populateAdAccountSelect();
      autoSave();
      showToast('Compte publicitaire supprimé', 'info');
    };

    function renderAdAccountsList() {
      const list = document.getElementById('adAccountsList');
      if (!list) return;
      list.innerHTML = '';
      (appState.adAccounts || []).forEach(acc => {
        const div = document.createElement('div');
        div.className = 'flex justify-between items-center p-3 border rounded-xl bg-gray-50';
        div.innerHTML = `
          <span class="font-semibold text-gray-700">${acc.name}</span>
          <button onclick="deleteAdAccount('${acc.id}')" class="text-red-500 hover:text-red-700 p-2">
            <i class="fas fa-trash-alt"></i>
          </button>
        `;
        list.appendChild(div);
      });
    }

    function populateAdAccountSelect() {
      const select = document.getElementById('adAccountSelect');
      const filterSelect = document.getElementById('adFilterAccount');
      if (!select) return;
      
      const currentVal = select.value;
      const currentFilterVal = filterSelect ? filterSelect.value : '';

      const options = '<option value="">-- Choisir un compte Ad --</option>';
      const filterOptions = '<option value="">-- Tous les comptes --</option>';
      
      const list = (appState.adAccounts || []).map(acc => `<option value="${acc.id}">${acc.name}</option>`).join('');
      
      select.innerHTML = options + list;
      if (filterSelect) filterSelect.innerHTML = filterOptions + list;

      select.value = currentVal;
      if (filterSelect) filterSelect.value = currentFilterVal;
    }

    function renderAdsTable() {
      const tbody = document.getElementById('adsTableBody');
      if (!tbody) return;
      tbody.innerHTML = '';
      
      const filterAccId = document.getElementById('adFilterAccount')?.value || '';
      const searchClient = document.getElementById('adSearchClient')?.value.toLowerCase() || '';

      // On filtre les transactions qui ont un compte publicitaire ou qui sont en cours (To-Do)
      let allAdsTx = [...(appState.transactions || []), ...(appState.todoTransactions || [])]
        .filter(t => t.adAccountId || t.adAccountName);

      // Filtre par compte Ad
      if (filterAccId) {
        allAdsTx = allAdsTx.filter(t => t.adAccountId === filterAccId);
      }

      // Filtre par recherche client
      if (searchClient) {
        allAdsTx = allAdsTx.filter(t => (t.clientName || '').toLowerCase().includes(searchClient));
      }

      // Mettre à jour le compteur de pubs actives
      const activeCount = allAdsTx.length;
      const countEl = document.getElementById('activeAdsCount');
      if (countEl) {
        countEl.textContent = `${activeCount} Pub${activeCount > 1 ? 's' : ''} Active${activeCount > 1 ? 's' : ''}`;
      }

      if (allAdsTx.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="p-8 text-center text-gray-500">Aucune publicité correspondante</td></tr>`;
        return;
      }

      // Trier par date de fin décroissante
      allAdsTx.sort((a, b) => new Date(b.endDate || 0) - new Date(a.endDate || 0));

      allAdsTx.forEach(t => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition-colors text-sm';
        
        // Calcul de la date de fin si non présente (date + durée)
        let endDate = t.endDate || 'Non définie';
        if (!t.endDate && t.duration) {
          try {
            const days = parseInt(t.duration.replace(/\D/g, ''));
            if (!isNaN(days)) {
              const d = new Date(t.date || Date.now());
              d.setDate(d.getDate() + days);
              endDate = d.toLocaleDateString('fr-FR');
            }
          } catch(e) {}
        }

        const adAcc = t.adAccountName || (appState.adAccounts.find(a => a.id === t.adAccountId)?.name) || 'Non spécifié';
        
        row.innerHTML = `
          <td class="p-4 font-medium">${t.clientName}</td>
          <td class="p-4"><span class="bg-cyan-100 text-cyan-800 px-2 py-1 rounded text-xs font-bold">${adAcc}</span></td>
          <td class="p-4">${endDate}</td>
          <td class="p-4 font-bold text-blue-600">${formatCurrency(t.priceDzd)}</td>
          <td class="p-4">
            <span class="px-2 py-1 rounded-full text-[10px] font-bold ${t.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}">
              ${t.status === 'pending' ? 'EN ATTENTE' : 'ACTIF'}
            </span>
          </td>
        `;
        tbody.appendChild(row);
      });
    }

    window.saveManualBalances = function() {
      const liqInput = document.getElementById('manualLiquide');
      const barInput = document.getElementById('manualBaridimob');
      const usdtInput = document.getElementById('manualUsdt');
      
      // CRITICAL: Les valeurs saisies par l'utilisateur sont les NOUVEAUX TOTAUX RÉELS
      const newTotalLiq = Number(liqInput ? liqInput.value : 0);
      const newTotalBar = Number(barInput ? barInput.value : 0);
      const newTotalUsdt = Number(usdtInput ? usdtInput.value : 0);

      // Calculer le solde théorique actuel (sans ajustement)
      const theoretical = calculateTheoreticalBalance();

      // 3. Calcul du Delta (Ajustement nécessaire)
      // Nouveau Total Désiré = Total Calculé + Ajustement
      // Donc: Ajustement = Nouveau Total Désiré - Total Calculé
      const deltaLiq = newTotalLiq - theoretical.liquide;
      const deltaBar = newTotalBar - theoretical.baridimob;
      const deltaUsdt = newTotalUsdt - theoretical.usdt;

      appState.manualBalances = {
        liquide: deltaLiq,
        baridimob: deltaBar,
        usdt: deltaUsdt
      };
      
      appState.lastUpdated = Date.now();

      // Forcer le recalcul et la sauvegarde immédiate
      recalculateFinanceBalances();
      saveToLocalStorage(); 
      if (typeof enqueueCloudSave === 'function') enqueueCloudSave(); 
      
      closeModal('manualBalanceModal');
      showToast('Soldes mis à jour sur les valeurs saisies', 'success');
      
      // Mettre à jour l'UI globale
      if (typeof updateDashboard === 'function') updateDashboard();
    };

    window.openManualBalanceModal = function() {
      // Afficher les soldes ACTUELS dans les champs, pas les ajustements
      // Cela permet à l'utilisateur de voir "50 000" et de le changer en "55 000"
      
      const currentLiq = appState.balances ? (appState.balances.liquide || 0) : 0;
      const currentBar = appState.balances ? (appState.balances.baridimob || 0) : 0;
      const currentUsdt = appState.balances ? (appState.balances.usdt || 0) : 0;

      const elLiq = document.getElementById('manualLiquide');
      const elBar = document.getElementById('manualBaridimob');
      const elUsdt = document.getElementById('manualUsdt');
      
      if (elLiq) elLiq.value = currentLiq;
      if (elBar) elBar.value = currentBar;
      if (elUsdt) elUsdt.value = currentUsdt;
      
      openModal('manualBalanceModal');
    };

    // === GESTION CLIENTS / OFFRES / TRANSACTIONS / PAIEMENTS / USD ===
    window.addClient = function() {
      const name = document.getElementById('newClientName').value.trim();
      const phone = document.getElementById('newClientPhone').value.trim();
      const instagram = document.getElementById('newClientInstagram').value.trim();
      const facebook = document.getElementById('newClientFacebook').value.trim();
      const notes = document.getElementById('newClientNotes').value.trim();

      if (!name) {
        showToast('Nom du client requis', 'error');
        return;
      }

      if (editingClientId) {
        const client = appState.clients.find(c => c.id === editingClientId);
        if (!client) {
          showToast('Client introuvable', 'error');
        } else {
          client.name = name;
          client.phone = phone;
          client.contact = phone || instagram || facebook || '';
          client.notes = notes;
          if (!client.social) client.social = { instagram: [], facebook: [] };
          const igHandle = instagram ? instagram.replace(/^@+/, '').trim() : '';
          client.username = igHandle;
          client.social.instagram = igHandle ? [igHandle] : [];
          client.social.facebook = facebook ? [facebook.trim()] : [];
          client.updatedAt = Date.now();
        }
        editingClientId = null;
        showToast('Client modifié', 'success');
      } else {
        // Nettoyage automatique des doublons avant ajout
        const cleanName = name.toLowerCase().trim();
        const existing = appState.clients.find(c => c.name.toLowerCase().trim() === cleanName);
        if (existing) {
          showToast('Ce client existe déjà', 'warning');
          return;
        }

        // Génération d'un ID Client lisible (C-001)
        if (!appState.settings.clientSeq) appState.settings.clientSeq = 0;
        appState.settings.clientSeq++;
        const readableId = `C-${String(appState.settings.clientSeq).padStart(3, '0')}`;

        const client = {
          id: generateId('client'),
          readableId: readableId,
          uid: auth.currentUser ? auth.currentUser.uid : null,
          name,
          phone,
          contact: phone || instagram || facebook || '',
          notes,
          totalSpent: 0,
          unpaid: 0,
          transactionsCount: 0,
          updatedAt: Date.now(),
          social: {
            instagram: instagram ? [instagram.replace(/^@+/, '').trim()] : [],
            facebook: facebook ? [facebook.trim()] : []
          }
        };
        appState.clients.push(client);
        showToast(`Client ${readableId} ajouté`, 'success');
      }

      document.getElementById('newClientName').value = '';
      document.getElementById('newClientPhone').value = '';
      document.getElementById('newClientInstagram').value = '';
      document.getElementById('newClientFacebook').value = '';
      document.getElementById('newClientNotes').value = '';

      closeModal('clientModal');
      renderClientsTable();
      populateClientDropdown();
      autoSave();
    };

    window.addOffer = function() {
      const nameInput = document.getElementById('newOfferName');
      const descInput = document.getElementById('newOfferDesc');
      const priceInput = document.getElementById('newOfferPrice');
      const costPerUnitInput = document.getElementById('newOfferCostPerUnit');
      const durationInput = document.getElementById('newOfferDuration');

      const name = nameInput ? nameInput.value.trim() : '';
      const desc = descInput ? descInput.value.trim() : '';
      const price = Number(priceInput ? priceInput.value : 0);
      const costPerUnit = Number(costPerUnitInput ? costPerUnitInput.value : 0);
      const duration = durationInput ? durationInput.value.trim() : '';

      if (!name || !price || !costPerUnit) {
        showToast('Nom, prix et montant $ requis', 'error');
        return;
      }

      if (editingOfferId) {
        const offerIndex = appState.offers.findIndex(o => o.id === editingOfferId);
        if (offerIndex !== -1) {
          appState.offers[offerIndex] = {
            ...appState.offers[offerIndex],
            name,
            description: desc,
            price,
            costPerUnit,
            duration,
            updatedAt: Date.now()
          };
          showToast('Offre modifiée', 'success');
        }
      } else {
        appState.offers.push({
          id: generateId('offer'),
          name,
          description: desc,
          price,
          costPerUnit,
          duration,
          updatedAt: Date.now()
        });
        showToast('Offre ajoutée', 'success');
      }

      if(nameInput) nameInput.value = '';
      if(descInput) descInput.value = '';
      if(priceInput) priceInput.value = '';
      if(costPerUnitInput) costPerUnitInput.value = '';
      if(durationInput) durationInput.value = '';
      editingOfferId = null;

      closeModal('offerModal');
      renderOffersGrid();
      populateOfferSelect();
      autoSave();
    };

    window.addTransaction = function() {
      const offerId = document.getElementById('offerSelect').value;
      const clientId = document.getElementById('clientSelect').value;
      const adAccountId = document.getElementById('adAccountSelect').value;
      const buyRate = Number(document.getElementById('buyRate').value || 0);
      const paid = document.getElementById('transactionPaid').checked;
      const reminderInput = document.getElementById('transactionReminderDate');

      // Toujours utiliser les champs saisis (remplis automatiquement si une offre est sélectionnée)
      const amount = Number(document.getElementById('standardDollarAmount').value || 0);
      const priceDzd = Number(document.getElementById('standardPriceDzd').value || 0);
      let duration = document.getElementById('standardDuration').value || '';

      // Si une offre est sélectionnée, reprendre sa durée par défaut si le champ est vide
      if (offerId) {
        const offer = appState.offers.find(o => o.id === offerId);
        if (!offer) {
          showToast('Offre introuvable', 'error');
          return;
        }
        if (!duration) duration = offer.duration || '';
      }

      if (!clientId) {
        showToast('Sélectionnez un client', 'error');
        return;
      }
      if (!amount || !priceDzd || !buyRate) {
        showToast('Montant $, prix vente et taux achat requis', 'error');
        return;
      }

      const client = appState.clients.find(c => c.id === clientId);
      if (!client) {
        showToast('Client introuvable', 'error');
        return;
      }

      const totalDzd = amount * buyRate;
      const profit = priceDzd - totalDzd;

      let reminderAt = null;
      if (!paid) {
        if (reminderInput && reminderInput.value) {
          reminderAt = reminderInput.value;
        } else {
          const d = new Date();
          d.setDate(d.getDate() + 3);
          reminderAt = getLocalDateString(d);
        }
      }

      const adAcc = appState.adAccounts.find(a => a.id === adAccountId);
      const actor = getActor();

      // Génération d'un numéro de transaction séquentiel (TX-001)
      if (!appState.settings.txnSeq) appState.settings.txnSeq = 0;
      appState.settings.txnSeq++;
      const readableId = `TX-${String(appState.settings.txnSeq).padStart(3, '0')}`;

      const transaction = {
        id: generateId('txn'),
        readableId: readableId,
        date: getLocalDateString(),
        createdAt: Date.now(),
        clientId,
        clientName: client.name,
        offerId: offerId || null,
        offerName: offerId ? (appState.offers.find(o => o.id === offerId)?.name || '') : 'Offre Standard',
        adAccountId: adAccountId || null,
        adAccountName: adAcc ? adAcc.name : '',
        amount,
        priceDzd,
        buyRate, // On stocke le taux d'achat spécifique à cette transaction
        totalDzd,
        profit,
        duration,
        paid,
        reminderAt,
        uid: actor.uid,
        handledByUid: actor.uid,
        handledByName: actor.name,
      };

      appState.transactions.push(transaction);
      if (actor.type === 'employee' && actor.uid) {
        handleEmployeeMilestone(actor.uid, actor.name);
      }
      logAudit('transaction:add', { id: transaction.readableId, client: transaction.clientName, amount: transaction.amount, revenueDzd: transaction.priceDzd, profitDzd: transaction.profit, actor: actor.name });

      // CRITICAL: Mettre à jour le timestamp du client pour forcer la synchro de son nouveau solde
      client.updatedAt = Date.now();

      // Les stats client seront recalculées globalement pour robustesse
      renderTables();
      autoSave();
      showToast(`Transaction ${readableId} ajoutée`, 'success');
      resetCalculator();
    };

    window.addPayment = function() {
      const clientId = document.getElementById('paymentClientSelect').value;
      const amountInput = document.getElementById('paymentAmount');
      const amount = Number(amountInput ? amountInput.value : 0);
      const account = document.getElementById('paymentAccount').value;
      const method = document.getElementById('paymentMethod').value;
      const status = document.getElementById('paymentStatus').value;
      const noteInput = document.getElementById('paymentNote');
      const note = noteInput ? noteInput.value.trim() : '';

      if (!clientId || !amount) {
        showToast('Client et montant requis', 'error');
        return;
      }

      let client = appState.clients.find(c => c.id === clientId);
      if (!client) {
        // Fallback: rechercher par nom affiché si l'id ne correspond pas
        const sel = document.getElementById('paymentClientSelect');
        const selectedName = sel?.options[sel.selectedIndex]?.text || '';
        client = appState.clients.find(c => (c.name || '').trim() === selectedName.trim());
      }
      if (!client) {
        showToast('Client introuvable', 'error');
        return;
      }

      const payment = {
        id: generateId('pay'),
        date: getLocalDateString(),
        clientId: client.id,
        clientName: client.name,
        amount,
        account,
        method,
        status,
        note,
      };

      appState.payments.push(payment);
      
      // CRITICAL: Update client timestamp to sync new balance state
      client.updatedAt = Date.now();
      
      recalculateFinanceBalances();

      client.unpaid = Number(client.unpaid || 0) - amount;

      renderPaymentsTable();
      const tbody = document.getElementById('paymentsTableBody');
      if (tbody) {
        // Wait for render to complete
        setTimeout(() => {
            const row = tbody.querySelector(`tr[data-payment-id="${payment.id}"]`);
            if (row) {
              row.classList.add('animate-pulse');
              setTimeout(() => {
                row.classList.remove('animate-pulse');
              }, 800);
            }
        }, 50);
      }
      closeModal('paymentModal');
      renderClientsTable();
      autoSave();
      showToast('Paiement enregistré', 'success');
      
      // Reset form
      if(amountInput) amountInput.value = '';
      if(noteInput) noteInput.value = '';
      document.getElementById('paymentClientSelect').value = '';
    };

    window.addUsdPurchase = function() {
      const amount = Number(document.getElementById('usdAmount').value || 0);
      const rate = Number(document.getElementById('usdRate').value || 0);
      const dzdAccount = document.getElementById('usdAccountSource').value;
      const source = document.getElementById('usdSource').value.trim();

      if (!amount || !rate) {
        showToast('Montant USD et taux requis', 'error');
        return;
      }

      const totalDzd = amount * rate;

      const purchase = {
        id: generateId('usd'),
        date: getLocalDateString(),
        amount,
        rate,
        totalDzd,
        dzdAccount,
        source,
      };

      appState.usdPurchases.push(purchase);
      logAudit('usdPurchase:add', { amount: purchase.amount, rate: purchase.rate, totalDzd: purchase.totalDzd, source: purchase.source });
      recalculateFinanceBalances();

      renderUsdPurchasesTable();
      const tbody = document.getElementById('usdPurchasesTableBody');
      if (tbody) {
        const row = tbody.querySelector(`tr[data-usd-id="${purchase.id}"]`);
        if (row) {
          row.classList.add('animate-pulse');
          setTimeout(() => {
            row.classList.remove('animate-pulse');
          }, 800);
        }
      }
      closeModal('usdPurchaseModal');
       autoSave();
       showToast('Achat USD enregistré', 'success');
     };

    window.addExpense = function() {
      const date = document.getElementById('expenseDate').value || getLocalDateString();
      const category = document.getElementById('expenseCategory').value || 'Autre';
      const account = document.getElementById('expenseAccount').value;
      const amount = Number(document.getElementById('expenseAmount').value || 0);
      const note = document.getElementById('expenseNote').value.trim();
      const recurring = !!document.getElementById('expenseRecurring')?.checked;
      const reminderEmail = document.getElementById('expenseReminderEmail')?.value?.trim() || '';
      
      const isEmployee = (appState.session && appState.session.type === 'employee');
      // If employee, use username or email. If admin, use 'Admin' or email
      const addedBy = isEmployee ? (appState.session.user.displayName || appState.session.user.email) : 'Admin';
      const uid = appState.session && appState.session.user ? appState.session.user.uid : null;

      if (!amount) { showToast('Montant requis', 'error'); return; }
      if (recurring) {
        const rid = generateId('recur');
        appState.recurringExpenses.push({
          id: rid,
          category,
          amount,
          note,
          addedBy, // Track creator
          uid // Track creator ID
        });
        appState.expenses.push({
          id: generateId('exp'),
          date,
          category,
          account,
          amount,
          note,
          recurringId: rid,
          addedBy, // Track creator
          uid // Track creator ID
        });
        if (reminderEmail) {
          try {
            fetch('http://localhost:3000/reminders', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({
                emailTo: reminderEmail,
                category,
                amount,
                note,
                dayOfMonth: date && date.includes('-') ? parseInt(date.split('-')[2]) : new Date().getDate()
              })
            }).then(() => {}).catch(() => {});
          } catch (e) {}
        }
      } else {
        appState.expenses.push({
          id: generateId('exp'),
          date,
          category,
          account,
          amount,
          note,
          addedBy, // Track creator
          uid // Track creator ID
        });
      }
      logAudit('expense:add', { date, category, account, amount, addedBy, uid });
      closeModal('expenseModal');
      recalculateFinanceBalances();
      applyRecurringExpensesForCurrentMonth();
      renderExpensesTable();
      autoSave();
      if(appState.settings.storageMode === 'cloud') {
          // Force save for employee to ensure data reaches cloud immediately
          saveToCloud();
      }
      updateDashboard();
       showToast('Frais ajouté', 'success');
     };

    window.addTodoTransaction = function() {
      const offerId = document.getElementById('offerSelect').value;
      const clientId = document.getElementById('clientSelect').value;
      const adAccountId = document.getElementById('adAccountSelect').value;
      const buyRate = Number(document.getElementById('buyRate').value || 0);
      const paid = document.getElementById('transactionPaid').checked;

      const amount = Number(document.getElementById('standardDollarAmount').value || 0);
      const priceDzd = Number(document.getElementById('standardPriceDzd').value || 0);
      let duration = document.getElementById('standardDuration').value || '';

      if (!clientId) {
        showToast('Sélectionnez un client', 'error');
        return;
      }
      if (!amount || !priceDzd) {
        showToast('Montant $ et prix vente requis', 'error');
        return;
      }

      const client = appState.clients.find(c => c.id === clientId);
      if (!client) {
        showToast('Client introuvable', 'error');
        return;
      }

      const adAcc = appState.adAccounts.find(a => a.id === adAccountId);
      const actor = getActor();

      const todo = {
        id: generateId('todo'),
        date: getLocalDateString(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        uid: actor.uid,
        createdByUid: actor.uid,
        createdByName: actor.name,
        clientId,
        clientName: client.name,
        offerId: offerId || null,
        offerName: offerId ? (appState.offers.find(o => o.id === offerId)?.name || '') : 'Offre Standard',
        adAccountId: adAccountId || null,
        adAccountName: adAcc ? adAcc.name : '',
        amount,
        priceDzd,
        buyRate,
        duration,
        paid,
        status: 'pending' // pending, done, problem
      };

      if (!Array.isArray(appState.todoTransactions)) appState.todoTransactions = [];
      appState.todoTransactions.push(todo);

      renderTodoTable();
      autoSave();
      showToast('Transaction mise en attente (To-Do)', 'info');
      resetCalculator();
    };

    window.toggleTodoPayment = function(id) {
      const todo = (appState.todoTransactions || []).find(t => t.id === id);
      if (todo) {
        todo.paid = !todo.paid;
        todo.updatedAt = Date.now();
        renderTodoTable();
        autoSave();
      }
    };

    window.validateTodoTransaction = function(id, status) {
      const idx = appState.todoTransactions.findIndex(t => t.id === id);
      if (idx === -1) return;
      
      const todo = appState.todoTransactions[idx];
      const actor = getActor();
      
      // Calculate profit if possible
      const totalDzd = todo.amount * (todo.buyRate || 340);
      const profit = todo.priceDzd - totalDzd;
      
      let reminderAt = null;
      if (!todo.paid) {
        const d = new Date();
        d.setDate(d.getDate() + 3);
        reminderAt = getLocalDateString(d);
      }

      const transaction = {
        id: generateId('txn'),
        date: getLocalDateString(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        uid: actor.uid,
        handledByUid: actor.uid,
        handledByName: actor.name,
        clientId: todo.clientId,
        clientName: todo.clientName,
        offerId: todo.offerId,
        offerName: todo.offerName,
        amount: todo.amount,
        priceDzd: todo.priceDzd,
        buyRate: todo.buyRate || 0,
        totalDzd,
        profit,
        duration: todo.duration,
        paid: todo.paid,
        reminderAt,
        status: status === 'done' ? 'active' : status // Fix: 'done' doit devenir 'active' pour les stats
      };

      appState.transactions.push(transaction);
      appState.todoTransactions.splice(idx, 1);
      
      const client = (appState.clients || []).find(c => c.id === todo.clientId);
      if (client) {
          client.updatedAt = Date.now();
      }

      logAudit('todo:validate', { todoId: todo.id, client: todo.clientName, status, revenueDzd: todo.priceDzd, profitDzd: profit, actor: actor.name });
      
      if (status === 'done') {
        showToast('Transaction validée et enregistrée', 'success');
      } else {
        showToast('Transaction enregistrée avec mention "Problème"', 'warning');
      }
      
      renderTables();
      if (status === 'done' && actor.type === 'employee' && actor.uid) {
        handleEmployeeMilestone(actor.uid, actor.name);
      }
      autoSave();
    };

    function handleEmployeeMilestone(uid, name) {
      if (!uid) return;
      if (!appState.employeeGame) appState.employeeGame = {};
      if (!appState.employeeGame[uid]) appState.employeeGame[uid] = { awarded: [] };
      const awarded = Array.isArray(appState.employeeGame[uid].awarded) ? appState.employeeGame[uid].awarded : [];

      const completed = (appState.transactions || []).filter(t => {
        if (!t) return false;
        const handler = t.handledByUid || t.uid;
        if (!handler || String(handler) !== String(uid)) return false;
        if (t.status === 'problem') return false;
        return true;
      }).length;

      const thresholds = [5, 9, 20];
      const hit = thresholds.find(n => completed >= n && !awarded.includes(n));
      if (!hit) return;

      awarded.push(hit);
      appState.employeeGame[uid].awarded = awarded;
      try { saveToLocalStorage(); } catch (e) {}

      showMilestoneOverlay(hit, completed, name);
    }

    function showMilestoneOverlay(level, total, name) {
      const existing = document.getElementById('milestoneOverlay');
      if (existing && existing.parentNode) existing.parentNode.removeChild(existing);

      const overlay = document.createElement('div');
      overlay.id = 'milestoneOverlay';
      overlay.className = 'milestone-overlay';

      const title = level === 5 ? 'Palier 5 atteint' : (level === 9 ? 'Palier 9 atteint' : 'Palier 20 atteint');
      const subtitle = name ? `${name} • ${total} transactions validées` : `${total} transactions validées`;

      const card = document.createElement('div');
      card.className = 'milestone-card';
      card.innerHTML = `
        <div class="milestone-title">${title}</div>
        <div class="milestone-subtitle">${subtitle}</div>
      `;

      const confetti = document.createElement('div');
      confetti.className = 'milestone-confetti';
      const colors = ['#2563eb', '#4f46e5', '#16a34a', '#f59e0b', '#e11d48', '#06b6d4'];
      for (let i = 0; i < 36; i++) {
        const p = document.createElement('div');
        p.className = 'milestone-piece';
        p.style.left = Math.floor(Math.random() * 100) + '%';
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.animationDelay = (Math.random() * 0.4) + 's';
        p.style.transform = `rotate(${Math.floor(Math.random() * 360)}deg)`;
        confetti.appendChild(p);
      }

      overlay.appendChild(confetti);
      overlay.appendChild(card);
      overlay.addEventListener('click', () => { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); });
      document.body.appendChild(overlay);
      setTimeout(() => { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); }, 3500);
    }

     // === ETAT GLOBAL DE L'APP ===
    let editingOfferId = null;
    let editingClientId = null;
    let appState = {
      clients: [],
      transactions: [],
      offers: [],
      payments: [],
      usdPurchases: [],
      currentTab: 'dashboard',
      lastUpdated: 0,
      sync: { pendingCloudSave: false, retryDelayMs: 5000 },
      syncQueue: [],
      syncTimer: null,
      syncThrottleMs: 2000,
      settings: {
        storageMode: 'cloud',
        cloudProvider: 'firebase',
        autoSaveEnabled: true,
        seedDefaults: true,
        expenseCategories: ['Salaire', 'Téléphone', 'Internet'],
        topClientsWeights: { spent: 0.7, transactions: 0.3, unpaid: -0.2 },
      },
      expenses: [],
      recurringExpenses: [],
      clientRequests: [],
      usdtExpenses: [],
      todoTransactions: [],
      adAccounts: [],
      manualBalances: { liquide: 0, baridimob: 0, usdt: 0 }, // Initial or manual adjustment
    };
    window.appState = appState;

    // === UTILITAIRES ===
    function generateId(prefix = 'id') {
      return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
    }
    window.generateId = generateId;

    function safeToFixed(value, digits = 2) {
      const num = Number(value || 0);
      if (Number.isNaN(num)) return (0).toFixed(digits);
      return num.toFixed(digits);
    }

    function normalizePhoneForWhatsApp(phone) {
      let digits = String(phone || '').replace(/\D+/g, '');
      if (!digits) return '';
      if (digits.startsWith('213') && digits.length === 12) return digits;
      if (digits.startsWith('0') && digits.length === 10) return '213' + digits.slice(1);
      if (digits.length === 9) return '213' + digits;
      if (digits.startsWith('00')) digits = digits.slice(2);
      if (digits.startsWith('0') && digits.length > 9) digits = digits.slice(1);
      return digits;
    }

    function buildClientWhatsAppLink(client) {
      const phone = client.phone || client.contact || '';
      const normalized = normalizePhoneForWhatsApp(phone);
      if (!normalized) return '';
      const msg = encodeURIComponent('Bonjour ' + (client.name || '') + ' ');
      return 'https://wa.me/' + normalized + '?text=' + msg;
    }

    function buildClientInstagramLink(client) {
      let handle = client.username;
      if (!handle && client.social && Array.isArray(client.social.instagram) && client.social.instagram.length > 0) {
        handle = client.social.instagram[0];
      }
      if (!handle) return '';
      handle = String(handle).trim().replace(/^@+/, '');
      if (!handle) return '';
      return 'https://instagram.com/' + handle;
    }

    function formatDate(date) {
      return new Date(date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    }

    // NOUVELLE FONCTION CENTRALE DE CALCUL (SANS AJUSTEMENT MANUEL)
    function calculateTheoreticalBalance() {
      let liq = 0;
      let bar = 0;
      let usdt = 0;

      // 1. Entrées (Paiements)
      (appState.payments || []).forEach(p => {
          const amt = Number(p.amount || 0);
          const method = (p.method || '').toLowerCase();
          const account = p.account || (method === 'baridimob' ? 'baridimob' : (method === 'usdt' ? 'usdt' : 'liquide'));
          
          if (account === 'baridimob') bar += amt;
          else if (account === 'usdt') usdt += amt;
          else liq += amt;
      });

      // 2. Sorties (Dépenses)
      (appState.expenses || []).forEach(e => {
          const amt = Number(e.amount || 0);
          const account = e.account || 'liquide';
          
          if (account === 'baridimob') bar -= amt;
          else if (account === 'usdt') usdt -= amt;
          else liq -= amt;
      });

      // 3. Achats USD (DZD -> USDT)
      (appState.usdPurchases || []).forEach(u => {
          const dzdAmt = Number(u.totalDzd || 0);
          const usdtAmt = Number(u.amount || 0);
          const dzdAccount = u.dzdAccount || 'liquide';
          
          if (dzdAccount === 'baridimob') bar -= dzdAmt;
          else liq -= dzdAmt;
          
          usdt += usdtAmt;
      });

      // 4. Ventes USD (Transactions) - Diminue le stock USDT
      (appState.transactions || []).forEach(t => {
          const usdtAmt = Number(t.amount || 0);
          usdt -= usdtAmt;
      });

      // 5. Dépenses USDT
      (appState.usdtExpenses || []).forEach(e => {
          const usdtAmt = Number(e.amount || 0);
          usdt -= usdtAmt;
      });

      return { liquide: liq, baridimob: bar, usdt: usdt };
    }

    function recalculateFinanceBalances() {
      const manual = appState.manualBalances || { liquide: 0, baridimob: 0, usdt: 0 };
      const theoretical = calculateTheoreticalBalance();

      const balances = { 
        liquide: theoretical.liquide + Number(manual.liquide || 0), 
        baridimob: theoretical.baridimob + Number(manual.baridimob || 0), 
        usdt: theoretical.usdt + Number(manual.usdt || 0) 
      };

      appState.balances = balances;
      updateFinanceUI();
    }

    function updateFinanceUI() {
      const b = appState.balances || { liquide: 0, baridimob: 0, usdt: 0 };
      const isEmployee = (appState.session && appState.session.type === 'employee');
      
      const elLiq = document.getElementById('balanceLiquide');
      const elBar = document.getElementById('balanceBaridimob');
      const elUsdt = document.getElementById('balanceUsdt');
      
      // Employee Restriction: Hide sensitive balances
      if (isEmployee) {
          if (elLiq) elLiq.innerHTML = '<span class="text-gray-400 text-sm italic">Masqué</span>';
          if (elBar) elBar.innerHTML = '<span class="text-gray-400 text-sm italic">Masqué</span>';
          if (elUsdt) elUsdt.innerHTML = '<span class="text-gray-400 text-sm italic">Masqué</span>';
      } else {
          if (elLiq) elLiq.textContent = formatCurrency(b.liquide);
          if (elBar) elBar.textContent = formatCurrency(b.baridimob);
          if (elUsdt) elUsdt.textContent = `${b.usdt.toFixed(2)} USDT`;
          
          if (elLiq) elLiq.classList.toggle('text-red-600', b.liquide < 0);
          if (elBar) elBar.classList.toggle('text-red-600', b.baridimob < 0);
          if (elUsdt) elUsdt.classList.toggle('text-red-600', b.usdt < 0);
      }
    }

    function getLocalDateString(date = new Date()) {
      return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
    }
    
    function isAdminSession() {
      // Check if auth exists before accessing currentUser
      const hasAuth = (typeof auth !== 'undefined' && auth && auth.currentUser);
      return hasAuth || (appState.session && appState.session.type === 'employee');
    }
    
    function requireAdmin() {
      if (!isAdminSession()) {
        showToast('Accès réservé à lâ€™administration', 'warning');
        return false;
      }
      return true;
    }

    // Expose functions globally to ensure HTML event handlers find them
    window.toggleRedotpayCalculator = toggleRedotpayCalculator;
    window.calculateRedotpayUsd = calculateRedotpayUsd;

    function updateRequestsBadge() {
        const badge = document.getElementById('requestsBadge');
        if (!badge) return;
        
        const requests = appState.clientRequests || [];
        const unreadCount = requests.filter(r => !r.read).length;
        
        badge.textContent = unreadCount;
        if (unreadCount > 0) {
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }
    
    function updateSyncIndicator() {
      const el = document.getElementById('syncIndicator');
      const txt = document.getElementById('syncIndicatorText');
      if (!el || !txt) return;
      const isCloud = appState.settings.storageMode === 'cloud' && !!(auth && auth.currentUser);
      const hasQueue = (appState.syncQueue || []).length > 0 || !!appState.syncTimer;
      const hasError = !!(appState.sync && appState.sync.pendingCloudSave);
      if (!isCloud) { el.classList.add('hidden'); return; }
      if (hasError) {
        txt.textContent = 'Erreur de synchronisation';
        el.classList.remove('hidden');
        el.classList.remove('bg-blue-50','text-blue-700','border-blue-200');
        el.classList.add('bg-red-50','text-red-700','border-red-200');
        return;
      }
      if (hasQueue) {
        txt.textContent = 'Synchronisation…';
        el.classList.remove('hidden');
        el.classList.remove('bg-red-50','text-red-700','border-red-200');
        el.classList.add('bg-blue-50','text-blue-700','border-blue-200');
        return;
      }
      txt.textContent = 'Synchronisé';
      el.classList.remove('hidden');
      el.classList.remove('bg-red-50','text-red-700','border-red-200');
      el.classList.remove('bg-blue-50','text-blue-700','border-blue-200');
      el.classList.add('bg-gray-50','text-gray-700','border-gray-200');
    }

  function openImagePreview(src) {
    const clientVisible = !!document.getElementById('clientSpaceContainer') && document.getElementById('clientSpaceContainer').style.display !== 'none';
    if (clientVisible) {
      const modal2 = document.getElementById('clientImagePreviewModal');
      const img2 = document.getElementById('clientImagePreviewContent');
      if (!modal2 || !img2) return;
      img2.src = src;
      modal2.classList.remove('hidden');
    } else {
      const modal = document.getElementById('imagePreviewModal');
      const img = document.getElementById('imagePreviewContent');
      if (!modal || !img) return;
      img.src = src;
      modal.classList.remove('hidden');
    }
  }
  
  function copyToClipboard(text) {
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
  }
  
  function renderSettingsAdmin() {
    const container = document.getElementById('settingsContent');
    if (!container) return;
    if (!Array.isArray(appState.employees)) appState.employees = [];
    const cloudStatus = (appState.settings.storageMode === 'cloud') 
      ? '<span class="text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded text-xs">Cloud connecté</span>'
      : '<span class="text-gray-700 bg-gray-50 border border-gray-200 px-2 py-1 rounded text-xs">Mode local</span>';
    container.innerHTML = `
      <div class="bg-white p-6 rounded-2xl shadow border">
        <h3 class="text-xl font-bold mb-4 flex items-center gap-2"><i class="fas fa-cog text-blue-600"></i> Paramètres</h3>
        <div class="flex items-center justify-between mb-4">
          <div class="text-sm text-gray-600">Statut: ${cloudStatus}</div>
          <div class="text-xs text-gray-500">Dernière mise à jour: ${new Date(appState.lastUpdated || Date.now()).toLocaleString()}</div>
        </div>
        <div class="flex items-center gap-3 mb-6">
          <button onclick="forceCloudSave()" class="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
            <i class="fas fa-cloud-upload-alt mr-1"></i> Forcer Sauvegarde Cloud
          </button>
          ${(appState.sync?.pendingCloudSave) ? '<span class="text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-1 rounded">En attente de synchro cloudâ€¦</span>' : ''}
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-1 bg-gray-50 border rounded-xl p-4">
            <h4 class="font-bold mb-3">Ajouter un employé</h4>
            <input id="empUsername" type="text" placeholder="Nom d'utilisateur" class="w-full p-2 border rounded mb-2">
            <input id="empPassword" type="password" placeholder="Mot de passe" class="w-full p-2 border rounded mb-3">
            <button onclick="addEmployee()" class="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Ajouter</button>
          </div>
          <div class="lg:col-span-2">
            <h4 class="font-bold mb-3">Employés</h4>
            <div id="employeesList" class="space-y-3"></div>
          </div>
        </div>
      </div>
    `;
    const list = document.getElementById('employeesList');
    list.innerHTML = '';
    appState.employees.forEach(emp => {
      const div = document.createElement('div');
      div.className = 'flex items-center justify-between bg-white border rounded-xl p-3';
      div.innerHTML = `
        <div>
          <div class="font-bold">${emp.username}</div>
          <div class="text-xs text-gray-500">Créé le ${new Date(emp.createdAt || Date.now()).toLocaleDateString()}</div>
        </div>
        <div class="flex gap-2">
          <button onclick="resetEmployeePassword('${emp.id}')" class="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 text-sm"><i class="fas fa-key mr-1"></i> Réinitialiser</button>
          <button onclick="deleteEmployee('${emp.id}')" class="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"><i class="fas fa-trash mr-1"></i> Supprimer</button>
        </div>
      `;
      list.appendChild(div);
    });
  }
  function addEmployee() {
    const u = document.getElementById('empUsername').value.trim();
    const p = document.getElementById('empPassword').value.trim();
    if (!u || !p) { showToast('Nom utilisateur et mot de passe requis', 'error'); return; }
    const emp = { id: generateId('emp'), username: u, password: p, createdAt: Date.now() };
    appState.employees.push(emp);
    autoSave();
    renderSettingsAdmin();
    showToast('Employé ajouté', 'success');
    document.getElementById('empUsername').value = '';
    document.getElementById('empPassword').value = '';
  }
  function deleteEmployee(id) {
    if (!confirm('Supprimer cet employé ?')) return;
    appState.employees = appState.employees.filter(e => e.id !== id);
    autoSave();
    renderSettingsAdmin();
    showToast('Employé supprimé', 'success');
  }
  function resetEmployeePassword(id) {
    const input = document.getElementById('newEmpPwdInput');
    const hiddenId = document.getElementById('resetPwdEmpId');
    if (input) input.value = '';
    if (hiddenId) hiddenId.value = id;
    openModal('resetPwdModal');
  }

  window.saveResetEmployeePassword = function() {
    const id = document.getElementById('resetPwdEmpId').value;
    const newPwd = document.getElementById('newEmpPwdInput').value;
    if (!newPwd) {
      showToast('Mot de passe requis', 'error');
      return;
    }
    const emp = appState.employees.find(e => e.id === id);
    if (!emp) return;
    emp.password = newPwd;
    autoSave();
    renderSettingsAdmin();
    closeModal('resetPwdModal');
    showToast('Mot de passe mis à jour', 'success');
  };
  function closeImagePreview() {
    const modal = document.getElementById('imagePreviewModal');
    const img = document.getElementById('imagePreviewContent');
    const modal2 = document.getElementById('clientImagePreviewModal');
    const img2 = document.getElementById('clientImagePreviewContent');
    if (img) img.src = '';
    if (img2) img2.src = '';
    if (modal) modal.classList.add('hidden');
    if (modal2) modal2.classList.add('hidden');
  }
  
  function openRequestModal(id) {
    const modal = document.getElementById('requestDetailModal');
    const content = document.getElementById('requestDetailContent');
    const btn = document.getElementById('requestToggleProcessedBtn');
    const req = (appState.clientRequests || []).find(r => r.id === id);
    if (!modal || !content || !req) return;
    content.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div class="text-sm text-gray-500">Date</div>
          <div class="font-bold">${formatDate(req.date)}</div>
        </div>
        <div>
          <div class="text-sm text-gray-500">Statut</div>
          <select id="requestStatusSelect" class="mt-1 p-2 border rounded text-sm">
            <option value="pending" ${req.status==='pending'?'selected':''}>En attente</option>
            <option value="in_progress" ${req.status==='in_progress'?'selected':''}>En cours</option>
            <option value="problematic" ${req.status==='problematic'?'selected':''}>Problématique</option>
            <option value="processed" ${req.status==='processed'?'selected':''}>Traité</option>
          </select>
        </div>
        <div>
          <div class="text-sm text-gray-500">Plateforme</div>
          <div class="font-bold">${(req.platform || '').toUpperCase()}</div>
        </div>
        <div>
          <div class="text-sm text-gray-500">Offre</div>
          <div class="font-bold">${req.offer || '-'}</div>
        </div>
        <div class="md:col-span-2">
          <div class="text-sm text-gray-500">Objectif</div>
          <div>${req.metaObjective || req.tiktokObjective || '-'}</div>
        </div>
        <div>
          <div class="text-sm text-gray-500">Instagram</div>
          <div>${req.instagram || '<span class="text-gray-400">N/A</span>'}</div>
        </div>
        <div>
          <div class="text-sm text-gray-500">Page Facebook</div>
          <div>${req.pageFacebook || '<span class="text-gray-400">N/A</span>'}</div>
        </div>
        <div class="md:col-span-2">
          <div class="text-sm text-gray-500">Cibles/Options</div>
          <div class="text-xs text-gray-700">
            ${req.metaFollowersTarget ? `<div>Followers: ${req.metaFollowersTarget}</div>` : ''}
            ${req.metaMessagesTarget ? `<div>Messages: ${req.metaMessagesTarget}</div>` : ''}
            ${req.tiktokMsgTarget ? `<div>TikTok Messages: ${req.tiktokMsgTarget}</div>` : ''}
          </div>
        </div>
        <div class="md:col-span-2">
          <div class="text-sm text-gray-500">Lien publication</div>
          ${req.pubLink ? `<div class="flex items-center gap-2"><a href="${req.pubLink}" target="_blank" class="text-blue-600 hover:underline"><i class="fas fa-link mr-1"></i>${req.pubLink}</a><button class="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200" onclick="copyToClipboard('${req.pubLink}')">Copier</button></div>` : '<span class="text-gray-400">Aucun lien</span>'}
        </div>
        <div class="md:col-span-2">
          <div class="text-sm text-gray-500">Site Web</div>
          ${req.websiteUrl ? `<div class="flex items-center gap-2"><a href="${req.websiteUrl}" target="_blank" class="text-blue-600 hover:underline"><i class="fas fa-link mr-1"></i>${req.websiteUrl}</a><button class="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200" onclick="copyToClipboard('${req.websiteUrl}')">Copier</button></div>` : '<span class="text-gray-400">Aucun</span>'}
        </div>
        <div class="md:col-span-2">
          <div class="text-sm text-gray-500">Note client</div>
          <div class="bg-yellow-50 border border-yellow-100 p-3 rounded">${req.clientNote || '<span class="text-gray-400">Aucune</span>'}</div>
        </div>
        <div>
          <div class="text-sm text-gray-500">Moyen de paiement</div>
          <div class="font-bold">${req.paymentMethod || '-'}</div>
          ${req.paymentDetails ? `<div class="text-xs mt-1 text-gray-600">${req.paymentDetails.dzdAmount} DZD -> ${Number(req.paymentDetails.usdToSend || 0).toFixed(2)} $</div>` : ''}
        </div>
        <div>
          <div class="text-sm text-gray-500">Preuve</div>
          ${req.paymentProof ? (String(req.paymentProof).startsWith('data:') 
             ? `<img src="${req.paymentProof}" class="h-32 rounded border cursor-pointer" onclick="openImagePreview('${req.paymentProof}')">`
             : `<a href="${req.paymentProof}" target="_blank" class="text-blue-600 hover:underline"><i class="fas fa-link mr-1"></i>Ouvrir</a>`) 
             : '<span class="text-gray-400">Aucune preuve</span>'}
        </div>
      </div>
    `;
    btn.textContent = 'Enregistrer';
    btn.onclick = function() {
      const sel = document.getElementById('requestStatusSelect');
      const val = sel ? sel.value : req.status;
      updateRequestStatus(id, val);
      openRequestModal(id);
    };
    modal.classList.remove('hidden');
  }
  function closeRequestModal() {
    const modal = document.getElementById('requestDetailModal');
    if (!modal) return;
    modal.classList.add('hidden');
  }
    // Normaliser les données (ajouter des id manquants, valeurs par défaut)
    function normalizeAppState() {
      const currentUid = auth.currentUser ? auth.currentUser.uid : null;
      const now = Date.now();
      let changed = false;

      if (!appState.balances) {
        appState.balances = { liquide: 0, baridimob: 0, usdt: 0 };
        changed = true;
      }
      
      if (!appState.settings) {
        appState.settings = { storageMode: 'cloud', autoSaveEnabled: true };
        changed = true;
      }
      if (!appState.settings.storageMode) {
        appState.settings.storageMode = 'cloud';
        changed = true;
      }
      if (appState.settings.autoSaveEnabled === undefined) {
        appState.settings.autoSaveEnabled = true;
        changed = true;
      }
      
      const ensureIdAndMeta = (item, prefix) => {
        if (!item.id) { item.id = generateId(prefix); changed = true; }
        if (!item.updatedAt) { item.updatedAt = now; changed = true; }
        if (!item.uid && currentUid) { item.uid = currentUid; changed = true; }
      };

      const ensureArray = (key) => {
        if (!Array.isArray(appState[key])) { appState[key] = []; changed = true; }
      };

      ['offers', 'clients', 'transactions', 'todoTransactions', 'payments', 'usdPurchases', 'expenses', 'usdtExpenses', 'recurringExpenses', 'clientRequests'].forEach(ensureArray);

      appState.offers.forEach(o => {
        ensureIdAndMeta(o, 'offer');
        if (typeof o.price !== 'number') { o.price = Number(o.price || 0); changed = true; }
        if (typeof o.costPerUnit !== 'number') { o.costPerUnit = Number(o.costPerUnit || 0); changed = true; }
        if (!('description' in o)) { o.description = ''; changed = true; }
        if (!('duration' in o)) { o.duration = 'N/A'; changed = true; }
      });
      appState.clients.forEach(c => {
        ensureIdAndMeta(c, 'client');
        if (!('contact' in c)) { c.contact = ''; changed = true; }
        if (!('notes' in c)) { c.notes = ''; changed = true; }
      });
      appState.transactions.forEach(t => {
        ensureIdAndMeta(t, 'txn');
        if (!t.date || t.date.includes('T')) { 
          t.date = getLocalDateString(t.date ? new Date(t.date) : new Date()); 
          changed = true;
        }
        if (t.reminderAt && t.reminderAt.includes('T')) {
           t.reminderAt = getLocalDateString(new Date(t.reminderAt));
           changed = true;
        }
        if (!('createdAt' in t)) { t.createdAt = now; changed = true; }
      });
      appState.todoTransactions.forEach(t => {
        ensureIdAndMeta(t, 'todo');
        if (!t.date || t.date.includes('T')) { 
          t.date = getLocalDateString(t.date ? new Date(t.date) : new Date()); 
          changed = true;
        }
        if (!('createdAt' in t)) { t.createdAt = now; changed = true; }
      });
      appState.payments.forEach(p => {
        ensureIdAndMeta(p, 'pay');
        if (!p.date || p.date.includes('T')) { 
          p.date = getLocalDateString(p.date ? new Date(p.date) : new Date()); 
          changed = true;
        }
      });
      appState.usdPurchases.forEach(u => {
        ensureIdAndMeta(u, 'usd');
        if (!u.date || u.date.includes('T')) { 
          u.date = getLocalDateString(u.date ? new Date(u.date) : new Date()); 
          changed = true;
        }
      });
      appState.expenses.forEach(e => {
        ensureIdAndMeta(e, 'exp');
        if (!e.date || e.date.includes('T')) { 
          e.date = getLocalDateString(e.date ? new Date(e.date) : new Date()); 
          changed = true;
        }
        if (typeof e.amount !== 'number') { e.amount = Number(e.amount || 0); changed = true; }
        if (!('category' in e)) { e.category = 'Autre'; changed = true; }
      });
      appState.usdtExpenses.forEach(e => {
        ensureIdAndMeta(e, 'usdt');
        if (!e.date || e.date.includes('T')) { 
          e.date = getLocalDateString(e.date ? new Date(e.date) : new Date()); 
          changed = true;
        }
      });
      appState.recurringExpenses.forEach(r => {
        ensureIdAndMeta(r, 'recur');
        if (!('category' in r)) { r.category = 'Autre'; changed = true; }
        if (typeof r.amount !== 'number') { r.amount = Number(r.amount || 0); changed = true; }
      });
      appState.clientRequests.forEach(r => {
        if (typeof r.read !== 'boolean') { r.read = false; changed = true; }
        if (typeof r.processed !== 'boolean') { r.processed = false; changed = true; }
        if (!r.date) { r.date = getLocalDateString(); changed = true; }
        if (!r.status) {
          r.status = r.processed ? 'processed' : 'pending';
          changed = true;
        }
        const validStatuses = ['pending','in_progress','problematic','processed'];
        if (!validStatuses.includes(r.status)) {
          r.status = r.processed ? 'processed' : 'pending';
          changed = true;
        }
      });

      if (!appState.customSection) {
          appState.customSection = { title: "Nos Réalisations", categories: [] };
          changed = true;
      }
      if (!appState.settings.workMethodText) {
           appState.settings.workMethodText = `<div class="space-y-4">...</div>`;
           changed = true;
      }

      if (changed) {
        try { saveToLocalStorage(); } catch (e) {}
      }
    }

    // === LOCAL STORAGE ===
    function saveToLocalStorage() {
      localStorage.setItem('hichemSponsor', JSON.stringify(appState));
    }

    function loadFromLocalStorage() {
      const data = localStorage.getItem('hichemSponsor');
      if (data) {
        try {
          const parsed = JSON.parse(data);
          Object.assign(appState, parsed);

          console.log('📦 Données chargées depuis le localStorage');
          normalizeAppState();
          updateRequestsBadge();
        } catch (e) {
          console.error('Erreur parse localStorage', e);
        }
      }
    }

    function setEmployeeGuardEnabled(enabled) {
      const existing = document.getElementById('employee-guard-style');
      if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
      if (!document.body) return;
      document.body.classList.toggle('employee-mode', !!enabled);
    }

    function updateDefaultBuyRateFromLastPurchase() {
      if (!appState.settings) appState.settings = {};
      const purchases = Array.isArray(appState.usdPurchases) ? appState.usdPurchases : [];
      if (!purchases.length) return;
      const sorted = [...purchases].sort((a, b) => {
        const da = (a.date || '').toString();
        const db = (b.date || '').toString();
        if (db !== da) return db.localeCompare(da);
        return Number(b.createdAt || 0) - Number(a.createdAt || 0);
      });
      const last = sorted.find(p => p && Number(p.rate || 0) > 0);
      if (!last) return;
      appState.settings.defaultBuyRate = Number(last.rate);
    }

    // === CLOUD (FIRESTORE) ===
    async function loadFromCloud() {
      try {
        const uid = getCloudUid();
        const doc = await getDb().collection('users').doc(uid).get();
        if (doc.exists) {
          const raw = doc.data();
          const data = raw?.data ?? raw;
          
          // CRITICAL: Filter keys to avoid overwriting collections with snapshot
          const snapshotKeys = ['settings', 'manualBalances', 'lastUpdated', 'sync'];
          snapshotKeys.forEach(k => {
            if (data[k] !== undefined) appState[k] = data[k];
          });
          
          console.log('☁️ Données utilisateur chargées depuis Firebase');
          
          // Charger les données granulaires pour compléter/mettre à jour
          await loadGranularFromCloud();
          
          normalizeAppState();
          
          try {
            const localStr = localStorage.getItem('hichemSponsor');
            if (localStr) {
              const localData = JSON.parse(localStr);
              
              // 1. Fusion des collections granulaires (Arrays)
              const collections = ['clients', 'offers', 'transactions', 'todoTransactions', 'payments', 'usdPurchases', 'expenses', 'clientRequests', 'recurringExpenses', 'usdtExpenses'];
              let mergeCount = 0;
              
              collections.forEach(col => {
                  if (Array.isArray(localData[col])) {
                      if (!appState[col]) appState[col] = [];
                      const cloudMap = new Map(appState[col].map(i => [i.id, i]));
                      
                      localData[col].forEach(localItem => {
                          if (!localItem.id) return;
                          const cloudItem = cloudMap.get(localItem.id);
                          
                          if (!cloudItem) {
                              // Item exists locally but not in cloud
                              appState[col].push(localItem);
                              mergeCount++;
                          } else {
                              // Item exists in both, use newest by updatedAt
                              const localTs = Number(localItem.updatedAt || 0);
                              const cloudTs = Number(cloudItem.updatedAt || 0);
                              if (localTs > cloudTs) {
                                  Object.assign(cloudItem, localItem);
                                  mergeCount++;
                              }
                          }
                      });
                  }
              });
              
              // 2. Fusion des données scalaires/objets (Manual Balances)
              if (localData.manualBalances) {
                  const localTs = Number(localData.lastUpdated || 0);
                  const cloudTs = Number(appState.lastUpdated || 0);
                  if (localTs > cloudTs) {
                      appState.manualBalances = localData.manualBalances;
                      mergeCount++;
                  }
              }
              
              if (mergeCount > 0) {
                console.log(`☁️ Fusion effectuée: ${mergeCount} éléments synchronisés.`);
                appState.lastUpdated = Date.now();
                await saveToCloud();
              }
            }
          } catch (e) {
            console.warn('Fusion locale/cloud impossible', e);
          }
          
          // Refresh UI after all data loaded and merged
          if (typeof renderTables === 'function') renderTables();
        } else {
          console.log('â˜ï¸ Aucun document cloud pour cet identifiant, initialisation...');
          ensureInitialData();
          normalizeAppState();
          await saveToCloud();
        }
      } catch (err) {
        console.error('Erreur chargement cloud:', err);
        showToast('Connexion instable : passage en mode hors ligne', 'warning');
        loadFromLocalStorage();
      }
    }

        async function syncGranularToCloud() {
        const db = getDb();
        if (!db) {
            console.error("syncGranularToCloud: DB not initialized");
            return;
        }
        
        // Initialize lastSyncedState if needed
        if (!appState.sync) appState.sync = {};
        if (!appState.sync.itemSnapshots) appState.sync.itemSnapshots = {};

        console.log("Starting granular sync (Delta Optimized)...");
        const collections = {
            clients: appState.clients,
            offers: appState.offers,
            transactions: appState.transactions,
            todoTransactions: appState.todoTransactions,
            payments: appState.payments,
            usdPurchases: appState.usdPurchases,
            expenses: appState.expenses,
            clientRequests: appState.clientRequests,
            recurringExpenses: appState.recurringExpenses,
            usdtExpenses: appState.usdtExpenses
        };
        const promises = [];
        let totalWrites = 0;
        let totalSkipped = 0;

        for (const [colName, items] of Object.entries(collections)) {
            if (!Array.isArray(items)) continue;
            
            // Ensure snapshot container exists for this collection
            if (!appState.sync.itemSnapshots[colName]) appState.sync.itemSnapshots[colName] = {};
            
            items.forEach(item => {
                if (!item || typeof item !== 'object') return;
                
                // Generate ID if missing
                if (!item.id) item.id = generateId();
                
                // CRITICAL: Ensure item is scoped to current user
                item.uid = auth.currentUser ? auth.currentUser.uid : null;
                if (!item.updatedAt) item.updatedAt = Date.now();

                // Compute signature of current item
                const currentSig = JSON.stringify(item);
                
                // Compare with last successfully synced signature
                if (appState.sync.itemSnapshots[colName][item.id] === currentSig) {
                    totalSkipped++;
                    return; // Skip this item, it's already 100% synced
                }

                let docRef;
                if (item.id && typeof item.id === 'string' && item.id.indexOf('/') === -1) {
                    docRef = db.collection(colName).doc(item.id);
                } else {
                    docRef = db.collection(colName).doc();
                    item.id = docRef.id;
                }
                
                // Add to write queue
                promises.push(
                    docRef.set(item)
                    .then(() => {
                        // On success, update the snapshot signature
                        appState.sync.itemSnapshots[colName][item.id] = currentSig;
                        totalWrites++;
                    })
                    .catch(e => {
                        console.error(`Failed to sync item in ${colName}:`, item, e);
                        if (e.code === 'resource-exhausted') {
                             throw e; 
                        }
                    })
                );
            });
        }
        
        try {
            if (promises.length > 0) {
                console.log(`Sending ${promises.length} updates to Cloud...`);
                await Promise.all(promises);
                console.log(`Delta Sync Complete: ${totalWrites} written, ${totalSkipped} skipped.`);
            }

            // --- Handle Deletions ---
            if (appState.sync && appState.sync.pendingDeletions && appState.sync.pendingDeletions.length > 0) {
                console.log(`Processing ${appState.sync.pendingDeletions.length} deletions...`);
                const deletePromises = appState.sync.pendingDeletions.map(async (del) => {
                    try {
                        await db.collection(del.col).doc(del.id).delete();
                        if (appState.sync.itemSnapshots[del.col]) {
                            delete appState.sync.itemSnapshots[del.col][del.id];
                        }
                    } catch(e) {
                        console.error(`Failed to delete ${del.id} from ${del.col}:`, e);
                    }
                });
                await Promise.all(deletePromises);
                appState.sync.pendingDeletions = []; // Clear queue after success
            }
        } catch(e) {
            if (e.code === 'resource-exhausted') {
                console.error("Quota exceeded during granular sync");
                throw e; 
            }
        }
    }

    async function loadGranularFromCloud() {
        const db = getDb();
        const uid = auth.currentUser ? auth.currentUser.uid : null;
        if (!db || !uid) return;

        const loadCol = async (col) => {
            const resultsMap = new Map();
            try {
                // 1. Charger les données taguées avec l'UID de l'utilisateur
                const snapUid = await db.collection(col).where('uid', '==', uid).get();
                snapUid.forEach(d => resultsMap.set(d.id || d.ref.id, d.data()));
                
                // 2. Fallback Legacy : Charger toutes les données qui n'ont PAS d'UID
                // C'est nécessaire pour récupérer les données créées avant la mise à jour multi-utilisateur.
                const snapAll = await db.collection(col).get();
                snapAll.forEach(d => {
                    const data = d.data();
                    if (!data.uid && !resultsMap.has(d.id || d.ref.id)) {
                        resultsMap.set(d.id || d.ref.id, data);
                    }
                });

                // --- FEATURE: Auto-Update BuyRate from Last USD Purchase ---
                if (col === 'usdPurchases') {
                    const purchases = Array.from(resultsMap.values());
                    if (purchases.length > 0) {
                        // Sort by date desc (assuming date is YYYY-MM-DD or similar sortable string)
                        purchases.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
                        const lastPurchase = purchases[0];
                        if (lastPurchase && lastPurchase.rate) {
                            console.log('Auto-updating BuyRate from last purchase:', lastPurchase.rate);
                            appState.settings.defaultBuyRate = Number(lastPurchase.rate);
                        }
                    }
                }
                
                return Array.from(resultsMap.values());
            } catch (e) { 
                console.warn('Error loading ' + col + ':', e); 
                return [];
            }
        };
        const [clients, offers, transactions, todoTransactions, payments, usdPurchases, expenses, clientRequests, recurringExpenses, usdtExpenses] = await Promise.all([
            loadCol('clients'), loadCol('offers'), loadCol('transactions'), loadCol('todoTransactions'),
            loadCol('payments'), loadCol('usdPurchases'), loadCol('expenses'),
            loadCol('clientRequests'), loadCol('recurringExpenses'), loadCol('usdtExpenses')
        ]);
        
        const merge = (local, cloud) => {
            if (!Array.isArray(local)) local = [];
            const localMap = new Map(local.map(i => [i.id, i]));
            
            cloud.forEach(cItem => {
                if (cItem && cItem.id) {
                    if (!localMap.has(cItem.id)) {
                        localMap.set(cItem.id, cItem);
                    } else {
                        // Conflict resolution: keep the newest one
                        const localItem = localMap.get(cItem.id);
                        if ((cItem.updatedAt || 0) > (localItem.updatedAt || 0)) {
                            localMap.set(cItem.id, cItem);
                        }
                    }
                }
            });
            
            return Array.from(localMap.values());
        };

        appState.clients = merge(appState.clients, clients);
        appState.offers = merge(appState.offers, offers);
        appState.transactions = merge(appState.transactions, transactions);
        appState.todoTransactions = merge(appState.todoTransactions, todoTransactions);
        appState.payments = merge(appState.payments, payments);
        appState.usdPurchases = merge(appState.usdPurchases, usdPurchases);
        appState.expenses = merge(appState.expenses, expenses);
        appState.clientRequests = merge(appState.clientRequests, clientRequests);
        appState.recurringExpenses = merge(appState.recurringExpenses, recurringExpenses);
        appState.usdtExpenses = merge(appState.usdtExpenses, usdtExpenses);
        console.log('Merged granular data from Firebase');
    }

    function buildCloudSnapshot() {
      const snapshot = {
        settings: appState.settings || {},
        manualBalances: appState.manualBalances || { liquide: 0, baridimob: 0, usdt: 0 },
        lastUpdated: appState.lastUpdated || Date.now(),
        sync: {
          retryDelayMs: appState.sync?.retryDelayMs || 5000,
          throttleMs: appState.syncThrottleMs || 2000
        }
      };
      // On ne met PAS les grosses listes (clients, transactions, images, etc.)
      // Elles sont déjà synchronisées via les collections Firestore
      return snapshot;
    }

    async function saveToCloud() {
      try {
        const uid = getCloudUid();
        const db = getDb();
        if (!db) throw new Error('Base de données non initialisée');
        
        // Employee logic: Only save expenses if employee
        if (appState.session && appState.session.type === 'employee') {
             // Employees can only save their expenses to their collection or global if allowed
             // For now, we will rely on syncGranularToCloud to push new items
             await syncGranularToCloud();
             console.log('☁️ Données employé synchronisées');
             appState.sync.pendingCloudSave = false;
             updateSyncIndicator();
             return;
        }

        normalizeAppState();
        appState.lastUpdated = Date.now();
        const data = buildCloudSnapshot();
        await db.collection('users').doc(uid).set({ data }, { merge: true });
        await syncGranularToCloud();
        console.log('☁️ Données sauvegardées sur Firebase');
        appState.sync.pendingCloudSave = false;
        updateSyncIndicator();
        // showToast('Synchronisation Cloud réussie', 'success'); // Moins intrusif
      } catch (err) {
        console.error('Erreur sauvegarde cloud:', err);
        if (err.code === 'resource-exhausted') {
            showToast('Quota Firebase dépassé (Trop de synchronisations). Réessayez demain.', 'error');
        } else {
            // showToast('Mode hors ligne : sauvegarde locale effectuée', 'warning');
        }
        saveToLocalStorage();
        appState.sync.pendingCloudSave = true;
        updateSyncIndicator();
      }
    }

    function scheduleCloudRetry() {
      if (!appState.sync.pendingCloudSave) return;
      if (!(appState.settings.storageMode === 'cloud')) return;
      setTimeout(async () => {
        if (appState.sync.pendingCloudSave) {
          await saveToCloud();
          scheduleCloudRetry();
        }
      }, appState.sync.retryDelayMs || 5000);
    }

    async function autoSave() {
      if (!appState.settings.autoSaveEnabled) return;
      appState.lastUpdated = Date.now();
      saveToLocalStorage();
      enqueueCloudSave();
    }

    function enqueueCloudSave() {
      appState.syncQueue.push({ ts: Date.now() });
      if (appState.syncTimer) return;
      appState.syncTimer = setTimeout(async () => {
        appState.syncTimer = null;
        if (appState.settings.storageMode === 'cloud') {
          await saveToCloud();
          appState.syncQueue = [];
          scheduleCloudRetry();
        }
        updateSyncIndicator();
      }, appState.syncThrottleMs || 2000);
      updateSyncIndicator();
    }

    // === DASHBOARD / RENDU ===
    function renderClientsTable() {
      const tbody = document.getElementById('clientsTableBody');
      const searchInput = document.getElementById('clientTableSearch');
      const searchTerm = (searchInput ? searchInput.value : '').toLowerCase();
      if (!tbody) return;
      tbody.innerHTML = '';

      let totalSpent = 0;

      // Trier par unpaid DESC, puis name ASC
      const sorted = [...appState.clients].sort((a, b) => {
        const unpaidA = Number(a.unpaid || 0);
        const unpaidB = Number(b.unpaid || 0);
        if (unpaidB !== unpaidA) return unpaidB - unpaidA;
        return (a.name || '').localeCompare(b.name || '');
      });

      const filtered = sorted.filter(c => {
         const search = (c.name || '') + (c.readableId || '') + (c.phone || '');
         return search.toLowerCase().includes(searchTerm);
      });

      const frag = document.createDocumentFragment();
      filtered.forEach(client => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 border-b';
        
        const spent = Number(client.totalSpent || 0);
        const unpaid = Number(client.unpaid || 0);
        totalSpent += spent;
        
        const waLink = (typeof buildClientWhatsAppLink === 'function') ? buildClientWhatsAppLink(client) : '';
        const igLink = (typeof buildClientInstagramLink === 'function') ? buildClientInstagramLink(client) : '';
        
        // Affichage de l'ID s'il existe
        const idBadge = client.readableId 
            ? `<span class="inline-block px-2 py-0.5 text-[10px] font-mono bg-gray-100 text-gray-600 rounded mr-2 border border-gray-200">${client.readableId}</span>` 
            : '';

        row.innerHTML = `
          <td class="p-4">
            <div class="flex items-center">
              ${idBadge}
              <div class="font-bold text-gray-800">${client.name}</div>
            </div>
            <div class="text-xs text-gray-500 mt-1">${client.contact || ''}</div>
          </td>
          <td class="p-4 text-center">
             <div class="flex justify-center items-center gap-2">
              ${waLink ? `<a href="${waLink}" target="_blank" class="text-green-600 hover:text-green-800 transition-colors p-1" title="WhatsApp"><i class="fab fa-whatsapp text-lg"></i></a>` : ''}
              ${igLink ? `<a href="${igLink}" target="_blank" class="text-pink-600 hover:text-pink-800 transition-colors p-1" title="Instagram"><i class="fab fa-instagram text-lg"></i></a>` : ''}
            </div>
          </td>
          <td class="p-4 text-emerald-600 font-bold text-right">${formatCurrency(spent)}</td>
          <td class="p-4 font-bold text-right ${unpaid > 0 ? 'text-red-600 bg-red-50 rounded-lg' : 'text-gray-400'}">${formatCurrency(unpaid)}</td>
          <td class="p-4 text-gray-600 text-center">${client.transactionsCount || 0}</td>
          <td class="p-4 text-right">
            <button onclick="editClient('${client.id}')" class="text-blue-600 hover:text-blue-800 mr-3 p-2 rounded hover:bg-blue-50 transition-colors" title="Modifier">
              <i class="fas fa-edit"></i>
            </button>
            <button onclick="deleteClient('${client.id}')" class="text-red-600 hover:text-red-800 p-2 rounded hover:bg-red-50 transition-colors" title="Supprimer">
              <i class="fas fa-trash-alt"></i>
            </button>
          </td>
        `;
        frag.appendChild(row);
      });
      tbody.appendChild(frag);

      const summary = document.getElementById('clientsSummary');
      const totalSpan = document.getElementById('clientsTotalSpent');
      if (summary) summary.textContent = `${filtered.length} clients`;
      if (totalSpan) totalSpan.textContent = `Total dépensé: ${formatCurrency(totalSpent)}`;
    }

        function generateInvoice(transactionId) {
        const t = appState.transactions.find(tx => tx.id === transactionId);
        if (!t) return;
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Header
        doc.setFillColor(33, 150, 243); // Blue
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text("FACTURE", 105, 25, { align: "center" });
        
        // Company Info
        doc.setTextColor(50, 50, 50);
        doc.setFontSize(10);
        doc.text("Hichem Sponsor", 14, 50);
        doc.text("Service de Sponsoring Digital", 14, 55);
        
        // Invoice Details
        doc.setFontSize(10);
        const dateStr = (t.date || '').slice(0, 10);
        doc.text(`Date: ${dateStr}`, 150, 50);
        doc.text(`N° Facture: #${t.id.slice(-6).toUpperCase()}`, 150, 55);
        
        // Client Info
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text("Client:", 14, 70);
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        doc.text(t.clientName || "Client Inconnu", 14, 76);
        
        // Table
        const tableData = [
            [
                t.offerName || "Service Sponsoring", 
                t.duration || "N/A", 
                formatCurrency(t.priceDzd || 0)
            ]
        ];
        
        doc.autoTable({
            startY: 90,
            head: [['Description', 'Durée', 'Montant']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [33, 150, 243] },
            styles: { fontSize: 10, cellPadding: 4 },
        });
        
        // Total
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text(`Total à payer: ${formatCurrency(t.priceDzd || 0)}`, 140, finalY, { align: "left" });
        
        // Status
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        const status = t.paid ? "PAYÉ" : "EN ATTENTE";
        doc.setTextColor(t.paid ? 0 : 200, t.paid ? 150 : 0, 0); // Green or Red
        doc.text(`Statut: ${status}`, 14, finalY);
        
        // Footer
        doc.setTextColor(150, 150, 150);
        doc.setFontSize(8);
        doc.text("Merci de votre confiance.", 105, 280, { align: "center" });
        
        doc.save(`Facture_${t.clientName}_${dateStr}.pdf`);
    }

    function renderTransactionsTable() {
      const tbody = document.getElementById('transactionsTableBody');
      if (!tbody) return;
      tbody.innerHTML = '';

      let totalProfit = 0;
      const isEmployee = (appState.session && appState.session.type === 'employee');

      const filteredTransactions = filterTransactions().sort((a, b) => {
        const dateA = a.date || '';
        const dateB = b.date || '';
        const cmpDate = dateB.localeCompare(dateA);
        if (cmpDate !== 0) return cmpDate;
        return (b.createdAt || 0) - (a.createdAt || 0);
      });

      const frag = document.createDocumentFragment();
      filteredTransactions.forEach(t => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 border-b';
        const profit = Number(t.profit || 0);
        const buyRate = Number(t.buyRate || (t.amount ? (t.totalDzd / t.amount) : 340));
        totalProfit += profit;
        
        const costCell = isEmployee ? '' : `<td class="p-4 text-gray-700 text-right font-mono">${formatCurrency(t.totalDzd || 0)}</td>`;
        const profitCell = isEmployee ? '' : `<td class="p-4 text-emerald-600 font-semibold text-right">${formatCurrency(profit)}</td>`;
        
        const statusTag = t.status === 'problem' 
          ? '<span class="ml-2 px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded-full uppercase">Problème</span>' 
          : '';

        const paidBadge = t.paid 
          ? '<span class="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-lg border border-green-200 uppercase">Payé</span>' 
          : '<span class="px-2 py-1 bg-red-100 text-red-700 text-[10px] font-bold rounded-lg border border-red-200 uppercase">Impayé</span>';

        // Affichage de l'ID s'il existe
        const idBadge = t.readableId 
            ? `<div class="text-[10px] font-mono text-gray-500 bg-gray-100 inline-block px-1 rounded border mb-1">${t.readableId}</div>` 
            : '';

        row.innerHTML = `
          <td class="p-4 text-gray-700">
             ${idBadge}
             <div>${formatDate(t.date)}</div>
          </td>
          <td class="p-4 text-gray-800 font-medium">
            ${t.clientName || '-'}
            ${statusTag}
          </td>
          <td class="p-4 text-gray-700">${t.offerName || '-'}</td>
          <td class="p-4 text-gray-700 text-right font-mono">${t.amount || 0} $ <br><span class="text-[10px] text-gray-400">@ ${buyRate.toFixed(2)}</span></td>
          <td class="p-4 text-gray-700 text-right font-mono">${formatCurrency(t.priceDzd || 0)}</td>
          ${costCell}
          ${profitCell}
          <td class="p-4 text-gray-600">${t.duration || '-'}</td>
          <td class="p-4 text-center">
            <button onclick="toggleTransactionPayment('${t.id}')" title="Cliquer pour changer le statut" class="hover:scale-105 transition-transform">
              ${paidBadge}
            </button>
          </td>
          <td class="p-4 flex gap-2 justify-center">
            <button onclick="generateInvoice('${t.id}')" class="text-gray-600 hover:text-blue-600 transition-colors p-2 rounded hover:bg-blue-50" title="Facture PDF">
              <i class="fas fa-file-invoice"></i>
            </button>
            <button onclick="editTransaction('${t.id}')" class="text-blue-600 hover:text-blue-800 transition-colors p-2 rounded hover:bg-blue-50" title="Modifier">
              <i class="fas fa-edit"></i>
            </button>
            <button onclick="deleteTransaction('${t.id}')" class="text-red-600 hover:text-red-800 transition-colors p-2 rounded hover:bg-red-50" title="Supprimer">
              <i class="fas fa-trash-alt"></i>
            </button>
          </td>
        `;
        frag.appendChild(row);
      });
      tbody.appendChild(frag);

      const summary = document.getElementById('transactionsSummary');
      const totalSpan = document.getElementById('transactionsTotalProfit');
      if (summary) summary.textContent = `${filteredTransactions.length} transactions`;
      if (totalSpan) {
          totalSpan.textContent = isEmployee ? '' : `Profit total: ${formatCurrency(totalProfit)}`;
      }
      
      const profitHeader = document.getElementById('profitHeaderHistory');
      if (profitHeader) {
        profitHeader.style.display = isEmployee ? 'none' : '';
      }
      const costHeader = document.getElementById('costHeaderHistory');
      if (costHeader) {
        costHeader.style.display = isEmployee ? 'none' : '';
      }
    }

    function exportTransactions() {
      const rows = [
        ['Date', 'Client', 'Offre', 'Montant ($)', 'Prix Vente (DZD)', 'Profit (DZD)', 'Durée', 'Payé']
      ];
      
      // Use filtered transactions to respect user's view
      const transactions = (typeof filterTransactions === 'function' ? filterTransactions() : appState.transactions) || [];
      
      transactions.forEach(t => {
        const date = (t.date || '').slice(0, 10);
        const clientName = (t.clientName || 'Inconnu').replace(/"/g, '""');
        const offerName = (t.offerName || 'Inconnu').replace(/"/g, '""');
        const amount = t.amount || 0;
        const priceDzd = t.priceDzd || 0;
        const profit = t.profit || 0;
        const duration = (t.duration || '').replace(/"/g, '""');
        const paid = t.paid ? 'Oui' : 'Non';
        
        rows.push([date, `"${clientName}"`, `"${offerName}"`, amount, priceDzd, profit, `"${duration}"`, paid]);
      });
      
      let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // Add BOM for Excel support
      rows.forEach(rowArray => {
        const row = rowArray.join(",");
        csvContent += row + "\r\n";
      });
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `transactions_export_${getLocalDateString()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    let paymentsSortField = 'date';
    let paymentsSortDirection = 'desc';
    let usdPurchasesSortField = 'date';
    let usdPurchasesSortDirection = 'desc';

    function changePaymentsSortField(field) {
      paymentsSortField = field || 'date';
      renderPaymentsTable();
    }

    function togglePaymentsSortDirection() {
      paymentsSortDirection = paymentsSortDirection === 'asc' ? 'desc' : 'asc';
      renderPaymentsTable();
    }

    function changeUsdSortField(field) {
      usdPurchasesSortField = field || 'date';
      renderUsdPurchasesTable();
    }

    function toggleUsdSortDirection() {
      usdPurchasesSortDirection = usdPurchasesSortDirection === 'asc' ? 'desc' : 'asc';
      renderUsdPurchasesTable();
    }

    function renderPaymentsTable() {
      const tbody = document.getElementById('paymentsTableBody');
      if (!tbody) return;
      tbody.innerHTML = '';

      let total = 0;
      // CRITICAL: Utiliser le bon ID de l'input de recherche
      const search = document.getElementById('paymentSearchClient')?.value.toLowerCase() || '';

      // Copier proprement le tableau
      let payments = [...(appState.payments || [])];
      
      // Filtrage
      if (search) {
        payments = payments.filter(p => (p.clientName || '').toLowerCase().includes(search));
      }

      // Tri
      payments.sort((a, b) => {
        let cmp = 0;
        if (paymentsSortField === 'amount') {
          const aVal = Number(a.amount || 0);
          const bVal = Number(b.amount || 0);
          cmp = aVal - bVal;
        } else {
          const dateA = a.date || '';
          const dateB = b.date || '';
          cmp = dateA.localeCompare(dateB);
        }
        if (paymentsSortDirection === 'desc') cmp = -cmp;
        if (cmp !== 0) return cmp;
        const idA = (a.id || '').toString();
        const idB = (b.id || '').toString();
        return idB.localeCompare(idA);
      });

      const frag = document.createDocumentFragment();
      
      if (payments.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-gray-500">Aucun paiement trouvé</td></tr>`;
        return;
      }

      payments.forEach(p => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        const amount = Number(p.amount || 0);
        total += amount;
        
        // Formatter la date
        const dateStr = formatDate(p.date);
        
        row.innerHTML = `
          <td class="p-4 text-gray-700 whitespace-nowrap">${dateStr}</td>
          <td class="p-4 text-gray-800 font-medium">${p.clientName || '-'}</td>
          <td class="p-4 text-green-600 font-semibold">${formatCurrency(amount)}</td>
          <td class="p-4 text-gray-700">${p.method || '-'}</td>
          <td class="p-4 text-gray-700">
             <span class="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg border border-green-200 uppercase">Reçu</span>
          </td>
          <td class="p-4 text-gray-500 text-sm max-w-xs truncate" title="${p.note || ''}">${p.note || '-'}</td>
          <td class="p-4 text-center">
             <button onclick="deletePayment('${p.id}')" class="text-red-500 hover:text-red-700 transition-colors" title="Supprimer">
                <i class="fas fa-trash-alt"></i>
             </button>
          </td>
        `;
        row.dataset.paymentId = p.id;
        frag.appendChild(row);
      });
      tbody.appendChild(frag);

      const summary = document.getElementById('paymentsSummary');
      const totalSpan = document.getElementById('paymentsTotal');
      if (summary) summary.textContent = `${payments.length} paiements`;
      if (totalSpan) totalSpan.textContent = `Total: ${formatCurrency(total)}`;
    }

 function renderUsdPurchasesTable() {
      const tbody = document.getElementById('usdPurchasesTableBody');
      if (!tbody) return;
      tbody.innerHTML = '';

      let totalUsd = 0;
      const search = document.getElementById('usdSearchSource')?.value.toLowerCase() || '';

      let purchases = [...(appState.usdPurchases || [])];
      
      // Filtrage
      if (search) {
          purchases = purchases.filter(p => (p.source || '').toLowerCase().includes(search));
      }

      purchases.sort((a, b) => {
        let cmp = 0;
        if (usdPurchasesSortField === 'amount') {
          const aVal = Number(a.amount || 0);
          const bVal = Number(b.amount || 0);
          cmp = aVal - bVal;
        } else {
          const dateA = a.date || '';
          const dateB = b.date || '';
          cmp = dateA.localeCompare(dateB);
        }
        if (usdPurchasesSortDirection === 'desc') cmp = -cmp;
        if (cmp !== 0) return cmp;
        const idA = (a.id || '').toString();
        const idB = (b.id || '').toString();
        return idB.localeCompare(idA);
      });

      const frag = document.createDocumentFragment();
      purchases.forEach(p => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        const amount = Number(p.amount || 0);
        totalUsd += amount;
        row.innerHTML = `
          <td class="p-4 text-gray-700">${formatDate(p.date)}</td>
          <td class="p-4 text-gray-800">${safeToFixed(amount, 2)} $</td>
          <td class="p-4 text-gray-700">${p.rate || 0}</td>
          <td class="p-4 text-gray-700">${formatCurrency(p.totalDzd || 0)}</td>
          <td class="p-4 text-gray-700">${p.source || '-'}</td>
          <td class="p-4">
            <button onclick="deleteUsdPurchase('${p.id}')" class="text-red-600 hover:text-red-800">
              <i class="fas fa-trash-alt"></i>
            </button>
          </td>
        `;
        row.dataset.usdId = p.id;
        frag.appendChild(row);
      });
      tbody.appendChild(frag);

      const summary = document.getElementById('usdPurchasesSummary');
      const totalSpan = document.getElementById('usdPurchasesTotal');
      if (summary) summary.textContent = `${purchases.length} achats`;
      if (totalSpan) totalSpan.textContent = `Total USD: ${safeToFixed(totalUsd, 2)}`;
    }

  function renderExpensesTable() {
      const tbody = document.getElementById('expensesTableBody');
      if (!tbody) return;
      if (typeof applyRecurringExpensesForCurrentMonth === 'function') applyRecurringExpensesForCurrentMonth();
      tbody.innerHTML = '';

      const filterMonth = document.getElementById('expenseFilterMonth')?.value;
      const search = document.getElementById('expenseSearch')?.value.toLowerCase() || '';
      
      const isEmployee = (appState.session && appState.session.type === 'employee');
      const currentUserId = appState.session && appState.session.user ? appState.session.user.uid : null;
      const currentUserName = appState.session && appState.session.user ? String(appState.session.user.displayName || appState.session.user.email || '').toLowerCase() : '';

      let expenses = appState.expenses || [];
      if (!Array.isArray(expenses)) expenses = [];

      // Filter by Month and Search
      expenses = expenses.filter(e => {
          let match = true;
          if (filterMonth) {
              if (e.date) match = e.date.startsWith(filterMonth);
              else match = false;
          }
          if (match && search) {
              match = (e.note || '').toLowerCase().includes(search) || (e.category || '').toLowerCase().includes(search);
          }
          return match;
      });
      
      if (isEmployee) {
          expenses = expenses.filter(e => {
            const byUid = currentUserId && e && e.uid && String(e.uid) === String(currentUserId);
            const byName = currentUserName && e && e.addedBy && String(e.addedBy).toLowerCase() === currentUserName;
            return byUid || byName;
          });
      }

      let total = 0;
      let monthTotal = 0;
      const now = new Date();
      const month = now.getMonth();
      const year = now.getFullYear();
      const frag = document.createDocumentFragment();
      expenses.forEach(e => {
        const amount = Number(e.amount || 0);
        total += amount;
        try {
          const d = new Date(e.date || now);
          if (d.getMonth() === month && d.getFullYear() === year) {
            monthTotal += amount;
          }
        } catch (err) {}
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        
        // Show who added the expense (for admin view)
        const addedByBadge = e.addedBy ? `<span class="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded ml-2">${e.addedBy}</span>` : '';

        row.innerHTML = `
          <td class="p-4 text-gray-700 whitespace-nowrap">${formatDate(e.date)}</td>
          <td class="p-4 font-medium text-gray-800">${e.category || '-'}${!isEmployee ? addedByBadge : ''}</td>
          <td class="p-4 text-gray-700">${e.account || '-'}</td>
          <td class="p-4 font-bold text-red-600">${formatCurrency(amount)}</td>
          <td class="p-4 text-gray-600 text-sm max-w-xs truncate" title="${e.note || ''}">${e.note || '-'}</td>
          <td class="p-4 text-center">
            <button onclick="deleteExpense('${e.id}')" class="text-red-500 hover:text-red-700 transition-colors" title="Supprimer">
              <i class="fas fa-trash-alt"></i>
            </button>
          </td>
        `;
        frag.appendChild(row);
      });
      tbody.appendChild(frag);

      const summary = document.getElementById('expensesSummary');
      const totalSpan = document.getElementById('expensesTotal');
      const monthSpan = document.getElementById('expensesMonthTotal');
      if (summary) summary.textContent = `${expenses.length} frais`;
      if (totalSpan) totalSpan.textContent = `Total: ${formatCurrency(total)}`;
      if (monthSpan) monthSpan.textContent = `Total mensuel: ${formatCurrency(monthTotal)}`;
    }

  function renderUsdtExpensesTable() {
    try {
      const tbody = document.getElementById('usdtExpensesTableBody');
      if (!tbody) return;
      tbody.innerHTML = '';

      const filterMonth = document.getElementById('usdtExpenseFilterMonth')?.value;
      const search = document.getElementById('usdtExpenseSearch')?.value.toLowerCase() || '';
      let expenses = appState.usdtExpenses || [];
      if (!Array.isArray(expenses)) expenses = [];

      // Filtrage
      expenses = expenses.filter(e => {
          if (!e) return false;
          let match = true;
          if (filterMonth) {
              if (e.month) match = e.month === filterMonth;
              else if (e.date) match = String(e.date).startsWith(filterMonth);
              else match = false;
          }
          if (match && search) {
              match = (e.note || '').toLowerCase().includes(search);
          }
          return match;
      });

      let totalValueDzd = 0;
      let totalDiffDzd = 0;

      const frag = document.createDocumentFragment();
      expenses.forEach(e => {
        if (!e) return;
        const amount = Number(e.amount || 0);
        const buyRate = Number(e.buyRate || 0);
        const spendRate = Number(e.spendRate || 0);
        const costDzd = Number(e.costDzd || amount * buyRate);
        const valueDzd = Number(e.valueDzd || amount * spendRate);
        const diffDzd = Number(e.diffDzd || (valueDzd - costDzd));
        totalValueDzd += valueDzd;
        totalDiffDzd += diffDzd;

        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        const diffColor = diffDzd >= 0 ? 'text-green-600' : 'text-red-600';
        
        let dateStr = '-';
        try {
          if (e.date) dateStr = formatDate(e.date);
        } catch (err) { dateStr = e.date || '-'; }

        row.innerHTML = `
          <td class="p-4 text-gray-700">${dateStr}</td>
          <td class="p-4 text-gray-800">${safeToFixed(amount, 2)} USDT</td>
          <td class="p-4 text-gray-700">${safeToFixed(buyRate, 2)}</td>
          <td class="p-4 text-gray-700">${safeToFixed(spendRate, 2)}</td>
          <td class="p-4 text-red-600 font-semibold">${formatCurrency(costDzd)}</td>
          <td class="p-4 text-green-600 font-semibold">${formatCurrency(valueDzd)}</td>
          <td class="p-4 font-bold ${diffColor}">${formatCurrency(diffDzd)}</td>
          <td class="p-4 text-gray-700">${e.month || '-'}</td>
          <td class="p-4 text-gray-600">${e.note || '-'}</td>
          <td class="p-4">
            <button onclick="deleteUsdtExpense('${e.id}')" class="text-red-600 hover:text-red-800">
              <i class="fas fa-trash-alt"></i>
            </button>
          </td>
        `;
        frag.appendChild(row);
      });
      tbody.appendChild(frag);

      const summary = document.getElementById('usdtExpensesSummary');
      const totalSpan = document.getElementById('usdtExpensesTotal');
      const diffTotalSpan = document.getElementById('usdtDiffTotal');

      if (summary) summary.textContent = `${expenses.length} dépenses USDT`;
      if (totalSpan) totalSpan.textContent = `Total valeur: ${formatCurrency(totalValueDzd)}`;
      if (diffTotalSpan) {
        diffTotalSpan.textContent = formatCurrency(totalDiffDzd);
        diffTotalSpan.className = `text-2xl font-bold ${totalDiffDzd >= 0 ? 'text-green-600' : 'text-red-600'}`;
      }
    } catch (error) {
      console.error("Erreur renderUsdtExpensesTable:", error);
      showToast("Erreur d'affichage des dépenses USDT", "error");
    }
  }

        function renderRecentTransactions() {
      const container = document.getElementById('recentTransactions');
      const activityCount = document.getElementById('activityCount');
      const filterEl = document.getElementById('recentFilter');
      if (!container) return;

      container.innerHTML = '';
      const now = new Date();
      const todayStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
      
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth()+1).padStart(2,'0')}-${String(yesterday.getDate()).padStart(2,'0')}`;
      
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - 7);
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const mode = filterEl ? filterEl.value : 'today';
      const isInPeriod = (dStr) => {
        const dateStr = dStr || todayStr;
        if (mode === 'today') return dateStr === todayStr;
        if (mode === 'recent') return dateStr === todayStr || dateStr === yesterdayStr;
        if (mode === 'yesterday') return dateStr === yesterdayStr;
        
        const parts = dateStr.split('-');
        const d = new Date(parts[0], parts[1]-1, parts[2]);
        
        if (mode === 'week') return d >= startOfWeek;
        if (mode === 'month') return d >= startOfMonth;
        return true;
      };
      const latest = [...(appState.transactions || [])]
        .filter(t => t.status !== 'problem' && isInPeriod(t.date))
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      const isEmployee = (appState.session && appState.session.type === 'employee');

      if (!latest.length) {
        container.innerHTML = `
          <div class="text-center py-10">
            <i class="fas fa-exchange-alt text-gray-300 text-4xl mb-3"></i>
            <p class="text-gray-400 italic">Aucune transaction dans la période</p>
            <p class="text-sm text-gray-500 mt-2">Les transactions sélectionnées apparaÃ®tront ici</p>
          </div>
        `;
        if (activityCount) activityCount.textContent = '0 transaction';
        return;
      }

      latest.forEach(t => {
        const div = document.createElement('div');
        div.className = 'flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all';
        
        const profitDisplay = isEmployee ? '' : `<p class="font-bold text-emerald-600">${formatCurrency(t.profit || 0)}</p>`;

        div.innerHTML = `
          <div>
            <p class="font-semibold text-gray-800">${t.clientName || 'Client inconnu'}</p>
            <p class="text-sm text-gray-500">${t.offerName || 'Offre'} â€¢ ${formatDate(t.date)}</p>
          </div>
          <div class="text-right">
            ${profitDisplay}
            <p class="text-xs text-gray-500">${t.amount || 0} $ â€¢ ${formatCurrency(t.totalDzd || 0)}</p>
          </div>
        `;
        container.appendChild(div);
      });

      if (activityCount) activityCount.textContent = `${latest.length} transactions`;
    }

    function renderTopClients() {
      const container = document.getElementById('topClientsList');
      if (!container) return;
      container.innerHTML = '';
      
      const w = appState.settings?.topClientsWeights || { spent: 0.7, transactions: 0.3, unpaid: -0.2 };
      const score = c => (Number(c.totalSpent || 0) * w.spent) + (Number(c.transactionsCount || 0) * w.transactions) + (Number(c.unpaid || 0) * w.unpaid);
      
      const clients = [...(appState.clients || [])]
        .sort((a, b) => score(b) - score(a))
        .slice(0, 10);

      if (!clients.length) {
        container.innerHTML = `
          <div class="text-center py-6 text-gray-400 col-span-full text-sm">Pas de clients à classer pour l'instant</div>
        `;
        return;
      }
      clients.forEach((c, idx) => {
        const div = document.createElement('div');
        div.className = 'flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl hover:bg-yellow-50 transition-all border border-transparent hover:border-yellow-100 group';
        
        let medalColor = 'text-gray-300';
        if (idx === 0) medalColor = 'text-yellow-500 text-xl';
        else if (idx === 1) medalColor = 'text-gray-400 text-lg';
        else if (idx === 2) medalColor = 'text-orange-400 text-lg';

        div.innerHTML = `
          <div class="mb-2 relative">
            <span class="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm font-black text-gray-800 border-2 border-gray-100 group-hover:border-yellow-200 transition-colors">${idx + 1}</span>
            ${idx < 3 ? `<i class="fas fa-crown absolute -top-3 -right-3 ${medalColor} transform rotate-12"></i>` : ''}
          </div>
          <p class="font-bold text-gray-800 text-center line-clamp-1 text-xs w-full">${c.name}</p>
          <p class="text-[10px] font-bold text-emerald-600 mt-1 uppercase tracking-wider">${formatCurrency(c.totalSpent || 0)}</p>
        `;
        container.appendChild(div);
      });
    }
    function recalculateClientStats() {
      const txns = appState.transactions || [];
      const pays = appState.payments || [];
      const spentMap = {};
      const countMap = {};
      const unpaidTxnMap = {};
      const payMap = {};

      txns.forEach(t => {
        const cid = t.clientId;
        if (!cid) return;
        if (t.status === 'problem') return; // Exclure les problèmes des stats client
        
        const price = Number(t.priceDzd || 0);
        spentMap[cid] = (spentMap[cid] || 0) + price;
        countMap[cid] = (countMap[cid] || 0) + 1;
        if (!t.paid) {
          unpaidTxnMap[cid] = (unpaidTxnMap[cid] || 0) + price;
        }
      });
      pays.forEach(p => {
        const cid = p.clientId;
        if (!cid) return;
        const amt = Number(p.amount || 0);
        payMap[cid] = (payMap[cid] || 0) + amt;
      });

      (appState.clients || []).forEach(c => {
        if (!c) return;
        const cid = c.id;
        const totalSpent = spentMap[cid] || 0;
        const txnCount = countMap[cid] || 0;
        const unpaidFromTxns = unpaidTxnMap[cid] || 0;
        const paidAmounts = payMap[cid] || 0;
        c.totalSpent = totalSpent;
        c.transactionsCount = txnCount;
        c.unpaid = unpaidFromTxns - paidAmounts;
      });
    }

    window.detectDuplicateClients = function() {
      const clients = appState.clients || [];
      const map = new Map();
      const duplicates = [];

      clients.forEach(c => {
        if (!c || !c.name) return;
        const key = c.name.toLowerCase().trim();
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(c);
      });

      map.forEach((list, key) => {
        if (list.length > 1) {
          duplicates.push(list);
        }
      });

      if (duplicates.length === 0) {
        showToast('Aucun doublon détecté', 'success');
        return;
      }

      if (!confirm(`Détecté ${duplicates.length} groupes de doublons (même nom). Voulez-vous les fusionner automatiquement ?`)) return;

      let mergedCount = 0;
      duplicates.forEach(list => {
        // Trier par date de création ou activité (garder le plus complet)
        // On garde celui qui a le plus d'infos (email, phone, etc.) ou le plus récent
        list.sort((a, b) => {
           const scoreA = (a.email ? 1 : 0) + (a.phone ? 1 : 0) + (Number(a.totalSpent) > 0 ? 1 : 0);
           const scoreB = (b.email ? 1 : 0) + (b.phone ? 1 : 0) + (Number(b.totalSpent) > 0 ? 1 : 0);
           return scoreB - scoreA;
        });
        
        const master = list[0];
        const others = list.slice(1);
        
        others.forEach(other => {
          // Fusionner les données
          master.totalSpent = Number(master.totalSpent || 0) + Number(other.totalSpent || 0);
          master.transactionsCount = Number(master.transactionsCount || 0) + Number(other.transactionsCount || 0);
          master.unpaid = Number(master.unpaid || 0) + Number(other.unpaid || 0);
          if (other.notes) master.notes = (master.notes || '') + '\n' + other.notes;
          if (other.email && !master.email) master.email = other.email;
          if (other.phone && !master.phone) master.phone = other.phone;

          // Mettre à jour les références dans Transactions, Paiements, Requests
          if (appState.transactions) {
            appState.transactions.forEach(t => { if (t.clientId === other.id) t.clientId = master.id; });
          }
          if (appState.payments) {
            appState.payments.forEach(p => { if (p.clientId === other.id) p.clientId = master.id; });
          }
          if (appState.clientRequests) {
            appState.clientRequests.forEach(r => { if (r.clientId === other.id) r.clientId = master.id; });
          }
          
          // Supprimer le doublon
          const idx = appState.clients.indexOf(other);
          if (idx > -1) appState.clients.splice(idx, 1);
        });
        mergedCount++;
      });
      
      recalculateClientStats();
      saveToLocalStorage();
      if (typeof enqueueCloudSave === 'function') enqueueCloudSave();
      renderTables();
      showToast(`${mergedCount} groupes de doublons fusionnés`, 'success');
    };

    function updateDashboard() {
      const transactions = appState.transactions || [];
      const expenses = appState.expenses || [];
      const usdtExpenses = appState.usdtExpenses || [];
      const payments = appState.payments || [];
      const usdPurchases = appState.usdPurchases || [];
      const isEmployee = (appState.session && appState.session.type === 'employee');
      
      const now = new Date();
      const todayIso = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;

      // Employee restriction: Hide Global Profit/Stats sections if employee
      const profitSection = document.getElementById('profitStatsSection');
      if (profitSection) {
          if (isEmployee) profitSection.classList.add('hidden');
          else profitSection.classList.remove('hidden');
      }
      
      const chartSection = document.getElementById('profitChartSection');
      if (chartSection) {
          if (isEmployee) chartSection.classList.add('hidden');
          else chartSection.classList.remove('hidden');
      }

      // Employee restriction: Hide sensitive cards
      const financeHeader = document.getElementById('financeHeaderSection');
      const financeCards = document.getElementById('financeCardsSection');
      const taxCard = document.getElementById('taxCard');
      const settingsTab = document.getElementById('tab-settings'); // Tab link button
      
      const cardProfitToday = document.getElementById('card-profit-today');
      const cardStockUsd = document.getElementById('card-stock-usd');

      if (financeHeader) financeHeader.classList.toggle('hidden', isEmployee);
      if (financeCards) financeCards.classList.toggle('hidden', isEmployee);
      if (taxCard) taxCard.classList.toggle('hidden', isEmployee);
      if (settingsTab) settingsTab.classList.toggle('hidden', isEmployee);
      
      if (cardProfitToday) cardProfitToday.classList.toggle('hidden', isEmployee);
      if (cardStockUsd) cardStockUsd.classList.toggle('hidden', isEmployee);
      
      // Hide Employees management section in settings for employees (double check)
      const empSection = document.getElementById('employeesSection');
      if (empSection) empSection.classList.toggle('hidden', isEmployee);
      if (!isEmployee) renderEmployeesTable();

      let todayProfit = 0;
      let weekProfit = 0;
      let totalProfit = 0;
      let monthProfitGross = 0;
      let monthExpenses = 0;
      let todayExpenses = 0;
      let weekExpenses = 0;
      let todayCount = 0;
      let weekCount = 0;

      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - 7);
      startOfWeek.setHours(0, 0, 0, 0);
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      // 1. Calculs sur les Transactions (Profit Brut)
      transactions.forEach(t => {
        const profit = Number(t.profit || 0);
        // Utiliser la date locale pour la comparaison
        const tDateParts = (t.date || todayIso).split('-');
        const d = new Date(tDateParts[0], tDateParts[1]-1, tDateParts[2]);
        
        totalProfit += profit;

        const txDayIso = t.date || todayIso;
        if (txDayIso === todayIso) {
          todayProfit += profit;
          todayCount++;
        }
        if (d >= startOfWeek) {
          weekProfit += profit;
          weekCount++;
        }
        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
          monthProfitGross += profit;
        }
      });

      // 2. Calculs des Dépenses Frais
      let totalGeneralExpenses = 0;
      expenses.forEach(e => {
        const amt = Number(e.amount || 0);
        totalGeneralExpenses += amt;
        
        const eDateIso = e.date || todayIso;
        let d;
        if (eDateIso.includes('-')) {
             const parts = eDateIso.split('-');
             d = new Date(parts[0], parts[1]-1, parts[2]);
        } else {
             d = new Date(eDateIso);
        }

        if (eDateIso === todayIso) {
             todayExpenses += amt;
        }
        if (d >= startOfWeek) {
             weekExpenses += amt;
        }
        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
          monthExpenses += amt;
        }
      });
      
      // Ajustement Net (Profit - Dépenses)
      todayProfit = Math.max(0, todayProfit - todayExpenses);
      weekProfit = Math.max(0, weekProfit - weekExpenses);

      // 3. Calculs des Dépenses USDT (Différence = Gain/Perte)
      let totalUsdtDiff = 0;
      usdtExpenses.forEach(e => {
        totalUsdtDiff += Number(e.diffDzd || 0);
      });

      // 4. Calcul du Profit Net Global
      // Profit Transactions + Différence USDT - Frais Généraux
      const globalNetProfit = totalProfit + totalUsdtDiff - totalGeneralExpenses;
      const monthNet = Math.max(0, monthProfitGross - monthExpenses);

      // 5. Calcul des Fonds de Société
      // Fond DZD = (Max(Transactions Payées, Paiements Reçus) par client) - (Frais + Achats USDT Cost)
      
      const clientPaidTxns = {};
      const clientPayments = {};
      
      transactions.forEach(t => {
          if (t.paid) {
              const cid = t.clientId || 'unknown';
              clientPaidTxns[cid] = (clientPaidTxns[cid] || 0) + Number(t.priceDzd || 0);
          }
      });
      
      payments.forEach(p => {
          const cid = p.clientId || 'unknown';
          clientPayments[cid] = (clientPayments[cid] || 0) + Number(p.amount || 0);
      });
      
      let totalRevenue = 0;
      const allClientIds = new Set([...Object.keys(clientPaidTxns), ...Object.keys(clientPayments)]);
      allClientIds.forEach(cid => {
          const paidTxn = clientPaidTxns[cid] || 0;
          const payment = clientPayments[cid] || 0;
          // On prend le maximum pour éviter le double comptage si l'utilisateur note les deux,
          // et pour couvrir les cas où il ne note que l'un des deux.
          totalRevenue += Math.max(paidTxn, payment);
      });

      // Recalculate Finance Balances
      recalculateFinanceBalances();

      // === AFFICHAGE ===

      const todayProfitEl = document.getElementById('todayProfit');
      const weekProfitEl = document.getElementById('weekProfit');
      const totalProfitEl = document.getElementById('totalProfit');
      const monthProfitEl = document.getElementById('monthProfitNet');
      const taxAmountEl = document.getElementById('taxAmount');
      const currentUsdStockEl = document.getElementById('currentUsdStock');
      const totalUnpaidEl = document.getElementById('totalUnpaid');

      if (isEmployee) {
        if (todayProfitEl) todayProfitEl.textContent = '***';
        if (weekProfitEl) weekProfitEl.textContent = '***';
        if (totalProfitEl) totalProfitEl.textContent = '***';
        if (monthProfitEl) monthProfitEl.textContent = '***';
        if (taxAmountEl) taxAmountEl.textContent = '***';
        if (currentUsdStockEl) currentUsdStockEl.textContent = '***';
        if (totalUnpaidEl) totalUnpaidEl.textContent = '***';
      } else {
        if (todayProfitEl) todayProfitEl.textContent = formatCurrency(todayProfit);
        if (weekProfitEl) weekProfitEl.textContent = formatCurrency(weekProfit);
        // Mise à jour : Afficher le Profit Net Global au lieu du brut
        if (totalProfitEl) totalProfitEl.textContent = formatCurrency(globalNetProfit);
        if (monthProfitEl) monthProfitEl.textContent = formatCurrency(monthNet);
        
        // Calculate and display tax (0.05% of total revenue)
        const taxRate = 0.0005;
        const taxAmount = totalRevenue * taxRate;
        if (taxAmountEl) {
          taxAmountEl.textContent = formatCurrency(taxAmount);
        }

        // Update Stock USD and Total Unpaid
        if (currentUsdStockEl) {
            const usdtBalance = appState.balances ? appState.balances.usdt : 0;
            currentUsdStockEl.textContent = `${usdtBalance.toFixed(2)} $`;
        }
        if (totalUnpaidEl) {
            const totalUnpaid = (appState.clients || []).reduce((sum, c) => sum + Number(c.unpaid || 0), 0);
            totalUnpaidEl.textContent = formatCurrency(totalUnpaid);
        }
      }

      const totalClientsEl = document.getElementById('totalClients');
      if (totalClientsEl) totalClientsEl.textContent = appState.clients.length;

      const newClientsEl = document.getElementById('newClients');
      if (newClientsEl) newClientsEl.textContent = `${appState.clients.length} nouveaux ce mois`;

      const totalTransactionsEl = document.getElementById('totalTransactions');
      if (totalTransactionsEl) totalTransactionsEl.textContent = `${transactions.length} transactions`;

      const weekTransactionsEl = document.getElementById('weekTransactions');
      if (weekTransactionsEl) weekTransactionsEl.textContent = `${weekCount} transactions`;

      // Inclure TOUTES les transactions impayées dans les relances
      const dueReminders = transactions.filter(t => !t.paid);
      
      // Group reminders by client
      const groupedReminders = [];
      const clientMap = new Map();

      dueReminders.forEach(t => {
        if (!clientMap.has(t.clientId)) {
          const client = (appState.clients || []).find(c => c.id === t.clientId) || {};
          clientMap.set(t.clientId, {
            clientId: t.clientId,
            clientName: client.name || t.clientName || 'Client inconnu',
            totalDue: Number(client.unpaid || 0), // Utiliser la balance réelle du client
            transactionCount: 0,
            client: client
          });
          groupedReminders.push(clientMap.get(t.clientId));
        }
        const group = clientMap.get(t.clientId);
        group.transactionCount++;
      });

      // Trier par montant total dû (le plus gros en premier) et filtrer les soldes à 0
      const finalRelances = groupedReminders
        .filter(g => g.totalDue > 0)
        .sort((a, b) => b.totalDue - a.totalDue);

      const dueCount = finalRelances.length;
      const dueCountEl = document.getElementById('dueRemindersCount');
      const dueLabelEl = document.getElementById('dueRemindersLabel');
      const dueListEl = document.getElementById('dueRemindersList');
      const dueListCountEl = document.getElementById('dueRemindersListCount');

      if (dueCountEl) dueCountEl.textContent = String(dueCount);
      if (dueLabelEl) {
        if (dueCount === 0) {
          dueLabelEl.textContent = "Tous les clients sont à jour";
        } else {
          dueLabelEl.textContent = `${dueCount} client${dueCount > 1 ? 's' : ''} à relancer`;
        }
      }
      if (dueListCountEl) {
        dueListCountEl.textContent = dueCount ? `${dueCount} client${dueCount > 1 ? 's' : ''}` : '';
      }
      if (dueListEl) {
        dueListEl.innerHTML = '';
        if (!dueCount) {
          dueListEl.innerHTML = '<p class="text-gray-400 italic">Aucun rappel programmé</p>';
        } else {
          finalRelances.slice(0, 20).forEach(group => {
            const client = group.client;
            const wa = buildClientWhatsAppLink(client);
            const ig = buildClientInstagramLink(client);
            const amount = formatCurrency(group.totalDue);
            const countText = group.transactionCount > 1 ? ` (${group.transactionCount} tx)` : '';
            const li = document.createElement('div');
            li.className = 'flex justify-between items-center p-2 bg-gray-50 rounded-lg';
            li.innerHTML = `
              <div>
                <p class="font-medium text-gray-800">${group.clientName}</p>
                <p class="text-xs text-gray-500">Total dû: ${amount}${countText}</p>
              </div>
              <div class="flex items-center gap-2">
                ${wa ? `<a href="${wa}" target="_blank" class="text-green-600 hover:text-green-800" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>` : ''}
                ${ig ? `<a href="${ig}" target="_blank" class="text-pink-600 hover:text-pink-800" title="Instagram"><i class="fab fa-instagram"></i></a>` : ''}
              </div>
            `;
            dueListEl.appendChild(li);
          });
        }
      }

      // Update Chart
      renderProfitChart(transactions, expenses);
    }

    let profitChartInstance = null;

    function renderProfitChart(transactions, expenses) {
        const ctx = document.getElementById('profitChart');
        if (!ctx) return; // Canvas might not be in DOM yet or on other tabs
        
        // Prepare data: Last 30 days
        const labels = [];
        const profitData = [];
        const expenseData = [];
        const today = new Date();
        
        // Create map for aggregation
        const profitsMap = {};
        const expensesMap = {};
        
        // Fill maps
        transactions.forEach(t => {
            const dateStr = (t.date || '').slice(0, 10);
            if (!profitsMap[dateStr]) profitsMap[dateStr] = 0;
            profitsMap[dateStr] += Number(t.profit || 0);
        });
        
        expenses.forEach(e => {
            const dateStr = (e.date || '').slice(0, 10);
            if (!expensesMap[dateStr]) expensesMap[dateStr] = 0;
            expensesMap[dateStr] += Number(e.amount || 0);
        });

        // Generate last 30 days
        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const dateStr = getLocalDateString(d);
            labels.push(d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }));
            profitData.push(profitsMap[dateStr] || 0);
            expenseData.push(expensesMap[dateStr] || 0);
        }

        if (profitChartInstance) {
            profitChartInstance.data.labels = labels;
            profitChartInstance.data.datasets[0].data = profitData;
            profitChartInstance.data.datasets[1].data = expenseData;
            profitChartInstance.update();
        } else {
            profitChartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Profit Net',
                            data: profitData,
                            borderColor: '#3B82F6', // Blue 500
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            borderWidth: 2,
                            tension: 0.3,
                            fill: true,
                            pointRadius: 2
                        },
                        {
                            label: 'Dépenses',
                            data: expenseData,
                            borderColor: '#F87171', // Red 400
                            backgroundColor: 'rgba(248, 113, 113, 0.05)',
                            borderWidth: 2,
                            tension: 0.3,
                            fill: true,
                            pointRadius: 2,
                            borderDash: [5, 5]
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false 
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            callbacks: {
                                label: function(context) {
                                    let label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.y !== null) {
                                        label += new Intl.NumberFormat('fr-DZ', { style: 'currency', currency: 'DZD' }).format(context.parsed.y);
                                    }
                                    return label;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            },
                            ticks: {
                                callback: function(value) {
                                    if (Math.abs(value) >= 1000) {
                                        return (value / 1000) + 'k';
                                    }
                                    return value;
                                }
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                maxTicksLimit: 10,
                                maxRotation: 0
                            }
                        }
                    },
                    interaction: {
                        mode: 'nearest',
                        axis: 'x',
                        intersect: false
                    }
                }
            });
        }
    }

            function applyEmployeeRestrictions() {
        const isEmp = (appState.session && appState.session.type === 'employee');
        if (!isEmp) {
            const tabFrais = document.getElementById('tab-frais');
            if (tabFrais) tabFrais.style.display = '';
            const tabPaiements = document.getElementById('tab-paiements');
            if (tabPaiements) tabPaiements.style.display = '';
            const tabAchats = document.getElementById('tab-achats');
            if (tabAchats) tabAchats.style.display = '';
            const tabAds = document.getElementById('tab-ads');
            if (tabAds) tabAds.style.display = '';
            const dashBtn = document.getElementById('tab-dashboard');
            if (dashBtn) dashBtn.style.display = '';
            const thProfit = document.getElementById('th-profit');
            if (thProfit) thProfit.style.display = '';
            if (typeof setEmployeeGuardEnabled === 'function') setEmployeeGuardEnabled(false);
            return;
        }
        if (typeof setEmployeeGuardEnabled === 'function') setEmployeeGuardEnabled(true);
        const tabFrais = document.getElementById('tab-frais');
        const tabPaiements = document.getElementById('tab-paiements');
        const tabAchats = document.getElementById('tab-achats');
        const tabAds = document.getElementById('tab-ads');
        const dashBtn = document.getElementById('tab-dashboard');
        if (dashBtn) dashBtn.style.display = 'none';
        
        // Hide tabs for employees
        if (tabFrais) tabFrais.style.display = '';
        if (tabPaiements) tabPaiements.style.display = 'none';
        if (tabAchats) tabAchats.style.display = 'none';
        if (tabAds) tabAds.style.display = 'none';

        const thProfit = document.getElementById('th-profit');
        if (thProfit) thProfit.style.display = 'none';
        const buyRate = document.getElementById('buyRate');
        if(buyRate && buyRate.closest('div')) buyRate.closest('div').style.display = 'none';
        
        const previewBlock = document.querySelector('.bg-gradient-to-r.from-blue-50.to-indigo-50');
        if(previewBlock) previewBlock.style.display = 'none';
        
        const stdDollar = document.getElementById('standardDollarAmount');
        if(stdDollar && stdDollar.closest('div')) stdDollar.closest('div').style.display = 'none';
        
        const dashboard = document.getElementById('dashboard');
        if(dashboard && isEmp) {
             const profits = Array.from(dashboard.querySelectorAll('p')).filter(p => p.textContent.includes('Profit'));
             profits.forEach(p => {
                 const card = p.closest('.shadow-xl'); 
                 if(card) card.style.display = 'none';
             });
        }
    }

  async function syncAdminRequests() {
    const db = getDb();
    if (!db) return;
    try {
        const snap = await db.collection('requests').get();
        const remoteReqs = [];
        snap.forEach(doc => remoteReqs.push(doc.data()));
        if (!appState.clientRequests) appState.clientRequests = [];
        const existingIds = new Set(appState.clientRequests.map(r => r.id));
        remoteReqs.forEach(r => {
            if (!existingIds.has(r.id)) appState.clientRequests.push(r);
        });
        if (typeof renderRequests === 'function') renderRequests();
        if (typeof updateRequestsBadge === 'function') updateRequestsBadge();
    } catch (e) { console.warn('Admin sync error:', e); }
  }

  let adminRequestsUnsubscribe = null;

  function setupAdminRealtimeListeners() {
    const db = getDb();
    if (!db) return;
    if (appState.session && appState.session.type === 'client') return;
    if (!auth || !auth.currentUser) return;
    if (!appState.settings || appState.settings.storageMode !== 'cloud') return;
    
    // Unsubscribe previous if exists
    if (adminRequestsUnsubscribe) {
        adminRequestsUnsubscribe();
        adminRequestsUnsubscribe = null;
    }

    try {
        adminRequestsUnsubscribe = db.collection('requests')
            .onSnapshot((snapshot) => {
                let changes = false;
                if (!appState.clientRequests) appState.clientRequests = [];
                
                snapshot.docChanges().forEach((change) => {
                    const data = change.doc.data();
                    if (change.type === "added") {
                        // Check if exists
                        const idx = appState.clientRequests.findIndex(r => r.id === data.id);
                        if (idx === -1) {
                            appState.clientRequests.push(data);
                            changes = true;
                            // Show notification for new request if recent (< 5 mins)
                            if (Date.now() - (new Date(data.date).getTime()) < 300000) { 
                                showToast('Nouvelle demande reÃ§ue', 'info');
                            }
                        }
                    }
                    if (change.type === "modified") {
                         const idx = appState.clientRequests.findIndex(r => r.id === data.id);
                         if (idx !== -1) {
                             appState.clientRequests[idx] = data;
                             changes = true;
                         }
                    }
                    if (change.type === "removed") {
                        const idx = appState.clientRequests.findIndex(r => r.id === data.id);
                        if (idx !== -1) {
                            appState.clientRequests.splice(idx, 1);
                            changes = true;
                        }
                    }
                });

                if (changes || snapshot.docChanges().length === 0) {
                     if (typeof renderRequests === 'function') renderRequests();
                     if (typeof updateRequestsBadge === 'function') updateRequestsBadge();
                }
            }, (error) => {
                console.warn('Admin Real-time Listener Error:', error);
            });
            
    } catch (e) { console.warn('Setup Listener Error:', e); }
  }
  window.setupAdminRealtimeListeners = setupAdminRealtimeListeners;

  function renderTables() {
      if (appState.session && appState.session.type === 'client') return;
      if (typeof syncAdminRequests === 'function' && (!appState.lastAdminSync || Date.now() - appState.lastAdminSync > 60000)) {
          appState.lastAdminSync = Date.now();
          syncAdminRequests();
      }
      recalculateClientStats();
      recalculateFinanceBalances();
      renderClientsTable();
      renderTransactionsTable();
      renderTodoTable();
      renderOffersGrid();
      renderPaymentsTable();
      renderUsdPurchasesTable();
      renderUsdtExpensesTable();
      renderExpensesTable();
      renderRecentTransactions();
      renderTopClients();
      renderAdsTable();
      populateAdAccountSelect();
      updateDashboard();
      if(typeof renderRequests === 'function') renderRequests();
      applyEmployeeRestrictions();
    }

    function resetCalculator() {
      const select = document.getElementById('offerSelect');
      const amount = document.getElementById('standardDollarAmount');
      const price = document.getElementById('standardPriceDzd');
      const duration = document.getElementById('standardDuration');
      const clientSearch = document.getElementById('clientSearch');
      const clientSelect = document.getElementById('clientSelect');
      const adAccountSelect = document.getElementById('adAccountSelect');
      const paid = document.getElementById('transactionPaid');

      if (select) select.value = '';
      if (amount) amount.value = '';
      if (price) price.value = '';
      if (duration) duration.value = '';
      if (clientSearch) clientSearch.value = '';
      if (clientSelect) clientSelect.value = '';
      if (adAccountSelect) adAccountSelect.value = '';
      if (paid) paid.checked = false;

      const details = document.getElementById('offerDetails');
      if (details) details.textContent = 'Sélectionnez une offre';

      const fields = document.getElementById('standardFields');
      if (fields) fields.classList.add('hidden');

      calculatePreview();
    }

    let renderTablesScheduled = false;
    function renderTablesAsync() {
      if (renderTablesScheduled) return;
      renderTablesScheduled = true;
      requestAnimationFrame(() => {
        renderTablesScheduled = false;
        renderTables();
      });
    }

    // renderOffersGrid moved to end of file to avoid duplication


// ensureInitialData moved up

    // === GESTION CLIENTS / OFFRES / TRANSACTIONS / PAIEMENTS / USD ===
    function deleteClient(id) {
      if(!confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) return;
      if (!appState.sync) appState.sync = {};
      if (!appState.sync.pendingDeletions) appState.sync.pendingDeletions = [];
      appState.sync.pendingDeletions.push({ col: 'clients', id: id });
      
      appState.clients = appState.clients.filter(c => c.id !== id);
      renderClientsTable();
      populateClientDropdown();
      autoSave();
    }

    function editClient(id) {
      const client = appState.clients.find(c => c.id === id);
      if (!client) { showToast('Client introuvable', 'error'); return; }

      editingClientId = id;

      const nameEl = document.getElementById('newClientName');
      const phoneEl = document.getElementById('newClientPhone');
      const instaEl = document.getElementById('newClientInstagram');
      const fbEl = document.getElementById('newClientFacebook');
      const notesEl = document.getElementById('newClientNotes');
      const titleEl = document.querySelector('#clientModal h3');

      if (nameEl) nameEl.value = client.name || '';
      if (phoneEl) phoneEl.value = client.phone || client.contact || '';
      if (instaEl) {
        const ig = client.username || (client.social && client.social.instagram && client.social.instagram[0]) || '';
        instaEl.value = ig ? '@' + ig.replace(/^@+/, '') : '';
      }
      if (fbEl) {
        const fb = (client.social && client.social.facebook && client.social.facebook[0]) || '';
        fbEl.value = fb;
      }
      if (notesEl) notesEl.value = client.notes || '';
      if (titleEl) titleEl.textContent = 'Modifier un Client';

      openModal('clientModal');
    }

    function editOffer(id) {
      const offer = appState.offers.find(o => o.id === id);
      if (!offer) return;

      editingOfferId = id;
      document.getElementById('newOfferName').value = offer.name;
      document.getElementById('newOfferDesc').value = offer.description || '';
      document.getElementById('newOfferPrice').value = offer.price || '';
      document.getElementById('newOfferCostPerUnit').value = offer.costPerUnit || '';
      document.getElementById('newOfferDuration').value = offer.duration || '';

      const title = document.querySelector('#offerModal h3');
      if(title) title.innerHTML = '<i class="fas fa-gift text-purple-600"></i> Modifier l\'Offre';

      openModal('offerModal');
    }

    function deleteOffer(id) {
      if(!confirm('Voulez-vous vraiment supprimer cette offre ?')) return;
      if (!appState.sync) appState.sync = {};
      if (!appState.sync.pendingDeletions) appState.sync.pendingDeletions = [];
      appState.sync.pendingDeletions.push({ col: 'offers', id: id });
      
      const before = appState.offers.length;
      const offerById = appState.offers.find(o => o.id === id);
      appState.offers = appState.offers.filter(o => o.id !== id);
      if (appState.offers.length === before) {
        if (offerById) {
          appState.offers = appState.offers.filter(o => !(o.name === offerById.name && Number(o.price||0) === Number(offerById.price||0)));
        }
      }
      renderOffersGrid();
      populateOfferSelect();
      autoSave();
      showToast('Offre supprimée', 'success');
    }

    function renderTodoTable() {
      const tbodyTransactions = document.getElementById('todoTableBodyTransactions');
      const countElTx = document.getElementById('todoCountTransactions');
      const emptyStateTx = document.getElementById('todoEmptyStateTransactions');
      
      const todos = (appState.todoTransactions || []).filter(t => t.status === 'pending');
      const count = todos.length;

      if (countElTx) countElTx.textContent = count;
      
      const badge = document.getElementById('todoBadge');
      if (badge) {
        badge.textContent = count;
        if (count > 0) badge.classList.remove('hidden');
        else badge.classList.add('hidden');
      }

      // Helper to render a row
      const createRow = (t) => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        
        // Badge pour les transactions "Problème"
        const typeBadge = t.isProblem 
          ? '<span class="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded uppercase ml-2">Problème</span>'
          : '';

        const dateStr = `<td class="p-4 text-gray-600">${formatDate(t.date)}</td>`;
        const clientName = `<td class="p-4 font-bold text-gray-800">${t.clientName}${typeBadge}</td>`;
        const offerName = `<td class="p-4 text-gray-700">${t.offerName}</td>`;
        const price = `<td class="p-4 text-right font-bold text-blue-600">${formatCurrency(t.priceDzd)}</td>`;
        const payment = `
          <td class="p-4 text-center">
            <button onclick="toggleTodoPayment('${t.id}')" class="px-3 py-1 rounded-full text-[10px] font-bold transition-all ${t.paid ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}">
              ${t.paid ? '<i class="fas fa-check-circle"></i> PAYÉ' : '<i class="fas fa-times-circle"></i> NON'}
            </button>
          </td>`;
        
        // Actions différentes si c'est un problème
        let actions = '';
        if (t.isProblem) {
          actions = `
          <td class="p-4 text-center flex justify-center gap-2">
            <button onclick="resolveProblem('${t.id}')" class="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-[10px] font-bold shadow-sm" title="Résoudre (Remettre en actif)">
              <i class="fas fa-check-circle"></i>
            </button>
            <button onclick="editTransaction('${t.id}')" class="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-[10px] font-bold shadow-sm" title="Modifier">
              <i class="fas fa-edit"></i>
            </button>
            <button onclick="deleteTransaction('${t.id}')" class="p-2 text-gray-400 hover:text-red-600 transition-colors">
              <i class="fas fa-trash-alt text-[10px]"></i>
            </button>
          </td>`;
        } else {
          actions = `
          <td class="p-4 text-center flex justify-center gap-2">
            <button onclick="validateTodoTransaction('${t.id}', 'done')" class="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-[10px] font-bold shadow-sm" title="Valider">
              <i class="fas fa-check"></i>
            </button>
            <button onclick="validateTodoTransaction('${t.id}', 'problem')" class="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-[10px] font-bold shadow-sm" title="Problème">
              <i class="fas fa-exclamation-triangle"></i>
            </button>
            <button onclick="deleteTodoTransaction('${t.id}')" class="p-2 text-gray-400 hover:text-red-600 transition-colors">
              <i class="fas fa-trash-alt text-[10px]"></i>
            </button>
          </td>`;
        }

        row.innerHTML = dateStr + clientName + offerName + price + payment + actions;
        return row;
      };

      // Combiner les To-Do transactions normales ET les transactions avec statut "problem"
      const normalTodos = appState.todoTransactions || [];
      const problemTransactions = (appState.transactions || []).filter(t => t.status === 'problem');
      
      const allTodos = [
        ...normalTodos.map(t => ({ ...t, isProblem: false })),
        ...problemTransactions.map(t => ({ ...t, isProblem: true }))
      ];

      if (tbodyTransactions) {
        tbodyTransactions.innerHTML = '';
        if (allTodos.length === 0) {
          if (emptyStateTx) emptyStateTx.classList.remove('hidden');
        } else {
          if (emptyStateTx) emptyStateTx.classList.add('hidden');
          allTodos.sort((a, b) => b.createdAt - a.createdAt).forEach(t => {
            tbodyTransactions.appendChild(createRow(t));
          });
        }
      }
      
      renderTodoPreview();
    }

    function renderTodoPreview() {
      const preview = document.getElementById('todoPreviewList');
      if (!preview) return;
      
      const normalTodos = (appState.todoTransactions || []).filter(t => t.status === 'pending');
      const problems = (appState.transactions || []).filter(t => t.status === 'problem');
      
      const allPreview = [
          ...problems.map(t => ({ ...t, isProblem: true })),
          ...normalTodos.map(t => ({ ...t, isProblem: false }))
      ];

      if (allPreview.length === 0) {
        preview.innerHTML = '<p class="text-indigo-200 italic text-center py-4">Tout est à jour !</p>';
        return;
      }
      
      preview.innerHTML = '';
      allPreview.slice(0, 3).forEach(t => {
        const div = document.createElement('div');
        div.className = 'bg-white/10 p-3 rounded-xl border border-white/20 flex justify-between items-center cursor-pointer hover:bg-white/20 transition';
        div.onclick = () => showTab('todo');
        
        const icon = t.isProblem ? '<i class="fas fa-exclamation-triangle text-red-300"></i>' : '<i class="fas fa-clock text-indigo-300"></i>';
        const problemTag = t.isProblem ? '<span class="text-[10px] font-bold text-red-300 ml-2">PROBLÈME</span>' : '';

        div.innerHTML = `
          <div class="flex items-center gap-3">
            ${icon}
            <div>
              <div class="font-bold text-white text-xs">${t.clientName} ${problemTag}</div>
              <div class="text-[10px] text-indigo-200 opacity-75">${t.offerName}</div>
            </div>
          </div>
          <div class="text-right">
             <span class="text-xs font-bold text-white">${t.amount}$</span>
          </div>
        `;
        preview.appendChild(div);
      });
    }

    // Nouvelle fonction pour résoudre un problème et remettre la transaction en "normal"
    window.resolveProblem = function(id) {
      const t = appState.transactions.find(x => x.id === id);
      if (t) {
        t.status = 'active'; // Remettre en statut normal
        t.updatedAt = Date.now();
        renderTables();
        // Forcer le rafraîchissement de la ToDo list car elle dépend de renderTables()
        if (typeof renderTodoTransactions === 'function') renderTodoTransactions();
        autoSave();
        showToast('Problème résolu, transaction rétablie', 'success');
      }
    };

    function deletePayment(id) {
      if(!confirm('Supprimer ce paiement ? Cela augmentera la dette du client.')) return;
      const payment = appState.payments.find(p => p.id === id);
      if (payment) {
          const client = appState.clients.find(c => c.id === payment.clientId);
          if (client) {
              client.unpaid = (Number(client.unpaid || 0) + Number(payment.amount || 0));
              client.updatedAt = Date.now(); // Sync Trigger
          }
      }
      appState.payments = appState.payments.filter(p => p.id !== id);
      recalculateFinanceBalances();
      renderPaymentsTable();
      renderClientsTable();
      autoSave();
      showToast('Paiement supprimé', 'info');
    }

    function addUsdtExpense() {
      const amount = Number(document.getElementById('usdtExpenseAmount').value || 0);
      const month = document.getElementById('usdtExpenseMonth').value;
      const note = document.getElementById('usdtExpenseNote').value.trim();

      if (!amount) {
        showToast('Montant USDT requis', 'error');
        return;
      }

      if (!month) {
        showToast('Mois requis', 'error');
        return;
      }

      if (typeof updateDefaultBuyRateFromLastPurchase === 'function') updateDefaultBuyRateFromLastPurchase();
      const purchases = Array.isArray(appState.usdPurchases) ? appState.usdPurchases : [];
      const sortedPurchases = [...purchases].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      const lastPurchase = sortedPurchases.find(p => p && Number(p.rate || 0) > 0) || null;
      const buyRate = lastPurchase ? Number(lastPurchase.rate || 0) : Number(appState.settings?.defaultBuyRate || 0);
      if (!buyRate) {
        showToast('Aucun achat USD trouvé pour calculer le coût', 'error');
        return;
      }

      const spendRate = buyRate;
      const costDzd = amount * buyRate;
      const valueDzd = amount * spendRate;
      const diffDzd = valueDzd - costDzd;

      if (!Array.isArray(appState.usdtExpenses)) {
        appState.usdtExpenses = [];
      }

      const expense = {
        id: generateId('usdt'),
        date: getLocalDateString(),
        amount,
        month,
        buyRate,
        spendRate,
        costDzd,
        valueDzd,
        diffDzd,
        note,
      };

      appState.usdtExpenses.push(expense);
      recalculateFinanceBalances();

      renderUsdtExpensesTable();
      autoSave();

      document.getElementById('usdtExpenseAmount').value = '';
      document.getElementById('usdtExpenseMonth').value = '';
      document.getElementById('usdtExpenseNote').value = '';
      showToast('Dépense USDT enregistrée', 'success');
    }

    function deleteUsdtExpense(id) {
      if(!confirm('Supprimer cette dépense USDT ?')) return;
      if (!Array.isArray(appState.usdtExpenses)) {
        appState.usdtExpenses = [];
      }
      appState.usdtExpenses = appState.usdtExpenses.filter(e => e.id !== id);
      recalculateFinanceBalances();
      renderUsdtExpensesTable();
      autoSave();
    }

    function populateExpenseCategorySelect() {
      const select = document.getElementById('expenseCategory');
      if (!select) return;
      select.innerHTML = '';
      (appState.settings.expenseCategories || []).forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        select.appendChild(opt);
      });
    }

    function applyRecurringExpensesForCurrentMonth() {
      const now = new Date();
      const month = now.getMonth();
      const year = now.getFullYear();
      (appState.recurringExpenses || []).forEach(def => {
        const exists = (appState.expenses || []).some(e => {
          let eMonth, eYear;
          if (e.date && e.date.includes('-')) {
             const parts = e.date.split('-');
             eYear = parseInt(parts[0]);
             eMonth = parseInt(parts[1]) - 1;
          } else {
             const d = new Date(e.date || now);
             eMonth = d.getMonth();
             eYear = d.getFullYear();
          }
          return e.recurringId === def.id && eMonth === month && eYear === year;
        });
        if (!exists) {
          const dateStr = getLocalDateString(new Date(year, month, 1));
          appState.expenses.push({
            id: generateId('exp'),
            date: dateStr,
            category: def.category,
            amount: Number(def.amount || 0),
            note: def.note || '',
            recurringId: def.id,
            addedBy: def.addedBy,
            uid: def.uid,
          });
        }
      });
    }

    function deleteExpense(id) {
      if(!confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) return;
      const isEmp = (appState.session && appState.session.type === 'employee');
      const currentUid = appState.session && appState.session.user ? String(appState.session.user.uid || '') : '';
      const currentName = appState.session && appState.session.user ? String(appState.session.user.displayName || appState.session.user.email || '').toLowerCase() : '';
      const existing = (appState.expenses || []).find(e => e.id === id);
      if (isEmp && existing) {
        const byUid = currentUid && existing.uid && String(existing.uid) === currentUid;
        const byName = currentName && existing.addedBy && String(existing.addedBy).toLowerCase() === currentName;
        if (!byUid && !byName) {
          showToast('Vous ne pouvez supprimer que vos frais', 'error');
          return;
        }
      }
      if (existing) logAudit('expense:delete', { date: existing.date, category: existing.category, account: existing.account, amount: existing.amount, addedBy: existing.addedBy, uid: existing.uid });
      appState.expenses = (appState.expenses || []).filter(e => e.id !== id);
      recalculateFinanceBalances();
      renderExpensesTable();
      autoSave();
      updateDashboard();
      showToast('Frais supprimé', 'info');
    }

    function addExpenseCategory() {
      const input = document.getElementById('newExpenseCategory');
      if (!input) return;
      const name = input.value.trim();
      if (!name) return;
      const cats = appState.settings.expenseCategories || [];
      if (!cats.includes(name)) cats.push(name);
      appState.settings.expenseCategories = cats;
      input.value = '';
      renderExpenseCategoriesList();
      populateExpenseCategorySelect();
      autoSave();
    }

    function deleteExpenseCategory(name) {
      const cats = appState.settings.expenseCategories || [];
      appState.settings.expenseCategories = cats.filter(c => c !== name);
      renderExpenseCategoriesList();
      populateExpenseCategorySelect();
      autoSave();
    }

    function renderExpenseCategoriesList() {
      const list = document.getElementById('expenseCategoriesList');
      if (!list) return;
      list.innerHTML = '';
      (appState.settings.expenseCategories || []).forEach(cat => {
        const div = document.createElement('div');
        div.className = 'flex justify-between items-center p-3 border rounded-xl';
        div.innerHTML = `
          <span class="font-medium text-gray-800">${cat}</span>
          <button onclick="deleteExpenseCategory('${cat}')" class="text-red-600 hover:text-red-800">
            <i class="fas fa-trash-alt"></i>
          </button>
        `;
        list.appendChild(div);
      });
    }

    function deleteTransaction(id) {
      if(!confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) return;
      
      // Update client timestamp before deleting transaction to sync balance change
      const t = appState.transactions.find(x => x.id === id);
      if (t && t.clientId) {
          const client = appState.clients.find(c => c.id === t.clientId);
          if (client) client.updatedAt = Date.now();
      }

      if (!appState.sync) appState.sync = {};
      if (!appState.sync.pendingDeletions) appState.sync.pendingDeletions = [];
      appState.sync.pendingDeletions.push({ col: 'transactions', id: id });
      
      appState.transactions = appState.transactions.filter(t => t.id !== id);
      renderTables();
      autoSave();
    }

    window.toggleTransactionPayment = function(id) {
      const t = appState.transactions.find(x => x.id === id);
      if (t) {
        t.paid = !t.paid;
        t.updatedAt = Date.now();
        
        // Update client timestamp to sync balance change
        if (t.clientId) {
            const client = appState.clients.find(c => c.id === t.clientId);
            if (client) client.updatedAt = Date.now();
        }

        renderTables();
        autoSave();
        showToast(t.paid ? 'Marquée comme payée' : 'Marquée comme impayée', 'info');
      }
    };

    function editTransaction(id) {
      const t = appState.transactions.find(x => x.id === id);
      if (!t) { showToast('Transaction introuvable', 'error'); return; }
      
      document.getElementById('editTxId').value = id;
      document.getElementById('editTxAmount').value = t.amount || 0;
      document.getElementById('editTxPrice').value = t.priceDzd || 0;
      document.getElementById('editTxDuration').value = t.duration || '';
      document.getElementById('editTxPaid').checked = !!t.paid;
      
      openModal('editTransactionModal');
    }

    window.saveEditTransaction = function() {
      const id = document.getElementById('editTxId').value;
      const amount = Number(document.getElementById('editTxAmount').value || 0);
      const priceDzd = Number(document.getElementById('editTxPrice').value || 0);
      const durationStr = document.getElementById('editTxDuration').value || '';
      const paid = document.getElementById('editTxPaid').checked;

      const t = appState.transactions.find(x => x.id === id);
      if (!t) return;

      if (!amount || !priceDzd) { showToast('Valeurs invalides', 'error'); return; }
      
      // Recalculer total et profit en conservant le taux d’achat existant si possible
      const buyRateGuess = t.buyRate || (t.amount ? (Number(t.totalDzd || 0) / Number(t.amount || 1)) : Number(document.getElementById('buyRate')?.value || 0));
      const totalDzd = amount * Number(buyRateGuess || 0);
      const profit = priceDzd - totalDzd;
      
      Object.assign(t, { 
          amount, 
          priceDzd, 
          totalDzd, 
          profit, 
          duration: durationStr, 
          paid,
          updatedAt: Date.now() 
      });

      // Update client timestamp to sync balance change
      if (t.clientId) {
          const client = appState.clients.find(c => c.id === t.clientId);
          if (client) client.updatedAt = Date.now();
      }
      
      renderTables();
      autoSave();
      closeModal('editTransactionModal');
      showToast('Transaction mise à jour', 'success');
    };

    function deleteUsdPurchase(id) {
      if(!confirm('Supprimer cet achat USD ?')) return;
      appState.usdPurchases = appState.usdPurchases.filter(t => t.id !== id);
      recalculateFinanceBalances();
      renderUsdPurchasesTable();
      autoSave();
    }

    // === SELECTS / RECHERCHE ===
    function populateClientDropdown() {
      const dropdown = document.getElementById('clientDropdown');
      const selectHidden = document.getElementById('clientSelect');
      const search = document.getElementById('clientSearch');
      if (!dropdown || !selectHidden || !search) return;

      dropdown.innerHTML = '';

      appState.clients.forEach(client => {
        const item = document.createElement('div');
        item.className = 'px-4 py-2 hover:bg-blue-50 cursor-pointer';
        item.textContent = client.name;
        item.onclick = () => {
          search.value = client.name;
          selectHidden.value = client.id;
          dropdown.classList.add('hidden');
        };
        dropdown.appendChild(item);
      });
    }

    function filterClients() {
      const search = document.getElementById('clientSearch').value.toLowerCase();
      const dropdown = document.getElementById('clientDropdown');
      if (!dropdown) return;

      dropdown.classList.remove('hidden');
      dropdown.innerHTML = '';

      appState.clients
        .filter(c => c.name.toLowerCase().includes(search))
        .forEach(client => {
          const item = document.createElement('div');
          item.className = 'px-4 py-2 hover:bg-blue-50 cursor-pointer';
          item.textContent = client.name;
          item.onclick = () => {
            document.getElementById('clientSearch').value = client.name;
            document.getElementById('clientSelect').value = client.id;
            dropdown.classList.add('hidden');
          };
          dropdown.appendChild(item);
        });

      if (!dropdown.innerHTML) {
        dropdown.innerHTML = '<div class="px-4 py-2 text-gray-400 text-sm">Aucun client</div>';
      }
    }

    function populateOfferSelect() {
      const select = document.getElementById('offerSelect');
      const details = document.getElementById('offerDetails');
      const standardFields = document.getElementById('standardFields');
      if (!select) return;

      const currentVal = select.value;
      select.innerHTML = '<option value="">Offre Standard (saisie manuelle)</option>';

      if (Array.isArray(appState.offers)) {
          appState.offers.forEach(offer => {
            const option = document.createElement('option');
            option.value = offer.id;
            option.textContent = offer.name;
            select.appendChild(option);
          });
      }
      
      if (currentVal) select.value = currentVal;
      selectOfferInTransaction();
    }

    function selectOfferInTransaction() {
      const select = document.getElementById('offerSelect');
      const details = document.getElementById('offerDetails');
      const standardFields = document.getElementById('standardFields');
      const amountInput = document.getElementById('standardDollarAmount');
      const priceInput = document.getElementById('standardPriceDzd');
      const durationInput = document.getElementById('standardDuration');

      if (!select || !details || !standardFields) return;

      const id = select.value;
      if (!id) {
        details.textContent = 'Offre Standard (saisie manuelle)';
        standardFields.classList.remove('hidden');
        amountInput.value = '';
        priceInput.value = '';
        durationInput.value = '';
        return;
      }

      const offer = appState.offers.find(o => o.id === id);
      if (!offer) return;

      details.innerHTML = `
        <div class="font-semibold text-gray-800 mb-1">${offer.name}</div>
        <div class="text-sm text-gray-600 mb-1">${offer.description || ''}</div>
        <div class="text-sm text-gray-600">
          Montant à dépenser: ${offer.costPerUnit || 0} $ â€¢ Prix vente: ${formatCurrency(offer.price || 0)} â€¢ Durée: ${offer.duration || '-'}
        </div>
      `;

      standardFields.classList.add('hidden');
      amountInput.value = offer.costPerUnit || 0;
      priceInput.value = offer.price || 0;
      durationInput.value = offer.duration || '';
      calculatePreview();
    }

    function calculatePreview() {
      const buyRate = Number(document.getElementById('buyRate').value || 0);
      const amount = Number(document.getElementById('standardDollarAmount').value || 0);
      const priceDzd = Number(document.getElementById('standardPriceDzd').value || 0);

      const totalDzd = amount * buyRate;
      const profit = priceDzd - totalDzd;
      const percent = totalDzd ? (profit / totalDzd) * 100 : 0;

      document.getElementById('previewCost').textContent = formatCurrency(totalDzd);
      document.getElementById('previewRevenue').textContent = formatCurrency(priceDzd);
      document.getElementById('previewProfit').textContent = formatCurrency(profit);
      document.getElementById('profitPercentage').textContent = `Marge: ${percent.toFixed(2)}%`;
    }

    function resetCalculator() {
      document.getElementById('buyRate').value = appState.settings.defaultBuyRate || 340;
      document.getElementById('offerSelect').value = '';
      document.getElementById('standardDollarAmount').value = '';
      document.getElementById('standardPriceDzd').value = '';
      document.getElementById('standardDuration').value = '';
      document.getElementById('clientSearch').value = '';
      document.getElementById('clientSelect').value = '';
      document.getElementById('transactionPaid').checked = true;
      document.getElementById('offerDetails').textContent = 'Sélectionnez une offre';
      document.getElementById('standardFields').classList.remove('hidden');
      calculatePreview();
    }

    function populatePaymentClientSelect() {
      const select = document.getElementById('paymentClientSelect');
      if (!select) return;

      select.innerHTML = '<option value="">Choisir un client...</option>';
      appState.clients.forEach(client => {
        const option = document.createElement('option');
        option.value = client.id;
        option.textContent = client.name;
        select.appendChild(option);
      });
    }

    // === EXPORT / IMPORT / STATS (simples) ===
    // backupData and importData moved/unified at end of file


    function exportPDF() {
      showToast('Fonction export PDF à implémenter', 'info');
    }

    function exportClientsCSV() {
      try {
        const rows = [['Nom', 'Contact', 'Total dépensé', 'Impayé', 'Transactions']];
        (appState.clients || []).forEach(c => {
          rows.push([
            c.name || '',
            c.contact || '',
            String(c.totalSpent || 0).replace(/\./g, ','),
            String(c.unpaid || 0).replace(/\./g, ','),
            String(c.transactionsCount || 0),
          ]);
        });
        const csv = rows.map(r => r.map(field => {
          const s = String(field ?? '');
          if (/[",;\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
          return s;
        }).join(';')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `clients_${getLocalDateString()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Export CSV des clients réussi', 'success');
      } catch (err) {
        console.error(err);
        showToast('Erreur export CSV', 'error');
      }
    }

    function showStats() {
      showToast('Fonction statistiques à implémenter', 'info');
    }

    function manualSave() {
      try {
        appState.lastUpdated = Date.now();
        if (appState.settings.storageMode === 'cloud') {
          saveToCloud();
          showToast('Sauvegarde cloud effectuée', 'success');
        } else {
          saveToLocalStorage();
          showToast('Sauvegarde locale effectuée', 'success');
        }
      } catch (e) {
        console.error(e);
        showToast('Erreur lors de la sauvegarde', 'error');
      }
    }

    async function purgeAllData() {
      const ok = confirm('Cette action supprimera toutes les offres, clients, transactions, paiements et achats USD. Confirmez ?');
      if (!ok) return;
      appState.offers = [];
      appState.clients = [];
      appState.transactions = [];
      appState.payments = [];
      appState.usdPurchases = [];
      appState.settings.seedDefaults = false;
      appState.lastUpdated = Date.now();
      saveToLocalStorage();
      if (appState.settings.storageMode === 'cloud') {
        await saveToCloud();
      }
      populateClientDropdown();
      populateOfferSelect();
      populatePaymentClientSelect();
      renderTables();
      showTab('dashboard');
      showToast('Toutes les données ont été supprimées', 'success');
    }

    // === REQUESTS TAB LOGIC ===
    function renderRequests() {
      const tbody = document.getElementById('requestsTableBody');
      const emptyState = document.getElementById('requestsEmptyState');
      const editor = document.getElementById('workMethodEditor');

      if (!tbody) return;

      // Update editor with current content
      if (editor && appState.settings.workMethodText) {
         if (document.activeElement !== editor) { // Don't overwrite if user is typing
            editor.value = appState.settings.workMethodText;
         }
      }

      tbody.innerHTML = '';
      const searchEl = document.getElementById('requestsSearch');
      const statusEl = document.getElementById('requestsStatusFilter');
      const unreadEl = document.getElementById('requestsUnreadOnly');
      const q = (searchEl ? searchEl.value : '').toLowerCase();
      const statusFilter = statusEl ? statusEl.value : 'all';
      const unreadOnly = unreadEl ? unreadEl.checked : false;
      const requests = (appState.clientRequests || [])
        .filter(r => {
          if (unreadOnly && r.read) return false;
          if (statusFilter !== 'all' && (r.status || 'pending') !== statusFilter) return false;
          if (q) {
            const hay = [
              r.instagram || '',
              r.pageFacebook || '',
              r.offer || '',
              r.paymentMethod || '',
              r.pubLink || '',
              r.metaObjective || '',
              r.tiktokObjective || ''
            ].join(' ').toLowerCase();
            if (!hay.includes(q)) return false;
          }
          return true;
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      updateRequestsBadge();

      if (requests.length === 0) {
        emptyState.classList.remove('hidden');
        return;
      }

      emptyState.classList.add('hidden');
      
      requests.forEach(req => {
        const tr = document.createElement('tr');
        tr.className = (req.read ? 'bg-white hover:bg-gray-50' : 'bg-yellow-50 hover:bg-yellow-100 font-medium') + ((req.status === 'processed') ? ' opacity-80' : '');
        tr.addEventListener('click', (ev) => {
          if (ev.target.closest('button')) return;
          openRequestModal(req.id);
        });
        
        let details = `<span class="block text-xs text-gray-500">${req.platform}</span>`;
        if (req.metaObjective) details += `<span class="block text-xs text-gray-500">Obj: ${req.metaObjective}</span>`;
        
        const statusMap = {
          pending: { text: 'En attente', cls: 'text-yellow-700 bg-yellow-50 border-yellow-200' },
          in_progress: { text: 'En cours', cls: 'text-blue-700 bg-blue-50 border-blue-200' },
          problematic: { text: 'Problématique', cls: 'text-red-700 bg-red-50 border-red-200' },
          processed: { text: 'Traité', cls: 'text-green-700 bg-green-50 border-green-200' },
        };
        const rawStatus = req.status || 'pending';
        const s = statusMap[rawStatus] || statusMap['pending'];
        
        tr.innerHTML = `
          <td class="p-4 text-gray-600 whitespace-nowrap">
            ${formatDate(req.date)}
            <div class="text-xs text-gray-400">${new Date(req.date).toLocaleTimeString()}</div>
          </td>
          <td class="p-4">
            <div class="font-bold text-gray-800">${req.instagram || req.facebook || 'Client'}</div>
            ${req.pageFacebook ? `<div class="text-xs text-blue-600"><i class="fab fa-facebook"></i> ${req.pageFacebook}</div>` : ''}
            ${req.websiteUrl ? `<div class="text-xs text-green-600"><i class="fas fa-link"></i> Site Web</div>` : ''}
          </td>
          <td class="p-4">
            <span class="px-2 py-1 rounded-full text-xs font-bold ${req.platform === 'meta' ? 'bg-blue-100 text-blue-700' : 'bg-black text-white'}">
              ${req.platform ? req.platform.toUpperCase() : 'N/A'}
            </span>
            ${req.metaObjective ? `<div class="text-xs mt-1">${req.metaObjective}</div>` : ''}
            ${req.pubLink ? `<div class="mt-1"><a href="${req.pubLink}" target="_blank" class="text-blue-600 hover:underline text-xs"><i class="fas fa-link"></i> Lien Pub</a></div>` : ''}
          </td>
          <td class="p-4">
            <div class="font-bold text-purple-700">${req.offer || 'N/A'}</div>
          </td>
          <td class="p-4">
            <div class="flex flex-col gap-1">
                <span class="text-sm font-semibold">${req.paymentMethod || 'N/A'}</span>
                ${req.paymentProof ? (String(req.paymentProof).startsWith('data:') ? `<button class="text-xs text-blue-600 underline text-left" onclick="openImagePreview('${req.paymentProof}'); event.stopPropagation();"><i class="fas fa-image mr-1"></i> Voir Preuve</button>` : `<a href="${req.paymentProof}" target="_blank" class="text-xs text-blue-600 underline" onclick="event.stopPropagation();"><i class="fas fa-link mr-1"></i> Voir Preuve</a>`) : '<span class="text-xs text-gray-400">Aucune preuve</span>'}
                <span class="text-xs ${s.cls} px-2 py-1 rounded inline-block w-fit mt-1 border">${s.text}</span>
            </div>
          </td>
          <td class="p-4 rounded-r-lg">
            <div class="flex gap-2">
              <button onclick="openRequestModal('${req.id}'); event.stopPropagation();" class="text-blue-600 hover:text-blue-800" title="Voir détails">
                <i class="fas fa-eye"></i>
              </button>
              <div class="relative">
                <select onchange="updateRequestStatus('${req.id}', this.value)" class="text-xs border rounded px-2 py-1 bg-white">
                  <option value="pending" ${req.status==='pending'?'selected':''}>En attente</option>
                  <option value="in_progress" ${req.status==='in_progress'?'selected':''}>En cours</option>
                  <option value="problematic" ${req.status==='problematic'?'selected':''}>Problématique</option>
                  <option value="processed" ${req.status==='processed'?'selected':''}>Traité</option>
                </select>
              </div>
              <button onclick="toggleRequestRead('${req.id}')" class="text-gray-500 hover:text-blue-600" title="${req.read ? 'Marquer comme non lu' : 'Marquer comme lu'}">
                <i class="fas ${req.read ? 'fa-envelope-open' : 'fa-envelope'}"></i>
              </button>
              <button onclick="deleteRequest('${req.id}')" class="text-red-500 hover:text-red-700" title="Supprimer">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    function toggleRequestRead(id) {
      const req = appState.clientRequests.find(r => r.id === id);
      if (req) {
        req.read = !req.read;
        renderRequests();
        autoSave();
      }
    }
    function toggleRequestProcessed(id) {
      const req = appState.clientRequests.find(r => r.id === id);
      if (req) {
        req.status = req.status === 'processed' ? 'pending' : 'processed';
        req.processed = (req.status === 'processed');
        renderRequests();
        autoSave();
      }
    }

    function updateRequestStatus(id, status) {
      const req = appState.clientRequests.find(r => r.id === id);
      if (!req) return;
      const validStatuses = ['pending','in_progress','problematic','processed'];
      if (!validStatuses.includes(status)) return;
      req.status = status;
      req.processed = (status === 'processed');
    if (status === 'processed') {
      createTransactionFromRequest(req);
    }
      renderRequests();
      autoSave();
    }

    function deleteRequest(id) {
      if(confirm('Supprimer cette demande ?')) {
        appState.clientRequests = appState.clientRequests.filter(r => r.id !== id);
        renderRequests();
        autoSave();
        showToast('Demande supprimée', 'success');
      }
    }
  
  function createTransactionFromRequest(req) {
    const clientName = req.instagram || req.pageFacebook || 'Client';
    let client = (appState.clients || []).find(c => (c.name||'') === clientName);
    if (!client) {
      client = { id: generateId('client'), name: clientName, contact: req.instagram || req.pageFacebook || '', notes: '', totalSpent: 0, unpaid: 0, transactionsCount: 0 };
      appState.clients.push(client);
    }
    const offerName = req.offer || (req.customOffer ? 'Offre personnalisable' : 'Offre');
    const amountUsd = req.customOffer ? Number(req.customBudgetUsd || 0) : Number(req.paymentDetails?.usdToSend || 0);
    const rate = req.customOffer ? Number(req.customRateUsed || 340) : Number(document.getElementById('buyRate')?.value || 340);
    const priceDzd = req.customOffer ? Number(req.customBudgetDzd || 0) : (amountUsd * rate);
    const totalDzd = amountUsd * rate;
    const duration = req.customOffer ? `${req.customDurationDays || 0} jours` : '';
    const txn = {
      id: generateId('txn'),
      date: getLocalDateString(),
      createdAt: Date.now(),
      clientId: client.id,
      clientName: client.name,
      offerId: null,
      offerName,
      amount: Number(amountUsd || 0),
      priceDzd: Number(priceDzd || 0),
      totalDzd: Number(totalDzd || 0),
      profit: 0,
      duration
    };
    appState.transactions.push(txn);
    renderTransactionsTable();
    updateDashboard();
  }

    // === WORK METHOD SECTIONS MANAGEMENT ===

    function renderWorkMethodSectionsAdmin() {
      const container = document.getElementById('workMethodSectionsList');
      if (!container) return;
      
      container.innerHTML = '';
      if (!appState.settings.workMethodSections) appState.settings.workMethodSections = [];
      const sections = appState.settings.workMethodSections;

      if (sections.length === 0) {
        container.innerHTML = '<div class="text-center text-gray-400 py-4">Aucune section. Ajoutez-en une !</div>';
        return;
      }

      sections.forEach((section, index) => {
        const div = document.createElement('div');
        div.className = 'bg-gray-50 border border-gray-200 rounded-xl p-4 relative group';
        div.innerHTML = `
          <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <button onclick="moveWorkMethodSection(${index}, -1)" class="p-1 text-gray-400 hover:text-blue-600" title="Monter">
               <i class="fas fa-arrow-up"></i>
            </button>
            <button onclick="moveWorkMethodSection(${index}, 1)" class="p-1 text-gray-400 hover:text-blue-600" title="Descendre">
               <i class="fas fa-arrow-down"></i>
            </button>
            <button onclick="deleteWorkMethodSection('${section.id}')" class="p-1 text-red-400 hover:text-red-600" title="Supprimer">
               <i class="fas fa-trash"></i>
            </button>
          </div>
          
          <div class="space-y-3">
            <div>
              <label class="block text-xs font-semibold text-gray-500 mb-1">Titre</label>
              <input type="text" value="${section.title || ''}" 
                onchange="updateWorkMethodSection('${section.id}', 'title', this.value)"
                class="w-full p-2 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none">
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-500 mb-1">Paragraphe</label>
              <textarea rows="3"
                onchange="updateWorkMethodSection('${section.id}', 'content', this.value)"
                class="w-full p-2 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none">${section.content || ''}</textarea>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-500 mb-1">Image (Optionnel)</label>
              <div class="flex items-center gap-3">
                ${section.image ? `<img src="${section.image}" class="h-12 w-12 object-cover rounded-lg border bg-white">` : ''}
                <input type="file" accept="image/*" 
                  onchange="handleWorkMethodImageUpload('${section.id}', this)"
                  class="text-xs text-gray-500 w-full">
                ${section.image ? `<button onclick="updateWorkMethodSection('${section.id}', 'image', null)" class="text-xs text-red-500 hover:underline shrink-0">Supprimer</button>` : ''}
              </div>
            </div>
          </div>
        `;
        container.appendChild(div);
      });
    }

    function addWorkMethodSection() {
      if (!appState.settings.workMethodSections) appState.settings.workMethodSections = [];
      
      appState.settings.workMethodSections.push({
        id: generateId('section'),
        title: 'Nouvelle Section',
        content: '',
        image: null
      });
      
      autoSave();
      renderWorkMethodSectionsAdmin();
      // Update client view if visible
      if(document.getElementById('client-method') && !document.getElementById('client-method').classList.contains('hidden')) {
          showClientTab('client-method');
      }
    }

    function updateWorkMethodSection(id, field, value) {
      const section = appState.settings.workMethodSections.find(s => s.id === id);
      if (section) {
        section[field] = value;
        autoSave();
        // If updating image, we might want to re-render admin to show preview immediately
        if (field === 'image') renderWorkMethodSectionsAdmin(); 
        
        if(document.getElementById('client-method') && !document.getElementById('client-method').classList.contains('hidden')) {
            showClientTab('client-method');
        }
      }
    }

    function deleteWorkMethodSection(id) {
      if(confirm('Supprimer cette section ?')) {
        appState.settings.workMethodSections = appState.settings.workMethodSections.filter(s => s.id !== id);
        autoSave();
        renderWorkMethodSectionsAdmin();
        if(document.getElementById('client-method') && !document.getElementById('client-method').classList.contains('hidden')) {
            showClientTab('client-method');
        }
      }
    }

    function moveWorkMethodSection(index, direction) {
      const sections = appState.settings.workMethodSections;
      const newIndex = index + direction;
      
      if (newIndex >= 0 && newIndex < sections.length) {
        const temp = sections[index];
        sections[index] = sections[newIndex];
        sections[newIndex] = temp;
        autoSave();
        renderWorkMethodSectionsAdmin();
        if(document.getElementById('client-method') && !document.getElementById('client-method').classList.contains('hidden')) {
            showClientTab('client-method');
        }
      }
    }

    function handleWorkMethodImageUpload(id, input) {
      if (input.files && input.files[0]) {
        const file = input.files[0];
        const process = async () => {
          try {
            let dataUrl;
            if (file.size > 2 * 1024 * 1024) {
              dataUrl = await compressImageFile(file, { maxBytes: 2 * 1024 * 1024, maxWidth: 1280 });
            } else {
              dataUrl = await readFileAsDataURL(file);
            }
            updateWorkMethodSection(id, 'image', dataUrl);
          } catch (e) {
            showToast('Erreur lors du traitement de lâ€™image', 'error');
          } finally {
            input.value = '';
          }
        };
        process();
      }
    }

    // === CLIENT SPACE LOGIC ===

    function showClientSpace() {
    showToast("Espace client temporairement désactivé", 'warning');
  }

  function hideClientSpace() {
    document.getElementById('clientSpaceContainer').style.display = 'none';
    document.getElementById('loginContainer').style.display = 'flex'; // Restore login flex
  }
  
  function currentClient() {
    if (!(appState.session && appState.session.type === 'client')) return null;
    const id = appState.session.id;
    return (appState.clients || []).find(c => c.id === id) || null;
  }
  
  function renderClientAccountInfo() {
    const c = currentClient();
    const nameEl = document.getElementById('clientAccName');
    const userEl = document.getElementById('clientAccUser');
    const phoneEl = document.getElementById('clientAccPhone');
    const emailEl = document.getElementById('clientAccEmail');
    if (!c) {
      if (nameEl) nameEl.value = '';
      if (userEl) userEl.value = '';
      if (phoneEl) phoneEl.value = '';
      if (emailEl) emailEl.value = '';
      document.getElementById('clientInstagramList')?.replaceChildren();
      document.getElementById('clientFacebookList')?.replaceChildren();
      return;
    }
    if (nameEl) nameEl.value = c.name || '';
    if (userEl) userEl.value = c.username || '';
    if (phoneEl) phoneEl.value = c.phone || '';
    if (emailEl) emailEl.value = c.email || '';
    const igWrap = document.getElementById('clientInstagramList');
    const fbWrap = document.getElementById('clientFacebookList');
    if (igWrap) {
      igWrap.innerHTML = '';
      const arr = (c.social && Array.isArray(c.social.instagram)) ? c.social.instagram : [];
      arr.forEach((acc, idx) => {
        const chip = document.createElement('div');
        chip.className = 'px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm flex items-center gap-2';
        chip.innerHTML = '<span>'+acc+'</span><button class="text-pink-700" onclick="removeClientInstagram('+idx+')"><i class="fas fa-times"></i></button>';
        igWrap.appendChild(chip);
      });
    }
    if (fbWrap) {
      fbWrap.innerHTML = '';
      const arr = (c.social && Array.isArray(c.social.facebook)) ? c.social.facebook : [];
      arr.forEach((acc, idx) => {
        const chip = document.createElement('div');
        chip.className = 'px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2';
        chip.innerHTML = '<span>'+acc+'</span><button class="text-blue-700" onclick="removeClientFacebook('+idx+')"><i class="fas fa-times"></i></button>';
        fbWrap.appendChild(chip);
      });
    }
  }
  
  async function saveClientIdentifiers() {
    const c = currentClient();
    if (!c) { showToast('Aucun client', 'error'); return; }
    const name = document.getElementById('clientAccName')?.value.trim() || '';
    const user = document.getElementById('clientAccUser')?.value.trim() || '';
    const phone = document.getElementById('clientAccPhone')?.value.trim() || '';
    const email = document.getElementById('clientAccEmail')?.value.trim() || '';
    c.name = name || c.name;
    c.username = user;
    c.phone = phone;
    c.email = email;
    c.contact = email || phone || user || c.contact;
    try { saveToLocalStorage(); } catch (e) {}
    await syncClientAccount(c);
    if (appState.settings.storageMode === 'cloud') { try { saveToCloud(); } catch (e) {} }
    showToast('Profil mis à jour', 'success');
    renderClientAccountInfo();
  }
  
  async function addClientInstagram() {
    const c = currentClient();
    if (!c) { showToast('Aucun client', 'error'); return; }
    const val = document.getElementById('clientAddInstagram')?.value.trim();
    if (!val) return;
    if (!c.social) c.social = { instagram: [], facebook: [] };
    if (!Array.isArray(c.social.instagram)) c.social.instagram = [];
    if (!c.social.instagram.includes(val)) c.social.instagram.push(val);
    document.getElementById('clientAddInstagram').value = '';
    try { saveToLocalStorage(); } catch (e) {}
    await syncClientAccount(c);
    if (appState.settings.storageMode === 'cloud') { try { saveToCloud(); } catch (e) {} }
    renderClientAccountInfo();
  }
  
  async function addClientFacebook() {
    const c = currentClient();
    if (!c) { showToast('Aucun client', 'error'); return; }
    const val = document.getElementById('clientAddFacebook')?.value.trim();
    if (!val) return;
    if (!c.social) c.social = { instagram: [], facebook: [] };
    if (!Array.isArray(c.social.facebook)) c.social.facebook = [];
    if (!c.social.facebook.includes(val)) c.social.facebook.push(val);
    document.getElementById('clientAddFacebook').value = '';
    try { saveToLocalStorage(); } catch (e) {}
    await syncClientAccount(c);
    if (appState.settings.storageMode === 'cloud') { try { saveToCloud(); } catch (e) {} }
    renderClientAccountInfo();
  }
  
  async function removeClientInstagram(idx) {
    const c = currentClient();
    if (!c || !c.social || !Array.isArray(c.social.instagram)) return;
    c.social.instagram.splice(idx, 1);
    try { saveToLocalStorage(); } catch (e) {}
    await syncClientAccount(c);
    if (appState.settings.storageMode === 'cloud') { try { saveToCloud(); } catch (e) {} }
    renderClientAccountInfo();
  }
  
  async function removeClientFacebook(idx) {
    const c = currentClient();
    if (!c || !c.social || !Array.isArray(c.social.facebook)) return;
    c.social.facebook.splice(idx, 1);
    try { saveToLocalStorage(); } catch (e) {}
    await syncClientAccount(c);
    if (appState.settings.storageMode === 'cloud') { try { saveToCloud(); } catch (e) {} }
    renderClientAccountInfo();
  }
  function renderClientOffers() {
    const container = document.querySelector('#client-offres .grid');
    if(!container) return;
    
    // Check if we have offers in appState
    if (appState && appState.offers && appState.offers.length > 0) {
        container.innerHTML = '';
        appState.offers.forEach(offer => {
            const div = document.createElement('div');
            div.className = 'border rounded-2xl p-4 hover:shadow-lg transition-all cursor-pointer bg-gray-50 flex flex-col justify-between';
            div.innerHTML = `
              <div>
                <div class="flex justify-between items-center mb-2">
                    <span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">Offre</span>
                    <span class="text-xl font-bold text-gray-800">${offer.name}</span>
                </div>
                <p class="text-gray-600 text-sm mb-4">${offer.description || 'Aucune description'}</p>
                <div class="text-lg font-bold text-blue-600 mb-4">${formatCurrency(offer.price || 0)}</div>
              </div>
              <button onclick="selectClientOffer('${offer.id}')" class="w-full py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50">
                Choisir cette offre
              </button>
            `;
            container.appendChild(div);
        });
    } else {
        container.innerHTML = '<p class="text-gray-500 col-span-2 text-center py-8">Aucune offre trouvée â€¢ Ajoutez vos offres dans le tableau de bord (onglet Offres).</p>';
    }
  }

  function populateClientOrderOffers() {
    const select = document.getElementById('orderOfferSelect');
    if(!select) return;
    
    // Keep the default option
    select.innerHTML = '<option value="">-- Choisir une offre --</option>';
    
    if (appState && appState.offers && appState.offers.length > 0) {
        appState.offers.forEach(offer => {
            const opt = document.createElement('option');
            opt.value = offer.name; // Use name for the order since ID might not mean much to the recipient without the DB
            opt.textContent = `${offer.name} - ${formatCurrency(offer.price || 0)}`;
            select.appendChild(opt);
        });
    }
  }

  function selectClientOffer(offerId) {
    // Switch to order tab
    showClientTab('client-order');
    // Try to select it in the dropdown
    const offer = appState.offers.find(o => o.id === offerId);
    if(offer) {
        const select = document.getElementById('orderOfferSelect');
        if(select) {
            // We populated values with names in populateClientOrderOffers
            select.value = offer.name; 
        }
    }
  }

  function showClientTab(tabId) {
    // Hide all contents
    document.querySelectorAll('.client-tab-content').forEach(el => el.classList.add('hidden'));
    // Show target
    document.getElementById(tabId).classList.remove('hidden');
    
    // Update buttons
    document.querySelectorAll('.client-tab-btn').forEach(btn => {
      btn.classList.remove('bg-blue-100', 'text-blue-700', 'active-client-tab');
      btn.classList.add('text-gray-600', 'hover:bg-gray-100');
      if(btn.dataset.tab === tabId) {
         btn.classList.remove('text-gray-600', 'hover:bg-gray-100');
         btn.classList.add('bg-blue-100', 'text-blue-700', 'active-client-tab');
      }
    });

    // Dynamic content loading
    if (tabId === 'client-method') {
       const content = document.getElementById('clientMethodContent');
       if (content) {
          content.innerHTML = appState.settings.workMethodText || '<p>Information non disponible.</p>';
          content.querySelectorAll('img').forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => openImagePreview(img.src));
          });
       }
    }
    if (tabId === 'client-custom') {
       renderCustomSectionClient();
    }
    if (tabId === 'client-requests') {
       renderClientRequests();
    }
  }

  // === FORM LOGIC ===

  function updateFormLogic() {
    const platform = document.getElementById('platformSelect').value;
    const metaSection = document.getElementById('metaSection');
    const tiktokSection = document.getElementById('tiktokSection');
    const commonFields = document.getElementById('commonFields');
    const websiteSection = document.getElementById('websiteLinkSection');

    // Reset visibility
    metaSection.classList.add('hidden');
    tiktokSection.classList.add('hidden');
    commonFields.classList.add('hidden');
    websiteSection.classList.add('hidden');

    if (platform === 'meta') {
      metaSection.classList.remove('hidden');
      commonFields.classList.remove('hidden');
      updateMetaLogic(); // Re-check internal meta state
    } else if (platform === 'tiktok') {
      tiktokSection.classList.remove('hidden');
      commonFields.classList.remove('hidden');
      updateTikTokLogic(); // Re-check internal tiktok state
    }
  }

  function updateMetaLogic() {
    const objective = document.getElementById('metaObjective').value;
    const followersOpts = document.getElementById('metaFollowersOptions');
    const messagesOpts = document.getElementById('metaMessagesOptions');
    const websiteSection = document.getElementById('websiteLinkSection');

    followersOpts.classList.add('hidden');
    messagesOpts.classList.add('hidden');
    websiteSection.classList.add('hidden');

    if (objective === 'followers') {
      followersOpts.classList.remove('hidden');
    } else if (objective === 'messages') {
      messagesOpts.classList.remove('hidden');
    } else if (objective === 'conversion') {
      websiteSection.classList.remove('hidden');
    }
  }

  function updateTikTokLogic() {
    const objective = document.getElementById('tiktokObjective').value;
    const messagesOpts = document.getElementById('tiktokMessagesOptions');
    const websiteSection = document.getElementById('websiteLinkSection');

    messagesOpts.classList.add('hidden');
    websiteSection.classList.add('hidden');

    if (objective === 'messages') {
      messagesOpts.classList.remove('hidden');
    } else if (objective === 'conversion') {
      websiteSection.classList.remove('hidden');
    }
  }

  function previewFile(input) {
    const preview = document.getElementById('filePreview');
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        preview.innerHTML = `<img src="${e.target.result}" class="h-32 mx-auto rounded-lg object-contain shadow-md">`;
      }
      reader.readAsDataURL(input.files[0]);
    }
  }

  async function compressImageFile(file, opts = {}) {
    const maxBytes = opts.maxBytes || (2 * 1024 * 1024);
    const maxWidth = opts.maxWidth || 1280;
    const minQuality = opts.minQuality || 0.5;
    const step = opts.step || 0.1;
    const readAsDataURL = (f) => new Promise(resolve => {
      const r = new FileReader();
      r.onload = e => resolve(e.target.result);
      r.readAsDataURL(f);
    });
    const src = await readAsDataURL(file);
    const img = new Image();
    img.src = src;
    await new Promise(res => { img.onload = res; });
    const ratio = img.width > maxWidth ? maxWidth / img.width : 1;
    const canvas = document.createElement('canvas');
    canvas.width = Math.floor(img.width * ratio);
    canvas.height = Math.floor(img.height * ratio);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    let quality = 0.9;
    let out = canvas.toDataURL('image/jpeg', quality);
    while (out.length * 0.75 > maxBytes && quality > minQuality) {
      quality = Math.max(minQuality, quality - step);
      out = canvas.toDataURL('image/jpeg', quality);
    }
    return out;
  }

  function readFileAsDataURL(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  }

  async function handleOrderSubmit(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Envoi en cours...';
    btn.disabled = true;

    // 1. Gather Basic Data
    const platform = document.getElementById('platformSelect').value;
    const paymentMethod = document.getElementById('paymentMethodSelect').value;
    
    // 2. Construct Order Data Object
    const orderData = {
        id: 'REQ-' + Date.now(),
        date: getLocalDateString(),
        read: false,
        processed: false,
        platform: platform || 'N/A',
        paymentMethod: paymentMethod || 'N/A',
        paymentProof: null,
        status: 'pending',
        clientToken: getClientToken()
    };

    // 3. Add Platform Specifics
    if (platform === 'meta') {
        orderData.metaObjective = document.getElementById('metaObjective').value;
        const followersTarget = document.querySelector('input[name="metaFollowersTarget"]:checked');
        if (followersTarget) orderData.metaFollowersTarget = followersTarget.value;
        
        const messagesTarget = document.querySelectorAll('input[name="metaMsgTarget"]:checked');
        if (messagesTarget.length > 0) {
             orderData.metaMessagesTarget = Array.from(messagesTarget).map(cb => cb.value).join(', ');
        }
    } else if (platform === 'tiktok') {
        orderData.tiktokObjective = document.getElementById('tiktokObjective').value;
        const tiktokMsg = document.querySelector('input[name="tiktokMsgTarget"]:checked');
        if (tiktokMsg) orderData.tiktokMsgTarget = tiktokMsg.value;
    }

    // 4. Add User Inputs
    orderData.instagram = document.getElementById('metaInstaName').value;
    orderData.pageFacebook = document.getElementById('metaFbName').value;
    orderData.offer = document.getElementById('orderOfferSelect').value;
    orderData.websiteUrl = document.getElementById('websiteUrl').value;
    orderData.pubLink = document.getElementById('pubLink').value;
    orderData.clientNote = document.getElementById('clientNote').value;

    // 5.1 Payment Proof capture (base64)
    const proofInput = document.getElementById('paymentProof');
    if (proofInput && proofInput.files && proofInput.files[0]) {
      const file = proofInput.files[0];
      try {
        if (file.size > 2 * 1024 * 1024) {
          orderData.paymentProof = await compressImageFile(file);
        } else {
          orderData.paymentProof = await readFileAsDataURL(file);
        }
      } catch (err) {
        console.warn('Erreur lecture/compression preuve', err);
      }
    }

    // 5. RedotPay Logic
    if (paymentMethod === 'redotpay') {
          const dzdAmount = parseFloat(document.getElementById('redotpayDzdAmount').value || 0);
          orderData.paymentDetails = {
              method: 'RedotPay',
              dzdAmount: dzdAmount,
              usdToSend: dzdAmount / 250
          };
    }

    const customToggle = document.getElementById('customOfferToggle');
    const customFields = document.getElementById('customOfferFields');
    if (customToggle && customToggle.checked) {
      const mode = document.getElementById('customOfferMode').value;
      const budget = parseFloat(document.getElementById('customOfferBudget').value || 0);
      const durationDays = parseInt(document.getElementById('customOfferDuration').value || '0', 10);
      if (durationDays < 3) { showToast('Durée minimale: 3 jours', 'error'); resetSubmitButton(btn, originalText); return; }
      const rate = (mode === 'usd' ? computeCustomRate(budget) : computeCustomRate(budget / 340));
      if (mode === 'usd' && budget < 3) { showToast('Budget minimum: 3 USD', 'error'); resetSubmitButton(btn, originalText); return; }
      if (mode === 'dzd' && (budget / rate) < 3) { showToast('Budget minimum: 3 USD', 'error'); resetSubmitButton(btn, originalText); return; }
      orderData.customOffer = true;
      orderData.customOfferMode = mode;
      orderData.customDurationDays = durationDays;
      orderData.customRateUsed = rate;
      if (mode === 'usd') {
        orderData.customBudgetUsd = budget;
        orderData.customBudgetDzd = Math.round(budget * rate);
      } else {
        orderData.customBudgetDzd = budget;
        orderData.customBudgetUsd = +(budget / rate).toFixed(2);
      }
      orderData.offer = orderData.offer || 'Offre personnalisable';
    }

    // 6. Add Client if New
    const clientName = orderData.instagram || orderData.pageFacebook || 'Nouveau Client';
    const isNewClient = !appState.clients.some(c => 
        (c.contact && (c.contact === orderData.instagram || c.contact === orderData.pageFacebook)) ||
        (c.name === clientName)
    );

    if (isNewClient) {
        const newClient = {
            id: 'client-' + Date.now(),
            name: clientName,
            contact: orderData.instagram || orderData.pageFacebook || '',
            notes: 'Ajouté automatiquement via commande',
            status: 'Actif',
            joinedDate: getLocalDateString()
        };
        appState.clients.push(newClient);
    }

        // 7. Save
    setTimeout(async () => {
      if(!appState.clientRequests) appState.clientRequests = [];
      
      // Fix: Attach Client ID if logged in
      if (appState.session && appState.session.type === 'client') {
          orderData.clientId = appState.session.id;
      }
      
      appState.clientRequests.push(orderData);

      // Fix: Sync to Cloud Collection
      await syncClientRequest(orderData);
      
      if(appState.settings.storageMode === 'cloud') {
        saveToCloud(); 
      } else {
        saveToLocalStorage();
      }
      
      updateRequestsBadge();
      try {
        if (typeof renderRequests === 'function' && appState.currentTab === 'requests') {
          renderRequests();
        }
      } catch (e) {}

      if (isNewClient) {
          showNewClientPopup();
      } else {
          alert('âœ… Commande envoyée avec succès ! Notre équipe vous contactera bientÃ´t.');
      }

      btn.innerHTML = originalText;
      btn.disabled = false;
      e.target.reset();
      updateFormLogic();
      const preview = document.getElementById('filePreview');
      if(preview) {
        preview.innerHTML = `
          <i class="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
          <p class="text-gray-500" data-i18n="lbl_upload_proof_hint">Cliquez ou déposez votre reÃ§u ici</p>
        `;
      }
      // Reset payment sections
      document.querySelectorAll('#redotpayCalculator, #ccpInfo, #baridimobInfo').forEach(el => el.classList.add('hidden'));
    }, 1500);
  }
  
  function computeCustomRate(usdAmount) {
    if (!usdAmount || usdAmount <= 100) return 340;
    return 320;
  }
  // === GLOBAL SYNC FOR CLIENTS ===
  async function syncClientRequest(orderData) {
    try {
      const docId = orderData.id || 'REQ-' + Date.now();
      if(typeof db !== 'undefined') await db.collection('requests').doc(docId).set(orderData);
      console.log('Demande synchronisÃ©e avec le cloud (Collection Requests)');
    } catch(e) { console.warn('Erreur synchro demande:', e); }
  }

  async function syncClientAccount(clientData) {
    try {
      if (!clientData.id) return;
      if(typeof db !== 'undefined') await db.collection('clients').doc(clientData.id).set(clientData);
      console.log('Compte client synchronisÃ© (Collection Clients)');
    } catch(e) { console.warn('Erreur synchro client:', e); }
  }
  // === GLOBAL SYNC FOR CLIENTS ===
  async function syncClientRequest(orderData) {
    try {
      const docId = orderData.id || 'REQ-' + Date.now();
      if(typeof db !== 'undefined') await db.collection('requests').doc(docId).set(orderData);
      console.log('Demande synchronisÃ©e avec le cloud (Collection Requests)');
    } catch(e) { console.warn('Erreur synchro demande:', e); }
  }

  async function syncClientAccount(clientData) {
    try {
      if (!clientData.id) return;
      if(typeof db !== 'undefined') await db.collection('clients').doc(clientData.id).set(clientData);
      console.log('Compte client synchronisÃ© (Collection Clients)');
    } catch(e) { console.warn('Erreur synchro client:', e); }
  }
  function ensureClientToken() {
    if (!localStorage.getItem('clientToken')) {
      localStorage.setItem('clientToken', 'CT-' + Math.random().toString(36).slice(2) + Date.now());
    }
  }
  function getClientToken() {
    ensureClientToken();
    return localStorage.getItem('clientToken');
  }
  async function renderClientRequests() {
    const list = document.getElementById('clientRequestsList');
    if (!list) return;
    
    // 1. Token Local
    const token = getClientToken();
    
    // 2. Session Info
    const sessionId = (appState.session && appState.session.type === 'client') ? appState.session.id : null;
    let clientContact = null;
    if (sessionId) {
        const client = (appState.clients || []).find(c => c.id === sessionId);
        if (client) clientContact = client.contact;

        // --- SYNC FROM CLOUD ---
        if (typeof db !== 'undefined') {
            try {
                // Fetch by ID
                const snaps = await db.collection('requests').where('clientId', '==', sessionId).get();
                snaps.forEach(doc => {
                    const d = doc.data();
                    if(!appState.clientRequests) appState.clientRequests = [];
                    if(!appState.clientRequests.some(r => r.id === d.id)) appState.clientRequests.push(d);
                });
            } catch(e) { console.warn('Sync requests error:', e); }
        }
    }

    const items = (appState.clientRequests || []).filter(r => {
        if (r.clientToken && r.clientToken === token) return true;
        if (sessionId && r.clientId === sessionId) return true;
        if (clientContact) {
            if (r.instagram && r.instagram.toLowerCase() === clientContact.toLowerCase()) return true;
            if (r.pageFacebook && r.pageFacebook.toLowerCase() === clientContact.toLowerCase()) return true;
        }
        return false;
    }).sort((a,b)=>new Date(b.date)-new Date(a.date));

    list.innerHTML = '';
    if (items.length === 0) {
      list.innerHTML = '<div class="text-gray-500 text-center py-4">Aucune demande pour le moment.</div>';
      return;
    }
    const statusText = {
      pending: 'En attente',
      in_progress: 'En cours',
      problematic: 'ProblÃ©matique',
      processed: 'TraitÃ©'
    };
    items.forEach(req => {
      const div = document.createElement('div');
      div.className = 'border rounded-xl p-4 bg-gray-50 flex items-center justify-between hover:shadow-sm transition';
      const s = statusText[req.status || 'pending'];
      const statusClass = req.status==='processed'?'bg-green-100 text-green-800 border-green-200':
                          req.status==='in_progress'?'bg-blue-100 text-blue-800 border-blue-200':
                          req.status==='problematic'?'bg-red-100 text-red-800 border-red-200':
                          'bg-yellow-100 text-yellow-800 border-yellow-200';
      
      div.innerHTML = `
        <div>
          <div class="font-bold text-gray-800">${req.offer || 'Offre'}</div>
          <div class="text-xs text-gray-500 mt-1"><i class="far fa-clock mr-1"></i> ${new Date(req.date).toLocaleString()}</div>
          ${req.pubLink ? `<div class="text-xs mt-1"><a class="text-blue-600 hover:underline" target="_blank" href="${req.pubLink}"><i class="fas fa-link mr-1"></i> Lien Pub</a></div>` : ''}
          ${req.instagram ? `<div class="text-xs text-gray-400 mt-0.5">@${req.instagram}</div>` : ''}
        </div>
        <div class="text-sm">
          <span class="px-3 py-1 rounded-full border text-xs font-semibold ${statusClass}">${s}</span>
        </div>
      `;
      list.appendChild(div);
    });
  }

  function showNewClientPopup() {
      const modalHtml = `
        <div id="newClientModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center animate-fade-in-down relative">
                <div class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                    <i class="fas fa-check"></i>
                </div>
                <h3 class="text-2xl font-bold text-gray-800 mb-2" data-i18n="popup_new_client_title">Bienvenue !</h3>
                <p class="text-gray-600 mb-6" data-i18n="popup_new_client_msg">
                    Nous avons bien reÃ§u votre première commande. Pour comprendre le déroulement, veuillez consulter notre méthode de travail.
                </p>
                <button onclick="closeNewClientPopupAndRedirect()" class="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all">
                    <i class="fas fa-book-open mr-2"></i> <span data-i18n="btn_go_method">Voir la Méthode de Travail</span>
                </button>
            </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', modalHtml);
      
      // Re-apply translations for popup
      const userLang = navigator.language.startsWith('ar') ? 'ar' : 'fr';
      setLanguage(userLang); 
  }

  window.closeNewClientPopupAndRedirect = function() {
      const modal = document.getElementById('newClientModal');
      if(modal) modal.remove();
      showClientTab('client-method');
  };

  function toggleRedotpayCalculator() {
    const select = document.getElementById('paymentMethodSelect');
    const calc = document.getElementById('redotpayCalculator');
    const ccp = document.getElementById('ccpInfo');
    const baridi = document.getElementById('baridimobInfo');

    if(!select) return;

    // Hide all first
    if(calc) calc.classList.add('hidden');
    if(ccp) ccp.classList.add('hidden');
    if(baridi) baridi.classList.add('hidden');
    
    if(select.value === 'redotpay' && calc) {
        calc.classList.remove('hidden');
    } else if (select.value === 'ccp' && ccp) {
        ccp.classList.remove('hidden');
    } else if (select.value === 'baridimob' && baridi) {
        baridi.classList.remove('hidden');
    }
  }

  window.copyToClipboard = function(text, btn) {
      navigator.clipboard.writeText(text).then(() => {
          const originalContent = btn.innerHTML;
          const copiedText = document.documentElement.lang === 'ar' ? 'ØªÙ… Ø§Ù„Ù†Ø³Ø® !' : 'Copié !';
          
          btn.innerHTML = `<i class="fas fa-check mr-1"></i> ${copiedText}`;
          btn.classList.remove('bg-blue-100', 'text-blue-700', 'bg-yellow-100', 'text-yellow-700', 'bg-red-100', 'text-red-700');
          btn.classList.add('bg-green-100', 'text-green-700');
          
          setTimeout(() => {
              btn.innerHTML = originalContent;
              // Reset colors loosely (simplified) or specific logic could be added
              btn.classList.remove('bg-green-100', 'text-green-700');
              btn.classList.add('bg-gray-100', 'text-gray-700'); // Default fallback
          }, 2000);
      });
  };

  function calculateRedotpayUsd() {
    const dzdInput = document.getElementById('redotpayDzdAmount');
    const usdDisplay = document.getElementById('redotpayUsdDisplay');
    if(!dzdInput || !usdDisplay) return;
    
    const dzd = parseFloat(dzdInput.value);
    if(isNaN(dzd) || dzd <= 0) {
        usdDisplay.textContent = '0.00 $';
        return;
    }
    
    const usd = dzd / 250;
    usdDisplay.textContent = usd.toFixed(2) + ' $';
  }

  // === GESTION SECTION PERSO (ADMIN) ===
  function saveCustomSectionTitle() {
      const input = document.getElementById('customSectionTitleInput');
      if(input && input.value) {
          appState.customSection.title = input.value;
          saveToLocalStorage();
          if(appState.settings.storageMode === 'cloud') saveToCloud();
          showToast('Titre mis à jour', 'success');
          renderCustomSectionClient(); // Update client view if visible
      }
  }

  function addCustomCategory() {
      const title = document.getElementById('newCatTitle').value;
      const desc = document.getElementById('newCatDesc').value;
      const img = document.getElementById('newCatImage').value;
      const filesInput = document.getElementById('newCatImages');

      if(!title) { showToast('Titre requis', 'error'); return; }

      const newCat = {
          id: 'cat-' + Date.now(),
          title,
          desc,
          image: img || '',
          photos: []
      };

      if (filesInput && filesInput.files && filesInput.files.length > 0) {
          const files = Array.from(filesInput.files);
          const tasks = files.map(async (f) => {
            try {
              if (f.size > 2 * 1024 * 1024) {
                return await compressImageFile(f);
              } else {
                return await readFileAsDataURL(f);
              }
            } catch { return null; }
          });
          Promise.all(tasks).then(results => {
              results.forEach(r => { if (r) newCat.photos.push(r); });
              if (!newCat.image) {
                  newCat.image = newCat.photos[0] || 'https://via.placeholder.com/400x300?text=No+Image';
              }
              appState.customSection.categories.push(newCat);
              saveToLocalStorage();
              if(appState.settings.storageMode === 'cloud') saveToCloud();
              
              showToast('Catégorie ajoutée', 'success');
              renderCustomSectionAdmin();
              renderCustomSectionClient();
              
              document.getElementById('newCatTitle').value = '';
              document.getElementById('newCatDesc').value = '';
              document.getElementById('newCatImage').value = '';
              filesInput.value = '';
          });
          return;
      }

      if (!newCat.image) {
          newCat.image = 'https://via.placeholder.com/400x300?text=No+Image';
      }
      appState.customSection.categories.push(newCat);
      saveToLocalStorage();
      if(appState.settings.storageMode === 'cloud') saveToCloud();
      
      showToast('Catégorie ajoutée', 'success');
      renderCustomSectionAdmin();
      renderCustomSectionClient(); // Update client view
      
      // Clear inputs
      document.getElementById('newCatTitle').value = '';
      document.getElementById('newCatDesc').value = '';
      document.getElementById('newCatImage').value = '';
      if (filesInput) filesInput.value = '';
  }

  function deleteCustomCategory(id) {
      if(confirm('Supprimer cette catégorie ?')) {
          appState.customSection.categories = appState.customSection.categories.filter(c => c.id !== id);
          saveToLocalStorage();
          if(appState.settings.storageMode === 'cloud' && auth && auth.currentUser) saveToCloud();
          renderCustomSectionAdmin();
          renderCustomSectionClient();
          showToast('Catégorie supprimée', 'success');
      }
  }

  function renderCustomSectionAdmin() {
      const container = document.getElementById('adminCustomCategoriesList');
      const titleInput = document.getElementById('customSectionTitleInput');
      
      if(titleInput && appState.customSection) titleInput.value = appState.customSection.title;

      if(!container || !appState.customSection) return;

      container.innerHTML = '';
      const wmBox = document.createElement('div');
      wmBox.className = 'bg-white p-4 rounded-xl border shadow-sm mb-4';
      wmBox.innerHTML = `
        <h4 class="font-bold mb-3">Ã‰diteur Méthode de Travail</h4>
        <textarea id="workMethodEditorInCustom" rows="5" class="w-full p-3 border rounded-lg">${appState.settings.workMethodText || ''}</textarea>
        <div class="mt-2 flex gap-2">
          <button id="saveWmBtn" class="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Sauvegarder</button>
          <button id="previewWmBtn" class="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">Voir dans Espace Client</button>
        </div>
      `;
      container.appendChild(wmBox);
      const saveBtn = wmBox.querySelector('#saveWmBtn');
      const prevBtn = wmBox.querySelector('#previewWmBtn');
      if (saveBtn) {
        saveBtn.addEventListener('click', () => {
          const val = document.getElementById('workMethodEditorInCustom').value;
          appState.settings.workMethodText = val;
          autoSave();
          showToast('Méthode de travail mise à jour', 'success');
        });
      }
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          showClientTab('client-method');
        });
      }
      appState.customSection.categories.forEach((cat, idx) => {
          if (!Array.isArray(cat.photos)) cat.photos = cat.image ? [cat.image] : [];
          const div = document.createElement('div');
          div.className = 'bg-white p-4 rounded-xl border shadow-sm';
          const cover = (Array.isArray(cat.photos) && cat.photos[0]) ? cat.photos[0] : (cat.image || 'https://via.placeholder.com/400x300?text=No+Image');
          const photosGrid = Array.isArray(cat.photos) && cat.photos.length > 0 ? `
              <div class="admin-photos-grid grid grid-cols-6 gap-2" data-cat-id="${cat.id}">
                ${cat.photos.map((p, i) => `
                  <div class="relative group" draggable="true" data-photo-index="${i}">
                    <img src="${p}" class="w-20 h-20 object-cover rounded-lg border cursor-move" title="Glisser pour réordonner" onclick="openImagePreview('${p}')">
                    <div class="absolute bottom-1 right-1 bg-white bg-opacity-80 text-gray-700 rounded px-1 text-[10px] pointer-events-none"><i class="fas fa-grip-lines"></i></div>
                    <div class="absolute top-1 left-1 bg-black bg-opacity-40 text-white text-[10px] px-1 rounded pointer-events-none">#${i+1}</div>
                    <button onclick="deleteCustomCategoryPhoto('${cat.id}', ${i})" class="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition">Ã—</button>
                  </div>
                `).join('')}
              </div>
          ` : '<p class="text-xs text-gray-400">Aucune photo</p>';
          div.innerHTML = `
              <div class="flex gap-4 items-start">
                  <img src="${cover}" class="w-24 h-24 object-cover rounded-lg bg-gray-100 border cursor-pointer" onclick="openImagePreview('${cover}')">
                  <div class="flex-1 space-y-2">
                      <div>
                          <label class="block text-xs font-semibold text-gray-500 mb-1">Titre</label>
                          <input type="text" value="${cat.title || ''}" onchange="updateCustomCategory('${cat.id}', 'title', this.value)" class="w-full p-2 border rounded-lg text-sm">
                      </div>
                      <div>
                          <label class="block text-xs font-semibold text-gray-500 mb-1">Description</label>
                          <textarea rows="2" onchange="updateCustomCategory('${cat.id}', 'desc', this.value)" class="w-full p-2 border rounded-lg text-sm">${cat.desc || ''}</textarea>
                      </div>
                      <div>
                          <label class="block text-xs font-semibold text-gray-500 mb-1">Ajouter des photos</label>
                          <input type="file" accept="image/*" multiple onchange="handleCustomCategoryPhotosUpload('${cat.id}', this)" class="w-full p-2 border rounded-lg text-sm">
                      </div>
                      ${photosGrid}
                  </div>
                  <div class="flex flex-col items-center gap-2">
                      <button onclick="deleteCustomCategory('${cat.id}')" class="text-red-500 hover:text-red-700 p-2">
                          <i class="fas fa-trash"></i>
                      </button>
                  </div>
              </div>
          `;
          container.appendChild(div);
          setupPhotoDragAndDrop();
      });
  }

    function setupPhotoDragAndDrop() {
      document.querySelectorAll('.admin-photos-grid').forEach(grid => {
        const catId = grid.dataset.catId;
        let dragSrcIndex = null;
        grid.addEventListener('dragstart', (e) => {
          const item = e.target.closest('[data-photo-index]');
          if (!item) return;
          dragSrcIndex = Number(item.dataset.photoIndex || item.getAttribute('data-photo-index'));
          e.dataTransfer.effectAllowed = 'move';
        });
        grid.addEventListener('dragover', (e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
        });
        grid.addEventListener('drop', (e) => {
          e.preventDefault();
          const item = e.target.closest('[data-photo-index]');
          if (!item) return;
          const dropIndex = Number(item.dataset.photoIndex || item.getAttribute('data-photo-index'));
          if (dragSrcIndex === null || dropIndex === null || dragSrcIndex === dropIndex) return;
          const cat = appState.customSection.categories.find(c => c.id === catId);
          if (!cat || !Array.isArray(cat.photos)) return;
          const moved = cat.photos.splice(dragSrcIndex, 1)[0];
          cat.photos.splice(dropIndex, 0, moved);
          saveToLocalStorage();
          if(appState.settings.storageMode === 'cloud' && auth && auth.currentUser) saveToCloud();
          renderCustomSectionAdmin();
          renderCustomSectionClient();
        });
      });
    }

  function updateCustomCategory(id, field, value) {
      const cat = appState.customSection.categories.find(c => c.id === id);
      if (!cat) return;
      cat[field] = value;
      saveToLocalStorage();
      if(appState.settings.storageMode === 'cloud' && auth && auth.currentUser) saveToCloud();
      renderCustomSectionAdmin();
      renderCustomSectionClient();
  }

  function handleCustomCategoryPhotosUpload(id, input) {
      const cat = appState.customSection.categories.find(c => c.id === id);
      if (!cat || !input.files) return;
      if (!Array.isArray(cat.photos)) cat.photos = [];
      const files = Array.from(input.files);
      const tasks = files.map(async (f) => {
          try {
            if (f.size > 2 * 1024 * 1024) {
              return await compressImageFile(f);
            } else {
              return await readFileAsDataURL(f);
            }
          } catch { return null; }
      });
      Promise.all(tasks).then(results => {
          results.forEach(r => { if (r) cat.photos.push(r); });
          if (!cat.image && cat.photos.length > 0) cat.image = cat.photos[0];
          saveToLocalStorage();
          if(appState.settings.storageMode === 'cloud' && auth && auth.currentUser) saveToCloud();
          renderCustomSectionAdmin();
          renderCustomSectionClient();
          input.value = '';
          showToast('Photos ajoutées', 'success');
      });
  }

  function deleteCustomCategoryPhoto(id, index) {
      const cat = appState.customSection.categories.find(c => c.id === id);
      if (!cat || !Array.isArray(cat.photos)) return;
      cat.photos.splice(index, 1);
      if (cat.photos.length > 0) {
          cat.image = cat.photos[0];
      } else {
          cat.image = cat.image || '';
      }
      saveToLocalStorage();
      if(appState.settings.storageMode === 'cloud' && auth && auth.currentUser) saveToCloud();
      renderCustomSectionAdmin();
      renderCustomSectionClient();
  }

  // === RENDU CLIENT SECTION PERSO ===
  function renderCustomSectionClient() {
      const container = document.getElementById('clientCustomContent');
      const title = document.getElementById('clientCustomTitle');
      const tabTitle = document.getElementById('clientCustomTabTitle');

      if(appState.customSection) {
          if(title) title.textContent = appState.customSection.title;
          if(tabTitle) tabTitle.textContent = appState.customSection.title;
      }

      if(!container || !appState.customSection) return;
      
      container.innerHTML = '';
      if(appState.customSection.categories.length === 0) {
          container.innerHTML = '<p class="text-gray-500 col-span-3 text-center py-8">BientÃ´t disponible...</p>';
          return;
      }

      appState.customSection.categories.forEach(cat => {
          if (!Array.isArray(cat.photos)) cat.photos = cat.image ? [cat.image] : [];
          const div = document.createElement('div');
          div.className = 'bg-white rounded-2xl shadow-lg overflow-hidden border hover:shadow-xl transition-all';
          const cover = (Array.isArray(cat.photos) && cat.photos[0]) ? cat.photos[0] : (cat.image || 'https://via.placeholder.com/400x300?text=No+Image');
          const gallery = Array.isArray(cat.photos) && cat.photos.length > 1 ? `
              <div class="p-6 pt-0 grid grid-cols-3 gap-2">
                  ${cat.photos.slice(1).map(p => `<img src="${p}" loading="lazy" class="w-full h-24 object-cover rounded-lg border cursor-pointer" onclick="openImagePreview('${p}')">`).join('')}
              </div>
          ` : '';
          div.innerHTML = `
              <div class="h-48 bg-gray-200 overflow-hidden">
                  <img src="${cover}" loading="lazy" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer" onclick="openImagePreview('${cover}')">
              </div>
              <div class="p-6">
                  <h3 class="text-xl font-bold text-gray-800 mb-2">${cat.title}</h3>
                  <p class="text-gray-600 text-sm leading-relaxed">${cat.desc}</p>
              </div>
              ${gallery}
          `;
          container.appendChild(div);
      });
  }

  // === INITIALISATION GLOBALE ===
  document.addEventListener('DOMContentLoaded', async function () {
    const loginBtn = document.getElementById('loginButton');
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof window.handleLoginClick === 'function') window.handleLoginClick();
        });
    }
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    const onEnter = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (typeof window.handleLoginClick === 'function') window.handleLoginClick();
      }
    };
    if (loginEmail) loginEmail.addEventListener('keydown', onEnter);
    if (loginPassword) loginPassword.addEventListener('keydown', onEnter);

    try {
        const userLang = (navigator.language && navigator.language.startsWith('ar')) ? 'ar' : 'fr';
        if (typeof setLanguage === 'function') setLanguage(userLang);

        if (typeof updateAuthUI === 'function') updateAuthUI(auth ? auth.currentUser : null);
        if (typeof loadFromLocalStorage === 'function') loadFromLocalStorage();
        if (typeof updateDefaultBuyRateFromLastPurchase === 'function') updateDefaultBuyRateFromLastPurchase();
        if (typeof setEmployeeGuardEnabled === 'function') {
          setEmployeeGuardEnabled(!!(appState.session && appState.session.type === 'employee'));
        }
        const buyRateInput = document.getElementById('buyRate');
        if (buyRateInput && appState.settings) {
          const v = Number(appState.settings.defaultBuyRate || 0);
          if (v > 0) buyRateInput.value = v;
        }
        
        if (typeof newClient !== 'undefined') {
          if (typeof syncClientAccount === 'function') await syncClientAccount(newClient);
        }
        
        if (auth && auth.currentUser && appState.settings && appState.settings.storageMode === 'cloud') {
          if (typeof window.loadFromCloud === 'function') {
            await window.loadFromCloud();
          } else if (typeof loadFromCloud === 'function') {
            await loadFromCloud();
          }
        }
        
        if (typeof applyRecurringExpensesForCurrentMonth === 'function') applyRecurringExpensesForCurrentMonth();

        const isEmp = (appState.session && appState.session.type === 'employee');
        if (auth && auth.currentUser) {
          if (typeof showTab === 'function') showTab('dashboard');
        } else if (isEmp) {
          if (typeof forceAdminView === 'function') forceAdminView();
          if (typeof updateDashboard === 'function') updateDashboard();
          if (typeof showTab === 'function') showTab('clients');
        } else {
          const appContainer = document.getElementById('appContainer');
          const loginContainer = document.getElementById('loginContainer');
          if (appContainer) appContainer.style.display = 'none';
          if (loginContainer) loginContainer.style.display = 'flex';
        }
        
        if (typeof ensureVisibleUI === 'function') ensureVisibleUI();
        if (typeof ensureAuthVisibility === 'function') ensureAuthVisibility();
        if (typeof visibilityWatchdog === 'function') visibilityWatchdog(3000);
        
        if (typeof isAdminSession === 'function' && isAdminSession()) {
          if (typeof forceAdminView === 'function') forceAdminView();
        }
        
        if (typeof uiGuardLoop === 'function') uiGuardLoop(5000);
        
        if (typeof populateClientDropdown === 'function') populateClientDropdown();
        if (typeof populateOfferSelect === 'function') populateOfferSelect();
        if (typeof populateExpenseCategorySelect === 'function') populateExpenseCategorySelect();
        if (typeof populatePaymentClientSelect === 'function') populatePaymentClientSelect();
        if (typeof populateAdAccountSelect === 'function') populateAdAccountSelect();
        if (typeof recalculateFinanceBalances === 'function') recalculateFinanceBalances();
        if (typeof renderTables === 'function') renderTables();
        if (typeof updateNavButtonsVisibility === 'function') updateNavButtonsVisibility();
        if (typeof renderAdsTable === 'function') renderAdsTable();
        if (typeof renderAdAccountsList === 'function') renderAdAccountsList();
        if (typeof renderAuditLog === 'function') renderAuditLog();
        if (typeof calculatePreview === 'function') calculatePreview();
        if (typeof updateDashboard === 'function') updateDashboard();
        if (typeof setupEventListeners === 'function') setupEventListeners();
        if (typeof setupClientSearchListeners === 'function') setupClientSearchListeners();
    } catch (err) {
        console.error('CRITICAL INIT ERROR:', err);
    }
    
    const empToggle = document.getElementById('employeeModeToggle');
    const emailLabel = document.querySelector('label[for="loginEmail"]');
    const emailInput = document.getElementById('loginEmail');
    if (empToggle && emailLabel && emailInput) {
      empToggle.addEventListener('change', function () {
        const isEmp = empToggle.checked;
        emailLabel.textContent = isEmp ? 'Nom dâ€™utilisateur' : 'Email';
        emailInput.placeholder = isEmp ? 'Nom dâ€™utilisateur employé' : '';
      });
    }
    const toggle = document.getElementById('customOfferToggle');
    const fields = document.getElementById('customOfferFields');
    const modeEl = document.getElementById('customOfferMode');
    const budgetEl = document.getElementById('customOfferBudget');
    const durationEl = document.getElementById('customOfferDuration');
    const summary = document.getElementById('customOfferSummary');
    function updateSummary() {
      if (!fields || fields.classList.contains('hidden')) { if (summary) summary.textContent = ''; return; }
      const mode = modeEl.value;
      const budget = parseFloat(budgetEl.value || 0);
      const usd = mode === 'usd' ? budget : (budget / computeCustomRate(budget / 340));
      const rate = computeCustomRate(usd);
      const dzd = mode === 'usd' ? (budget * rate) : budget;
      const dur = parseInt(durationEl.value || '0', 10);
      if (summary) summary.textContent = `Taux: ${rate} DZD/USD â€¢ Budget: ${usd.toFixed(2)} $ (${Math.round(dzd)} DZD) â€¢ Durée: ${dur} jours`;
    }
    if (toggle) toggle.addEventListener('change', () => { if (fields) { fields.classList.toggle('hidden', !toggle.checked); } updateSummary(); });
    if (modeEl) modeEl.addEventListener('change', updateSummary);
    if (budgetEl) budgetEl.addEventListener('input', updateSummary);
    if (durationEl) durationEl.addEventListener('input', updateSummary);

    const metaStatus = document.getElementById('metaAdsStatus');
    const metaConnectBtn = document.getElementById('metaAdsConnectBtn');
    const metaDisconnectBtn = document.getElementById('metaAdsDisconnectBtn');
    const metaImportBtn = document.getElementById('metaAdsImportAccountsBtn');

    function getMetaAdsBaseUrl() {
      const port = String(window.location.port || '');
      if (port === '8082') return '';
      return 'http://localhost:8082';
    }

    function ensureMetaAdsSameOriginOrWarn() {
      const base = getMetaAdsBaseUrl();
      if (base) {
        showToast('Pour Facebook Ads (Pro), ouvre l’app via http://localhost:8082', 'error');
        return false;
      }
      return true;
    }

    async function refreshMetaAdsStatus() {
      if (!metaStatus) return;
      try {
        const base = getMetaAdsBaseUrl();
        const res = await fetch(`${base}/api/meta/status`, { credentials: 'include' });
        if (!res.ok) throw new Error('bad status');
        const data = await res.json();
        if (data && data.configOk === false) {
          const missing = Array.isArray(data.missing) ? data.missing.join(', ') : 'META_APP_ID, META_APP_SECRET';
          metaStatus.textContent = `Configuration manquante: ${missing}`;
          metaStatus.className = 'font-bold text-red-700';
          if (metaConnectBtn) metaConnectBtn.disabled = true;
          if (metaImportBtn) metaImportBtn.disabled = true;
          return;
        }
        if (metaConnectBtn) metaConnectBtn.disabled = false;
        if (metaImportBtn) metaImportBtn.disabled = false;
        metaStatus.textContent = data && data.connected ? 'Connecté' : 'Non connecté';
        metaStatus.className = data && data.connected ? 'font-bold text-emerald-700' : 'font-bold text-gray-800';
      } catch (e) {
        metaStatus.textContent = 'Serveur Meta non disponible';
        metaStatus.className = 'font-bold text-gray-800';
      }
    }

    async function disconnectMetaAds() {
      try {
        const base = getMetaAdsBaseUrl();
        await fetch(`${base}/api/meta/disconnect`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include' });
      } catch (e) {}
      await refreshMetaAdsStatus();
    }

    async function importMetaAdAccounts() {
      if (!ensureMetaAdsSameOriginOrWarn()) return;
      try {
        const base = getMetaAdsBaseUrl();
        const res = await fetch(`${base}/api/meta/adaccounts`, { credentials: 'include' });
        if (!res.ok) throw new Error('bad status');
        const data = await res.json();
        const list = Array.isArray(data && data.data) ? data.data : [];
        if (!Array.isArray(appState.adAccounts)) appState.adAccounts = [];
        const existing = new Set(appState.adAccounts.map(a => a && a.name ? a.name.trim().toLowerCase() : ''));
        let added = 0;
        list.forEach(acc => {
          const name = (acc && acc.name) ? String(acc.name).trim() : '';
          if (!name) return;
          const key = name.toLowerCase();
          if (existing.has(key)) return;
          appState.adAccounts.push({ id: generateId('adacc'), name, createdAt: Date.now(), metaAdAccountId: acc.id || null });
          existing.add(key);
          added++;
        });
        if (added > 0) {
          autoSave();
          if (typeof renderAdAccountsList === 'function') renderAdAccountsList();
          if (typeof populateAdAccountSelect === 'function') populateAdAccountSelect();
          showToast(`${added} compte(s) Ads importé(s)`, 'success');
        } else {
          showToast('Aucun nouveau compte Ads', 'info');
        }
      } catch (e) {
        showToast('Impossible de récupérer les comptes Ads (serveur Meta)', 'error');
      }
      await refreshMetaAdsStatus();
    }

    if (metaConnectBtn) metaConnectBtn.addEventListener('click', () => {
      const base = getMetaAdsBaseUrl();
      window.location.href = `${base}/api/meta/login`;
    });
    if (metaDisconnectBtn) metaDisconnectBtn.addEventListener('click', () => { disconnectMetaAds(); });
    if (metaImportBtn) metaImportBtn.addEventListener('click', () => { importMetaAdAccounts(); });
    refreshMetaAdsStatus();
  });
  if (auth && typeof auth.onAuthStateChanged === 'function') {
    auth.onAuthStateChanged(async function (user) {
      if (typeof updateAuthUI === 'function') updateAuthUI(user);
      if (user) {
        if (!window.appState) window.appState = {};
        window.appState.session = {
          type: 'admin',
          user: { uid: user.uid || null, email: user.email || '', displayName: user.displayName || '' }
        };
        if (typeof setEmployeeGuardEnabled === 'function') setEmployeeGuardEnabled(false);
        try { saveToLocalStorage(); } catch (e) {}

        if (typeof forceAdminView === 'function') forceAdminView();
        try {
          if (typeof window.loadFromCloud === 'function') {
            await window.loadFromCloud();
          } else if (typeof loadFromCloud === 'function') {
            await loadFromCloud();
          } else if (typeof loadFromLocalStorage === 'function') {
            loadFromLocalStorage();
          }
        } catch (e) {
          console.error("Erreur init data auth state:", e);
          if (typeof loadFromLocalStorage === 'function') loadFromLocalStorage();
        }
        if (typeof ensureInitialData === 'function') ensureInitialData();
        if (typeof applyRecurringExpensesForCurrentMonth === 'function') applyRecurringExpensesForCurrentMonth();
        if (typeof renderTablesAsync === 'function') renderTablesAsync();
        if (typeof populateClientDropdown === 'function') populateClientDropdown();
        if (typeof populateOfferSelect === 'function') populateOfferSelect();
        if (typeof populatePaymentClientSelect === 'function') populatePaymentClientSelect();
        if (typeof recalculateFinanceBalances === 'function') recalculateFinanceBalances();
        if(typeof window.setupAdminRealtimeListeners === 'function') window.setupAdminRealtimeListeners();
        if (typeof showTab === 'function') showTab('dashboard');
        
        if (typeof forceAdminView === 'function') forceAdminView();
        if (typeof ensureAuthVisibility === 'function') ensureAuthVisibility();
        if (typeof visibilityWatchdog === 'function') visibilityWatchdog(3000);
        if (typeof emergencyRevealUI === 'function') setTimeout(emergencyRevealUI, 500);
        if (typeof uiGuardLoop === 'function') uiGuardLoop(5000);
        
        window.authTransitionFlag = false;
      } else {
        if (window.appState && window.appState.session && window.appState.session.type === 'admin') {
          window.appState.session = null;
          try { saveToLocalStorage(); } catch (e) {}
        }
      }
    });
  }
  window.addEventListener('beforeunload', function () {
    try { saveToLocalStorage(); } catch (e) {}
  });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      try { saveToLocalStorage(); } catch (e) {}
    }
  });
function setupClientSearchListeners() {
  const clientSearch = document.getElementById('clientSearch');
  const dropdown = document.getElementById('clientDropdown');
  if (!clientSearch || !dropdown) {
    console.warn('⚠️ setupClientSearchListeners: elements non trouvés');
    return;
  }
  
  // Supprimer les anciens listeners si possible (en ré-assignant les fonctions)
  clientSearch.onfocus = function() {
    if (this.value.trim()) {
      filterClients();
    }
  };
  
  clientSearch.oninput = function() {
    filterClients();
  };

  // Click outside to hide
  if (!window._hasSearchGlobalListener) {
      document.addEventListener('click', function(e) {
        const dd = document.getElementById('clientDropdown');
        if (dd && !e.target.closest('.relative') && !e.target.closest('#clientDropdown')) {
          dd.classList.add('hidden');
        }
      });
      window._hasSearchGlobalListener = true;
  }
}

function showTab(tabId) {
  const isEmployee = (appState.session && appState.session.type === 'employee');
  if (isEmployee) {
    const allowed = new Set(['clients', 'transactions', 'history', 'frais']);
    if (!allowed.has(tabId)) tabId = 'clients';
  }
  appState.currentTab = tabId;
  document.querySelectorAll('.tab-content').forEach(tab => { tab.classList.add('hidden'); });
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active-tab');
    btn.classList.remove('bg-blue-600', 'text-white');
    btn.classList.add('text-gray-700', 'bg-gray-100');
  });
  const tabContent = document.getElementById(tabId);
  if (tabContent) {
    tabContent.classList.remove('hidden');
    tabContent.style.opacity = '0';
    tabContent.style.animation = 'fadeIn 0.5s ease forwards';
  }
  const activeBtn = document.getElementById(`tab-${tabId}`);
  if (activeBtn) {
    activeBtn.classList.remove('text-gray-700', 'bg-gray-100');
    activeBtn.classList.add('active-tab');
  }
  if (tabId === 'dashboard') { if (typeof updateDashboard === 'function') updateDashboard(); } 
  else if (tabId === 'clients') { 
    if (typeof renderClientsTable === 'function') renderClientsTable();
    if (typeof updateClientsSummary === 'function') updateClientsSummary(); 
  } 
  else if (tabId === 'offers') {
    if (typeof renderOffersGrid === 'function') renderOffersGrid();
  }
  else if (tabId === 'transactions') { 
    if (typeof renderTodoTable === 'function') renderTodoTable();
  }
  else if (tabId === 'history') {
    if (typeof renderTransactionsTable === 'function') renderTransactionsTable();
  }
  else if (tabId === 'paiements') {
    if (typeof renderPaymentsTable === 'function') renderPaymentsTable();
  }
  else if (tabId === 'achats') {
    if (typeof renderUsdPurchasesTable === 'function') renderUsdPurchasesTable();
  }
  else if (tabId === 'ads') {
    if (typeof renderAdsTable === 'function') renderAdsTable();
    if (typeof renderAdAccountsList === 'function') renderAdAccountsList();
  }
  else if (tabId === 'frais') {
    if (typeof renderExpensesTable === 'function') renderExpensesTable();
    if (typeof renderUsdtExpensesTable === 'function') renderUsdtExpensesTable();
  }
  else if (tabId === 'requests') {
    if (typeof renderRequests === 'function') renderRequests();
  }
  else if (tabId === 'custom-section-admin') {
    if (typeof renderCustomSectionAdmin === 'function') renderCustomSectionAdmin();
  }
  else if (tabId === 'todo') {
    if (typeof populateOfferSelect === 'function') populateOfferSelect();
    if (typeof setupClientSearchListeners === 'function') setupClientSearchListeners();
    if (typeof calculatePreview === 'function') calculatePreview();
  }
}
window.showTab = showTab;

function setupEventListeners() {
  const searchInput = document.getElementById('transactionSearch');
  const filterSelect = document.getElementById('transactionFilter');
  if (searchInput) { searchInput.addEventListener('input', renderTransactionsTable); }
  if (filterSelect) { filterSelect.addEventListener('change', renderTransactionsTable); }
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') { closeAllModals(); }
  });
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-backdrop')) { closeAllModals(); }
  });
}
function filterClients() {
  const searchInput = document.getElementById('clientSearch');
  const dropdown = document.getElementById('clientDropdown');
  const searchTerm = searchInput.value.toLowerCase().trim();
  
  if (!searchTerm) {
    dropdown.classList.add('hidden');
    document.getElementById('clientSelect').value = '';
    return;
  }
  
  const filtered = appState.clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm) || 
    (client.contact && client.contact.toLowerCase().includes(searchTerm))
  );
  
  dropdown.innerHTML = '';
  
  if (filtered.length === 0) {
    dropdown.innerHTML = '<div class="p-4 text-gray-500 text-center">Aucun client trouvé</div>';
    dropdown.classList.remove('hidden');
    return;
  }
  
  filtered.forEach(client => {
    const item = document.createElement('div');
    item.className = 'p-4 border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors flex justify-between items-start';
    item.innerHTML = `<div><div class="font-bold text-gray-800">${client.name}</div><div class="text-xs text-gray-500">${client.contact || 'Pas de contact'}</div></div>`;
    item.onclick = () => selectClient(client.id, client.name);
    dropdown.appendChild(item);
  });
  
  dropdown.classList.remove('hidden');
}

function selectClient(clientId, clientName) {
  document.getElementById('clientSelect').value = clientId;
  document.getElementById('clientSearch').value = clientName;
  document.getElementById('clientDropdown').classList.add('hidden');
  calculatePreview();
}
function filterTransactions() {
  const searchTerm = document.getElementById('transactionSearch')?.value.toLowerCase() || '';
  const filterValue = document.getElementById('transactionFilter')?.value || 'all';
  let filtered = [...appState.transactions];
  if (searchTerm) {
    filtered = filtered.filter(t => {
      const clientName = (t.clientName || '').toLowerCase();
      const offerName = (t.offerName || '').toLowerCase();
      const amountStr = (t.dollarAmount ?? t.amount ?? '').toString().toLowerCase();
      return clientName.includes(searchTerm) || offerName.includes(searchTerm) || amountStr.includes(searchTerm);
    });
  }
  const now = new Date();
  switch(filterValue) {
    case 'today':
      const today = getLocalDateString();
      filtered = filtered.filter(t => t.date === today);
      break;
    case 'week':
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const weekStr = getLocalDateString(oneWeekAgo);
      filtered = filtered.filter(t => t.date >= weekStr);
      break;
    case 'month':
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const monthStr = getLocalDateString(oneMonthAgo);
      filtered = filtered.filter(t => t.date >= monthStr);
      break;
  }
  return filtered;
}

function renderOffersGrid() {
  const grid = document.getElementById('offersGrid');
  if (!grid) return;
  grid.innerHTML = '';
  if (appState.offers.length === 0) {
    grid.innerHTML = `<div class="col-span-full text-center py-12"><i class="fas fa-gift text-5xl mb-4 text-gray-300"></i><p class="text-lg text-gray-500">Aucune offre créée</p><p class="text-sm text-gray-400 mt-2">Créez votre première offre pour commencer</p></div>`;
    return;
  }
  const isEmployee = (appState.session && appState.session.type === 'employee');
  appState.offers.forEach(offer => {
    const usageCount = appState.transactions.filter(t => t.offerName === offer.name).length;
    const card = document.createElement('div');
    card.className = 'bg-white border border-gray-200 p-6 rounded-2xl hover:border-purple-300 transition-all card-hover group relative';
    
    // Calcul de la marge pour chaque offre
    const buyRate = appState.settings.defaultBuyRate;
    const offerPrice = Number(offer.price || 0);
    const offerCostUSD = Number(offer.costPerUnit || 0);
    const costDzd = offerCostUSD * buyRate;
    const marginDzd = offerPrice - costDzd;
    const marginPercentage = costDzd > 0 ? ((marginDzd / costDzd) * 100).toFixed(2) : 0;
    
    let marginColor = 'text-green-600';
    if (marginPercentage < 10) marginColor = 'text-red-600';
    else if (marginPercentage < 20) marginColor = 'text-yellow-600';
    
    const usdDisplay = safeToFixed(offerCostUSD, 2);
    
    let financialInfo = '';
    if (!isEmployee) {
        financialInfo = `
        <div class="grid grid-cols-2 gap-3 mb-4 text-sm border-t border-b border-gray-100 py-3">
            <div><span class="text-gray-600 text-xs block">Montant ($):</span><span class="font-bold text-blue-600">$${usdDisplay}</span></div>
            <div><span class="text-gray-600 text-xs block">Prix Vente (DZD):</span><span class="font-bold text-purple-600">${formatCurrency(offerPrice)}</span></div>
            <div><span class="text-gray-600 text-xs block">Coût @ ${buyRate}:</span><span class="font-bold text-red-600">${formatCurrency(costDzd)}</span></div>
            <div><span class="text-gray-600 text-xs block">Marge:</span><span class="font-bold ${marginColor}">${marginPercentage}%</span></div>
        </div>
        <div class="flex justify-between items-center">
            <div><p class="text-xs text-gray-500">Bénéfice estimé</p><span class="text-lg font-black text-green-600">${formatCurrency(marginDzd)}</span></div>
        </div>`;
    } else {
        financialInfo = `
        <div class="mb-4 text-sm border-t border-b border-gray-100 py-3">
            <div><span class="text-gray-600 text-xs block">Prix Vente (DZD):</span><span class="font-bold text-purple-600">${formatCurrency(offerPrice)}</span></div>
        </div>`;
    }

    const deleteBtn = `<div class="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onclick="editOffer('${offer.id}')" class="text-blue-600 hover:text-blue-800 bg-white p-2 rounded-full shadow-sm"><i class="fas fa-edit"></i></button>
            <button onclick="deleteOffer('${offer.id}')" class="text-red-600 hover:text-red-800 bg-white p-2 rounded-full shadow-sm"><i class="fas fa-trash-alt"></i></button>
          </div>`;

    card.innerHTML = `${deleteBtn}<div class="flex justify-between items-start mb-2"><div><h3 class="text-xl font-bold text-gray-800">${offer.name}</h3><p class="text-xs text-gray-500 mt-1"><i class="fas fa-clock mr-1"></i>${offer.duration || 'Non spécifiée'}</p></div><span class="bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full">${usageCount} vente${usageCount > 1 ? 's' : ''}</span></div><p class="text-gray-600 mb-4 min-h-[50px] text-sm">${offer.description || 'Pas de description'}</p>${financialInfo}`;
    grid.appendChild(card);
  });
}

    // Old renderPaymentsTable removed to avoid duplication
    // See lines ~4900 for the correct implementation
    // updateRecentActivity removed (duplicate of renderRecentTransactions)


function updateClientsSummary() {
  const totalSpent = appState.clients.reduce((sum, client) => {
    const clientTransactions = appState.transactions.filter(t => t.clientId == client.id);
    return sum + clientTransactions.reduce((sumT, t) => sumT + t.totalDzd, 0);
  }, 0);
  document.getElementById('clientsSummary').textContent = `${appState.clients.length} client${appState.clients.length > 1 ? 's' : ''}`;
  document.getElementById('clientsTotalSpent').textContent = `Total dépensé: ${formatCurrency(totalSpent)}`;
}

function updateTransactionsSummary() {
  const totalProfit = appState.transactions.reduce((sum, t) => sum + t.profit, 0);
  document.getElementById('transactionsSummary').textContent = `${appState.transactions.length} transaction${appState.transactions.length > 1 ? 's' : ''}`;
  document.getElementById('transactionsTotalProfit').textContent = `Profit total: ${formatCurrency(totalProfit)}`;
}

function closeAllModals() {
  document.querySelectorAll('[id$="Modal"]').forEach(modal => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  });
  document.body.style.overflow = 'auto';
}

window.calculatePreview = calculatePreview;
window.exportClientsCSV = exportClientsCSV;
window.formatCurrency = formatCurrency;
window.updateDashboard = updateDashboard;
window.recalculateFinanceBalances = recalculateFinanceBalances;
window.updateClientsSummary = updateClientsSummary;
window.renderTables = renderTables;
window.openModal = openModal;
window.closeModal = closeModal;
window.closeAllModals = closeAllModals;
window.addAdAccount = addAdAccount;
window.deleteAdAccount = deleteAdAccount;
window.renderAdsTable = renderAdsTable;
window.populateAdAccountSelect = populateAdAccountSelect;
window.openManualBalanceModal = openManualBalanceModal;
window.saveManualBalances = saveManualBalances;

function backupData() {
    const data = JSON.stringify(appState, null, 2);
    const blob = new Blob([data], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `backup_sponsor_manager_${getLocalDateString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Sauvegarde téléchargée", "success");
}

function importData() {
    const input = document.getElementById('restoreFile');
    if (input) {
        input.value = ''; 
        input.click();
    } else {
        const newInput = document.createElement('input');
        newInput.type = 'file';
        newInput.accept = '.json';
        newInput.onchange = function() { restoreData(this); };
        newInput.click();
    }
}
window.importData = importData;

function restoreData(input) {
    const file = input.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data && data.clients && data.transactions) {
                if(confirm("Attention : Cela va remplacer toutes vos données actuelles. Êtes-vous sûr ?")) {
                    appState = data;
                    saveToLocalStorage();
                    // Reset sync state to force full sync if needed or just keep as is
                    appState.sync = { pendingCloudSave: true }; 
                    window.location.reload();
                }
            } else {
                showToast("Fichier de sauvegarde invalide", "error");
            }
        } catch(err) {
            console.error(err);
            showToast("Erreur lors de la lecture du fichier", "error");
        }
    };
    reader.readAsText(file);
}
    
    // === GESTION DES DOUBLONS AVANCÉE (IA-Like) ===
    window.detectDuplicateClients = function() {
        // Redirection vers l'ancien bouton qui était "IA" mais faisons mieux
        // Nous allons scanner avec une logique floue (fuzzy logic)
        const clients = appState.clients || [];
        const duplicates = [];
        const processed = new Set();
        
        // Seuil de similarité (Levenshtein distance)
        const threshold = 3; 

        clients.forEach((c1, i) => {
            if (processed.has(c1.id)) return;
            
            const group = [c1];
            
            for (let j = i + 1; j < clients.length; j++) {
                const c2 = clients[j];
                if (processed.has(c2.id)) continue;
                
                // Critère 1: Nom exact ou très proche
                const name1 = (c1.name || '').toLowerCase().trim();
                const name2 = (c2.name || '').toLowerCase().trim();
                
                let isMatch = false;
                
                if (name1 === name2) isMatch = true;
                else if (Math.abs(name1.length - name2.length) < 3) {
                     // Check distance
                     const dist = levenshtein(name1, name2);
                     if (dist <= threshold) isMatch = true;
                }
                
                // Critère 2: Téléphone identique (si présent)
                if (!isMatch && c1.phone && c2.phone) {
                    const p1 = c1.phone.replace(/\D/g,'');
                    const p2 = c2.phone.replace(/\D/g,'');
                    if (p1.length > 8 && p1 === p2) isMatch = true;
                }

                if (isMatch) {
                    group.push(c2);
                    processed.add(c2.id);
                }
            }
            
            if (group.length > 1) {
                duplicates.push(group);
                processed.add(c1.id);
            }
        });

        if (duplicates.length === 0) {
            showToast('Aucun doublon détecté', 'success');
            return;
        }

        // Auto-merge prompt
        if (!confirm(`Détecté ${duplicates.length} groupes de doublons potentiels. Voulez-vous tenter une fusion automatique intelligente ?\n\n(Annuler pour voir la liste)`)) {
            // Si annuler, on pourrait afficher une modale de détail, mais pour l'instant on ne fait rien
            return;
        }
        
        // Auto Merge Logic
        let mergeCount = 0;
        duplicates.forEach(group => {
            // Sort group to find the "Master" record (most data)
            group.sort((a, b) => {
                let scoreA = (a.totalSpent||0) + (a.transactionsCount||0)*1000 + (a.phone?500:0) + (a.email?500:0);
                let scoreB = (b.totalSpent||0) + (b.transactionsCount||0)*1000 + (b.phone?500:0) + (b.email?500:0);
                return scoreB - scoreA;
            });
            
            const master = group[0];
            const others = group.slice(1);
            
            others.forEach(other => {
                // Merge Data
                master.totalSpent = (Number(master.totalSpent)||0) + (Number(other.totalSpent)||0);
                master.transactionsCount = (Number(master.transactionsCount)||0) + (Number(other.transactionsCount)||0);
                master.unpaid = (Number(master.unpaid)||0) + (Number(other.unpaid)||0);
                
                if (!master.phone && other.phone) master.phone = other.phone;
                if (!master.email && other.email) master.email = other.email;
                if (!master.notes) master.notes = "";
                if (other.notes) master.notes += "\n" + other.notes;
                
                // Remap Foreign Keys
                if (appState.transactions) appState.transactions.forEach(t => { if(t.clientId === other.id) { t.clientId = master.id; t.clientName = master.name; t.updatedAt = Date.now(); } });
                if (appState.payments) appState.payments.forEach(p => { if(p.clientId === other.id) { p.clientId = master.id; p.clientName = master.name; } });
                
                // Mark for deletion
                const idx = appState.clients.indexOf(other);
                if (idx > -1) appState.clients.splice(idx, 1);
            });
            
            master.updatedAt = Date.now();
            mergeCount++;
        });
        
        recalculateClientStats();
        saveToLocalStorage();
        if(typeof enqueueCloudSave === 'function') enqueueCloudSave();
        renderTables();
        showToast(`${mergeCount} fusions effectuées avec succès`, 'success');
    };

    function levenshtein(a, b) {
      if (a.length === 0) return b.length;
      if (b.length === 0) return a.length;
      const matrix = [];
      for (let i = 0; i <= b.length; i++) { matrix[i] = [i]; }
      for (let j = 0; j <= a.length; j++) { matrix[0][j] = j; }
      for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
          if (b.charAt(i - 1) === a.charAt(j - 1)) {
            matrix[i][j] = matrix[i - 1][j - 1];
          } else {
            matrix[i][j] = Math.min(
              matrix[i - 1][j - 1] + 1,
              matrix[i][j - 1] + 1,
              matrix[i - 1][j] + 1
            );
          }
        }
      }
      return matrix[b.length][a.length];
    }

function mergeDuplicates(groupIdx) {
    // Re-run detection to get fresh groups
    const clients = appState.clients || [];
    const duplicates = [];
    const processed = new Set();
    const normalize = str => (str || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '');

    for (let i = 0; i < clients.length; i++) {
      if (processed.has(clients[i].id)) continue;
      const c1 = clients[i];
      const group = [c1];
      const n1 = normalize(c1.name);

      for (let j = i + 1; j < clients.length; j++) {
        if (processed.has(clients[j].id)) continue;
        const c2 = clients[j];
        const n2 = normalize(c2.name);
        let isDuplicate = false;
        if (n1 && n2 && n1 === n2) isDuplicate = true;
        if (!isDuplicate && n1.length > 4 && n2.length > 4) {
             const dist = levenshtein(n1, n2);
             if (dist <= 2) isDuplicate = true;
        }
        if (!isDuplicate && c1.contact && c2.contact) {
            const cont1 = normalize(c1.contact);
            const cont2 = normalize(c2.contact);
            if (cont1.length > 5 && cont2.length > 5 && (cont1.includes(cont2) || cont2.includes(cont1))) {
                isDuplicate = true;
            }
        }
        if (isDuplicate) {
            group.push(c2);
            processed.add(c2.id);
        }
      }
      if (group.length > 1) {
        duplicates.push(group);
        processed.add(c1.id);
      }
    }

    const group = duplicates[groupIdx];
    if (!group || group.length < 2) return;

    if(!confirm(`Fusionner ${group.length} clients en un seul ? Les transactions seront transférées vers le premier client du groupe (${group[0].name}).`)) return;

    const masterClient = group[0];
    const clientsToRemove = group.slice(1);

    // Merge logic
    clientsToRemove.forEach(c => {
        // 1. Reassign Transactions
        appState.transactions.forEach(t => {
            if (t.clientId === c.id) {
                t.clientId = masterClient.id;
                t.clientName = masterClient.name;
            }
        });
        // 2. Reassign Payments
        appState.payments.forEach(p => {
            if (p.clientId === c.id) {
                p.clientId = masterClient.id;
                p.clientName = masterClient.name;
            }
        });
        // 2b. Reassign To-Do Transactions
        (appState.todoTransactions || []).forEach(t => {
            if (t.clientId === c.id) {
                t.clientId = masterClient.id;
                t.clientName = masterClient.name;
            }
        });
    });
}

    // === EXPORTS & INIT ===
    window.showStats = showStats;
    window.resetCalculator = resetCalculator;
    window.filterTransactions = filterTransactions;
    window.filterClients = filterClients;
    window.selectClient = selectClient;
    window.setupClientSearchListeners = setupClientSearchListeners;
    window.levenshtein = levenshtein;
    
    // === INIT VISIBILITY GUARD ===
    // This runs immediately to hide elements before content fully loads
  // === GESTION DES EMPLOYES (ADMIN) ===
  window.addEmployee = function() {
      const u = document.getElementById('newEmpUsername');
      const p = document.getElementById('newEmpPassword');
      const e = document.getElementById('newEmpEmail');
      
      if(!u || !p) return;
      const username = u.value.trim();
      const password = p.value.trim();
      const email = e ? e.value.trim() : '';
      
      if(!username || !password) {
          showToast('Nom et mot de passe requis', 'error');
          return;
      }
      
      if(!Array.isArray(appState.employees)) appState.employees = [];
      
      const exists = appState.employees.find(emp => emp.username.toLowerCase() === username.toLowerCase());
      if(exists) {
          showToast('Cet utilisateur existe déjà', 'error');
          return;
      }
      
      const newEmp = {
          id: generateId('emp'),
          username,
          password,
          email,
          createdAt: Date.now()
      };
      
      appState.employees.push(newEmp);
      saveToLocalStorage();
      if(appState.settings.storageMode === 'cloud') saveToCloud();
      
      u.value = '';
      p.value = '';
      if(e) e.value = '';
      
      renderEmployeesTable();
      showToast('Employé ajouté', 'success');
  };

  window.deleteEmployee = function(id) {
      if(!confirm('Supprimer cet employé ?')) return;
      appState.employees = (appState.employees || []).filter(e => e.id !== id);
      saveToLocalStorage();
      if(appState.settings.storageMode === 'cloud') saveToCloud();
      renderEmployeesTable();
      showToast('Employé supprimé', 'info');
  };

  window.renderEmployeesTable = function() {
      const tbody = document.getElementById('employeesTableBody');
      if(!tbody) return;
      tbody.innerHTML = '';
      
      (appState.employees || []).forEach(emp => {
          const tr = document.createElement('tr');
          tr.className = 'hover:bg-gray-50';
          tr.innerHTML = `
              <td class="p-3 font-bold text-gray-800">${emp.username}</td>
              <td class="p-3 text-gray-600">${emp.email || '-'}</td>
              <td class="p-3 text-center">
                  <button onclick="deleteEmployee('${emp.id}')" class="text-red-500 hover:text-red-700">
                      <i class="fas fa-trash-alt"></i>
                  </button>
              </td>
          `;
          tbody.appendChild(tr);
      });
      renderEmployeePerformance();
  };

  function renderEmployeePerformance() {
    const tbody = document.getElementById('employeePerfTableBody');
    const summary = document.getElementById('employeePerfSummary');
    if (!tbody) return;

    const employees = Array.isArray(appState.employees) ? appState.employees : [];
    const tx = Array.isArray(appState.transactions) ? appState.transactions : [];
    const today = getLocalDateString();
    const now = new Date();
    const monthKey = getLocalDateString().slice(0, 7);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 6);
    const weekStartKey = getLocalDateString(weekAgo);

    const byUid = new Map();
    tx.forEach(t => {
      if (!t) return;
      if (t.status === 'problem') return;
      const uid = t.handledByUid || t.uid;
      if (!uid) return;
      if (!byUid.has(uid)) byUid.set(uid, []);
      byUid.get(uid).push(t);
    });

    const stats = employees.map(emp => {
      const uid = emp.id;
      const list = byUid.get(uid) || [];
      let dayCount = 0;
      let weekCount = 0;
      let monthCount = 0;
      let monthProfit = 0;
      list.forEach(t => {
        const d = String(t.date || '').slice(0, 10);
        if (d === today) dayCount++;
        if (d >= weekStartKey) weekCount++;
        if (d.startsWith(monthKey)) {
          monthCount++;
          monthProfit += Number(t.profit || 0);
        }
      });
      return { uid, name: emp.username || uid, dayCount, weekCount, monthCount, monthProfit };
    });

    stats.sort((a, b) => (b.monthCount - a.monthCount) || (b.monthProfit - a.monthProfit));

    const searchEl = document.getElementById('employeePerfSearch');
    const selectEl = document.getElementById('employeePerfSelect');
    const detailsWrap = document.getElementById('employeePerfDetails');
    const dailyBody = document.getElementById('employeePerfDailyBody');
    const detailDay = document.getElementById('employeePerfDetailDay');
    const detailWeek = document.getElementById('employeePerfDetailWeek');
    const detailMonth = document.getElementById('employeePerfDetailMonth');
    const detailProfit = document.getElementById('employeePerfDetailProfit');
    const detailLabel = document.getElementById('employeePerfDetailLabel');

    if (selectEl) {
      const current = selectEl.value || '';
      const opts = ['<option value=\"\">Tous les employés</option>']
        .concat(employees.map(e => `<option value=\"${e.id}\">${e.username || e.id}</option>`));
      selectEl.innerHTML = opts.join('');
      selectEl.value = current;
    }

    const search = (searchEl ? searchEl.value.trim().toLowerCase() : '');
    const selectedUid = (selectEl ? selectEl.value : '') || '';
    const filtered = stats.filter(s => {
      if (selectedUid && s.uid !== selectedUid) return false;
      if (search && !String(s.name || '').toLowerCase().includes(search)) return false;
      return true;
    });

    tbody.innerHTML = '';
    const frag = document.createDocumentFragment();
    filtered.forEach(s => {
      const tr = document.createElement('tr');
      tr.className = 'hover:bg-gray-50 cursor-pointer';
      tr.innerHTML = `
        <td class="p-3 font-semibold text-gray-800">${s.name}</td>
        <td class="p-3 text-right">${s.dayCount}</td>
        <td class="p-3 text-right">${s.weekCount}</td>
        <td class="p-3 text-right">${s.monthCount}</td>
        <td class="p-3 text-right font-bold text-emerald-600">${formatCurrency(s.monthProfit)}</td>
      `;
      tr.addEventListener('click', () => {
        const sel = document.getElementById('employeePerfSelect');
        if (sel) {
          sel.value = s.uid;
          renderEmployeePerformance();
        }
      });
      frag.appendChild(tr);
    });
    tbody.appendChild(frag);
    if (summary) summary.textContent = `${filtered.length} employé(s) • Mois: ${monthKey}`;

    if (detailsWrap && dailyBody && detailDay && detailWeek && detailMonth && detailProfit) {
      if (!selectedUid) {
        detailsWrap.classList.add('hidden');
      } else {
        const selected = stats.find(s => s.uid === selectedUid);
        if (selected) {
          detailsWrap.classList.remove('hidden');
          detailDay.textContent = String(selected.dayCount);
          detailWeek.textContent = String(selected.weekCount);
          detailMonth.textContent = String(selected.monthCount);
          detailProfit.textContent = formatCurrency(selected.monthProfit);
          if (detailLabel) detailLabel.textContent = selected.name;

          const list = byUid.get(selectedUid) || [];
          const days = [];
          for (let i = 0; i < 30; i++) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            days.push(getLocalDateString(d));
          }
          const perDay = new Map(days.map(d => [d, { count: 0, profit: 0 }]));
          list.forEach(t => {
            const d = String(t.date || '').slice(0, 10);
            if (!perDay.has(d)) return;
            const cur = perDay.get(d);
            cur.count += 1;
            cur.profit += Number(t.profit || 0);
          });
          dailyBody.innerHTML = '';
          const dfrag = document.createDocumentFragment();
          days.forEach(d => {
            const s = perDay.get(d);
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-gray-50';
            tr.innerHTML = `
              <td class="p-3">${formatDate(d)}</td>
              <td class="p-3 text-right font-bold text-gray-800">${s.count}</td>
              <td class="p-3 text-right font-bold text-emerald-600">${formatCurrency(s.profit)}</td>
            `;
            dfrag.appendChild(tr);
          });
          dailyBody.appendChild(dfrag);
        } else {
          detailsWrap.classList.add('hidden');
        }
      }
    }

    if (!window._employeePerfListenersBound) {
      if (searchEl) searchEl.addEventListener('input', () => renderEmployeePerformance());
      if (selectEl) selectEl.addEventListener('change', () => renderEmployeePerformance());
      window._employeePerfListenersBound = true;
    }
  }
