// === EMPLOYEE PERMISSIONS CONTROLLER ===
window.updateEmployeePermission = function(empId, tabId, hasAccess) {
  if (!appState.employees) return;
  const emp = appState.employees.find(e => e.id === empId);
  if (!emp) return;
  if (!emp.permissions) emp.permissions = {};
  emp.permissions[tabId] = !!hasAccess;
  emp.updatedAt = Date.now();
  
  // Update the session permissions if this is the currently logged in employee
  if (appState.session && appState.session.type === 'employee' && appState.session.employeeId === empId) {
    appState.session.permissions = emp.permissions;
  }
  
  if (typeof autoSave === 'function') autoSave();
  if (typeof updateNavButtonsVisibility === 'function') updateNavButtonsVisibility();
  if (typeof renderCurrentTab === 'function') renderCurrentTab();
  showToast('Permissions mises à jour', 'success');
};

window.openModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  if (modalId === 'paymentModal') populatePaymentClientDropdown();
  if (modalId === 'expenseModal') {
    const d = document.getElementById('expenseDate');
    if (d && !d.value && typeof getLocalDateString === 'function') d.value = getLocalDateString();
  }
  if (modalId === 'balancesModal') populateBalancesModal();
  modal.classList.remove('hidden');
  modal.classList.add('flex');
};

window.setListPage = function(key, page) {
  if (!appState.ui) appState.ui = {};
  if (!appState.ui.pages) appState.ui.pages = {};
  const p = Number(page);
  appState.ui.pages[key] = Number.isFinite(p) ? p : 1;
  if (typeof renderCurrentTab === 'function') renderCurrentTab();
};

window.setListFilter = function(key, value) {
  if (!appState.ui) appState.ui = {};
  if (!appState.ui.filters) appState.ui.filters = {};
  if (!appState.ui.pages) appState.ui.pages = {};
  appState.ui.filters[key] = (value || '').toString();
  appState.ui.pages[key] = 1;
  if (typeof renderCurrentTab === 'function') {
    renderCurrentTab();
    setTimeout(() => {
      const input = document.getElementById(`searchInput_${key}`);
      if (input) {
        input.focus();
        const val = input.value;
        input.value = '';
        input.value = val;
      }
    }, 0);
  }
};

window.applyProfitRange = function() {
  const from = document.getElementById('profitFrom')?.value || '';
  const to = document.getElementById('profitTo')?.value || '';
  if (!from || !to) {
    showToast('Choisis une date de début et une date de fin', 'error');
    return;
  }
  if (!appState.ui) appState.ui = {};
  appState.ui.profitRange = { from, to };
  if (typeof renderCurrentTab === 'function') renderCurrentTab();
};

window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
};

function populatePaymentClientDropdown() {
  const select = document.getElementById('paymentClientId');
  if (!select) return;
  const clients = appState.clients || [];
  select.innerHTML = '<option value="">-- Sélectionner un client --</option>' +
    clients.map(c => `<option value="${c.id}">${c.name} (Dette: ${formatCurrency(c.unpaid || 0)})</option>`).join('');
}

function populateBalancesModal() {
  if (typeof calculateTheoreticalBalance !== 'function') return;
  const theo = calculateTheoreticalBalance();
  const manual = appState.manualBalances || { liquide: 0, baridimob: 0, usdt: 0 };
  const current = {
    liquide: Number(theo.liquide || 0) + Number(manual.liquide || 0),
    baridimob: Number(theo.baridimob || 0) + Number(manual.baridimob || 0),
    usdt: Number(theo.usdt || 0) + Number(manual.usdt || 0)
  };

  const liq = document.getElementById('balanceLiquideDesired');
  const bar = document.getElementById('balanceBaridiDesired');
  const usdt = document.getElementById('balanceUsdtDesired');
  if (liq) liq.value = Math.round(current.liquide);
  if (bar) bar.value = Math.round(current.baridimob);
  if (usdt) usdt.value = Number(current.usdt || 0).toFixed(2);

  const liqTheo = document.getElementById('balanceLiquideTheo');
  const barTheo = document.getElementById('balanceBaridiTheo');
  const usdtTheo = document.getElementById('balanceUsdtTheo');
  if (liqTheo) liqTheo.textContent = `Théorique: ${formatCurrency(theo.liquide)} • Ajustement: ${formatCurrency(manual.liquide || 0)}`;
  if (barTheo) barTheo.textContent = `Théorique: ${formatCurrency(theo.baridimob)} • Ajustement: ${formatCurrency(manual.baridimob || 0)}`;
  if (usdtTheo) usdtTheo.textContent = `Théorique: ${safeToFixed(theo.usdt, 2)} USDT • Ajustement: ${safeToFixed(manual.usdt || 0, 2)} USDT`;
}

window.saveBalancesAdjustments = function() {
  if (typeof calculateTheoreticalBalance !== 'function') return;
  const theo = calculateTheoreticalBalance();

  const desiredLiquide = Number(document.getElementById('balanceLiquideDesired')?.value || 0);
  const desiredBaridi = Number(document.getElementById('balanceBaridiDesired')?.value || 0);
  const desiredUsdt = Number(document.getElementById('balanceUsdtDesired')?.value || 0);

  if (!Number.isFinite(desiredLiquide) || !Number.isFinite(desiredBaridi) || !Number.isFinite(desiredUsdt)) {
    showToast('Valeurs invalides', 'error');
    return;
  }

  appState.manualBalances = {
    liquide: desiredLiquide - Number(theo.liquide || 0),
    baridimob: desiredBaridi - Number(theo.baridimob || 0),
    usdt: desiredUsdt - Number(theo.usdt || 0)
  };

  if (typeof autoSave === 'function') autoSave();
  if (typeof recalculateFinanceBalances === 'function') recalculateFinanceBalances();
  closeModal('balancesModal');
  if (typeof renderCurrentTab === 'function') renderCurrentTab();
  showToast('Soldes mis à jour', 'success');
};

window.handleLoginClick = async function() {
  const emailEl = document.getElementById('loginEmail');
  const passwordEl = document.getElementById('loginPassword');
  const errorEl = document.getElementById('loginError');
  const email = (emailEl?.value || '').trim();
  const password = passwordEl?.value || '';

  if (errorEl) errorEl.textContent = '';

  if (!email || !password) {
    const msg = 'Veuillez remplir tous les champs.';
    if (errorEl) errorEl.textContent = msg;
    showToast(msg, 'error');
    return;
  }

  // Intercept Demo Mode activation
  if (email.toLowerCase() === 'demo') {
      if (typeof injectDemoData === 'function') {
          injectDemoData();
          return;
      }
  }

  try {
    // 1. Check if it's an Employee first (Seamless routing)
    let employees = appState.employees || [];
    if (employees.length === 0 && window.firebase) {
      const db = firebase.firestore();
      // Fetch all employees to allow Javascript case-insensitive search
      const snap = await db.collection('employees').get().catch(() => ({ empty: true }));
      if (!snap.empty) employees = snap.docs.map(d => d.data());
    }

    const emp = employees.find(e => (e.active !== false) && ((e.login || '').toLowerCase() === email.toLowerCase() || (e.email || '').toLowerCase() === email.toLowerCase()));
    
    if (emp) {
      if (emp.password !== password) {
        throw new Error('Mot de passe employé incorrect');
      }
      
      appState.adminUid = emp.uid; 
      appState.session = { type: 'employee', employeeId: emp.id, name: emp.name, login: emp.login, permissions: emp.permissions || {}, loginAt: Date.now() };
      
      if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
      showToast('Connexion employé réussie', 'success');
      if (typeof updateAuthUI === 'function') updateAuthUI(null);
      if (typeof loadFromCloud === 'function') await loadFromCloud();
      if (typeof renderTables === 'function') renderTables();
      return;
    }

    // 2. If not an employee, route to Firebase Admin Auth
    if (typeof loginWithEmailPassword === 'function') {
      await loginWithEmailPassword(email, password);
    } else if (window.auth && typeof auth.signInWithEmailAndPassword === 'function') {
      await auth.signInWithEmailAndPassword(email, password);
      showToast('Connexion Admin réussie', 'success');
      if (typeof updateAuthUI === 'function') updateAuthUI(auth.currentUser);
      if (typeof loadFromCloud === 'function') await loadFromCloud();
      if (typeof renderTables === 'function') renderTables();
    } else {
      throw new Error('Authentification indisponible');
    }
  } catch (error) {
    console.error(error);
    const msg = (typeof firebaseErrorMessage === 'function')
      ? firebaseErrorMessage(error)
      : (error?.message || 'Erreur de connexion');
    if (errorEl) errorEl.textContent = msg;
    showToast(msg, 'error');
  }
};

window.forceCloudSave = function() {
  window.isManualSave = true;
  showToast('Sauvegarde en cours...', 'info');
  if (typeof saveToCloud === 'function') saveToCloud();
  else showToast('Fonction de sauvegarde indisponible', 'error');
};

