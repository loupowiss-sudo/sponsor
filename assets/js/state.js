// === CONFIG HELPERS ===
window.getBuyRate = () => (window.appState && window.appState.globalConfig && window.appState.globalConfig.rates) ? window.appState.globalConfig.rates.buy : 255;
window.getSellRate = () => (window.appState && window.appState.globalConfig && window.appState.globalConfig.rates) ? window.appState.globalConfig.rates.sell : 357;
window.getRedotpayRate = () => (window.appState && window.appState.globalConfig && window.appState.globalConfig.redotpay) ? window.appState.globalConfig.redotpay.rate : 250;

// === ÉTAT GLOBAL DE L'APPLICATION (INITIALISATION CRITIQUE) ===
if (!window.appState) {
  window.appState = {
    clients: [], transactions: [], offers: [], payments: [], usdPurchases: [],
    currentTab: 'dashboard', lastUpdated: 0,
    sync: { pendingCloudSave: false, retryDelayMs: 5000, itemSnapshots: {}, pendingDeletions: [] },
    syncQueue: [], syncTimer: null, syncThrottleMs: 2000,
    settings: {
      storageMode: 'cloud', cloudProvider: 'firebase',
      autoSaveEnabled: true, seedDefaults: true,
      expenseCategories: ['Salaire', 'Téléphone', 'Internet'],
      topClientsWeights: { spent: 0.7, transactions: 0.3, unpaid: -0.2 },
    },
    globalConfig: {
      ccp: {
        number: "0044032948",
        key: "28",
        name: "BENDJEDDOU HICHEM",
        address: "CITE VERT BT28 ODF OULED FAYET - 16094"
      },
      baridimob: {
        number: "00799999004403294836"
      },
      redotpay: {
        id: "1956595423",
        rate: 250
      },
      rates: {
        buy: 255,
        sell: 357
      }
    },
    expenses: [], recurringExpenses: [], clientRequests: [], usdtExpenses: [],
    todoTransactions: [], adAccounts: [],
    manualBalances: { liquide: 0, baridimob: 0, usdt: 0 },
    // Nouvelles collections pour la gestion d'entreprise
    roles: [],
    employees: [],
    products: [],
    employeePayments: [],
    employeePerformance: [], // Pour enregistrer les données de performance
    performanceConfig: {
      ratePerTask: 1700, // Taux par tâche (RATE)
      fixedCosts: {
        salary: 40000,
        internet: 3000,
        pub: 20000,
        risque: 15000
      }
    }
  };
}

var appState = window.appState;
window.editingOfferId = null;
window.editingClientId = null;
var editingOfferId = window.editingOfferId;
var editingClientId = window.editingClientId;

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
        lbl_to_send: "À envoyer (USD)",
        lbl_rate: "Taux: 1 USD = 340 DZD",
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
        lbl_upload_proof_hint: "Cliquez ou déposez votre reçu ici",
        lbl_client_note: "Note (Optionnel)",
        ph_client_note: "Ajoutez une note, une instruction ou une question...",
        lbl_copy: "Copier",
        lbl_copied: "Copié !",
        popup_new_client_title: "Bienvenue !",
        popup_new_client_msg: "Nous avons bien reçu votre première commande. Pour comprendre le déroulement, veuillez consulter notre méthode de travail.",
        btn_go_method: "Voir la Méthode de Travail"
    },
    ar: {
        nav_info: "معلومات",
        nav_offers: "عروضنا",
        nav_method: "طريقة العمل",
        nav_payment: "دفع",
        nav_order: "طلب رعاية",
        nav_custom: "إنجازاتنا",
        client_title: "منطقة العميل",
        client_subtitle: "مرحبًا بك في مساحتك الخاصة",
        btn_back: "العودة لتسجيل الدخول",
        info_title: "معلومات عامة",
        info_desc: "مرحبًا بك في منصة الرعاية الخاصة بنا. هنا يمكنك الاطلاع على عروضنا وفهم كيفية عملنا وطلب الرعاية مباشرة دون الحاجة لإنشاء حساب.",
        info_speed: "سرعة",
        info_speed_desc: "معالجة سريعة لطلباتكم.",
        info_security: "أمان",
        info_security_desc: "مدفوعات وبيانات آمنة.",
        info_support: "دعم",
        info_support_desc: "مساعدة متاحة لخدمتكم.",
        offers_title: "عروضنا المتاحة",
        offers_subtitle: "اختر عرضًا لمعرفة التفاصيل.",
        btn_details: "عرض التفاصيل",
        method_title: "طريقة العمل",
        payment_title: "طرق الدفع",
        payment_subtitle: "إليك تفاصيل الدفع:",
        order_title: "طلب رعاية",
        lbl_platform: "المنصة",
        opt_choose_platform: "-- اختر منصة --",
        lbl_objective: "الهدف",
        opt_choose_objective: "-- اختر الهدف --",
        opt_followers: "زيادة المتابعين",
        opt_messages: "رسائل",
        opt_conversion: "تحويل للموقع",
        lbl_target_network: "الشبكة المستهدفة للمتابعين",
        lbl_msg_dest: "وجهة الرسائل",
        lbl_site_link: "رابط الموقع",
        lbl_offer_chosen: "العرض المختار",
        opt_choose_offer: "-- اختر عرضًا --",
        lbl_pub_link: "رابط المنشور (بوست/ريلز/فيديو)",
        lbl_payment_method: "طريقة الدفع المستخدمة",
        opt_choose_payment: "-- اختر --",
        lbl_proof: "إثبات الدفع (صورة)",
        btn_submit: "إرسال الطلب",
        calc_title: "حاسبة RedotPay",
        calc_desc: "أدخل المبلغ بالدينار الذي تريد إنفاقه، وسنحسب المبلغ بالدولار الذي يجب إرساله.",
        lbl_amount_dzd: "المبلغ (DZD)",
        lbl_to_send: "للإرسال (USD)",
        lbl_rate: "سعر الصرف: 1 دولار = 340 دج",
        meta_config: "إعدادات Meta",
        tiktok_config: "إعدادات TikTok",
        ph_insta: "@حسابي",
        ph_fb: "صفحتي",
        ph_website: "https://mysite.com",
        ph_pub_link: "https://...",
        ph_amount: "مثال: 5000",
        lbl_insta_name: "اسم حساب انستغرام",
        lbl_fb_name: "اسم صفحة فيسبوك",
        lbl_both: "كلاهما",
        lbl_pub_link: "رابط المنشور (Post/Reel/Video)",
        opt_cash: "نقدا / آخر",
        lbl_upload_proof_hint: "اضغط أو قم بإسقاط الإيصال هنا",
        lbl_client_note: "ملاحظة (اختياري)",
        ph_client_note: "أضف ملاحظة، تعليمات أو سؤال...",
        lbl_copy: "نسخ",
        lbl_copied: "تم النسخ !",
        popup_new_client_title: "مرحبا بك !",
        popup_new_client_msg: "لقد استلمنا طلبك الأول بنجاح. لفهم سير العمل، يرجى الاطلاع على طريقة العمل.",
        btn_go_method: "مشاهدة طريقة العمل"
    }
};

window.TRANSLATIONS = TRANSLATIONS;