window.exportPDF = function() {
  const element = document.getElementById('tabContentContainer');
  if (!element) return;
  if (typeof html2pdf !== 'function') {
    showToast('Export PDF indisponible (librairie non chargée)', 'error');
    return;
  }
  showToast('Génération du PDF...', 'info');
  const opt = {
    margin: [10, 10],
    filename: `Sponsor_Manager_Export_${new Date().toISOString().slice(0, 10)}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(element).save().then(() => {
    showToast('PDF généré avec succès !', 'success');
  }).catch(err => {
    console.error(err);
    showToast('Erreur lors de la génération du PDF', 'error');
  });
};

window.generateInvoicePdf = function(txId) {
  if (typeof html2pdf !== 'function') {
    showToast('PDF indisponible (librairie non chargée)', 'error');
    return;
  }
  const tx = (appState.transactions || []).find(t => t.id === txId);
  if (!tx) {
    showToast('Transaction introuvable', 'error');
    return;
  }

  const invNumber = `INV-${String(tx.date || getLocalDateString()).split('-').join('')}-${String(tx.id).slice(-6)}`;
  const company = 'Hichem Sponsor';
  const client = tx.clientName || 'Client';
  const dateLabel = typeof formatDate === 'function' ? formatDate(tx.date) : (tx.date || '');
  const usd = safeToFixed(tx.amount, 2);
  const dzd = formatCurrency(tx.priceDzd);
  const paidLabel = tx.paid ? 'Payé' : 'Impayé';
  const buyRate = typeof getBuyRate === 'function' ? getBuyRate() : 255;
  const profit = typeof calculateTransactionProfit === 'function'
    ? calculateTransactionProfit(Number(tx.amount || 0), Number(tx.priceDzd || 0), buyRate)
    : null;

  const durationLabel = tx.duration ? `${tx.duration}` : 'N/A';
  const clientInfo = (appState.clients || []).find(c => c.id === tx.clientId);
  const contactLabel = clientInfo ? (clientInfo.phone || clientInfo.instagram || clientInfo.contact || '-') : '-';

  const node = document.createElement('div');
  node.style.padding = '40px';
  node.style.fontFamily = 'Arial, sans-serif';
  node.style.color = '#374151';
  node.style.backgroundColor = '#ffffff';
  node.style.maxWidth = '800px';
  node.style.margin = '0 auto';
  
  node.innerHTML = `
    <!-- Header -->
    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 40px; border-bottom: 2px solid #f3f4f6; padding-bottom: 20px;">
      <div>
        <h1 style="font-size:32px; font-weight:900; color:#111827; margin:0; letter-spacing:-1px;">Hichem Sponsor</h1>
        <p style="font-size:14px; color:#6b7280; margin:4px 0 0 0;">Agence de Marketing Digital</p>
        <p style="font-size:12px; color:#9ca3af; margin:2px 0 0 0;">hichemsponsor.contact@gmail.com</p>
      </div>
      <div style="text-align:right;">
        <h2 style="font-size:24px; font-weight:800; color:#3b82f6; margin:0; text-transform:uppercase;">FACTURE</h2>
        <table style="margin-top:10px; text-align:right; font-size:13px; float:right;" cellspacing="0" cellpadding="2">
          <tr>
            <td style="color:#6b7280; padding-right:12px;">N° Facture:</td>
            <td style="font-weight:700; color:#111827;">${invNumber}</td>
          </tr>
          <tr>
            <td style="color:#6b7280; padding-right:12px;">Date:</td>
            <td style="font-weight:700; color:#111827;">${dateLabel}</td>
          </tr>
          <tr>
            <td style="color:#6b7280; padding-right:12px;">Statut:</td>
            <td style="font-weight:900; color:${tx.paid ? '#10b981' : '#ef4444'}; text-transform:uppercase;">${paidLabel}</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Client Info -->
    <div style="margin-bottom: 40px;">
      <h3 style="font-size:14px; color:#9ca3af; text-transform:uppercase; letter-spacing:1px; margin:0 0 8px 0; border-bottom:1px solid #e5e7eb; padding-bottom:4px; display:inline-block;">Facturé à</h3>
      <p style="font-size:18px; font-weight:800; color:#111827; margin:0 0 4px 0;">${client}</p>
      <p style="font-size:14px; color:#4b5563; margin:0;">Contact: <span style="font-weight:600;">${contactLabel}</span></p>
    </div>

    <!-- Items Table -->
    <table style="width:100%; border-collapse:collapse; margin-bottom:40px;">
      <thead>
        <tr style="background-color:#f9fafb; border-top:1px solid #e5e7eb; border-bottom:2px solid #e5e7eb;">
          <th style="padding:12px 16px; text-align:left; font-size:12px; color:#6b7280; text-transform:uppercase; letter-spacing:1px;">Description de l'Offre</th>
          <th style="padding:12px 16px; text-align:center; font-size:12px; color:#6b7280; text-transform:uppercase; letter-spacing:1px;">Durée</th>
          <th style="padding:12px 16px; text-align:right; font-size:12px; color:#6b7280; text-transform:uppercase; letter-spacing:1px;">Budget (USD)</th>
          <th style="padding:12px 16px; text-align:right; font-size:12px; color:#6b7280; text-transform:uppercase; letter-spacing:1px;">Montant (DZD)</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom:1px solid #f3f4f6;">
          <td style="padding:16px; font-size:14px; font-weight:700; color:#111827;">
            ${tx.offerName || 'Service Standard'}
          </td>
          <td style="padding:16px; text-align:center; font-size:14px; color:#4b5563;">
            ${durationLabel}
          </td>
          <td style="padding:16px; text-align:right; font-size:14px; color:#4b5563; font-family:monospace;">
            ${usd} $
          </td>
          <td style="padding:16px; text-align:right; font-size:15px; font-weight:800; color:#111827;">
            ${dzd}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Totals -->
    <div style="display:flex; justify-content:flex-end;">
      <table style="width:300px; border-collapse:collapse;">
        <tr>
          <td style="padding:12px 16px; font-size:14px; color:#6b7280; text-align:right;">Sous-total:</td>
          <td style="padding:12px 16px; font-size:15px; font-weight:600; color:#111827; text-align:right; border-bottom:1px solid #e5e7eb;">${dzd}</td>
        </tr>
        <tr>
          <td style="padding:16px; font-size:18px; font-weight:800; color:#111827; text-align:right;">TOTAL:</td>
          <td style="padding:16px; font-size:20px; font-weight:900; color:#3b82f6; text-align:right;">${dzd}</td>
        </tr>
        ${profit !== null ? `
        <!-- Internal Profit Tracking (Optional/Hidden for actual clients) -->
        <tr style="opacity:0.3;">
          <td style="padding:4px 16px; font-size:10px; color:#9ca3af; text-align:right;">Marge (Interne):</td>
          <td style="padding:4px 16px; font-size:10px; color:#9ca3af; text-align:right;">${formatCurrency(profit)}</td>
        </tr>
        ` : ''}
      </table>
    </div>

    <!-- Footer -->
    <div style="margin-top:60px; padding-top:20px; border-top:1px solid #e5e7eb; text-align:center;">
      <p style="font-size:14px; font-weight:700; color:#374151; margin:0 0 4px 0;">Merci pour votre confiance !</p>
      <p style="font-size:12px; color:#9ca3af; margin:0;">Si vous avez des questions concernant cette facture, veuillez nous contacter.</p>
    </div>
  `;

  const opt = {
    margin: [10, 10],
    filename: `${invNumber}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  showToast('Génération de la facture...', 'info');
  html2pdf().set(opt).from(node).save().then(() => {
    showToast('Facture générée', 'success');
  }).catch(err => {
    console.error(err);
    showToast('Erreur lors de la génération', 'error');
  });
};

window.addClient = function() {
  const name = document.getElementById('newClientName')?.value?.trim();
  const phone = document.getElementById('newClientPhone')?.value?.trim();
  const instagram = document.getElementById('newClientInstagram')?.value?.trim();
  const facebook = document.getElementById('newClientFacebook')?.value?.trim();
  const notes = document.getElementById('newClientNotes')?.value?.trim();

  if (!name) return showToast('Nom du client requis', 'error');

  const igHandle = instagram ? instagram.replace(/^@+/, '').trim() : '';

  if (window.editingClientId) {
    const client = (appState.clients || []).find(c => c.id === window.editingClientId);
    if (!client) return;
    client.name = name;
    client.phone = phone || '';
    client.instagram = igHandle || '';
    client.contact = phone || instagram || facebook || '';
    client.notes = notes || '';
    client.username = igHandle || '';
    client.social = { instagram: igHandle ? [igHandle] : [], facebook: facebook ? [facebook.trim()] : [] };
    client.updatedAt = Date.now();
    window.editingClientId = null;
    showToast('Client modifié', 'success');
  } else {
    const cleanName = name.toLowerCase().trim();
    if ((appState.clients || []).some(c => (c.name || '').toLowerCase().trim() === cleanName)) {
      return showToast('Ce client existe déjà', 'warning');
    }
    const client = {
      id: generateId('client'),
      name,
      phone: phone || '',
      instagram: igHandle || '',
      contact: phone || instagram || facebook || '',
      notes: notes || '',
      totalSpent: 0,
      unpaid: 0,
      updatedAt: Date.now(),
      social: {
        instagram: igHandle ? [igHandle] : [],
        facebook: facebook ? [facebook.trim()] : []
      }
    };
    if (!appState.clients) appState.clients = [];
    appState.clients.push(client);
    showToast('Client ajouté', 'success');
  }

  closeModal('clientModal');
  if (typeof autoSave === 'function') autoSave();
  if (typeof renderCurrentTab === 'function') renderCurrentTab();
};

window.editClient = function(id) {
  const client = (appState.clients || []).find(c => c.id === id);
  if (!client) return;
  window.editingClientId = id;
  const ig = client.instagram || (client.social && Array.isArray(client.social.instagram) && client.social.instagram[0]) || client.username || '';
  const fb = (client.social && Array.isArray(client.social.facebook) && client.social.facebook[0]) || '';
  if (document.getElementById('newClientName')) document.getElementById('newClientName').value = client.name || '';
  if (document.getElementById('newClientPhone')) document.getElementById('newClientPhone').value = client.phone || '';
  if (document.getElementById('newClientInstagram')) document.getElementById('newClientInstagram').value = ig || '';
  if (document.getElementById('newClientFacebook')) document.getElementById('newClientFacebook').value = fb || '';
  if (document.getElementById('newClientNotes')) document.getElementById('newClientNotes').value = client.notes || '';
  openModal('clientModal');
};

window.updateClientDebtNote = function(id, note) {
  const client = (appState.clients || []).find(c => c.id === id);
  if (!client) return;
  client.debtNote = note;
  client.updatedAt = Date.now();
  if (typeof autoSave === 'function') autoSave();
};

window.openPaymentModalPrefilled = function(clientId) {
  openModal('paymentModal');
  setTimeout(() => {
    const sel = document.getElementById('paymentClientId');
    if (sel) sel.value = clientId;
  }, 10);
};
window.deleteClient = function(id) {
  if (!confirm('Supprimer ce client ?')) return;
  appState.clients = (appState.clients || []).filter(c => c.id !== id);
  if (!appState.sync) appState.sync = {};
  if (!appState.sync.pendingDeletions) appState.sync.pendingDeletions = [];
  appState.sync.pendingDeletions.push({ col: 'clients', id: id });
  if (typeof autoSave === 'function') autoSave();
  if (typeof renderCurrentTab === 'function') renderCurrentTab();
};

window.addOffer = function() {
  const name = document.getElementById('newOfferName')?.value?.trim();
  const description = document.getElementById('newOfferDesc')?.value?.trim();
  const priceDzd = Number(document.getElementById('newOfferPrice')?.value || 0);
  const costPerUnit = Number(document.getElementById('newOfferCostPerUnit')?.value || 0);
  const duration = document.getElementById('newOfferDuration')?.value?.trim();

  if (!name || !priceDzd) return showToast('Nom et prix requis', 'error');

  if (window.editingOfferId) {
    const offer = (appState.offers || []).find(o => o.id === window.editingOfferId);
    if (!offer) return;
    Object.assign(offer, { name, description: description || '', priceDzd, costPerUnit, duration: duration || '', updatedAt: Date.now() });
    window.editingOfferId = null;
    showToast('Offre modifiée', 'success');
  } else {
    if (!appState.offers) appState.offers = [];
    appState.offers.push({ id: generateId('offer'), name, description: description || '', priceDzd, costPerUnit, duration: duration || '', updatedAt: Date.now() });
    showToast('Offre ajoutée', 'success');
  }
  closeModal('offerModal');
  if (typeof autoSave === 'function') autoSave();
  if (typeof renderCurrentTab === 'function') renderCurrentTab();
};

window.editOffer = function(id) {
  const offer = (appState.offers || []).find(o => o.id === id);
  if (!offer) return;
  window.editingOfferId = id;
  if (document.getElementById('newOfferName')) document.getElementById('newOfferName').value = offer.name || '';
  if (document.getElementById('newOfferDesc')) document.getElementById('newOfferDesc').value = offer.description || '';
  if (document.getElementById('newOfferPrice')) document.getElementById('newOfferPrice').value = offer.priceDzd || 0;
  if (document.getElementById('newOfferCostPerUnit')) document.getElementById('newOfferCostPerUnit').value = offer.costPerUnit || 0;
  if (document.getElementById('newOfferDuration')) document.getElementById('newOfferDuration').value = offer.duration || '';
  openModal('offerModal');
};

window.deleteOffer = function(id) {
  if (!confirm('Supprimer cette offre ?')) return;
  appState.offers = (appState.offers || []).filter(o => o.id !== id);
  if (!appState.sync) appState.sync = {};
  if (!appState.sync.pendingDeletions) appState.sync.pendingDeletions = [];
  appState.sync.pendingDeletions.push({ col: 'offers', id: id });
  if (typeof autoSave === 'function') autoSave();
  if (typeof renderCurrentTab === 'function') renderCurrentTab();
};

window.handleNewTodoSubmit = function(actionMode, event) {
  if (event) event.preventDefault();
  const form = document.getElementById('newTodoForm');
  if (form && !form.checkValidity()) {
    form.reportValidity();
    return;
  }
  
  const clientId = document.getElementById('todoClientId')?.value;
  const offerId = document.getElementById('todoOfferId')?.value;
  const priceDzd = Number(document.getElementById('todoPrice')?.value || 0);
  const paid = !!document.getElementById('todoPaid')?.checked;

  const client = (appState.clients || []).find(c => c.id === clientId);
  if (!client) return showToast('Client invalide', 'error');
  if (!offerId) return showToast('Offre invalide', 'error');
  if (!Number.isFinite(priceDzd) || priceDzd <= 0) return showToast('Prix DZD invalide', 'error');

  const isCustom = offerId === '__custom__';
  const offer = isCustom ? null : (appState.offers || []).find(o => o.id === offerId);
  if (!isCustom && !offer) return showToast('Offre introuvable', 'error');

  let finalOfferId = offerId;
  let finalOfferName = offer ? offer.name : 'Offre personnalisée';
  let amountUsd = offer ? Number(offer.costPerUnit || 0) : 0;
  let durationDays = offer ? Number(offer.duration || 0) : null;

  if (isCustom) {
    finalOfferId = generateId('custom_offer');
    const customName = (document.getElementById('todoCustomName')?.value || '').trim();
    const customUsd = Number(document.getElementById('todoCustomUsd')?.value || 0);
    const customDuration = Number(document.getElementById('todoCustomDuration')?.value || 0);
    if (customName) finalOfferName = customName;
    if (!Number.isFinite(customUsd) || customUsd <= 0) return showToast('Montant USD invalide', 'error');
    if (!Number.isFinite(customDuration) || customDuration <= 0) return showToast('Durée invalide', 'error');
    amountUsd = customUsd;
    durationDays = customDuration;
  }

    const todoDateStr = document.getElementById('todoDate')?.value || getLocalDateString();
    const adAccountId = document.getElementById('todoAdAccountId')?.value || null;
    
    // Calculate endDate if a duration is specified
    let endDate = null;
    if (durationDays > 0) {
        const start = new Date(todoDateStr);
        if (!isNaN(start.getTime())) {
            start.setDate(start.getDate() + durationDays);
            endDate = start.getTime();
        }
    }
    
    const todo = {
    id: generateId('todo'),
    clientId: client.id,
    clientName: client.name,
    offerId: finalOfferId,
    offerName: finalOfferName,
    priceDzd,
    amount: amountUsd,
    paid,
    status: 'pending',
    date: todoDateStr,
    adAccountId: adAccountId,
    endDate: endDate,
    createdAt: Date.now(),
    customDurationDays: durationDays,
    employeeId: (appState.session && appState.session.type === 'employee') ? appState.session.employeeId : null,
    employeeName: (appState.session && appState.session.type === 'employee') ? (appState.session.name || '') : null
  };

  if (actionMode === 'direct') {
    if (!appState.transactions) appState.transactions = [];
    const tx = { ...todo, id: generateId('tx'), status: 'active', completedAt: Date.now() };
    appState.transactions.push(tx);
    client.totalSpent = (client.totalSpent || 0) + (todo.priceDzd || 0);
    if (!todo.paid) client.unpaid = (client.unpaid || 0) + (todo.priceDzd || 0);
    client.updatedAt = Date.now();
    if (typeof autoSave === 'function') autoSave();
    showToast('Sponsor validé (direct)', 'success');
    if (typeof showTab === 'function') showTab('history');
    return;
  }

  if (!appState.todoTransactions) appState.todoTransactions = [];
  appState.todoTransactions.push(todo);
  if (typeof autoSave === 'function') autoSave();
  showToast('Tâche ajoutée à la To-Do List', 'success');
  if (typeof showTab === 'function') showTab('transactions');
};

window.updateTodoPrice = function() {
  const offerId = document.getElementById('todoOfferId')?.value;
  const offer = (appState.offers || []).find(o => o.id === offerId);
  const priceEl = document.getElementById('todoPrice');
  const customBox = document.getElementById('todoCustomOfferFields');
  const isCustom = offerId === '__custom__';

  if (customBox) {
    if (isCustom) customBox.classList.remove('hidden');
    else customBox.classList.add('hidden');
  }

  if (!priceEl) return;
  if (isCustom) {
    priceEl.readOnly = false;
    if (!priceEl.value) priceEl.value = '';
    return;
  }

  const v = offer ? (offer.priceDzd ?? offer.price ?? 0) : 0;
  priceEl.value = Number(v) || 0;
  priceEl.readOnly = true;
};

window.filterTodoOffers = function() {
  const searchEl = document.getElementById('todoOfferSearch');
  const select = document.getElementById('todoOfferId');
  const counter = document.getElementById('todoOfferMatchCount');
  if (!select) return;
  const query = (searchEl?.value || '').trim().toLowerCase();

  let visibleCount = 0;
  Array.from(select.options).forEach((opt, idx) => {
    if (idx === 0 || idx === 1) {
      opt.hidden = false;
      return;
    }
    const text = (opt.textContent || '').toLowerCase();
    const match = !query || text.includes(query);
    opt.hidden = !match;
    if (match) visibleCount += 1;
  });

  if (counter) {
    counter.textContent = query ? `${visibleCount} offre(s) trouvée(s)` : `${Math.max(0, select.options.length - 2)} offres`;
  }
};

window.clearTodoOfferSearch = function() {
  const searchEl = document.getElementById('todoOfferSearch');
  if (searchEl) searchEl.value = '';
  if (typeof filterTodoOffers === 'function') filterTodoOffers();
  if (searchEl) searchEl.focus();
};

window.changeTodoStatus = function(id, newStatus, currentType) {
  let sourceArray = currentType === 'problem' ? appState.transactions : appState.todoTransactions;
  if (!sourceArray) return;
  
  let itemIndex = sourceArray.findIndex(t => t.id === id);
  if (itemIndex === -1) return;
  let item = sourceArray[itemIndex];

  if (
    (currentType === 'todo' && newStatus === 'pending') ||
    (currentType === 'in_progress' && newStatus === 'in_progress') ||
    (currentType === 'problem' && newStatus === 'problem')
  ) return;

  const employeeId = (appState.session && appState.session.type === 'employee') ? appState.session.employeeId : (item.employeeId || null);
  const employeeName = (appState.session && appState.session.type === 'employee') ? (appState.session.name || '') : (item.employeeName || null);

  item.employeeId = employeeId;
  item.employeeName = employeeName;
  item.updatedAt = Date.now();

  if (newStatus === 'done' || newStatus === 'problem') {
    const destStatus = newStatus === 'done' ? 'active' : 'problem';
    if (currentType === 'problem') {
       if (destStatus === 'active') {
         item.status = 'active';
         item.completedAt = Date.now();
         const client = (appState.clients || []).find(c => c.id === item.clientId);
         if (client) {
           client.totalSpent = (client.totalSpent || 0) + (item.priceDzd || 0);
           if (!item.paid) client.unpaid = (client.unpaid || 0) + (item.priceDzd || 0);
           client.updatedAt = Date.now();
         }
         showToast('Problème résolu, transaction validée', 'success');
       }
    } else {
       if (!appState.transactions) appState.transactions = [];
       const newTx = { ...item, id: generateId('tx'), status: destStatus };
       if (destStatus === 'active') {
         newTx.completedAt = Date.now();
         const client = (appState.clients || []).find(c => c.id === item.clientId);
         if (client) {
           client.totalSpent = (client.totalSpent || 0) + (item.priceDzd || 0);
           if (!item.paid) client.unpaid = (client.unpaid || 0) + (item.priceDzd || 0);
           client.updatedAt = Date.now();
         }
       }
       appState.transactions.push(newTx);
       if (!appState.sync) appState.sync = {};
       if (!appState.sync.pendingDeletions) appState.sync.pendingDeletions = [];
       appState.sync.pendingDeletions.push({ col: 'todoTransactions', id: item.id });
       sourceArray.splice(itemIndex, 1);
       showToast(destStatus === 'active' ? 'Transaction validée' : 'Signalé comme PROBLÈME', destStatus === 'active' ? 'success' : 'warning');
    }
  } else if (newStatus === 'pending' || newStatus === 'in_progress') {
    if (currentType === 'problem') {
      if (!appState.todoTransactions) appState.todoTransactions = [];
      const newTodo = { ...item, id: generateId('todo'), status: newStatus };
      appState.todoTransactions.push(newTodo);
      if (!appState.sync) appState.sync = {};
      if (!appState.sync.pendingDeletions) appState.sync.pendingDeletions = [];
      appState.sync.pendingDeletions.push({ col: 'transactions', id: item.id });
      sourceArray.splice(itemIndex, 1);
      showToast(newStatus === 'pending' ? 'Remis en attente' : 'Marqué EN COURS', 'info');
    } else {
      item.status = newStatus;
      showToast(newStatus === 'pending' ? 'Remis en attente' : 'Marqué EN COURS', 'info');
    }
  }

  if (typeof recalculateFinanceBalances === 'function') recalculateFinanceBalances();
  if (typeof autoSave === 'function') autoSave();
  if (typeof renderCurrentTab === 'function') renderCurrentTab();
};

window.toggleTodoPayment = function(id, currentType) {
  let sourceArray = currentType === 'problem' ? appState.transactions : appState.todoTransactions;
  if (!sourceArray) return;
  const item = sourceArray.find(t => t.id === id);
  if (!item) return;
  item.paid = !item.paid;
  if (typeof autoSave === 'function') autoSave();
  if (typeof renderCurrentTab === 'function') renderCurrentTab();
};

window.deleteTodoTransaction = function(id, currentType) {
  if (!confirm('Supprimer cette tâche ?')) return;
  let col = currentType === 'problem' ? 'transactions' : 'todoTransactions';
  appState[col] = (appState[col] || []).filter(t => t.id !== id);
  if (!appState.sync) appState.sync = {};
  if (!appState.sync.pendingDeletions) appState.sync.pendingDeletions = [];
  appState.sync.pendingDeletions.push({ col: col, id: id });
  if (typeof autoSave === 'function') autoSave();
  if (typeof renderCurrentTab === 'function') renderCurrentTab();
};

window.addPayment = function() {
  const clientId = document.getElementById('paymentClientId')?.value;
  const amount = Number(document.getElementById('paymentAmount')?.value || 0);
  const method = document.getElementById('paymentMethod')?.value || 'Cash';
  const note = document.getElementById('paymentNote')?.value?.trim() || '';
  if (!clientId || !amount) return showToast('Client et montant requis', 'error');
  const client = (appState.clients || []).find(c => c.id === clientId);
  if (!client) return showToast('Client introuvable', 'error');

  const payment = { id: generateId('pay'), date: getLocalDateString(), clientId: client.id, clientName: client.name, amount, method, note, createdAt: Date.now() };
  if (!appState.payments) appState.payments = [];
  appState.payments.push(payment);
  client.unpaid = (client.unpaid || 0) - amount;
  client.updatedAt = Date.now();

  closeModal('paymentModal');
  if (typeof autoSave === 'function') autoSave();
  if (typeof renderCurrentTab === 'function') renderCurrentTab();
  showToast('Paiement enregistré', 'success');
};

window.deletePayment = function(id) {
  if (!confirm('Supprimer ce paiement ? La dette du client sera réajustée.')) return;
  const pay = (appState.payments || []).find(p => p.id === id);
  if (pay) {
    const client = (appState.clients || []).find(c => c.id === pay.clientId);
    if (client) {
      client.unpaid = (client.unpaid || 0) + (pay.amount || 0);
      client.updatedAt = Date.now();
    }
  }
  appState.payments = (appState.payments || []).filter(p => p.id !== id);
  if (!appState.sync) appState.sync = {};
  if (!appState.sync.pendingDeletions) appState.sync.pendingDeletions = [];
  appState.sync.pendingDeletions.push({ col: 'payments', id: id });
  if (typeof autoSave === 'function') autoSave();
  if (typeof renderCurrentTab === 'function') renderCurrentTab();
};

window.addExpense = function() {
  const date = document.getElementById('expenseDate')?.value || (typeof getLocalDateString === 'function' ? getLocalDateString() : '');
  const category = (document.getElementById('expenseCategory')?.value || '').trim();
  const account = document.getElementById('expenseAccount')?.value || 'liquide';
  const amount = Number(document.getElementById('expenseAmount')?.value || 0);
  const note = (document.getElementById('expenseNote')?.value || '').trim();

  if (!date) return showToast('Date requise', 'error');
  if (!category) return showToast('Catégorie requise', 'error');
  if (!Number.isFinite(amount) || amount <= 0) return showToast('Montant invalide', 'error');

  const expense = {
    id: generateId('exp'),
    date,
    category,
    account,
    amount,
    note,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  if (!appState.expenses) appState.expenses = [];
  appState.expenses.push(expense);

  closeModal('expenseModal');
  if (typeof autoSave === 'function') autoSave();
  if (typeof recalculateFinanceBalances === 'function') recalculateFinanceBalances();
  if (typeof renderCurrentTab === 'function') renderCurrentTab();
  showToast('Frais ajouté', 'success');
};

window.deleteExpense = function(id) {
  if (!confirm('Supprimer ce frais ?')) return;
  appState.expenses = (appState.expenses || []).filter(e => e.id !== id);
  if (!appState.sync) appState.sync = {};
  if (!appState.sync.pendingDeletions) appState.sync.pendingDeletions = [];
  appState.sync.pendingDeletions.push({ col: 'expenses', id: id });
  if (typeof autoSave === 'function') autoSave();
  if (typeof recalculateFinanceBalances === 'function') recalculateFinanceBalances();
  if (typeof renderCurrentTab === 'function') renderCurrentTab();
  showToast('Frais supprimé', 'info');
};

window.addUsdPurchase = function() {
  const amount = Number(document.getElementById('usdAmount')?.value || 0);
  const rate = Number(document.getElementById('usdRate')?.value || 0);
  const source = document.getElementById('usdSource')?.value?.trim() || '';
  if (!amount || !rate) return showToast('Montant et taux requis', 'error');
  const purchase = { id: generateId('usd'), date: getLocalDateString(), amount, rate, totalDzd: amount * rate, source, createdAt: Date.now() };
  if (!appState.usdPurchases) appState.usdPurchases = [];
  appState.usdPurchases.push(purchase);
  closeModal('usdPurchaseModal');
  if (typeof autoSave === 'function') autoSave();
  if (typeof renderCurrentTab === 'function') renderCurrentTab();
  showToast('Achat USD enregistré', 'success');
};

window.deleteUsdPurchase = function(id) {
  if (!confirm('Supprimer cet achat USD ?')) return;
  appState.usdPurchases = (appState.usdPurchases || []).filter(p => p.id !== id);
  if (!appState.sync) appState.sync = {};
  if (!appState.sync.pendingDeletions) appState.sync.pendingDeletions = [];
  appState.sync.pendingDeletions.push({ col: 'usdPurchases', id: id });
  if (typeof autoSave === 'function') autoSave();
  if (typeof renderCurrentTab === 'function') renderCurrentTab();
};

window.openRequestModal = function(id) {
  const req = (appState.clientRequests || []).find(r => r.id === id);
  if (!req) return;
  req.read = true;
  if (typeof autoSave === 'function') autoSave();
  alert(`Détails de la demande:\n\nClient: ${req.instagram || req.pageFacebook || ''}\nOffre: ${req.offer || ''}\nLien: ${req.pubLink || ''}`);
  if (typeof renderCurrentTab === 'function') renderCurrentTab();
};

window.deleteRequest = function(id) {
  if (!confirm('Supprimer cette demande ?')) return;
  appState.clientRequests = (appState.clientRequests || []).filter(r => r.id !== id);
  if (!appState.sync) appState.sync = {};
  if (!appState.sync.pendingDeletions) appState.sync.pendingDeletions = [];
  appState.sync.pendingDeletions.push({ col: 'clientRequests', id: id });
  if (typeof autoSave === 'function') autoSave();
  if (typeof renderCurrentTab === 'function') renderCurrentTab();
};

window.sendWhatsAppReminder = function(clientId) {
  const client = (appState.clients || []).find(c => c.id === clientId);
  if (!client || !client.unpaid) return;
  const phone = normalizePhoneForWhatsApp(client.phone || client.contact);
  if (!phone) return showToast('Numéro WhatsApp invalide ou absent', 'error');

  const message = encodeURIComponent(
    `Bonjour ${client.name},\n\n` +
    `C'est Hichem Sponsor. Sauf erreur de notre part, il reste un montant impayé de ${formatCurrency(client.unpaid)} concernant vos dernières transactions.\n\n` +
    `Pourriez-vous nous confirmer le règlement dès que possible ?\n\n` +
    `Merci de votre confiance !`
  );
  window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
};

window.sendInstagramReminder = function(clientId) {
  const client = (appState.clients || []).find(c => c.id === clientId);
  if (!client || !client.unpaid) return;
  
  const igHandle = client.instagram ? client.instagram.replace('@', '').trim() : '';
  if (!igHandle) return showToast('Compte Instagram invalide ou absent', 'error');

  // Instagram does not support pre-filling messages via URL schemes on web reliably,
  // but we can copy the message to the clipboard and open the chat.
  const message = `Bonjour ${client.name},\n\n` +
    `C'est Hichem Sponsor. Sauf erreur de notre part, il reste un montant impayé de ${formatCurrency(client.unpaid)} concernant vos dernières transactions.\n\n` +
    `Pourriez-vous nous confirmer le règlement dès que possible ?\n\n` +
    `Merci de votre confiance !`;
    
  if (navigator.clipboard) {
    navigator.clipboard.writeText(message).then(() => {
      showToast('Message copié dans le presse-papier !', 'success');
      window.open(`https://ig.me/m/${igHandle}`, '_blank');
    }).catch(err => {
      console.error('Erreur copie presse-papier:', err);
      window.open(`https://ig.me/m/${igHandle}`, '_blank');
    });
  } else {
    window.open(`https://ig.me/m/${igHandle}`, '_blank');
  }
};

window.addAdAccount = function() {
  const name = document.getElementById('accName')?.value?.trim();
  const platform = document.getElementById('accPlatform')?.value || 'meta';
  const balance = Number(document.getElementById('accBalance')?.value || 0);
  if (!name) return showToast('Nom du compte requis', 'error');
  const account = { id: generateId('acc'), name, platform, balance, status: 'active', updatedAt: Date.now() };
  if (!appState.adAccounts) appState.adAccounts = [];
  appState.adAccounts.push(account);
  closeModal('adAccountModal');
  if (typeof autoSave === 'function') autoSave();
  if (typeof renderCurrentTab === 'function') renderCurrentTab();
  showToast('Compte publicitaire ajouté', 'success');
};

window.deleteAdAccount = function(id) {
  if (!confirm('Supprimer ce compte publicitaire ?')) return;
  appState.adAccounts = (appState.adAccounts || []).filter(a => a.id !== id);
  if (!appState.sync) appState.sync = {};
  if (!appState.sync.pendingDeletions) appState.sync.pendingDeletions = [];
  appState.sync.pendingDeletions.push({ col: 'adAccounts', id: id });
  if (typeof autoSave === 'function') autoSave();
  if (typeof renderCurrentTab === 'function') renderCurrentTab();
};

window.rechargeAdAccount = function(id) {
  const amountStr = prompt('Montant de la recharge ($) :');
  if (amountStr === null) return;
  const amount = Number(amountStr);
  if (!Number.isFinite(amount) || amount <= 0) return showToast('Montant invalide', 'error');
  const acc = (appState.adAccounts || []).find(a => a.id === id);
  if (!acc) return;
  acc.balance = Number(acc.balance || 0) + amount;
  acc.updatedAt = Date.now();
  if (typeof autoSave === 'function') autoSave();
  if (typeof renderCurrentTab === 'function') renderCurrentTab();
  showToast(`Compte rechargé de ${amount}$`, 'success');
};

window.addEmployee = function() {
  let name = (document.getElementById('employeeName')?.value || '').trim();
  const login = (document.getElementById('employeeLogin')?.value || '').trim();
  const password = (document.getElementById('employeePassword')?.value || '').trim();
  const salary = Number(document.getElementById('employeeSalary')?.value || 0);
  
  // Default values
  const active = document.getElementById('employeeActive') ? !!document.getElementById('employeeActive').checked : true;
  if (!name) name = login;

  if (!login || !password) return showToast('Nom d\'utilisateur et mot de passe requis', 'error');

  if (!appState.employees) appState.employees = [];
  const exists = appState.employees.some(e => (e.login || '').toLowerCase() === login.toLowerCase());
  if (exists) return showToast('Ce nom d\'utilisateur existe déjà', 'warning');

  appState.employees.push({
    id: generateId('emp'),
    name,
    login,
    password,
    salary,
    active,
    createdAt: Date.now(),
    updatedAt: Date.now()
  });

  if (document.getElementById('employeeName')) document.getElementById('employeeName').value = '';
  if (document.getElementById('employeeLogin')) document.getElementById('employeeLogin').value = '';
  if (document.getElementById('employeePassword')) document.getElementById('employeePassword').value = '';
  if (document.getElementById('employeeSalary')) document.getElementById('employeeSalary').value = '';
  if (document.getElementById('employeeActive')) document.getElementById('employeeActive').checked = true;

  if (typeof autoSave === 'function') autoSave();
  if (typeof renderCurrentTab === 'function') renderCurrentTab();
  showToast('Employé ajouté', 'success');
};

window.updateEmployeeSalary = function(id) {
  const employee = appState.employees.find(e => e.id === id);
  if (!employee) return;
  const newSalary = Number(document.getElementById(`editSalary-${id}`)?.value || 0);
  employee.salary = newSalary;
  employee.updatedAt = Date.now();
  if (typeof autoSave === 'function') autoSave();
  if (typeof renderCurrentTab === 'function') renderCurrentTab();
  showToast('Salaire mis à jour', 'success');
};

window.markAbsent = function(employeeId) {
  const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Algiers' }));
  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  if (!appState.absences) appState.absences = [];
  const existing = appState.absences.find(a => a.employeeId === employeeId && a.date === todayStr);
  if (existing) return;
  appState.absences.push({
    id: generateId('absence'),
    employeeId,
    date: todayStr,
    time: Date.now(),
    createdAt: Date.now()
  });
  if (typeof autoSave === 'function') autoSave();
  if (typeof renderCurrentTab === 'function') renderCurrentTab();
  showToast('Absence enregistrée', 'success');
};

window.removeAbsence = function(employeeId) {
  const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Algiers' }));
  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  if (!appState.absences) appState.absences = [];
  appState.absences = appState.absences.filter(a => !(a.employeeId === employeeId && a.date === todayStr));
  if (typeof autoSave === 'function') autoSave();
  if (typeof renderCurrentTab === 'function') renderCurrentTab();
  showToast('Absence annulée', 'success');
};

window.openAbsenceHistoryModal = function() {
  const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Algiers' }));
  const currentMonth = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}`;
  
  const modal = document.createElement('div');
  modal.id = 'absenceHistoryModal';
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
  
  // Function to render the history
  const renderHistory = () => {
    const selectedMonth = document.getElementById('historyMonthFilter')?.value || currentMonth;
    const [year, month] = selectedMonth.split('-').map(Number);
    const monthStart = `${year}-${String(month).padStart(2,'0')}-01`;
    const monthEnd = `${year}-${String(month).padStart(2,'0')}-${new Date(year, month, 0).getDate().toString().padStart(2,'0')}`;
    
    const monthAbsences = (appState.absences || []).filter(a => {
      return a.date >= monthStart && a.date <= monthEnd;
    });
    
    // Group by employee
    const grouped = {};
    monthAbsences.forEach(a => {
      if (!grouped[a.employeeId]) grouped[a.employeeId] = [];
      grouped[a.employeeId].push(a);
    });
    
    const content = document.getElementById('absenceHistoryContent');
    if (content) {
      content.innerHTML = Object.keys(grouped).length === 0 ? `
        <p class="text-center py-8 text-gray-500 dark:text-gray-400 italic">
          Aucune absence pour ce mois
        </p>
      ` : Object.keys(grouped).map(empId => {
        const emp = appState.employees.find(e => e.id === empId);
        const absences = grouped[empId];
        return `
          <div class="p-4 border rounded-2xl bg-gray-50 dark:bg-gray-700 mb-4">
            <h4 class="font-bold text-gray-800 dark:text-white mb-2">
              ${emp ? emp.name : 'Employé inconnu'}
              <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
                (${absences.length} absence${absences.length > 1 ? 's' : ''})
              </span>
            </h4>
            <div class="flex flex-wrap gap-2">
              ${absences.map(a => `
                <div class="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm flex items-center gap-2">
                  ${a.date}
                  <button onclick="deleteAbsence('${a.id}')" class="text-red-500 hover:text-red-700">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }).join('');
    }
  };
  
  modal.innerHTML = `
    <div class="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-3xl w-full max-w-2xl shadow-2xl fade-in border dark:border-gray-700">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-bold flex items-center gap-2 dark:text-white">
          <i class="fas fa-history text-indigo-600"></i> Historique des absences
        </h3>
        <button onclick="document.getElementById('absenceHistoryModal').remove()" class="text-gray-400 hover:text-gray-600 text-2xl">
          ×
        </button>
      </div>
      
      <div class="mb-6">
        <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Filtrer par mois</label>
        <input type="month" id="historyMonthFilter" value="${currentMonth}" class="w-full p-4 border dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 dark:text-white">
      </div>
      
      <div id="absenceHistoryContent" class="max-h-96 overflow-y-auto">
        <!-- History will be rendered here -->
      </div>
      
      <div class="mt-6 flex justify-end">
        <button onclick="document.getElementById('absenceHistoryModal').remove()" class="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl font-bold">
          Fermer
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Set up event listener for month filter change
  const filter = document.getElementById('historyMonthFilter');
  if (filter) {
    filter.addEventListener('change', renderHistory);
  }
  
  // Render initial history
  renderHistory();
};

window.deleteAbsence = function(absenceId) {
  if (!appState.absences) appState.absences = [];
  appState.absences = appState.absences.filter(a => a.id !== absenceId);
  if (typeof autoSave === 'function') autoSave();
  // Re-render the history modal if it's open
  const modal = document.getElementById('absenceHistoryModal');
  if (modal) {
    document.getElementById('absenceHistoryModal').remove();
    openAbsenceHistoryModal();
  } else {
    renderCurrentTab();
  }
  showToast('Absence supprimée', 'success');
};

// Payment functions
window.openAddPaymentModal = function(employeeId) {
  const employee = appState.employees.find(e => e.id === employeeId);
  if (!employee) return;
  
  // Create a temporary modal for adding payment
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
  modal.innerHTML = `
    <div class="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-3xl w-full max-w-md shadow-2xl fade-in border dark:border-gray-700">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-bold flex items-center gap-2 dark:text-white">
          <i class="fas fa-money-check-alt text-indigo-600"></i> Ajouter paiement pour ${employee.name || employee.login}
        </h3>
        <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600 text-2xl">
          ×
        </button>
      </div>
      <div class="space-y-4 mb-6">
        <input id="newPaymentDesc" type="text" placeholder="Description (ex: Salaire juillet 2025)" class="w-full p-4 border dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 dark:text-white">
        <input id="newPaymentAmount" type="number" placeholder="Montant (DA)" class="w-full p-4 border dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 dark:text-white">
        <input id="newPaymentDate" type="date" value="${new Date().toISOString().split('T')[0]}" class="w-full p-4 border dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 dark:text-white">
      </div>
      <div class="flex gap-3">
        <button onclick="this.closest('.fixed').remove()" class="flex-1 px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl font-bold">Annuler</button>
        <button onclick="addEmployeePayment('${employeeId}')" class="flex-1 px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg transition-all">Ajouter</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
};

window.addEmployeePayment = function(employeeId) {
  const desc = document.getElementById('newPaymentDesc').value;
  const amount = Number(document.getElementById('newPaymentAmount').value);
  const date = document.getElementById('newPaymentDate').value;
  
  if (!amount || !date) {
    showToast('Veuillez remplir tous les champs', 'error');
    return;
  }
  
  if (!appState.employeePayments) appState.employeePayments = [];
  
  appState.employeePayments.push({
    id: 'payment-' + Date.now(),
    employeeId,
    description: desc,
    amount,
    date,
    paid: false,
    createdAt: Date.now()
  });
  
  document.querySelector('.fixed').remove();
  
  if (typeof autoSave === 'function') autoSave();
  if (typeof renderCurrentTab === 'function') renderCurrentTab();
  showToast('Paiement ajouté', 'success');
};

window.togglePaymentStatus = function(paymentId) {
  if (!appState.employeePayments) appState.employeePayments = [];
  const payment = appState.employeePayments.find(p => p.id === paymentId);
  if (payment) {
    payment.paid = !payment.paid;
    if (typeof autoSave === 'function') autoSave();
    if (typeof renderCurrentTab === 'function') renderCurrentTab();
    showToast(payment.paid ? 'Paiement marqué payé' : 'Paiement marqué non payé', 'success');
  }
};

window.toggleEmployeeActive = function(id) {
  const emp = (appState.employees || []).find(e => e.id === id);
  if (!emp) return;
  emp.active = !(emp.active !== false);
  emp.updatedAt = Date.now();
  if (typeof autoSave === 'function') autoSave();
  if (typeof renderCurrentTab === 'function') renderCurrentTab();
};

window.deleteEmployee = function(id) {
  if (!confirm('Supprimer cet employé ?')) return;
  appState.employees = (appState.employees || []).filter(e => e.id !== id);
  if (!appState.sync) appState.sync = {};
  if (!appState.sync.pendingDeletions) appState.sync.pendingDeletions = [];
  appState.sync.pendingDeletions.push({ col: 'employees', id: id });
  if (typeof autoSave === 'function') autoSave();
  if (typeof renderCurrentTab === 'function') renderCurrentTab();
  showToast('Employé supprimé', 'info');
};

window.filterClients = function() {
  const search = (document.getElementById('clientSearch')?.value || '').toLowerCase();
  const rows = document.querySelectorAll('#clientsTableBody tr');
  rows.forEach(row => {
    row.style.display = row.innerText.toLowerCase().includes(search) ? '' : 'none';
  });
};

window.calculateRedotpayUsd = function() {
  const dzdInput = document.getElementById('redotpayDzdAmount');
  const usdDisplay = document.getElementById('redotpayUsdDisplay');
  if (!dzdInput || !usdDisplay) return;
  const dzd = parseFloat(dzdInput.value) || 0;
  const rate = window.getRedotpayRate ? window.getRedotpayRate() : 250;
  usdDisplay.textContent = `${(dzd / rate).toFixed(2)} $`;
};

window.previewFile = function(input) {
  const preview = document.getElementById('filePreview');
  if (!preview) return;
  if (input?.files && input.files[0]) {
    const file = input.files[0];
    preview.innerHTML = `<p class="text-green-600 font-bold">${file.name}</p>`;
  }
};

window.handleOrderSubmit = async function(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const originalText = btn ? btn.innerHTML : '';
  if (btn) {
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Envoi en cours...';
    btn.disabled = true;
  }

  try {
    const platform = document.getElementById('platformSelect')?.value || 'N/A';
    const paymentMethod = document.getElementById('paymentMethodSelect')?.value || 'N/A';
    const token = localStorage.getItem('clientToken') || generateId('client_token');
    if (!localStorage.getItem('clientToken')) localStorage.setItem('clientToken', token);

    const orderData = {
      id: 'REQ-' + Date.now(),
      date: getLocalDateString(),
      read: false,
      processed: false,
      platform,
      paymentMethod,
      paymentProof: null,
      status: 'pending',
      clientToken: token
    };

    if (platform === 'meta') {
      orderData.metaObjective = document.getElementById('metaObjective')?.value;
      const followersTarget = document.querySelector('input[name="metaFollowersTarget"]:checked');
      if (followersTarget) orderData.metaFollowersTarget = followersTarget.value;
      const messagesTarget = document.querySelectorAll('input[name="metaMsgTarget"]:checked');
      if (messagesTarget.length > 0) {
        orderData.metaMessagesTarget = Array.from(messagesTarget).map(cb => cb.value).join(', ');
      }
    } else if (platform === 'tiktok') {
      orderData.tiktokObjective = document.getElementById('tiktokObjective')?.value;
      const tiktokMsg = document.querySelector('input[name="tiktokMsgTarget"]:checked');
      if (tiktokMsg) orderData.tiktokMsgTarget = tiktokMsg.value;
    }

    orderData.instagram = document.getElementById('metaInstaName')?.value || '';
    orderData.pageFacebook = document.getElementById('metaFbName')?.value || '';
    orderData.offer = document.getElementById('orderOfferSelect')?.value || '';
    orderData.websiteUrl = document.getElementById('websiteUrl')?.value || '';
    orderData.pubLink = document.getElementById('pubLink')?.value || '';
    orderData.clientNote = document.getElementById('clientNote')?.value || '';

    const proofInput = document.getElementById('paymentProof');
    if (proofInput && proofInput.files && proofInput.files[0]) {
      const file = proofInput.files[0];
      if (file.size > 5 * 1024 * 1024) throw new Error("L'image est trop volumineuse (Max 5MB)");
      if (typeof readFileAsDataURL === 'function') orderData.paymentProof = await readFileAsDataURL(file);
    }

    if (paymentMethod === 'redotpay') {
      const dzdAmount = parseFloat(document.getElementById('redotpayDzdAmount')?.value || 0);
      orderData.paymentDetails = {
        method: 'RedotPay',
        dzdAmount,
        usdToSend: dzdAmount / (window.getRedotpayRate ? window.getRedotpayRate() : 250)
      };
    }

    if (!appState.clientRequests) appState.clientRequests = [];
    appState.clientRequests.push(orderData);
    if (typeof autoSave === 'function') autoSave();

    showToast('Commande envoyée avec succès !', 'success');
    e.target.reset();
    const filePreview = document.getElementById('filePreview');
    if (filePreview) filePreview.innerHTML = '';
  } catch (error) {
    console.error('Erreur commande:', error);
    showToast(error?.message || "Erreur lors de l'envoi de la commande", 'error');
  } finally {
    if (btn) {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  }
};

// Local Backup Logic
window.exportLocalBackup = function() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href",     dataStr);
  downloadAnchorNode.setAttribute("download", "sponsor_hichem_backup_" + getLocalDateString() + ".json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
  showToast('Sauvegarde locale téléchargée !', 'success');
};

window.importLocalBackup = function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const result = JSON.parse(e.target.result);
      if (typeof result === 'object' && result !== null) {
        // Merge with current state or replace? Replace makes more sense for a backup restore
        Object.keys(result).forEach(key => {
          appState[key] = result[key];
        });
        if (typeof autoSave === 'function') autoSave();
        if (typeof renderTables === 'function') renderTables();
        showToast('Sauvegarde restaurée avec succès !', 'success');
      } else {
        throw new Error("Format JSON invalide");
      }
    } catch (err) {
      console.error("Erreur d'importation:", err);
      showToast('Erreur lors de la lecture du fichier', 'error');
    }
    // reset input
    event.target.value = '';
  };
  reader.readAsText(file);
};

window.deleteTransaction = function(id) {
  if(!confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) return;
  const t = appState.transactions.find(x => x.id === id);
  if (t && t.clientId) {
      const client = appState.clients.find(c => c.id === t.clientId);
      if (client) client.updatedAt = Date.now();
  }
  if (!appState.sync) appState.sync = {};
  if (!appState.sync.pendingDeletions) appState.sync.pendingDeletions = [];
  appState.sync.pendingDeletions.push({ col: 'transactions', id: id });
  
  appState.transactions = appState.transactions.filter(tx => tx.id !== id);
  if (typeof recalculateFinanceBalances === 'function') recalculateFinanceBalances();
  if (typeof renderTables === 'function') renderTables();
  if (typeof autoSave === 'function') autoSave();
  showToast('Transaction supprimée', 'info');
};

window.editTransaction = function(id) {
  const t = appState.transactions.find(x => x.id === id);
  if (!t) { showToast('Transaction introuvable', 'error'); return; }
  
  document.getElementById('editTxId').value = id;
  document.getElementById('editTxDate').value = t.date || '';
  document.getElementById('editTxAmount').value = t.amount || 0;
  document.getElementById('editTxPrice').value = t.priceDzd || 0;
  document.getElementById('editTxDuration').value = t.duration || '';
  document.getElementById('editTxPaid').checked = !!t.paid;
  
  const adAccountSelect = document.getElementById('editTxAdAccountId');
  if (adAccountSelect) {
      adAccountSelect.innerHTML = '<option value="">-- Aucun compte (Organique) --</option>' + 
          (appState.adAccounts || []).map(a => `<option value="${a.id}">${a.name} (${a.platform})</option>`).join('');
      adAccountSelect.value = t.adAccountId || '';
  }
  
  openModal('editTransactionModal');
};

window.saveEditTransaction = function() {
  const id = document.getElementById('editTxId').value;
  const t = appState.transactions.find(x => x.id === id);
  if (!t) return;
  
  const amount = Number(document.getElementById('editTxAmount').value || 0);
  const priceDzd = Number(document.getElementById('editTxPrice').value || 0);
  const dateStr = document.getElementById('editTxDate').value || t.date;
  const durationStr = document.getElementById('editTxDuration').value || '';
  const paid = document.getElementById('editTxPaid').checked;
  const adAccountId = document.getElementById('editTxAdAccountId')?.value || null;

  if (!amount || !priceDzd) { showToast('Valeurs invalides', 'error'); return; }
  
  const oldPrice = t.priceDzd || 0;
  const oldPaid = !!t.paid;
  
  const buyRateGuess = t.buyRate || (t.amount ? (Number(t.totalDzd || 0) / Number(t.amount || 1)) : Number(document.getElementById('buyRate')?.value || 0));
  const totalDzd = amount * Number(buyRateGuess || 0);
  const profit = priceDzd - totalDzd;
  
  if (t.clientId) {
      const client = appState.clients.find(c => c.id === t.clientId);
      if (client) {
          client.totalSpent = (client.totalSpent || 0) - oldPrice + priceDzd;
          
          if (!oldPaid) client.unpaid = (client.unpaid || 0) - oldPrice;
          if (!paid) client.unpaid = (client.unpaid || 0) + priceDzd;
          
          client.updatedAt = Date.now();
      }
  }

  Object.assign(t, { 
      amount, 
      priceDzd, 
      totalDzd, 
      profit, 
      date: dateStr,
      duration: durationStr, 
      paid,
      adAccountId,
      updatedAt: Date.now() 
  });

  if (typeof recalculateFinanceBalances === 'function') recalculateFinanceBalances();
  if (typeof renderTables === 'function') renderTables();
  if (typeof autoSave === 'function') autoSave();
  closeModal('editTransactionModal');
  showToast('Transaction mise à jour', 'success');
};

window.toggleUsdFilter = function(checked) {
  const ui = getUiState();
  ui.filters['expenses_usdOnly'] = checked;
  ui.pages['expenses'] = 1;
  if (typeof renderCurrentTab === 'function') renderCurrentTab();
};

window.filterClientOptions = function(query) {
  const dropdown = document.getElementById('clientDropdown');
  if (!dropdown) return;
  const options = dropdown.querySelectorAll('.client-option');
  const q = query.toLowerCase();
  let visibleCount = 0;
  options.forEach(opt => {
    const name = (opt.dataset.name || '').toLowerCase();
    if (name.includes(q) || q === '') {
      opt.style.display = 'block';
      visibleCount++;
    } else {
      opt.style.display = 'none';
    }
  });
  if (visibleCount > 0) {
    dropdown.style.display = 'block';
  } else {
    dropdown.style.display = 'none';
  }
};

window.selectClient = function(el) {
  const id = el.dataset.id;
  const name = el.dataset.name;
  const hiddenInput = document.getElementById('todoClientId');
  const searchInput = document.getElementById('todoClientSearch');
  const dropdown = document.getElementById('clientDropdown');
  if (hiddenInput) hiddenInput.value = id;
  if (searchInput) searchInput.value = name;
  if (dropdown) dropdown.style.display = 'none';
  document.querySelectorAll('.client-option').forEach(o => o.classList.remove('selected'));
  if (el) el.classList.add('selected');
};

document.addEventListener('click', function(e) {
  const search = document.getElementById('todoClientSearch');
  const dropdown = document.getElementById('clientDropdown');
  if (search && dropdown) {
    if (!search.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = 'none';
    }
  }
});

// ==========================================
// OCR NOTEBOOK SCANNER
// ==========================================

let pendingOcrSponsors = [];

window.openOcrCamera = function() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    showToast('Camera non disponible', 'error');
    return;
  }
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(stream => {
      const video = document.createElement('video');
      video.srcObject = stream;
      video.autoplay = true;
      const canvas = document.createElement('canvas');
      canvas.style.position = 'fixed';
      canvas.style.top = '50%';
      canvas.style.left = '50%';
      canvas.style.transform = 'translate(-50%, -50%)';
      canvas.style.zIndex = '9999';
      canvas.style.borderRadius = '20px';
      canvas.style.boxShadow = '0 20px 60px rgba(0,0,0,0.5)';
      document.body.appendChild(canvas);
      const ctx = canvas.getContext('2d');
      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        setTimeout(() => {
          stream.getTracks().forEach(track => track.stop());
          document.body.removeChild(canvas);
          canvas.toBlob(blob => {
            const file = new File([blob], 'carnet.jpg', { type: 'image/jpeg' });
            handleOcrFileSelect({ files: [file], target: { value: '' } });
          });
        }, 1500);
      };
    })
    .catch(err => {
      console.error('Camera error:', err);
      showToast('Erreur camera', 'error');
    });
};

window.handleOcrFileSelect = function(input) {
  const file = input.files[0];
  if (!file) return;
  
  if (file.size > 10 * 1024 * 1024) {
    showToast('Image trop grande (max 10MB)', 'error');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    document.getElementById('ocrPreviewImage').src = e.target.result;
    document.getElementById('ocrUploadSection').classList.add('hidden');
    document.getElementById('ocrPreviewSection').classList.remove('hidden');
    document.getElementById('ocrResultsSection').classList.add('hidden');
    processOcrImage(e.target.result);
  };
  reader.readAsDataURL(file);
};

async function processOcrImage(imageSrc) {
  const progressSection = document.getElementById('ocrProgress');
  const progressBar = document.getElementById('ocrProgressBar');
  const progressText = document.getElementById('ocrProgressText');
  
  progressSection.classList.remove('hidden');
  progressText.textContent = 'Analyse OCR en cours...';
  progressBar.style.width = '10%';
  
  try {
    const result = await Tesseract.recognize(imageSrc, 'fra+ara', {
      logger: m => {
        if (m.status === 'recognizing text') {
          const percent = Math.round(m.progress * 100);
          progressBar.style.width = percent + '%';
          progressText.textContent = `Analyse en cours... ${percent}%`;
        }
      },
      tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789àâäéèêëîïôöùûüçÿœæÀÂÄÉÈÊËÎÏÔÖÙÛÜÇŸŒÆ\' -,.✓✔☑✗VvWwXx',
      preserve_interword_spaces: '1',
      tessedit_pageseg_mode: '3', // Auto page segmentation
      tessedit_ocr_engine_mode: '2' // LSTM engine only (better for modern text)
    });
    
    progressBar.style.width = '100%';
    progressText.textContent = 'Analyse terminée !';
    
    const text = result.data.text;
    console.log('OCR Result:', text);
    
    // Afficher le texte brut OCR
    document.getElementById('ocrRawText').textContent = text || '(vide)';
    
    pendingOcrSponsors = parseNotebookText(text);
    
    setTimeout(() => {
      progressSection.classList.add('hidden');
      document.getElementById('ocrResultsSection').classList.remove('hidden');
      displayOcrResults(pendingOcrSponsors);
    }, 500);
    
  } catch (err) {
    console.error('OCR Error:', err);
    progressSection.classList.add('hidden');
    showToast('Erreur lors de l\'analyse de l\'image', 'error');
  }
}

function parseNotebookText(text) {
  const lines = text.split('\n').filter(l => l.trim());
  const sponsors = [];
  const existingClients = appState.clients || [];
  const offers = appState.offers || [];
  
  // Pattern plus flexible pour les montants : 3-6 chiffres, avec ou sans séparateurs, avec ou sans DA/DZD
  const amountPattern = /(\d[\d\s,.]{2,8})\s*(?:da|dzd|dz|€|\$)?/i;
  
  for (const line of lines) {
    console.log('Traitement ligne:', line);
    
    // Compte les checks (✓, ✔, ☑, et 'W' que Tesseract détecte souvent)
    let checkCount = 0;
    const checkChars = ['✓', '✔', '☑', '✗', 'W', 'w', 'V', 'v', 'X', 'x'];
    for (const char of line) {
      if (checkChars.includes(char)) {
        checkCount++;
      }
    }
    
    // Pas de restriction sur les checks pour l'instant (pour test)
    
    // Nettoyer la ligne en enlevant les checks et caractères spéciaux
    let cleanLine = line;
    for (const char of checkChars) {
      cleanLine = cleanLine.split(char).join('');
    }
    cleanLine = cleanLine.trim();
    
    const amountMatch = cleanLine.match(amountPattern);
    if (!amountMatch) {
      console.log('Pas de montant trouvé');
      continue;
    }
    
    // Extraire le montant : enlever espaces, virgules, points
    let amountStr = amountMatch[1].replace(/[\s,.]/g, '');
    const amount = parseInt(amountStr);
    if (isNaN(amount) || amount < 100) {
      console.log('Montant invalide:', amountStr);
      continue;
    }
    
    let name = cleanLine.replace(amountPattern, '').trim();
    name = name.replace(/[^\p{L}\s\p{N}'-]/gu, '').trim();
    name = name.replace(/\s+/g, ' ').trim(); // Remplace multiples espaces par un seul
    
    if (!name || name.length < 2) {
      console.log('Nom invalide ou trop court:', name);
      continue;
    }
    
    // Payé si 2 checks ou plus
    const paid = checkCount >= 2;
    
    // Recherche client améliorée
    let matchedClient = existingClients.find(c => {
      if (!c.name) return false;
      const cName = c.name.toLowerCase().trim();
      const nName = name.toLowerCase().trim();
      return cName.includes(nName) || nName.includes(cName);
    });
    
    let matchedOffer = offers.find(o => {
      if (!o.priceDzd && !o.price) return false;
      const price = o.priceDzd || o.price;
      return Math.abs(price - amount) < 100;
    });
    
    if (!matchedOffer && amount > 0) {
      const similarOffer = offers.find(o => {
        if (!o.priceDzd && !o.price) return false;
        const price = o.priceDzd || o.price;
        return Math.abs(price - amount) < 500;
      });
      if (similarOffer) matchedOffer = { ...similarOffer, custom: true };
    }
    
    sponsors.push({
      name,
      amount,
      paid,
      checkCount,
      clientId: matchedClient ? matchedClient.id : null,
      clientFound: !!matchedClient,
      offerId: matchedOffer ? matchedOffer.id : null,
      offer: matchedOffer,
      offerNeeded: !matchedOffer,
      needsNewClient: !matchedClient,
      needsNewOffer: !matchedOffer
    });
  }
  
  console.log('Sponsors trouvés:', sponsors);
  return sponsors;
}

function displayOcrResults(sponsors) {
  const container = document.getElementById('ocrDetectedSponsors');
  
  if (sponsors.length === 0) {
    container.innerHTML = '<div class="text-center text-gray-500 py-8"><i class="fas fa-search text-4xl mb-3"></i><p>Aucun sponsor détecté</p><p class="text-sm mt-2">Clique sur "Ajouter un sponsor manuellement" pour commencer</p></div>';
    return;
  }
  
  container.innerHTML = sponsors.map((s, i) => {
    const statusIcon = s.paid ? 'fa-check-circle text-green-500' : 'fa-clock text-yellow-500';
    const statusText = s.paid ? 'Payé' : 'Non payé';
    const clientBadge = s.clientFound ? '<span class="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Client existant</span>' : '<span class="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">Nouveau client</span>';
    const offerBadge = s.offerNeeded ? '<span class="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">Offre personnalisée</span>' : '';
    const checksDisplay = s.checkCount ? `<span class="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">✓ x${s.checkCount}</span>` : '';
    
    return `
      <div class="p-4 border rounded-2xl ${s.needsNewClient || s.offerNeeded ? 'border-orange-300 bg-orange-50' : 'border-gray-200 bg-gray-50'}">
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <i class="fas ${statusIcon}"></i>
              <span class="font-bold text-gray-800">${s.name}</span>
              <span class="font-bold text-indigo-600">${s.amount.toLocaleString()} DA</span>
            </div>
            <div class="flex flex-wrap gap-2 mt-2">
              ${clientBadge}
              ${offerBadge}
              ${checksDisplay}
            </div>
            ${s.needsNewClient ? '<p class="text-xs text-red-600 mt-1"><i class="fas fa-exclamation-triangle mr-1"></i>Client non trouvé - À créer</p>' : ''}
            ${s.offerNeeded ? '<p class="text-xs text-orange-600 mt-1"><i class="fas fa-tag mr-1"></i>Offre non reconnue - À configurer</p>' : ''}
          </div>
          <div class="flex flex-col items-end gap-2">
            <span class="text-xs ${s.paid ? 'text-green-600' : 'text-yellow-600'} font-medium">${statusText}</span>
            <button onclick="deleteSponsorFromList(${i})" class="text-red-500 hover:text-red-700 text-sm">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

window.deleteSponsorFromList = function(index) {
  pendingOcrSponsors.splice(index, 1);
  displayOcrResults(pendingOcrSponsors);
  showToast('Sponsor supprimé', 'info');
};

window.resetOcrScanner = function() {
  document.getElementById('ocrUploadSection').classList.remove('hidden');
  document.getElementById('ocrPreviewSection').classList.add('hidden');
  document.getElementById('ocrResultsSection').classList.add('hidden');
  document.getElementById('ocrFileInput').value = '';
  document.getElementById('ocrPreviewImage').src = '';
  pendingOcrSponsors = [];
};

window.confirmOcrSponsors = async function() {
  const needsNewClient = pendingOcrSponsors.some(s => s.needsNewClient);
  const needsNewOffer = pendingOcrSponsors.some(s => s.offerNeeded);
  
  if (needsNewClient) {
    const firstNew = pendingOcrSponsors.find(s => s.needsNewClient);
    document.getElementById('ocrClientName').value = firstNew.name;
    document.getElementById('ocrNewClientName').value = firstNew.name;
    closeModal('ocrScannerModal');
    openModal('newClientFromOcrModal');
    return;
  }
  
  if (needsNewOffer) {
    const firstNewOffer = pendingOcrSponsors.find(s => s.offerNeeded);
    document.getElementById('ocrOfferIndex').value = pendingOcrSponsors.indexOf(firstNewOffer);
    document.getElementById('ocrCustomOfferName').value = '';
    document.getElementById('ocrCustomOfferPrice').value = firstNewOffer.amount;
    document.getElementById('ocrCustomOfferDuration').value = '';
    closeModal('ocrScannerModal');
    openModal('customOfferFromOcrModal');
    return;
  }
  
  await createOcrSponsorsDirect();
};

async function createOcrSponsorsDirect() {
  const today = new Date().toISOString().split('T')[0];
  const todosToCreate = [];
  const txToCreate = [];
  
  for (const sponsor of pendingOcrSponsors) {
    if (!sponsor.clientId || !sponsor.offerId) continue;
    
    todosToCreate.push({
      id: generateId('todo'),
      clientId: sponsor.clientId,
      offerId: sponsor.offerId,
      adAccountId: null,
      date: today,
      status: sponsor.paid ? 'completed' : 'pending',
      paid: sponsor.paid,
      priceDzd: sponsor.amount,
      notes: 'Créé via scanner carnet',
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    
    txToCreate.push({
      id: generateId('tx'),
      clientId: sponsor.clientId,
      offerId: sponsor.offerId,
      adAccountId: null,
      amount: 1,
      priceDzd: sponsor.amount,
      duration: sponsor.offer?.duration || '',
      date: today,
      paid: sponsor.paid,
      offerName: sponsor.offer?.name || 'Offre custom',
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  }
  
  if (!appState.todoTransactions) appState.todoTransactions = [];
  if (!appState.transactions) appState.transactions = [];
  
  appState.todoTransactions.push(...todosToCreate);
  appState.transactions.push(...txToCreate);
  
  if (typeof autoSave === 'function') autoSave();
  if (typeof renderCurrentTab === 'function') renderCurrentTab();
  
  showToast(`${pendingOcrSponsors.length} sponsor(s) créé(s) !`, 'success');
  resetOcrScanner();
  closeModal('ocrScannerModal');
}

window.saveClientFromOcr = function() {
  const clientName = document.getElementById('ocrNewClientName').value.trim();
  const page = document.getElementById('ocrNewClientPage').value.trim();
  const whatsapp = document.getElementById('ocrNewClientWhatsapp').value.trim();
  const city = document.getElementById('ocrNewClientCity').value.trim();
  const platform = document.getElementById('ocrNewClientPlatform').value;
  
  if (!clientName) {
    showToast('Nom du client requis', 'error');
    return;
  }
  
  const newClient = {
    id: generateId('client'),
    name: clientName,
    page: page,
    whatsapp: whatsapp,
    city: city,
    platform: platform,
    paid: 0,
    unpaid: 0,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  
  if (!appState.clients) appState.clients = [];
  appState.clients.push(newClient);
  
  const clientIndex = pendingOcrSponsors.findIndex(s => s.name.toLowerCase() === clientName.toLowerCase());
  if (clientIndex !== -1) {
    pendingOcrSponsors[clientIndex].clientId = newClient.id;
    pendingOcrSponsors[clientIndex].clientFound = true;
    pendingOcrSponsors[clientIndex].needsNewClient = false;
  }
  
  closeModal('newClientFromOcrModal');
  openModal('ocrScannerModal');
  displayOcrResults(pendingOcrSponsors);
  
  if (typeof autoSave === 'function') autoSave();
  showToast('Client créé !', 'success');
  
  const stillNeedsClient = pendingOcrSponsors.some(s => s.needsNewClient);
  const stillNeedsOffer = pendingOcrSponsors.some(s => s.offerNeeded);
  
  if (!stillNeedsClient && !stillNeedsOffer) {
    confirmOcrSponsors();
  } else if (stillNeedsClient) {
    const nextNew = pendingOcrSponsors.find(s => s.needsNewClient);
    document.getElementById('ocrClientName').value = nextNew.name;
    document.getElementById('ocrNewClientName').value = nextNew.name;
    closeModal('ocrScannerModal');
    openModal('newClientFromOcrModal');
  }
};

window.saveCustomOfferFromOcr = function() {
  const name = document.getElementById('ocrCustomOfferName').value.trim();
  const price = parseInt(document.getElementById('ocrCustomOfferPrice').value) || 0;
  const duration = document.getElementById('ocrCustomOfferDuration').value.trim();
  const desc = document.getElementById('ocrCustomOfferDesc').value.trim();
  
  if (!name || price <= 0) {
    showToast('Nom et prix de l\'offre requis', 'error');
    return;
  }
  
  const newOffer = {
    id: generateId('offer'),
    name: name,
    description: desc,
    priceDzd: price,
    costPerUnit: 0,
    duration: duration,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  
  if (!appState.offers) appState.offers = [];
  appState.offers.push(newOffer);
  
  const offerIdx = parseInt(document.getElementById('ocrOfferIndex').value);
  if (!isNaN(offerIdx) && pendingOcrSponsors[offerIdx]) {
    pendingOcrSponsors[offerIdx].offerId = newOffer.id;
    pendingOcrSponsors[offerIdx].offer = newOffer;
    pendingOcrSponsors[offerIdx].offerNeeded = false;
  }
  
  for (const sponsor of pendingOcrSponsors) {
    if (sponsor.offerNeeded && sponsor.amount === price) {
      sponsor.offerId = newOffer.id;
      sponsor.offer = newOffer;
      sponsor.offerNeeded = false;
      break;
    }
  }
  
  closeModal('customOfferFromOcrModal');
  openModal('ocrScannerModal');
  displayOcrResults(pendingOcrSponsors);
  
  if (typeof autoSave === 'function') autoSave();
  showToast('Offre créée !', 'success');
  
  const stillNeedsOffer = pendingOcrSponsors.some(s => s.offerNeeded);
  if (!stillNeedsOffer) {
    confirmOcrSponsors();
  }
};

window.addManualSponsor = function() {
  // Réinitialiser les champs
  document.getElementById('manualSponsorName').value = '';
  document.getElementById('manualSponsorAmount').value = '';
  document.getElementById('manualSponsorPaid').checked = false;
  
  closeModal('ocrScannerModal');
  openModal('manualSponsorModal');
};

window.saveManualSponsor = function() {
  const name = document.getElementById('manualSponsorName').value.trim();
  const amount = parseInt(document.getElementById('manualSponsorAmount').value) || 0;
  const paid = document.getElementById('manualSponsorPaid').checked;
  
  if (!name || amount <= 0) {
    showToast('Nom et montant requis', 'error');
    return;
  }
  
  const existingClients = appState.clients || [];
  const offers = appState.offers || [];
  
  // Recherche client
  let matchedClient = existingClients.find(c => {
    if (!c.name) return false;
    const cName = c.name.toLowerCase().trim();
    const nName = name.toLowerCase().trim();
    return cName.includes(nName) || nName.includes(cName);
  });
  
  // Recherche offre
  let matchedOffer = offers.find(o => {
    if (!o.priceDzd && !o.price) return false;
    const price = o.priceDzd || o.price;
    return Math.abs(price - amount) < 100;
  });
  
  if (!matchedOffer && amount > 0) {
    const similarOffer = offers.find(o => {
      if (!o.priceDzd && !o.price) return false;
      const price = o.priceDzd || o.price;
      return Math.abs(price - amount) < 500;
    });
    if (similarOffer) matchedOffer = { ...similarOffer, custom: true };
  }
  
  pendingOcrSponsors.push({
    name,
    amount,
    paid,
    checkCount: paid ? 2 : 1,
    clientId: matchedClient ? matchedClient.id : null,
    clientFound: !!matchedClient,
    offerId: matchedOffer ? matchedOffer.id : null,
    offer: matchedOffer,
    offerNeeded: !matchedOffer,
    needsNewClient: !matchedClient,
    needsNewOffer: !matchedOffer
  });
  
  closeModal('manualSponsorModal');
  openModal('ocrScannerModal');
  displayOcrResults(pendingOcrSponsors);
  
  showToast('Sponsor ajouté !', 'success');
};

// === HANDLERS PERFORMANCE SALARIÉS ===
window.addEmployeePerformance = function() {
  const employeeId = document.getElementById('perf-employee').value;
  const tasks = Number(document.getElementById('perf-tasks').value);
  const date = document.getElementById('perf-date').value;

  if (!employeeId || tasks <= 0 || !date) {
    showToast('Veuillez remplir tous les champs', 'error');
    return;
  }

  // Add tasks as individual transactions
  for (let i = 0; i < tasks; i++) {
    const txEntry = {
      id: 'tx-emp-' + Date.now() + '-' + i,
      date: date,
      employeeId: employeeId,
      createdAt: Date.now()
    };

    if (!appState.transactions) appState.transactions = [];
    appState.transactions.push(txEntry);
  }

  if (typeof autoSave === 'function') autoSave();
  if (typeof renderCurrentTab === 'function') renderCurrentTab();

  showToast(tasks + ' tâche(s) ajoutée(s) !', 'success');
};

window.exportPerformanceCSV = function() {
  const employees = appState.employees || [];
  const txs = appState.transactions || [];
  const config = appState.performanceConfig || {
    ratePerTask: 1700,
    fixedCosts: {
      salary: 40000,
      internet: 3000,
      pub: 20000,
      risque: 15000
    }
  };

  function calculPrime(gain) {
    if (gain >= 350000) return 12000;
    if (gain >= 250000) return 8000;
    if (gain >= 150000) return 5000;
    return 0;
  }

  // Get counts by employee
  const counts = {};
  txs.forEach(tx => {
    const id = tx.employeeId || 'unassigned';
    counts[id] = (counts[id] || 0) + 1;
  });

  const rows = Object.keys(counts).map(id => {
    const emp = employees.find(e => e.id === id);
    const tasks = counts[id];
    const gain = tasks * config.ratePerTask;
    const share = gain * 0.3;
    const prime = calculPrime(gain);
    const net = gain
      - config.fixedCosts.salary
      - config.fixedCosts.internet
      - config.fixedCosts.pub
      - config.fixedCosts.risque
      - prime;

    return {
      name: emp ? emp.name : 'Non attribué',
      tasks,
      gain,
      share,
      prime,
      net
    };
  }).sort((a, b) => b.gain - a.gain);

  let csv = "Nom,Tâches,Gain Société,Valeur 30%,Prime,Bénéfice Net\n";
  rows.forEach(p => {
    csv += `${p.name},${p.tasks},${p.gain},${Math.round(p.share)},${p.prime},${p.net}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'performance_salaries.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showToast('Export CSV terminé !', 'success');
};



