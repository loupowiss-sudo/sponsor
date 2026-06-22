// === UI-RENDER.JS ===

/**
 * Affiche un onglet spécifique
 * @param {string} tabId 
 */
// Function to check if employee has access to a tab
function hasTabAccess(tabId) {
  // Admin has full access
  if (!appState.session || appState.session.type !== 'employee') return true;
  // Employee checks permissions
  const permissions = appState.session.permissions || {};
  return permissions[tabId] === true;
}

// Function to update navigation buttons visibility
function updateNavButtonsVisibility() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    const onclickAttr = btn.getAttribute('onclick');
    if (!onclickAttr) return;
    const match = onclickAttr.match(/showTab\('([^']+)'\)/);
    if (!match) return;
    const tabId = match[1];
    if (hasTabAccess(tabId)) {
      btn.style.display = '';
    } else {
      btn.style.display = 'none';
    }
  });
}

window.showTab = function(tabId) {
  // Check access
  if (!hasTabAccess(tabId)) {
    // Find first accessible tab
    const allTabs = ['dashboard', 'clients', 'history', 'todo', 'offers', 'expenses', 'paiements', 'achats', 'reminders', 'ad-accounts', 'requests', 'performance', 'settings'];
    const firstAccessible = allTabs.find(t => hasTabAccess(t));
    if (firstAccessible) tabId = firstAccessible;
    else return;
  }

  appState.currentTab = tabId;
  
  // Update buttons
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.remove('bg-blue-600', 'text-white');
    b.classList.add('bg-gray-100', 'text-gray-700');
  });
  
  const btn = document.querySelector(`button[onclick="showTab('${tabId}')"]`);
  if (btn) {
    btn.classList.remove('bg-gray-100', 'text-gray-700');
    btn.classList.add('bg-blue-600', 'text-white');
  }
  
  renderCurrentTab();
};

/**
 * Rend le contenu de l'onglet actuel
 */
window.renderCurrentTab = function() {
  const tab = appState.currentTab || 'dashboard';
  const container = document.getElementById('tabContentContainer');
  if (!container) return;

  // Check access
  if (!hasTabAccess(tab)) {
    const allTabs = ['dashboard', 'clients', 'history', 'todo', 'offers', 'expenses', 'paiements', 'achats', 'reminders', 'ad-accounts', 'requests', 'performance', 'settings'];
    const firstAccessible = allTabs.find(t => hasTabAccess(t));
    if (firstAccessible) {
      appState.currentTab = firstAccessible;
    } else {
      container.innerHTML = '<p class="text-center py-8 text-gray-500">Accès refusé</p>';
      return;
    }
  }

  // Clear container
  container.innerHTML = '';

  switch(tab) {
    case 'dashboard': renderDashboard(container); break;
    case 'clients': renderClientsTable(container); break;
    case 'transactions': renderTodoTable(container); break;
    case 'history': renderTransactionsTable(container); break;
    case 'todo': renderNewTodoForm(container); break;
    case 'offers': renderOffersGrid(container); break;
    case 'expenses': renderExpensesTab(container); break;
    case 'paiements': renderPaymentsTable(container); break;
    case 'achats': renderUsdPurchasesTable(container); break;
    case 'reminders': renderRemindersTable(container); break;
    case 'ad-accounts': renderAdAccountsTable(container); break;
    case 'requests': renderRequests(container); break;
    case 'performance': renderEmployeePerformance(container); break;
    case 'settings': renderSettingsAdmin(container); break;
  }

  // Update nav visibility
  updateNavButtonsVisibility();
};

function getUiState() {
  if (!appState.ui) appState.ui = {};
  if (!appState.ui.pages) appState.ui.pages = {};
  if (!appState.ui.filters) appState.ui.filters = {};
  return appState.ui;
}

function clampPage(page, totalPages) {
  const p = Number(page) || 1;
  const max = Math.max(1, totalPages || 1);
  return Math.min(Math.max(1, p), max);
}

function toTs(item) {
  if (!item) return 0;
  if (item.updatedAt) return Number(item.updatedAt) || 0;
  if (item.createdAt) return Number(item.createdAt) || 0;
  if (item.date) {
    const t = Date.parse(item.date);
    return Number.isFinite(t) ? t : 0;
  }
  return 0;
}

function getLastUpdatedLabel(items) {
  const ts = Math.max(0, ...(items || []).map(toTs));
  if (!ts) return '—';
  return new Date(ts).toLocaleString('fr-FR');
}

function pageRange(current, total) {
  const t = Math.max(1, total || 1);
  const c = clampPage(current, t);
  const out = [];
  const push = (x) => out.push(x);
  if (t <= 7) {
    for (let i = 1; i <= t; i++) push(i);
    return out;
  }
  push(1);
  if (c > 4) push('…');
  const start = Math.max(2, c - 1);
  const end = Math.min(t - 1, c + 1);
  for (let i = start; i <= end; i++) push(i);
  if (c < t - 3) push('…');
  push(t);
  return out;
}

function renderPagination(key, page, totalItems, pageSize) {
  const totalPages = Math.max(1, Math.ceil((totalItems || 0) / pageSize));
  const current = clampPage(page, totalPages);
  const pages = pageRange(current, totalPages);
  const prevDisabled = current <= 1;
  const nextDisabled = current >= totalPages;
  return `
    <div class="flex flex-wrap items-center justify-between gap-3 mt-4">
      <div class="text-xs text-gray-500">Page ${current} / ${totalPages} • ${totalItems} éléments</div>
      <div class="flex flex-wrap items-center gap-2">
        <button ${prevDisabled ? 'disabled' : ''} onclick="setListPage('${key}', ${current - 1})" class="px-3 py-2 rounded-xl border text-xs font-bold ${prevDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}">Précédent</button>
        ${pages.map(p => p === '…'
          ? `<span class="px-2 text-gray-400">…</span>`
          : `<button onclick="setListPage('${key}', ${p})" class="w-9 h-9 rounded-xl border text-xs font-black ${p === current ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-50'}">${p}</button>`
        ).join('')}
        <button ${nextDisabled ? 'disabled' : ''} onclick="setListPage('${key}', ${current + 1})" class="px-3 py-2 rounded-xl border text-xs font-bold ${nextDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}">Suivant</button>
      </div>
    </div>
  `;
}

/**
 * Rend le Dashboard (Stats, etc.)
 */
window.renderDashboard = function(container) {
  recalculateFinanceBalances();
  const b = appState.balances || { liquide: 0, baridimob: 0, usdt: 0 };
  const role = getUserRole();
  const isAdmin = role === 'admin';
  const ui = getUiState();
  const defaultRanges = (typeof getDefaultProfitRanges === 'function') ? getDefaultProfitRanges() : null;
  const selFrom = (ui.profitRange && ui.profitRange.from) ? ui.profitRange.from : (defaultRanges ? defaultRanges.month.from : '');
  const selTo = (ui.profitRange && ui.profitRange.to) ? ui.profitRange.to : (defaultRanges ? defaultRanges.month.to : '');
  const sum = (from, to) => (typeof getProfitSummaryYmd === 'function') ? getProfitSummaryYmd(from, to) : null;
  const pToday = defaultRanges ? sum(defaultRanges.today.from, defaultRanges.today.to) : null;
  const pYesterday = defaultRanges ? sum(defaultRanges.yesterday.from, defaultRanges.yesterday.to) : null;
  const pWeek = defaultRanges ? sum(defaultRanges.week.from, defaultRanges.week.to) : null;
  const pMonth = defaultRanges ? sum(defaultRanges.month.from, defaultRanges.month.to) : null;
  const pCustom = (selFrom && selTo) ? sum(selFrom, selTo) : null;

  const employees = appState.employees || [];
  const txs = appState.transactions || [];
  
  const nowMs = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;
  const expiringCampaigns = txs.filter(t => {
      if (t.status !== 'active' && t.status) return false;
      if (!t.endDate) return false;
      const timeLeft = t.endDate - nowMs;
      return timeLeft > 0 && timeLeft <= oneDayMs;
  });

  const parseYmdLocal = (ymd) => {
    if (!ymd || typeof ymd !== 'string') return null;
    const m = ymd.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return null;
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    if (Number.isNaN(d.getTime())) return null;
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const inRange = (ymd, from, to) => {
    const d = parseYmdLocal(ymd);
    const a = parseYmdLocal(from);
    const b = parseYmdLocal(to);
    if (!d || !a || !b) return false;
    const start = a.getTime() <= b.getTime() ? a : b;
    const end = a.getTime() <= b.getTime() ? b : a;
    return d.getTime() >= start.getTime() && d.getTime() <= end.getTime();
  };

  const employeeRows = (from, to) => {
    const counts = {};
    txs.forEach(t => {
      if (!t || !t.date) return;
      if (!inRange(t.date, from, to)) return;
      const id = t.employeeId || 'unassigned';
      counts[id] = (counts[id] || 0) + 1;
    });
    const rows = [];
    employees.forEach(e => {
      rows.push({ id: e.id, name: e.name, count: counts[e.id] || 0 });
    });
    if (counts.unassigned) rows.push({ id: 'unassigned', name: 'Non attribué', count: counts.unassigned || 0 });
    rows.sort((a, b) => b.count - a.count);
    return rows;
  };

  const employeeCountsMap = (from, to) => {
    const m = {};
    txs.forEach(t => {
      if (!t || !t.date) return;
      if (!inRange(t.date, from, to)) return;
      const id = t.employeeId || 'unassigned';
      m[id] = (m[id] || 0) + 1;
    });
    return m;
  };

  const employeeStatsHtml = (() => {
    if (!defaultRanges) return '<div class="text-sm text-gray-400 italic">Stats indisponibles.</div>';
    if (!pCustom) return '<div class="text-sm text-gray-400 italic">Choisis un intervalle ci-dessus.</div>';

    const mToday = employeeCountsMap(defaultRanges.today.from, defaultRanges.today.to);
    const mYesterday = employeeCountsMap(defaultRanges.yesterday.from, defaultRanges.yesterday.to);
    const mWeek = employeeCountsMap(defaultRanges.week.from, defaultRanges.week.to);
    const mMonth = employeeCountsMap(defaultRanges.month.from, defaultRanges.month.to);
    const mRange = employeeCountsMap(pCustom.fromYmd, pCustom.toYmd);

    const ids = new Set();
    employees.forEach(e => ids.add(e.id));
    Object.keys(mToday).forEach(k => ids.add(k));
    Object.keys(mYesterday).forEach(k => ids.add(k));
    Object.keys(mWeek).forEach(k => ids.add(k));
    Object.keys(mMonth).forEach(k => ids.add(k));
    Object.keys(mRange).forEach(k => ids.add(k));

    const rows = Array.from(ids).map(id => {
      const emp = employees.find(e => e.id === id);
      return {
        id,
        name: emp ? emp.name : (id === 'unassigned' ? 'Non attribué' : id),
        today: mToday[id] || 0,
        yesterday: mYesterday[id] || 0,
        week: mWeek[id] || 0,
        month: mMonth[id] || 0,
        range: mRange[id] || 0
      };
    }).sort((a, b) => (b.range - a.range) || (b.week - a.week) || String(a.name || '').localeCompare(String(b.name || '')));

    return `
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-black uppercase border-b dark:border-gray-700">
              <th class="p-3">Employé</th>
              <th class="p-3 text-right">Aujourd'hui</th>
              <th class="p-3 text-right">Hier</th>
              <th class="p-3 text-right">Semaine</th>
              <th class="p-3 text-right">Mois</th>
              <th class="p-3 text-right">Intervalle</th>
            </tr>
          </thead>
          <tbody class="divide-y dark:divide-gray-700">
            ${rows.map(r => `
              <tr class="hover:bg-white dark:hover:bg-gray-800/60">
                <td class="p-3 font-bold text-gray-800 dark:text-gray-200">${r.name}</td>
                <td class="p-3 text-right font-black text-indigo-600">${r.today}</td>
                <td class="p-3 text-right font-black text-indigo-600">${r.yesterday}</td>
                <td class="p-3 text-right font-black text-indigo-600">${r.week}</td>
                <td class="p-3 text-right font-black text-indigo-600">${r.month}</td>
                <td class="p-3 text-right font-black text-green-600">${r.range}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  })();

  // --- SMART ALERTS ---
  const alerts = [];
  const usdtStock = b.usdt || 0;
  if (usdtStock < 150) {
      alerts.push({
          type: 'warning', icon: 'fa-exclamation-triangle',
          text: `Stock USDT critique : Il ne reste que ${formatCurrency(usdtStock, 'USD', 2)}. Prévoyez un rechargement.`
      });
  }

  const allClients = appState.clients || [];
  let totalDettes = 0;
  
  allClients.forEach(c => {
      if (Number(c.unpaid || 0) > 0) {
          totalDettes++;
      }
  });

  if (totalDettes > 0) {
      alerts.push({ type: 'danger', icon: 'fa-exclamation-circle', text: `Action Requise : ${totalDettes} client(s) ont une dette en cours.` });
  }

  const alertsHtml = alerts.length > 0 ? `
    <div class="mb-6 flex flex-col gap-3 fade-in">
        ${alerts.map(a => `
            <div class="p-4 rounded-xl border flex items-center gap-4 shadow-sm ${a.type === 'danger' ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300' : 'bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-300'}">
                <i class="fas ${a.icon} text-2xl"></i>
                <div class="font-bold text-sm md:text-base">${a.text}</div>
            </div>
        `).join('')}
    </div>
  ` : '';
  
  container.innerHTML = `
    ${alertsHtml}
    
    <!-- Absence System -->
    <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border dark:border-gray-700 mb-8">
      <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-3">
        <h3 class="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <i class="fas fa-user-times text-indigo-600"></i> Absences des employés
        </h3>
        <button onclick="openAbsenceHistoryModal()" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl shadow-lg transition-all">
          <i class="fas fa-history mr-2"></i> Historique
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${employees.filter(e => e.active).map(e => {
          const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Algiers' }));
          const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
          const absence = (appState.absences || []).find(a => a.employeeId === e.id && a.date === todayStr);
          const isAbsent = !!absence;
          return `
            <div class="p-4 border rounded-2xl bg-gray-50 dark:bg-gray-700 flex items-center justify-between">
              <div>
                <div class="font-bold text-gray-800 dark:text-white">${e.name || e.login}</div>
                <div class="text-xs text-gray-500">${isAbsent ? `Absent (marqué à ${new Date(absence.time).toLocaleTimeString('fr-FR')})` : 'Présent'}</div>
              </div>
              <button onclick="${isAbsent ? `removeAbsence('${e.id}')` : `markAbsent('${e.id}')`}" 
                class="px-4 py-2 rounded-xl font-bold text-xs ${isAbsent ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}">
                ${isAbsent ? 'Annuler absence' : 'Marquer absent'}
              </button>
            </div>
          `;
        }).join('')}
        ${employees.filter(e => e.active).length === 0 ? `
          <div class="col-span-full text-center py-8 text-gray-500 dark:text-gray-400 italic">
            Aucun employé actif
          </div>
        ` : ''}
      </div>
    </div>
    
    ${isAdmin ? `
    <div class="flex flex-col md:flex-row justify-between md:items-center gap-3 mb-4">
      <div class="text-sm text-gray-500 dark:text-gray-400 font-bold">Soldes</div>
      <button onclick="openModal('balancesModal')" class="px-4 py-2 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-black hover:bg-gray-50 dark:hover:bg-gray-700">
        Ajuster
      </button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border-l-8 border-green-500 fade-in dark:border-gray-700">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400">
            <i class="fas fa-money-bill-wave text-2xl"></i>
          </div>
          <div>
            <h3 class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Liquide</h3>
            <p class="text-3xl font-black text-gray-800 dark:text-white">${formatCurrency(b.liquide)}</p>
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border-l-8 border-blue-500 fade-in dark:border-gray-700">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
            <i class="fas fa-university text-2xl"></i>
          </div>
          <div>
            <h3 class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">BaridiMob</h3>
            <p class="text-3xl font-black text-gray-800 dark:text-white">${formatCurrency(b.baridimob)}</p>
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border-l-8 border-purple-500 fade-in dark:border-gray-700">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400">
            <i class="fas fa-coins text-2xl"></i>
          </div>
          <div>
            <h3 class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stock USDT</h3>
            <p class="text-3xl font-black text-gray-800 dark:text-white">${safeToFixed(b.usdt)} <span class="text-sm font-bold text-purple-400">USDT</span></p>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 mb-8">
      <div class="flex flex-col md:flex-row justify-between md:items-center gap-3 mb-6">
        <div>
          <h3 class="text-xl font-bold flex items-center gap-2 dark:text-white">
            <i class="fas fa-chart-pie text-indigo-500"></i> Profit
          </h3>
          <div class="text-xs text-gray-500 dark:text-gray-400">Basé sur ventes - coût (taux achat) - frais</div>
        </div>
        <div class="flex flex-col md:flex-row gap-2 md:items-center">
          <input id="profitFrom" type="date" value="${selFrom}" class="w-full md:w-44 p-3 border dark:border-gray-700 rounded-xl outline-none bg-gray-50 dark:bg-gray-900 dark:text-white">
          <input id="profitTo" type="date" value="${selTo}" class="w-full md:w-44 p-3 border dark:border-gray-700 rounded-xl outline-none bg-gray-50 dark:bg-gray-900 dark:text-white">
          <button onclick="applyProfitRange()" class="px-4 py-3 rounded-xl bg-indigo-600 text-white font-black">Appliquer</button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="p-5 rounded-2xl bg-gray-50 dark:bg-gray-900/40 border dark:border-gray-700">
          <div class="text-xs font-black text-gray-500 dark:text-gray-400 uppercase">Aujourd'hui</div>
          <div class="text-2xl font-black ${pToday && pToday.netProfit < 0 ? 'text-red-600' : 'text-green-600'}">${pToday ? formatCurrency(pToday.netProfit) : '—'}</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">${pToday ? `${pToday.txCount} tx • CA ${formatCurrency(pToday.revenue)} • Frais ${formatCurrency(pToday.expenses)}` : ''}</div>
        </div>
        <div class="p-5 rounded-2xl bg-gray-50 dark:bg-gray-900/40 border dark:border-gray-700">
          <div class="text-xs font-black text-gray-500 dark:text-gray-400 uppercase">Hier</div>
          <div class="text-2xl font-black ${pYesterday && pYesterday.netProfit < 0 ? 'text-red-600' : 'text-green-600'}">${pYesterday ? formatCurrency(pYesterday.netProfit) : '—'}</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">${pYesterday ? `${pYesterday.txCount} tx • CA ${formatCurrency(pYesterday.revenue)} • Frais ${formatCurrency(pYesterday.expenses)}` : ''}</div>
        </div>
        <div class="p-5 rounded-2xl bg-gray-50 dark:bg-gray-900/40 border dark:border-gray-700">
          <div class="text-xs font-black text-gray-500 dark:text-gray-400 uppercase">Semaine</div>
          <div class="text-2xl font-black ${pWeek && pWeek.netProfit < 0 ? 'text-red-600' : 'text-green-600'}">${pWeek ? formatCurrency(pWeek.netProfit) : '—'}</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">${pWeek ? `${pWeek.txCount} tx • CA ${formatCurrency(pWeek.revenue)} • Frais ${formatCurrency(pWeek.expenses)}` : ''}</div>
        </div>
        <div class="p-5 rounded-2xl bg-gray-50 dark:bg-gray-900/40 border dark:border-gray-700">
          <div class="text-xs font-black text-gray-500 dark:text-gray-400 uppercase">Mois</div>
          <div class="text-2xl font-black ${pMonth && pMonth.netProfit < 0 ? 'text-red-600' : 'text-green-600'}">${pMonth ? formatCurrency(pMonth.netProfit) : '—'}</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">${pMonth ? `${pMonth.txCount} tx • CA ${formatCurrency(pMonth.revenue)} • Frais ${formatCurrency(pMonth.expenses)}` : ''}</div>
        </div>
      </div>

      <div class="mt-6 p-5 rounded-2xl bg-white dark:bg-gray-800 border dark:border-gray-700">
        <div class="flex flex-col md:flex-row justify-between md:items-center gap-3">
          <div class="font-black text-gray-800 dark:text-gray-200">Intervalle</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">${pCustom ? `Profit net: ${formatCurrency(pCustom.netProfit)} • CA: ${formatCurrency(pCustom.revenue)} • Frais: ${formatCurrency(pCustom.expenses)}` : 'Sélectionne une période'}</div>
        </div>
      </div>

      <div class="mt-6 p-5 rounded-2xl bg-gray-50 dark:bg-gray-900/40 border dark:border-gray-700">
        <div class="font-black text-gray-800 dark:text-gray-200 mb-3">Performance employés</div>
        ${employeeStatsHtml}
      </div>
    </div>
    ` : `
    <div class="p-8 bg-blue-50 dark:bg-blue-900/20 rounded-3xl mb-8 text-center border dark:border-blue-800">
       <h2 class="text-2xl font-black text-blue-800 dark:text-blue-300">Bienvenue, Session Employé</h2>
       <p class="text-blue-600 dark:text-blue-400 font-bold">Consultez la To-Do List pour commencer votre travail.</p>
    </div>
    `}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
       ${expiringCampaigns.length > 0 ? `
       <div class="lg:col-span-2 bg-red-50 p-6 rounded-3xl shadow-xl border border-red-200 fade-in mb-2 mt-2">
         <h3 class="text-xl font-black mb-4 flex items-center gap-2 text-red-600">
           <i class="fas fa-exclamation-triangle"></i> Alertes: ${expiringCampaigns.length} Compagne(s) se termine(nt) dans moins de 24H
         </h3>
         <div class="space-y-3">
            ${expiringCampaigns.map(c => {
                const hoursLeft = Math.floor((c.endDate - nowMs) / (1000 * 60 * 60));
                return `
                <div class="p-3 bg-white rounded-xl shadow-sm border border-red-100 flex justify-between items-center">
                    <div>
                        <div class="font-bold text-gray-800">${c.clientName} - ${c.offerName}</div>
                        <div class="text-xs text-gray-500">Ad Account: ${c.adAccountId ? ((appState.adAccounts || []).find(a => a.id === c.adAccountId)?.name || 'Inconnu') : 'Organique'}</div>
                    </div>
                    <div class="text-sm font-black text-red-500 bg-red-100 px-3 py-1 rounded-full">
                        Dans ${hoursLeft} heure(s)
                    </div>
                </div>
                `;
            }).join('')}
         </div>
       </div>
       ` : ''}
       <div id="dashboardTodoContainer" class="lg:col-span-1 border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-700"></div>
       <div class="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
          <h3 class="text-xl font-bold mb-4 flex items-center gap-2 dark:text-white">
            <i class="fas fa-users text-blue-500"></i> Clients Récents
          </h3>
          <div id="topClientsPreview" class="space-y-3">
             <!-- Rempli par renderTopClients -->
          </div>
          <button onclick="showTab('clients')" class="w-full mt-4 py-2 text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition">
            Gérer les clients
          </button>
       </div>
    </div>

    ${isAdmin ? `
    <!-- Analytics Section -->
    <div class="mt-8 bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
       <h3 class="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white">
         <i class="fas fa-chart-line text-green-500"></i> Performance Mensuelle
       </h3>
       <div class="h-64">
          <canvas id="monthlyStatsChart"></canvas>
       </div>
    </div>
    ` : ''}
  `;
  renderTopClients();
  if (isAdmin) renderMonthlyStatsChart();
  
  const todoContainer = document.getElementById('dashboardTodoContainer');
  if (todoContainer && typeof window.renderTodoTable === 'function') {
      window.renderTodoTable(todoContainer);
  }
};

/**
 * Rend le tableau des clients
 */
window.renderClientsTable = function(container) {
  const ui = getUiState();
  const key = 'clients';
  const pageSize = 15;
  const query = (ui.filters[key] || '').trim().toLowerCase();
  const all = [...(appState.clients || [])].sort((a, b) => toTs(b) - toTs(a));
  const filtered = query
    ? all.filter(c => `${c.name || ''} ${c.phone || ''} ${c.contact || ''} ${c.instagram || ''}`.toLowerCase().includes(query))
    : all;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const page = clampPage(ui.pages[key] || 1, totalPages);
  ui.pages[key] = page;
  const start = (page - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);
  const lastUpdated = getLastUpdatedLabel(all);
  
  const getClientLastDeadline = (clientId) => {
    const txs = (appState.transactions || []).filter(t => t.clientId === clientId && t.status === 'active');
    if (txs.length === 0) return '-';
    // Find the latest transaction date
    const latestTx = txs.sort((a, b) => toTs(b) - toTs(a))[0];
    if (!latestTx || !latestTx.date) return '-';
    
    // Add duration if possible. Let's assume duration is often "X mois" or "X jours"
    let addDays = 30; // Default 1 month
    if (latestTx.duration) {
      const dur = latestTx.duration.toString().toLowerCase();
      if (dur.includes('jour')) addDays = parseInt(dur) || 0;
      else if (dur.includes('mois')) addDays = (parseInt(dur) || 1) * 30;
      else if (dur.includes('an')) addDays = (parseInt(dur) || 1) * 365;
      else addDays = parseInt(dur) || 30;
    }
    
    const [year, month, day] = latestTx.date.split('-').map(Number);
    if (!year || !month || !day) return latestTx.date;
    const dateObj = new Date(year, month - 1, day);
    dateObj.setDate(dateObj.getDate() + addDays);
    
    // Format YYYY-MM-DD
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  container.innerHTML = `
    <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border dark:border-gray-700 fade-in">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Base de Données Clients</h2>
          <p class="text-gray-500 dark:text-gray-400 text-sm">${filtered.length} clients • Dernière mise à jour: ${lastUpdated}</p>
        </div>
        <div class="flex gap-2 w-full md:w-auto">
          <input id="searchInput_${key}" type="text" value="${ui.filters[key] || ''}" oninput="setListFilter('${key}', this.value)" placeholder="Rechercher un client..." class="flex-grow md:w-64 p-3 border dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 dark:bg-gray-900 dark:text-white">
          <button onclick="openModal('clientModal')" class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2">
            <i class="fas fa-plus"></i> Nouveau
          </button>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 text-xs font-black uppercase tracking-widest border-b dark:border-gray-700">
              <th class="p-4">Client</th>
              <th class="p-4">Contact</th>
              <th class="p-4">Commandes & Dépenses</th>
              <th class="p-4">Finances (Solde / Dette)</th>
              <th class="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y dark:divide-gray-700 text-sm">
            ${pageItems.map(c => {
              const deadline = getClientLastDeadline(c.id);
              const txCount = (appState.transactions || []).filter(tx => tx.clientId === c.id).length;
              return `
              <tr class="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors">
                <td class="p-4">
                  <div class="font-bold text-gray-800 dark:text-gray-200">${c.name}</div>
                  <div class="text-[10px] text-gray-400 font-mono">${c.id}</div>
                </td>
                <td class="p-4">
                  <div class="flex flex-col gap-1">
                    <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 font-medium">
                      <i class="fab fa-whatsapp text-green-500"></i>
                      ${c.phone ? `<a href="${buildClientWhatsAppLink(c)}" target="_blank" class="hover:text-green-600 transition-colors">${c.phone}</a>` : '-'}
                    </div>
                    ${c.instagram ? `
                    <div class="flex items-center gap-2 text-sm text-gray-500 font-medium">
                      <i class="fab fa-instagram text-pink-600"></i>
                      <a href="https://instagram.com/${c.instagram.replace('@', '')}" target="_blank" class="hover:text-pink-700 transition-colors">${c.instagram}</a>
                    </div>` : ''}
                  </div>
                </td>
                <td class="p-4">
                  <div class="font-black text-indigo-600 text-lg">${formatCurrency(c.totalSpent || 0)}</div>
                  <div class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                    ${txCount} transaction${txCount > 1 ? 's' : ''}
                  </div>
                </td>
                <td class="p-4 flex flex-col items-start gap-2">
                  ${Number(c.unpaid || 0) > 0 ? `
                    <span class="font-black text-red-600 bg-red-50 dark:bg-red-900/30 px-3 py-1 rounded-lg border border-red-100 dark:border-red-800">
                      Dette: ${formatCurrency(c.unpaid)}
                    </span>
                    <span class="text-[11px] font-bold ${deadline !== '-' && new Date(deadline) < new Date() ? 'text-red-500' : 'text-gray-500'}">
                      <i class="fas fa-clock mr-1"></i> Délai : ${deadline}
                    </span>
                  ` : `
                    <span class="font-black text-green-600 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-lg border border-green-100 dark:border-green-800">
                      ${Number(c.unpaid || 0) < 0 ? 'Crédit: ' + formatCurrency(Math.abs(c.unpaid)) : 'Solde OK'}
                    </span>
                  `}
                </td>
                <td class="p-4 text-center align-middle">
                  <div class="flex flex-wrap justify-center gap-2">
                    ${c.phone ? `
                    <button onclick="sendWhatsAppReminder('${c.id}')" class="p-2 text-green-600 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 rounded-lg transition-colors" title="WhatsApp">
                      <i class="fab fa-whatsapp"></i>
                    </button>
                    ` : ''}
                    ${c.instagram ? `
                    <button onclick="sendInstagramReminder('${c.id}')" class="p-2 text-pink-600 bg-pink-50 dark:bg-pink-900/30 hover:bg-pink-100 rounded-lg transition-colors" title="Instagram">
                      <i class="fab fa-instagram"></i>
                    </button>
                    ` : ''}
                    <button onclick="openPaymentModalPrefilled('${c.id}')" class="p-2 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 rounded-lg transition-colors" title="Nouveau Paiement">
                      <i class="fas fa-money-bill-wave"></i>
                    </button>
                    <button onclick="editClient('${c.id}')" class="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title="Modifier">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteClient('${c.id}')" class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Supprimer">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </td>
              </tr>
            `}).join('')}
          </tbody>
        </table>
      </div>
      ${renderPagination(key, page, filtered.length, pageSize)}
    </div>
  `;
};

/**
 * Rend l'historique complet des transactions
 */
window.renderTransactionsTable = function(container) {
  const ui = getUiState();
  const key = 'transactions';
  const pageSize = 15;
  const query = (ui.filters[key] || '').trim().toLowerCase();
  const all = [...(appState.transactions || [])].sort((a, b) => toTs(b) - toTs(a));
  const filtered = query
    ? all.filter(t => `${t.clientName || ''} ${t.offerName || ''} ${t.status || ''}`.toLowerCase().includes(query))
    : all;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const page = clampPage(ui.pages[key] || 1, totalPages);
  ui.pages[key] = page;
  const start = (page - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);
  const lastUpdated = getLastUpdatedLabel(all);
  
  container.innerHTML = `
    <div class="bg-white rounded-3xl shadow-xl p-6 border fade-in">
      <div class="flex flex-col md:flex-row justify-between md:items-center gap-3 mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">Historique des Transactions</h2>
          <div class="text-xs text-gray-500">Dernière mise à jour: ${lastUpdated}</div>
        </div>
        <div class="flex flex-col md:flex-row gap-2 md:items-center">
          <input id="searchInput_${key}" type="text" value="${ui.filters[key] || ''}" oninput="setListFilter('${key}', this.value)" placeholder="Rechercher client/offre/statut..." class="w-full md:w-72 p-3 border rounded-xl outline-none bg-gray-50">
          <button onclick="exportTransactions()" class="text-blue-600 font-bold flex items-center gap-2 justify-center px-4 py-3 rounded-xl border">
            <i class="fas fa-file-csv"></i> Export CSV
          </button>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="bg-gray-50 text-gray-600 text-xs font-black uppercase border-b">
              <th class="p-4">Date</th>
              <th class="p-4">Client</th>
              <th class="p-4">Offre</th>
              <th class="p-4 text-right">Montant ($)</th>
              <th class="p-4 text-right">Prix (DZD)</th>
              <th class="p-4 text-center">Statut</th>
              <th class="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            ${pageItems.map(t => `
              <tr class="hover:bg-gray-50">
                <td class="p-4 text-gray-500">${formatDate(t.date)}</td>
                <td class="p-4 font-bold">${t.clientName}</td>
                <td class="p-4 text-gray-600">${t.offerName}</td>
                <td class="p-4 text-right font-mono">${t.amount} $</td>
                <td class="p-4 text-right font-black text-indigo-600">${formatCurrency(t.priceDzd)}</td>
                <td class="p-4 text-center">
                  <span class="px-2 py-1 rounded-full text-[10px] font-black ${t.status === 'problem' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}">
                    ${t.status === 'problem' ? 'PROBLÈME' : 'VALIDÉ'}
                  </span>
                </td>
                <td class="p-4 text-center">
                   <div class="flex justify-center gap-2">
                      <button onclick="generateInvoicePdf('${t.id}')" class="text-red-600"><i class="fas fa-file-invoice"></i></button>
                      <button onclick="editTransaction('${t.id}')" class="text-blue-600"><i class="fas fa-edit"></i></button>
                      <button onclick="deleteTransaction('${t.id}')" class="text-red-400"><i class="fas fa-trash-alt"></i></button>
                   </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      ${renderPagination(key, page, filtered.length, pageSize)}
    </div>
  `;
};

/**
 * Rend le tableau des paiements
 */
window.renderPaymentsTable = function(container) {
  const ui = getUiState();
  const key = 'payments';
  const pageSize = 15;
  const query = (ui.filters[key] || '').trim().toLowerCase();
  const all = [...(appState.payments || [])].sort((a, b) => toTs(b) - toTs(a));
  const filtered = query
    ? all.filter(p => `${p.clientName || ''} ${p.method || ''} ${p.note || ''}`.toLowerCase().includes(query))
    : all;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const page = clampPage(ui.pages[key] || 1, totalPages);
  ui.pages[key] = page;
  const start = (page - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);
  const lastUpdated = getLastUpdatedLabel(all);
  
  container.innerHTML = `
    <div class="bg-white rounded-3xl shadow-xl p-6 border fade-in">
      <div class="flex flex-col md:flex-row justify-between md:items-center gap-3 mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">Historique des Paiements</h2>
          <div class="text-xs text-gray-500">Dernière mise à jour: ${lastUpdated}</div>
        </div>
        <div class="flex flex-col md:flex-row gap-2 md:items-center">
          <input id="searchInput_${key}" type="text" value="${ui.filters[key] || ''}" oninput="setListFilter('${key}', this.value)" placeholder="Rechercher client/méthode/note..." class="w-full md:w-72 p-3 border rounded-xl outline-none bg-gray-50">
          <button onclick="openModal('paymentModal')" class="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg">
            <i class="fas fa-plus mr-2"></i> Nouveau Paiement
          </button>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="bg-gray-50 text-gray-600 text-xs font-black uppercase border-b">
              <th class="p-4">Date</th>
              <th class="p-4">Client</th>
              <th class="p-4">Montant</th>
              <th class="p-4">Méthode</th>
              <th class="p-4">Note</th>
              <th class="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            ${pageItems.map(p => `
              <tr class="hover:bg-gray-50">
                <td class="p-4 text-gray-500">${formatDate(p.date)}</td>
                <td class="p-4 font-bold">${p.clientName}</td>
                <td class="p-4 font-black text-green-600">${formatCurrency(p.amount)}</td>
                <td class="p-4 text-gray-600">${p.method}</td>
                <td class="p-4 text-gray-400 italic text-xs max-w-xs truncate">${p.note || '-'}</td>
                <td class="p-4 text-center">
                   <button onclick="deletePayment('${p.id}')" class="text-red-400 hover:text-red-600"><i class="fas fa-trash-alt"></i></button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      ${renderPagination(key, page, filtered.length, pageSize)}
    </div>
  `;
};

/**
 * Rend le tableau des achats USD
 */
window.renderUsdPurchasesTable = function(container) {
  const ui = getUiState();
  const key = 'usdPurchases';
  const pageSize = 15;
  const query = (ui.filters[key] || '').trim().toLowerCase();
  const all = [...(appState.usdPurchases || [])].sort((a, b) => toTs(b) - toTs(a));
  const filtered = query
    ? all.filter(p => `${p.source || ''} ${p.rate || ''} ${p.amount || ''}`.toLowerCase().includes(query))
    : all;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const page = clampPage(ui.pages[key] || 1, totalPages);
  ui.pages[key] = page;
  const start = (page - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);
  const lastUpdated = getLastUpdatedLabel(all);
  
  container.innerHTML = `
    <div class="bg-white rounded-3xl shadow-xl p-6 border fade-in">
      <div class="flex flex-col md:flex-row justify-between md:items-center gap-3 mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">Stock USD / Achats</h2>
          <div class="text-xs text-gray-500">Dernière mise à jour: ${lastUpdated}</div>
        </div>
        <div class="flex flex-col md:flex-row gap-2 md:items-center">
          <input id="searchInput_${key}" type="text" value="${ui.filters[key] || ''}" oninput="setListFilter('${key}', this.value)" placeholder="Rechercher source/taux/montant..." class="w-full md:w-72 p-3 border rounded-xl outline-none bg-gray-50">
          <button onclick="openModal('usdPurchaseModal')" class="bg-teal-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg">
            <i class="fas fa-plus mr-2"></i> Nouvel Achat
          </button>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="bg-gray-50 text-gray-600 text-xs font-black uppercase border-b">
              <th class="p-4">Date</th>
              <th class="p-4">Montant USD</th>
              <th class="p-4">Taux (DZD)</th>
              <th class="p-4">Total DZD</th>
              <th class="p-4">Source</th>
              <th class="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            ${pageItems.map(p => `
              <tr class="hover:bg-gray-50">
                <td class="p-4 text-gray-500">${formatDate(p.date)}</td>
                <td class="p-4 font-black text-teal-600">${safeToFixed(p.amount, 2)} $</td>
                <td class="p-4 text-gray-600">${p.rate}</td>
                <td class="p-4 font-bold text-gray-700">${formatCurrency(p.totalDzd)}</td>
                <td class="p-4 text-gray-500 text-xs">${p.source || '-'}</td>
                <td class="p-4 text-center">
                   <button onclick="deleteUsdPurchase('${p.id}')" class="text-red-400"><i class="fas fa-trash-alt"></i></button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      ${renderPagination(key, page, filtered.length, pageSize)}
    </div>
  `;
};

/**
 * Rend les demandes clients
 */
window.renderRequests = function(container) {
  const ui = getUiState();
  const key = 'clientRequests';
  const pageSize = 15;
  const query = (ui.filters[key] || '').trim().toLowerCase();
  const all = [...(appState.clientRequests || [])].sort((a, b) => toTs(b) - toTs(a));
  const filtered = query
    ? all.filter(r => `${r.instagram || ''} ${r.pageFacebook || ''} ${r.offer || ''} ${r.platform || ''}`.toLowerCase().includes(query))
    : all;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const page = clampPage(ui.pages[key] || 1, totalPages);
  ui.pages[key] = page;
  const start = (page - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);
  const lastUpdated = getLastUpdatedLabel(all);
  
  container.innerHTML = `
    <div class="bg-white rounded-3xl shadow-xl p-6 border fade-in">
      <div class="flex flex-col md:flex-row justify-between md:items-center gap-3 mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">Demandes Clients (${filtered.length})</h2>
          <div class="text-xs text-gray-500">Dernière mise à jour: ${lastUpdated}</div>
        </div>
        <input id="searchInput_${key}" type="text" value="${ui.filters[key] || ''}" oninput="setListFilter('${key}', this.value)" placeholder="Rechercher par nom/offre/plateforme..." class="w-full md:w-80 p-3 border rounded-xl outline-none bg-gray-50">
      </div>
      <div class="grid grid-cols-1 gap-4">
        ${pageItems.map(r => `
          <div class="p-4 border rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 ${r.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'}">
            <div class="flex items-center gap-4 w-full">
              <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                 <i class="fas ${r.platform === 'meta' ? 'fa-facebook text-blue-600' : 'fa-tiktok text-black'}"></i>
              </div>
              <div>
                <div class="font-bold text-gray-800">${r.instagram || r.pageFacebook || 'Client'}</div>
                <div class="text-[10px] text-gray-500">${formatDate(r.date)}</div>
                <div class="text-xs font-bold text-indigo-600">${r.offer || 'Offre Perso'}</div>
              </div>
            </div>
            <div class="flex gap-2 w-full md:w-auto justify-end">
               <button onclick="openRequestModal('${r.id}')" class="px-4 py-2 bg-white border rounded-xl text-xs font-bold shadow-sm hover:bg-gray-50">Détails</button>
               <button onclick="deleteRequest('${r.id}')" class="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100">Supprimer</button>
            </div>
          </div>
        `).join('')}
        ${filtered.length === 0 ? '<p class="text-center text-gray-400 py-8 italic">Aucune demande pour le moment.</p>' : ''}
      </div>
      ${renderPagination(key, page, filtered.length, pageSize)}
    </div>
  `;
};

/**
 * Rend les paramètres admin
 */
window.renderSettingsAdmin = function(container) {
  const employees = appState.employees || [];
  container.innerHTML = `
    <div class="bg-white rounded-3xl shadow-xl p-8 border fade-in max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold mb-8 text-gray-800 flex items-center gap-3">
        <i class="fas fa-cog text-gray-600"></i> Paramètres Système
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Configuration Financière -->
        <div class="space-y-6">
          <h3 class="font-bold text-lg text-gray-700 border-b pb-2">Configuration Financière</h3>
          <div>
            <label class="block text-sm font-bold text-gray-600 mb-2">Taux Achat USD (Défaut)</label>
            <input type="number" value="${getBuyRate()}" class="w-full p-3 border rounded-xl bg-gray-50">
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-600 mb-2">Taux Vente USD (Défaut)</label>
            <input type="number" value="${getSellRate()}" class="w-full p-3 border rounded-xl bg-gray-50">
          </div>
        </div>
        
        <!-- Synchronisation -->
        <div class="space-y-6">
          <h3 class="font-bold text-lg text-gray-700 border-b pb-2">Cloud & Synchro</h3>
          <div class="p-4 bg-blue-50 rounded-2xl border border-blue-100">
             <div class="flex items-center justify-between mb-4">
               <span class="text-sm font-bold text-blue-800">Statut Firebase</span>
               <span class="px-2 py-1 bg-green-500 text-white text-[10px] font-black rounded-full uppercase">Connecté</span>
             </div>
             <button onclick="forceCloudSave()" class="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition">
               <i class="fas fa-sync-alt mr-2"></i> Forcer la Synchro
             </button>
          </div>
        </div>
      </div>

      <div class="mt-10">
        <h3 class="font-bold text-lg text-gray-700 border-b pb-2 mb-6">Employés</h3>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="p-5 bg-gray-50 rounded-2xl border">
            <div class="font-black text-gray-800 mb-4">Ajouter un employé</div>
            <div class="space-y-3">
              <input id="employeeName" type="text" placeholder="Nom complet" class="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-gray-800 outline-none">
              <input id="employeeLogin" type="text" placeholder="Nom d'utilisateur" class="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-gray-800 outline-none">
              <input id="employeePassword" type="password" placeholder="Mot de passe" class="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-gray-800 outline-none">
              <input id="employeeSalary" type="number" placeholder="Salaire (DA)" class="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-gray-800 outline-none">
              <div class="hidden">
                <label class="flex items-center gap-2 text-sm text-gray-700 font-bold">
                  <input id="employeeActive" type="checkbox" checked>
                  Compte actif
                </label>
              </div>
              <button onclick="addEmployee()" class="w-full py-3 bg-gray-900 text-white font-bold rounded-xl mt-2 shadow hover:shadow-lg transition-all">Ajouter l'employé</button>
              <div class="text-xs text-gray-500">Utilise “Connexion Employé” sur l’écran de login avec ce login/mot de passe.</div>
            </div>
          </div>

          <div class="p-5 bg-white rounded-2xl border">
            <div class="font-black text-gray-800 mb-4">Liste des employés (${employees.length})</div>
            <div class="space-y-3">
              ${employees.map(e => `
                <div class="p-4 border rounded-2xl flex flex-col gap-3">
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="font-bold text-gray-800">${e.name || e.login}</div>
                      <div class="text-xs text-gray-500">${e.login}</div>
                      <div class="text-sm text-gray-600 font-semibold">Salaire: ${(e.salary || 0).toLocaleString()} DA</div>
                    </div>
                    <div class="flex items-center gap-2">
                      <button onclick="toggleEmployeeActive('${e.id}')" class="px-3 py-2 rounded-xl text-xs font-black ${e.active === false ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}">
                        ${e.active === false ? 'INACTIF' : 'ACTIF'}
                      </button>
                      <button onclick="deleteEmployee('${e.id}')" class="px-3 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-black hover:bg-gray-200">Supprimer</button>
                    </div>
                  </div>
                  <!-- Edit Salary -->
                  <div class="border-t pt-3 mt-1">
                    <div class="text-xs font-bold text-gray-500 mb-2 uppercase">Modifier le salaire :</div>
                    <div class="flex gap-2">
                      <input type="number" id="editSalary-${e.id}" value="${e.salary || 0}" placeholder="Nouveau salaire" class="flex-1 p-2 border rounded-xl bg-gray-50">
                      <button onclick="updateEmployeeSalary('${e.id}')" class="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl">Mettre à jour</button>
                    </div>
                  </div>
                  <!-- Permissions -->
                  <div class="border-t pt-3 mt-1">
                    <div class="text-xs font-bold text-gray-500 mb-2 uppercase">Permissions d'Accès :</div>
                    <div class="flex flex-wrap gap-3">
                      ${['dashboard', 'clients', 'history', 'todo', 'offers', 'expenses', 'paiements', 'achats', 'reminders', 'ad-accounts', 'requests', 'performance', 'employees'].map(tab => {
                        const labels = { 
                          dashboard: 'Dashboard', 
                          clients: 'Clients', 
                          history: 'Historique', 
                          todo: 'Nouvelle To-Do', 
                          offers: 'Offres', 
                          expenses: 'Frais', 
                          paiements: 'Paiements', 
                          achats: 'Achats USD', 
                          reminders: 'Dettes/Relances', 
                          'ad-accounts': 'Comptes Pub', 
                          requests: 'Demandes',
                          performance: 'Performance Salariés',
                          employees: 'Employés'
                        };
                        const isChecked = e.permissions && e.permissions[tab] === true;
                        return "<label class='flex items-center gap-1 text-sm font-semibold text-gray-700 cursor-pointer'>" +
                               "<input type='checkbox' " + (isChecked ? "checked" : "") + " onchange='updateEmployeePermission(\"" + e.id + "\", \"" + tab + "\", this.checked)' class='rounded text-gray-900 focus:ring-gray-900'> " +
                               labels[tab] +
                               "</label>";
                      }).join('')}
                    </div>
                  </div>
                </div>
              `).join('')}
              ${employees.length === 0 ? '<div class="text-sm text-gray-400 italic">Aucun employé pour le moment.</div>' : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

/**
 * Rend la grille des offres (Admin)
 */
window.renderOffersGrid = function(container) {
  const ui = getUiState();
  const key = 'offers';
  const pageSize = 15;
  const query = (ui.filters[key] || '').trim().toLowerCase();
  const all = [...(appState.offers || [])].sort((a, b) => toTs(b) - toTs(a));
  const filtered = query
    ? all.filter(o => `${o.name || ''} ${o.description || ''}`.toLowerCase().includes(query))
    : all;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const page = clampPage(ui.pages[key] || 1, totalPages);
  ui.pages[key] = page;
  const start = (page - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);
  const lastUpdated = getLastUpdatedLabel(all);
  
  container.innerHTML = `
    <div class="bg-white rounded-3xl shadow-xl p-6 border fade-in">
      <div class="flex flex-col md:flex-row justify-between md:items-center gap-3 mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">Gestion des Offres</h2>
          <div class="text-xs text-gray-500">${filtered.length} offres • Dernière mise à jour: ${lastUpdated}</div>
        </div>
        <div class="flex flex-col md:flex-row gap-2 md:items-center">
          <input id="searchInput_${key}" type="text" value="${ui.filters[key] || ''}" oninput="setListFilter('${key}', this.value)" placeholder="Rechercher une offre..." class="w-full md:w-72 p-3 border rounded-xl outline-none bg-gray-50">
          <button onclick="openModal('offerModal')" class="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg">
            <i class="fas fa-plus mr-2"></i> Nouvelle Offre
          </button>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${pageItems.map(o => `
          <div class="p-6 border rounded-3xl bg-gray-50 hover:shadow-lg transition-all relative group">
            <div class="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button onclick="editOffer('${o.id}')" class="text-blue-600"><i class="fas fa-edit"></i></button>
               <button onclick="deleteOffer('${o.id}')" class="text-red-400"><i class="fas fa-trash-alt"></i></button>
            </div>
            <h3 class="text-lg font-black text-gray-800 mb-2">${o.name}</h3>
            <p class="text-xs text-gray-500 mb-4 line-clamp-2">${o.description || '-'}</p>
            <div class="flex justify-between items-end">
              <div>
                <div class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Prix Vente</div>
                <div class="text-xl font-black text-purple-600">${formatCurrency(o.priceDzd)}</div>
              </div>
              <div class="text-right">
                <div class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Coût</div>
                <div class="text-sm font-bold text-gray-600">${o.costPerUnit} $</div>
              </div>
            </div>
          </div>
        `).join('')}
        ${filtered.length === 0 ? '<p class="col-span-full text-center text-gray-400 py-12 italic">Aucune offre définie.</p>' : ''}
      </div>
      ${renderPagination(key, page, filtered.length, pageSize)}
    </div>
  `;
};

window.renderExpensesTab = function(container) {
  const ui = getUiState();
  const key = 'expenses';
  const pageSize = 15;
  const filterUsdOnly = ui.filters[key + '_usdOnly'] === true;

  const baseExpenses = (appState.expenses || []).map(e => ({ ...e, _type: 'expense' }));
  const basePurchases = (appState.usdPurchases || []).map(p => ({
    ...p,
    _type: 'usd_purchase',
    category: 'Achat USD',
    account: 'usdt',
    amount: p.totalDzd,
    note: `Taux: ${p.rate} / ${p.amount} $ / ${p.source || '-'}`
  }));

  let all = [...baseExpenses, ...basePurchases].sort((a, b) => toTs(b) - toTs(a));
  
  if (filterUsdOnly) {
    all = all.filter(e => e._type === 'usd_purchase');
  }

  const query = (ui.filters[key] || '').trim().toLowerCase();
  const filtered = query
    ? all.filter(e => `${e.category || ''} ${e.note || ''} ${e.account || ''}`.toLowerCase().includes(query))
    : all;

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const page = clampPage(ui.pages[key] || 1, totalPages);
  ui.pages[key] = page;
  const start = (page - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);
  const lastUpdated = getLastUpdatedLabel(all);

  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const monthTotal = all.reduce((sum, e) => {
    const d = e?.date ? new Date(e.date) : null;
    if (!d || Number.isNaN(d.getTime())) return sum;
    if (d.getMonth() !== month || d.getFullYear() !== year) return sum;
    return sum + Number(e.amount || 0);
  }, 0);

  container.innerHTML = `
    <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border dark:border-gray-700 fade-in">
      <div class="flex flex-col md:flex-row justify-between md:items-center gap-3 mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Frais / Dépenses</h2>
          <div class="text-sm text-rose-600 font-black">Total du mois: ${formatCurrency(monthTotal)}</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">Dernière mise à jour: ${lastUpdated}</div>
        </div>
        <div class="flex flex-col lg:flex-row gap-2 lg:items-center">
          <label class="flex items-center gap-2 text-sm font-bold text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-3 py-2 rounded-xl cursor-pointer">
             <input type="checkbox" ${filterUsdOnly ? 'checked' : ''} onchange="toggleUsdFilter(this.checked)" class="w-4 h-4 rounded text-teal-600">
             Achats USD (Seulement)
          </label>
          <input id="searchInput_${key}" type="text" value="${ui.filters[key] || ''}" oninput="setListFilter('${key}', this.value)" placeholder="Rechercher..." class="w-full lg:w-48 p-3 border dark:border-gray-700 rounded-xl outline-none bg-gray-50 dark:bg-gray-900 dark:text-white">
          <button onclick="openModal('usdPurchaseModal')" class="bg-teal-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg text-sm">
            <i class="fas fa-dollar-sign mr-1"></i> + USD
          </button>
          <button onclick="openModal('expenseModal')" class="bg-rose-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg text-sm">
            <i class="fas fa-plus mr-1"></i> + Frais
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 text-xs font-black uppercase border-b dark:border-gray-700">
              <th class="p-4">Date</th>
              <th class="p-4">Catégorie</th>
              <th class="p-4">Compte</th>
              <th class="p-4">Montant</th>
              <th class="p-4">Note</th>
              <th class="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y dark:divide-gray-700">
            ${pageItems.map(e => `
              <tr class="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                <td class="p-4 text-gray-500 dark:text-gray-400">${formatDate(e.date)}</td>
                <td class="p-4 font-bold ${e._type === 'usd_purchase' ? 'text-teal-600' : 'text-gray-800 dark:text-gray-200'}">${e.category || '-'}</td>
                <td class="p-4 text-gray-600 dark:text-gray-400">${(e.account || 'liquide').toUpperCase()}</td>
                <td class="p-4 font-black ${e._type === 'usd_purchase' ? 'text-teal-600' : 'text-rose-600'}">${formatCurrency(e.amount)}</td>
                <td class="p-4 text-gray-500 dark:text-gray-400 text-xs max-w-xs truncate">${e.note || '-'}</td>
                <td class="p-4 text-center">
                  ${e._type === 'expense' 
                    ? `<button onclick="deleteExpense('${e.id}')" class="text-red-400 hover:text-red-600"><i class="fas fa-trash-alt"></i></button>`
                    : `<button onclick="deleteUsdPurchase('${e.id}')" class="text-red-400 hover:text-red-600"><i class="fas fa-trash-alt"></i></button>`
                  }
                </td>
              </tr>
            `).join('')}
            ${filtered.length === 0 ? '<tr><td colspan="6" class="p-8 text-center text-gray-400 italic">Aucun enregistrement trouvé.</td></tr>' : ''}
          </tbody>
        </table>
      </div>
      ${renderPagination(key, page, filtered.length, pageSize)}
    </div>
  `;
};

window.renderTodoTable = function(container) {
  const ui = getUiState();
  const key = 'todoTable';
  const pageSize = 15;
  const query = (ui.filters[key] || '').trim().toLowerCase();

  const todos = (appState.todoTransactions || [])
    .filter(t => t && (t.status === 'pending' || t.status === 'in_progress'))
    .map(t => ({ ...t, _type: t.status === 'in_progress' ? 'in_progress' : 'todo' }));

  const problems = (appState.transactions || [])
    .filter(t => t && t.status === 'problem')
    .map(t => ({ ...t, _type: 'problem' }));

  const all = [...problems, ...todos].sort((a, b) => {
    if (a._type !== b._type) return a._type === 'problem' ? -1 : 1;
    return toTs(b) - toTs(a);
  });

  const filtered = query
    ? all.filter(x => `${x.clientName || ''} ${x.offerName || ''} ${x.status || ''}`.toLowerCase().includes(query))
    : all;

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const page = clampPage(ui.pages[key] || 1, totalPages);
  ui.pages[key] = page;
  const start = (page - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);
  const lastUpdated = getLastUpdatedLabel(all);

  container.innerHTML = `
    <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border dark:border-gray-700 fade-in">
      <div class="flex flex-col md:flex-row justify-between md:items-center gap-3 mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white">To-Do List</h2>
          <div class="text-xs text-gray-500 dark:text-gray-400">${filtered.length} éléments • Dernière mise à jour: ${lastUpdated}</div>
        </div>
        <div class="flex flex-col md:flex-row gap-2 md:items-center">
          <input id="searchInput_${key}" type="text" value="${ui.filters[key] || ''}" oninput="setListFilter('${key}', this.value)" placeholder="Rechercher client/offre..." class="w-full md:w-72 p-3 border dark:border-gray-700 rounded-xl outline-none bg-gray-50 dark:bg-gray-900 dark:text-white">
          <button onclick="showTab('todo')" class="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black">Nouvelle</button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 text-xs font-black uppercase border-b dark:border-gray-700">
              <th class="p-4">Type</th>
              <th class="p-4">Date</th>
              <th class="p-4">Client</th>
              <th class="p-4">Offre</th>
              <th class="p-4">USD</th>
              <th class="p-4">Prix</th>
              <th class="p-4">Payé</th>
              <th class="p-4">Employé</th>
              <th class="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y dark:divide-gray-700">
            ${pageItems.map(t => `
              <tr class="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                <td class="p-4">
                  <select onchange="changeTodoStatus('${t.id}', this.value, '${t._type}')" class="text-xs font-black p-2 rounded-lg border outline-none cursor-pointer shadow-sm focus:ring-2 focus:ring-blue-500 ${
                    t._type === 'problem' ? 'bg-red-50 text-red-700 border-red-200' :
                    t._type === 'in_progress' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                    'bg-gray-50 text-gray-700 border-gray-200'
                  }">
                    <option value="pending" ${t._type === 'todo' ? 'selected' : ''}>TODO</option>
                    <option value="in_progress" ${t._type === 'in_progress' ? 'selected' : ''}>${t._type === 'in_progress' && t.employeeName ? 'EN COURS - ' + t.employeeName : 'EN COURS'}</option>
                    <option value="done">FAIT / GAIN</option>
                    <option value="problem" ${t._type === 'problem' ? 'selected' : ''}>${t._type === 'problem' && t.employeeName ? 'PROBLÈME - ' + t.employeeName : 'PROBLÈME'}</option>
                  </select>
                </td>
                <td class="p-4 text-gray-500 dark:text-gray-400">${formatDate(t.date)}</td>
                <td class="p-4 font-bold text-gray-800 dark:text-gray-200">${t.clientName || '-'}</td>
                <td class="p-4 text-gray-600 dark:text-gray-400">${t.offerName || '-'}</td>
                <td class="p-4 font-mono">${safeToFixed(t.amount, 2)} $</td>
                <td class="p-4 font-black text-indigo-600">${formatCurrency(t.priceDzd)}</td>
                <td class="p-4 text-center">
                  <label class="flex items-center justify-center cursor-pointer">
                    <input type="checkbox" onclick="toggleTodoPayment('${t.id}', '${t._type}')" class="w-5 h-5 text-indigo-600 rounded shadow-sm focus:ring-indigo-500 cursor-pointer" ${t.paid ? 'checked' : ''}>
                  </label>
                </td>
                <td class="p-4 text-gray-600 dark:text-gray-400 text-xs">${t.employeeName || '-'}</td>
                <td class="p-4 text-center">
                   <button onclick="deleteTodoTransaction('${t.id}', '${t._type}')" class="p-2 text-gray-400 hover:bg-gray-100 hover:text-red-500 rounded-lg text-xs font-black transition-colors" title="Supprimer">
                     <i class="fas fa-trash-alt"></i>
                   </button>
                </td>
              </tr>
            `).join('')}
            ${filtered.length === 0 ? '<tr><td colspan="9" class="p-8 text-center text-gray-400 italic">Aucune tâche.</td></tr>' : ''}
          </tbody>
        </table>
      </div>
      ${renderPagination(key, page, filtered.length, pageSize)}
    </div>
  `;
};

/**
 * To-Do List Aperçu (Dashboard)
 */
window.renderTodoPreview = function() {
  const preview = document.getElementById('todoPreviewList');
  if (!preview) return;
  
  const normalTodos = (appState.todoTransactions || []).filter(t => t.status === 'pending' || t.status === 'in_progress');
  const problems = (appState.transactions || []).filter(t => t.status === 'problem');
  
  const allPreview = [
    ...problems.map(t => ({ ...t, isProblem: true })),
    ...normalTodos.map(t => ({ ...t, isProblem: false }))
  ].sort((a, b) => toTs(b) - toTs(a)).slice(0, 5);

  if (allPreview.length === 0) {
    preview.innerHTML = '<p class="text-gray-400 italic text-center py-4">Tout est à jour !</p>';
    return;
  }
  
  preview.innerHTML = allPreview.map(t => `
    <div onclick="showTab('transactions')" class="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 transition-all">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full flex items-center justify-center ${t.isProblem ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}">
          <i class="fas ${t.isProblem ? 'fa-exclamation-triangle' : 'fa-clock'} text-xs"></i>
        </div>
        <div>
          <div class="font-bold text-gray-800 text-xs">${t.clientName}</div>
          <div class="text-[10px] text-gray-500">${t.offerName}</div>
        </div>
      </div>
      <div class="text-right font-black text-indigo-600 text-xs">
        ${formatCurrency(t.priceDzd)}
      </div>
    </div>
  `).join('');
};

/**
 * Aperçu Clients (Dashboard)
 */
window.renderTopClients = function() {
  const preview = document.getElementById('topClientsPreview');
  if (!preview) return;
  
  const sortedClients = [...(appState.clients || [])]
    .sort((a, b) => {
        const tsA = toTs(a);
        const tsB = toTs(b);
        return tsB - tsA;
    })
    .slice(0, 5);

  if (sortedClients.length === 0) {
    preview.innerHTML = '<p class="text-gray-400 italic text-center py-4">Aucun client enregistré.</p>';
    return;
  }
  
  preview.innerHTML = sortedClients.map(c => `
    <div onclick="showTab('clients')" class="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
          ${c.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div class="font-bold text-gray-800 text-xs">${c.name}</div>
          <div class="text-[10px] font-bold ${c.unpaid > 0 ? 'text-red-500' : (c.unpaid < 0 ? 'text-green-500' : 'text-gray-400')}">
            ${c.unpaid > 0 ? 'Dette: ' + formatCurrency(c.unpaid) : (c.unpaid < 0 ? 'Crédit: ' + formatCurrency(Math.abs(c.unpaid)) : 'À jour')}
          </div>
        </div>
      </div>
      <div class="text-right font-black text-gray-700 text-xs">
        ${formatCurrency(c.totalSpent || 0)}
      </div>
    </div>
  `).join('');
};

/**
 * Rend le formulaire de nouvelle To-Do
 */
window.renderNewTodoForm = function(container) {
  const clients = appState.clients || [];
  const offers = appState.offers || [];
  const adAccounts = appState.adAccounts || [];

  container.innerHTML = `
    <div class="bg-white rounded-3xl shadow-xl p-8 border fade-in max-w-2xl mx-auto">
      <h2 class="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
        <i class="fas fa-plus-circle text-indigo-600"></i> Nouvelle Tâche (To-Do)
      </h2>
      <form id="newTodoForm" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Date</label>
            <input type="date" id="todoDate" value="${new Date().toISOString().split('T')[0]}" class="w-full p-4 border rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50">
          </div>
          <div class="relative">
            <label class="block text-sm font-bold text-gray-700 mb-2">Client</label>
            <div class="relative">
              <input type="text" id="todoClientSearch" placeholder="Rechercher un client..." 
                     oninput="filterClientOptions(this.value)" 
                     class="w-full p-4 border rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50"
                     autocomplete="off">
              <input type="hidden" id="todoClientId" required value="">
              <div id="clientDropdown" class="absolute z-50 w-full mt-1 bg-white border rounded-2xl shadow-lg max-h-60 overflow-y-auto" style="display: none;">
                ${clients.map(c => `<div class="p-3 hover:bg-indigo-50 cursor-pointer client-option" data-id="${c.id}" data-name="${c.name}" onclick="selectClient(this)">${c.name}</div>`).join('')}
              </div>
            </div>
            <style>
              .client-option.selected { background-color: #e0e7ff; }
            </style>
          </div>
        </div>
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Compte Publicitaire</label>
          <select id="todoAdAccountId" class="w-full p-4 border rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50">
            <option value="">-- Aucun compte (Organique) --</option>
            ${adAccounts.map(a => `<option value="${a.id}">${a.name} (${a.platform})</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Offre</label>
          <input type="text" id="todoOfferSearch" oninput="filterTodoOffers()" placeholder="Rechercher une offre..." class="w-full p-4 border rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 mb-3">
          <select id="todoOfferId" required onchange="updateTodoPrice()" class="w-full p-4 border rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50">
            <option value="">-- Sélectionner une offre --</option>
            <option value="__custom__">Offre personnalisée (manuel)</option>
            ${offers.map(o => `<option value="${o.id}">${o.name} (${formatCurrency(o.priceDzd ?? o.price)})</option>`).join('')}
          </select>
          <div class="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span id="todoOfferMatchCount"></span>
            <button type="button" onclick="clearTodoOfferSearch()" class="text-indigo-600 font-bold">Effacer</button>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Prix (DZD)</label>
            <input type="number" id="todoPrice" required class="w-full p-4 border rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50">
            <div class="text-xs text-gray-500 mt-2">Automatique si l'offre existe, manuel si offre personnalisée.</div>
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Statut Paiement</label>
            <div class="flex items-center gap-4 p-4 border rounded-2xl bg-gray-50">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" id="todoPaid" class="w-5 h-5 text-indigo-600">
                <span class="font-bold text-gray-700">Payé</span>
              </label>
            </div>
          </div>
        </div>
        <div id="todoCustomOfferFields" class="hidden p-5 border rounded-2xl bg-gray-50 space-y-4">
          <div class="text-sm font-black text-gray-800">Offre personnalisée</div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Nom</label>
              <input type="text" id="todoCustomName" placeholder="Ex: Pack personnalisé" class="w-full p-4 border rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Montant (USD)</label>
              <input type="number" step="0.01" id="todoCustomUsd" placeholder="Ex: 20" class="w-full p-4 border rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Durée (jours)</label>
              <input type="number" step="1" id="todoCustomDuration" placeholder="Ex: 7" class="w-full p-4 border rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button type="button" onclick="handleNewTodoSubmit('todo', event)" class="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-black rounded-2xl shadow-lg hover:shadow-blue-200 transition-all flex items-center justify-center gap-3">
            <i class="fas fa-list-ul"></i> Ajouter à la To-Do Liste
          </button>
          <button type="button" onclick="handleNewTodoSubmit('direct', event)" class="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-black rounded-2xl shadow-lg hover:shadow-green-200 transition-all flex items-center justify-center gap-3">
            <i class="fas fa-rocket"></i> Sponsor Direct
          </button>
          <button type="button" onclick="openModal('ocrScannerModal')" class="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-black rounded-2xl shadow-lg hover:shadow-purple-200 transition-all flex items-center justify-center gap-3">
            <i class="fas fa-camera"></i> Scanner Carnet
          </button>
        </div>
      </form>
    </div>
  `;
  if (typeof filterTodoOffers === 'function') filterTodoOffers();
};

/**
 * Affiche le graphique des statistiques mensuelles
 */
/**
 * Rend le tableau des relances (dettes)
 */
window.renderRemindersTable = function(container) {
  const ui = getUiState();
  const key = 'reminders';
  const pageSize = 15;
  const query = (ui.filters[key] || '').trim().toLowerCase();
  const all = (appState.clients || [])
    .filter(c => (Number(c.unpaid || 0) > 0))
    .sort((a, b) => toTs(b) - toTs(a));
  const filtered = query ? all.filter(c => (c.name || '').toLowerCase().includes(query)) : all;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const page = clampPage(ui.pages[key] || 1, totalPages);
  ui.pages[key] = page;
  const start = (page - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);
  const lastUpdated = getLastUpdatedLabel(all);
  
  container.innerHTML = `
    <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border dark:border-gray-700 fade-in">
      <div class="flex flex-col md:flex-row justify-between md:items-center gap-3 mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Gestion des Dettes & Relances</h2>
          <div class="mt-2 flex flex-wrap items-center gap-2">
             <div class="bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-xl text-sm font-bold flex items-center gap-2">
               <i class="fas fa-users"></i> ${all.length} Clients
             </div>
             <div class="bg-red-600 text-white shadow-md shadow-red-200 px-3 py-1 rounded-xl text-sm font-black flex items-center gap-2">
               <i class="fas fa-chart-line"></i> Total : ${(typeof formatCur === 'function' ? formatCur(all.reduce((acc, c) => acc + Number(c.unpaid || 0), 0)) : all.reduce((acc, c) => acc + Number(c.unpaid || 0), 0) + ' DZD')}
             </div>
             <div class="text-gray-500 dark:text-gray-400 text-xs flex items-center gap-1 font-medium bg-gray-100 px-3 py-1 rounded-xl">
               <i class="fas fa-history"></i> ${lastUpdated}
             </div>
          </div>
        </div>
        <input id="searchInput_${key}" type="text" value="${ui.filters[key] || ''}" oninput="setListFilter('${key}', this.value)" placeholder="Rechercher par nom..." class="w-full md:w-80 p-3 border dark:border-gray-700 rounded-xl outline-none bg-gray-50 dark:bg-gray-900 dark:text-white">
      </div>
      
      <div class="grid grid-cols-1 gap-4">
        ${pageItems.map(c => `
          <div class="p-5 border dark:border-gray-700 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-red-50/30 dark:bg-red-900/10 hover:bg-red-50/50 transition-colors">
            <div class="flex items-start gap-4 w-full">
              <div class="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex-shrink-0 flex items-center justify-center text-red-600 dark:text-red-400 mt-1">
                <i class="fas fa-exclamation-circle text-xl"></i>
              </div>
              <div class="flex-grow">
                <div class="font-bold text-gray-800 dark:text-white text-lg">${c.name}</div>
                <div class="text-sm text-red-600 dark:text-red-400 font-black mb-2">Dette: ${formatCurrency(c.unpaid)}</div>
                <input type="text" value="${c.debtNote || ''}" onchange="updateClientDebtNote('${c.id}', this.value)" placeholder="Ajouter une note de relance..." class="w-full text-xs p-2 border border-red-200 dark:border-red-900/50 rounded-lg outline-none bg-white/60 dark:bg-gray-800 focus:ring-1 focus:ring-red-400 text-gray-700 dark:text-gray-300">
              </div>
            </div>
            <div class="flex flex-wrap md:flex-nowrap gap-2 w-full md:w-auto mt-2 md:mt-0 items-center justify-end">
               ${c.phone ? `
               <button onclick="sendWhatsAppReminder('${c.id}')" class="px-4 py-2 bg-green-600 text-white rounded-xl font-bold shadow-sm hover:bg-green-700 transition-all flex items-center justify-center gap-2">
                 <i class="fab fa-whatsapp"></i> WhatsApp
               </button>
               ` : ''}
               ${c.instagram ? `
               <button onclick="sendInstagramReminder('${c.id}')" class="px-4 py-2 bg-pink-600 text-white rounded-xl font-bold shadow-sm hover:bg-pink-700 transition-all flex items-center justify-center gap-2">
                 <i class="fab fa-instagram"></i> Instagram
               </button>
               ` : ''}
               ${(!c.phone && !c.instagram) ? `
               <span class="text-xs text-gray-500 italic mr-2">Aucun contact dispo</span>
               ` : ''}
               <button onclick="openPaymentModalPrefilled('${c.id}')" class="px-4 py-2 bg-white dark:bg-gray-700 border dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-600 shadow-sm transition-colors whitespace-nowrap">
                 Régler
               </button>
            </div>
          </div>
        `).join('')}
        ${filtered.length === 0 ? '<p class="text-center text-gray-400 py-12 italic">Aucune dette en cours. Félicitations !</p>' : ''}
      </div>
      ${renderPagination(key, page, filtered.length, pageSize)}
    </div>
  `;
};

/**
 * Rend le tableau des comptes publicitaires
 */
window.renderAdAccountsTable = function(container) {
  const ui = getUiState();
  const key = 'adAccounts';
  const pageSize = 15;
  const query = (ui.filters[key] || '').trim().toLowerCase();
  const all = [...(appState.adAccounts || [])].sort((a, b) => toTs(b) - toTs(a));
  const filtered = query
    ? all.filter(a => `${a.name || ''} ${a.platform || ''} ${a.status || ''}`.toLowerCase().includes(query))
    : all;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const page = clampPage(ui.pages[key] || 1, totalPages);
  ui.pages[key] = page;
  const start = (page - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);
  const lastUpdated = getLastUpdatedLabel(all);
  
  // Always ensure 'spent' is calculated directly before rendering if not fully synced
  (appState.adAccounts || []).forEach(acc => {
      acc.spent = 0;
      acc.activeCampaigns = 0;
  });
  
  (appState.transactions || []).forEach(t => {
     if ((t.status === 'active' || !t.status) && t.adAccountId) {
         const adAcc = (appState.adAccounts || []).find(a => a.id === t.adAccountId);
         if (adAcc) {
             adAcc.spent += Number(t.amount || 0);
             adAcc.activeCampaigns += 1;
         }
     }
  });
  
  container.innerHTML = `
    <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border dark:border-gray-700 fade-in">
      <div class="flex flex-col md:flex-row justify-between md:items-center gap-3 mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Comptes Publicitaires</h2>
          <p class="text-gray-500 dark:text-gray-400 text-sm">Suivi des soldes et plateformes • Dernière mise à jour: ${lastUpdated}</p>
        </div>
        <div class="flex flex-col md:flex-row gap-2 md:items-center">
          <input id="searchInput_${key}" type="text" value="${ui.filters[key] || ''}" oninput="setListFilter('${key}', this.value)" placeholder="Rechercher par nom/plateforme..." class="w-full md:w-72 p-3 border dark:border-gray-700 rounded-xl outline-none bg-gray-50 dark:bg-gray-900 dark:text-white">
          <button onclick="openModal('adAccountModal')" class="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2">
            <i class="fas fa-plus"></i> Nouveau Compte
          </button>
        </div>
      </div>

      <div class="mb-6 p-5 rounded-3xl border bg-red-50 border-red-100 dark:bg-gray-900/40 dark:border-gray-700">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div class="text-[10px] font-black text-red-600 uppercase tracking-widest">Meta — Résultats</div>
            <div class="text-sm font-black text-gray-900 dark:text-white mt-1">Token → Ad Account → Campagnes → Résultats</div>
          </div>
          <div class="flex flex-wrap gap-2">
            <button type="button" id="meta-live-save" class="px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 font-black text-xs">Enregistrer</button>
            <button type="button" id="meta-live-clear" class="px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-black text-xs">Effacer</button>
            <button type="button" id="meta-live-load-accounts" class="px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 font-black text-xs">Charger ad accounts</button>
            <button type="button" id="meta-live-load-campaigns" class="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs">Charger campagnes</button>
          </div>
        </div>

        <div class="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div class="lg:col-span-1">
            <div class="text-[10px] font-black text-gray-500 dark:text-gray-300 uppercase tracking-widest">Token Meta</div>
            <input id="meta-live-token" type="password" class="mt-2 w-full p-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl font-black text-sm outline-none focus:ring-2 focus:ring-red-400 dark:text-white" placeholder="Colle ton token ici">
            <div id="meta-live-identity" class="text-xs font-bold mt-2 text-gray-600 dark:text-gray-300">—</div>
          </div>
          <div class="lg:col-span-2">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <div class="text-[10px] font-black text-gray-500 dark:text-gray-300 uppercase tracking-widest">Ad Account</div>
                <select id="meta-live-adaccount" class="mt-2 w-full p-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl font-black text-sm outline-none focus:ring-2 focus:ring-red-400 dark:text-white">
                  <option value="">— Charge d’abord —</option>
                </select>
              </div>
              <div>
                <div class="text-[10px] font-black text-gray-500 dark:text-gray-300 uppercase tracking-widest">Du</div>
                <input id="meta-live-since" type="date" class="mt-2 w-full p-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl font-black text-sm outline-none focus:ring-2 focus:ring-red-400 dark:text-white">
              </div>
              <div>
                <div class="text-[10px] font-black text-gray-500 dark:text-gray-300 uppercase tracking-widest">Au</div>
                <input id="meta-live-until" type="date" class="mt-2 w-full p-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl font-black text-sm outline-none focus:ring-2 focus:ring-red-400 dark:text-white">
              </div>
            </div>

            <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <div class="text-[10px] font-black text-gray-500 dark:text-gray-300 uppercase tracking-widest">Recherche campagne</div>
                <input id="meta-live-filter-campaign" type="text" class="mt-2 w-full p-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl font-black text-sm outline-none focus:ring-2 focus:ring-red-400 dark:text-white" placeholder="Nom de campagne...">
              </div>
              <div>
                <div class="text-[10px] font-black text-gray-500 dark:text-gray-300 uppercase tracking-widest">Recherche page</div>
                <input id="meta-live-filter-page" type="text" class="mt-2 w-full p-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl font-black text-sm outline-none focus:ring-2 focus:ring-red-400 dark:text-white" placeholder="Nom de la Page...">
              </div>
            </div>

            <div class="mt-3 flex items-center justify-between gap-3">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" id="meta-live-only-active" class="w-5 h-5 text-red-600 rounded border-gray-300 focus:ring-red-500" checked>
                <span class="text-xs font-black text-gray-700 dark:text-gray-200">Campagnes actives uniquement</span>
              </label>
            </div>

            <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
              <button type="button" id="meta-live-btn-results" class="py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-sm shadow-sm">Résultats</button>
              <div id="meta-live-status" class="px-4 py-3 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-100 font-bold text-sm">—</div>
            </div>

            <div class="mt-3 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div class="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700 text-[10px] font-black text-gray-500 dark:text-gray-300 uppercase tracking-widest flex items-center justify-between gap-2">
                <span>Campagnes</span>
                <span id="meta-live-campaigns-count" class="text-[10px] font-black text-gray-400"></span>
              </div>
              <div id="meta-live-campaigns-list" class="p-4 text-sm font-bold text-gray-600 dark:text-gray-200">—</div>
            </div>

            <div class="mt-3 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div class="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700 text-[10px] font-black text-gray-500 dark:text-gray-300 uppercase tracking-widest">KPIs</div>
              <div id="meta-live-kpis" class="p-4 text-sm font-bold text-gray-600 dark:text-gray-200">Aucun KPI.</div>
            </div>

            <div class="mt-3 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div class="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700 text-[10px] font-black text-gray-500 dark:text-gray-300 uppercase tracking-widest">Envoyer au client</div>
              <div class="p-4 space-y-3">
                <div>
                  <div class="text-[10px] font-black text-gray-500 dark:text-gray-300 uppercase tracking-widest">Recherche client</div>
                  <input id="meta-live-client-search" type="text" class="mt-2 w-full p-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl font-black text-sm outline-none focus:ring-2 focus:ring-red-400 dark:text-white" placeholder="Nom ou téléphone...">
                  <div id="meta-live-client-suggest" class="mt-2 space-y-2"></div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <div class="text-[10px] font-black text-gray-500 dark:text-gray-300 uppercase tracking-widest">WhatsApp (tél)</div>
                    <input id="meta-live-client-phone" type="text" class="mt-2 w-full p-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl font-black text-sm outline-none focus:ring-2 focus:ring-red-400 dark:text-white" placeholder="Ex: 213xxxxxxxxx">
                  </div>
                  <div>
                    <div class="text-[10px] font-black text-gray-500 dark:text-gray-300 uppercase tracking-widest">Instagram (username)</div>
                    <input id="meta-live-client-ig" type="text" class="mt-2 w-full p-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl font-black text-sm outline-none focus:ring-2 focus:ring-red-400 dark:text-white" placeholder="Ex: @client">
                  </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <button type="button" id="meta-live-send-wa" class="py-3 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-black text-xs shadow-sm flex items-center justify-center gap-2">
                    <i class="fab fa-whatsapp text-sm"></i> WhatsApp
                  </button>
                  <button type="button" id="meta-live-send-ig" class="py-3 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-black text-xs shadow-sm">Instagram</button>
                  <button type="button" id="meta-live-copy-msg" class="py-3 rounded-2xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-black text-xs border border-gray-200 dark:border-gray-700 shadow-sm">Copier message</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${pageItems.map(acc => {
          const spent = Number(acc.spent) || 0;
          const initial = Number(acc.balance) || 0;
          const remaining = initial - spent;
          return `
          <div class="p-6 border dark:border-gray-700 rounded-3xl bg-gray-50 dark:bg-gray-900/50 hover:shadow-lg transition-all relative group">
            <div class="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button onclick="editAdAccount('${acc.id}')" class="text-blue-600"><i class="fas fa-edit"></i></button>
               <button onclick="deleteAdAccount('${acc.id}')" class="text-red-400"><i class="fas fa-trash-alt"></i></button>
            </div>
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center ${acc.platform === 'meta' ? 'bg-blue-100 text-blue-600' : 'bg-black text-white'}">
                <i class="fab ${acc.platform === 'meta' ? 'fa-facebook' : 'fa-tiktok'} text-xl"></i>
              </div>
              <h3 class="text-lg font-black text-gray-800 dark:text-white">${acc.name}</h3>
            </div>
            <div class="flex justify-between items-center">
              <div>
                <div class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Solde Restant</div>
                <div class="text-xl font-black ${remaining < 10 ? 'text-red-500' : 'text-green-600'}">${safeToFixed(remaining, 2)} $</div>
                <div class="text-[10px] text-gray-500 mt-1">Dépensé: ${safeToFixed(spent, 2)} / ${safeToFixed(initial, 2)} $</div>
                <div class="text-xs font-bold text-indigo-600 mt-2"><i class="fas fa-bullhorn"></i> ${acc.activeCampaigns || 0} Campagne(s) active(s)</div>
              </div>
              <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase ${acc.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                ${acc.status}
              </span>
            </div>
            <button onclick="rechargeAdAccount('${acc.id}')" class="w-full mt-4 py-2 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all">
              Recharger
            </button>
          </div>
        `}).join('')}
        ${filtered.length === 0 ? '<p class="col-span-full text-center text-gray-400 py-12 italic">Aucun compte configuré.</p>' : ''}
      </div>
      ${renderPagination(key, page, filtered.length, pageSize)}
    </div>
  `;
  try { setTimeout(() => { if (window.initMetaAdsLive) window.initMetaAdsLive(); }, 0); } catch (e) {}
};

window.renderMonthlyStatsChart = function() {
  const ctx = document.getElementById('monthlyStatsChart');
  if (!ctx) return;

  // Calculer les données par mois
  const transactions = appState.transactions || [];
  const monthlyData = {};
  
  // Initialiser les 6 derniers mois
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthKey = d.toLocaleString('fr-FR', { month: 'short' });
    monthlyData[monthKey] = { income: 0, profit: 0 };
  }

  transactions.forEach(t => {
    const d = new Date(t.date);
    const monthKey = d.toLocaleString('fr-FR', { month: 'short' });
    if (monthlyData[monthKey]) {
      monthlyData[monthKey].income += (t.priceDzd || 0);
      const buyRate = typeof getBuyRate === 'function' ? getBuyRate() : 255;
      const p = typeof calculateTransactionProfit === 'function'
        ? calculateTransactionProfit(Number(t.amount || 0), Number(t.priceDzd || 0), buyRate)
        : (Number(t.priceDzd || 0) - (Number(t.amount || 0) * buyRate));
      monthlyData[monthKey].profit += p;
    }
  });

  const labels = Object.keys(monthlyData);
  const incomeData = labels.map(l => monthlyData[l].income);
  const profitData = labels.map(l => monthlyData[l].profit);

  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#9ca3af' : '#4b5563';
  const gridColor = isDark ? '#374151' : '#f3f4f6';

  if (window.myChart) window.myChart.destroy();

  window.myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Revenus (DZD)',
          data: incomeData,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Profit Est. (DZD)',
          data: profitData,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: textColor }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: gridColor },
          ticks: { color: textColor }
        },
        x: {
          grid: { display: false },
          ticks: { color: textColor }
        }
      }
    }
  });
};

window.renderTables = function() {
  renderCurrentTab();
  if (typeof updateTodoBadge === 'function') updateTodoBadge();
};

window.updateTodoBadge = function() {
  const badge = document.getElementById('todoBadge');
  if (!badge) return;
  const todos = appState.todoTransactions || [];
  
  // Compter les to-dos qui ne sont pas "done"
  const pendingTodos = todos.filter(t => t && t._type !== 'done').length;
  
  if (pendingTodos > 0) {
    badge.textContent = pendingTodos;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
};

// === FONCTIONS PERFORMANCE SALARIÉS ===
window.renderEmployeePerformance = function(container) {
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

  function toYmd(d) {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }
  
  const now = new Date();
  const algeriaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Algiers' }));
  const today = new Date(algeriaTime);
  today.setHours(0,0,0,0);
  
  // Initialize UI state
  const ui = appState.ui?.performance || {
    startDate: toYmd(new Date(today.getFullYear(), today.getMonth(), 1)),
    endDate: toYmd(today)
  };
  appState.ui = appState.ui || {};
  appState.ui.performance = ui;

  // Helper to count tasks for a date range
  function countTasksInRange(fromYmd, toYmd) {
    const counts = {};
    const from = parseYmd(fromYmd);
    const to = parseYmd(toYmd);
    if (!from || !to) return counts;
    
    txs.forEach(t => {
      if (!t || !t.date) return;
      if (!inRangeYmd(t.date, from, to)) return;
      const id = t.employeeId || 'unassigned';
      counts[id] = (counts[id] || 0) + 1;
    });
    return counts;
  }

  // Get weekly, monthly, yearly counts for all employees
  function getEmployeeStats(id, startYmd, endYmd) {
    // Today's count
    const todayStr = toYmd(today);
    const todayCounts = countTasksInRange(todayStr, todayStr);
    
    // Yesterday
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = toYmd(yesterday);
    const yesterdayCounts = countTasksInRange(yesterdayStr, yesterdayStr);
    
    // This week (Sunday to today)
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Sunday start
    const weekStartStr = toYmd(weekStart);
    const weekCounts = countTasksInRange(weekStartStr, todayStr);
    
    // This month
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthStartStr = toYmd(monthStart);
    const monthCounts = countTasksInRange(monthStartStr, todayStr);
    
    // Selected range
    const rangeCounts = countTasksInRange(startYmd, endYmd);
    
    return {
      today: todayCounts[id] || 0,
      yesterday: yesterdayCounts[id] || 0,
      week: weekCounts[id] || 0,
      month: monthCounts[id] || 0,
      range: rangeCounts[id] || 0
    };
  }

  // Get monthly history for charts
  const monthlyHistory = [];
  for(let i = 0; i < 12; i++) {
    const monthDate = new Date(today);
    monthDate.setMonth(today.getMonth() - i);
    const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
    const ymdFrom = toYmd(monthStart);
    const ymdTo = toYmd(monthEnd);
    const monthCounts = countTasksInRange(ymdFrom, ymdTo);
    
    const monthData = {
      month: `${monthDate.getFullYear()}-${String(monthDate.getMonth()+1).padStart(2,'0')}`,
      label: monthDate.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
      counts: {}
    };
    
    const ids = new Set();
    employees.forEach(e => ids.add(e.id));
    Object.keys(monthCounts).forEach(k => ids.add(k));
    
    ids.forEach(id => {
      monthData.counts[id] = monthCounts[id] || 0;
    });
    
    monthlyHistory.unshift(monthData); // Add to beginning to get ascending order
  }

  // Get all employees
  const allIds = new Set();
  employees.forEach(e => allIds.add(e.id));
  // Also include unassigned
  allIds.add('unassigned');

  // Build the table rows
  const rows = Array.from(allIds).map(id => {
    const emp = employees.find(e => e.id === id);
    const stats = getEmployeeStats(id, ui.startDate, ui.endDate);
    const tasks = stats.range;
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
      id,
      name: emp ? emp.name : (id === 'unassigned' ? 'Non attribué' : id),
      today: stats.today,
      yesterday: stats.yesterday,
      week: stats.week,
      month: stats.month,
      range: stats.range,
      gain,
      share,
      prime,
      net
    };
  }).sort((a, b) => (b.range - a.range) || (b.month - a.month) || (b.week - a.week) || String(a.name || '').localeCompare(String(b.name || '')));

  let totalEmployees = rows.length;
  let totalGain = 0;
  let totalShare = 0;
  let totalPrime = 0;
  let totalNet = 0;
  
  rows.forEach(r => {
    totalGain += r.gain;
    totalShare += r.share;
    totalPrime += r.prime;
    totalNet += r.net;
  });

  container.innerHTML = `
    <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border dark:border-gray-700 fade-in mb-8">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">Ajouter une tâche</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <select id="perf-employee" class="p-4 border dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 dark:text-white">
          <option value="">-- Choisir un salarié --</option>
          ${employees.map(emp => `<option value="${emp.id}">${emp.name}</option>`).join('')}
        </select>
        <input type="number" id="perf-tasks" placeholder="Nombre de tâches" value="1" class="p-4 border dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 dark:text-white">
        <input type="date" id="perf-date" value="${toYmd(today)}" class="p-4 border dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 dark:text-white">
      </div>
      
      <button onclick="addEmployeePerformance()" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all">
        Ajouter la tâche
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border dark:border-gray-700 mb-8">
      <h3 class="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white">
        <i class="fas fa-filter text-indigo-500"></i>Filtrer les données
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Date de début</label>
          <input type="date" id="perf-start" value="${ui.startDate}" class="w-full p-4 border dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 dark:text-white">
        </div>
        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Date de fin</label>
          <input type="date" id="perf-end" value="${ui.endDate}" class="w-full p-4 border dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 dark:text-white">
        </div>
        <div class="md:col-span-2 flex gap-2">
          <button onclick="perfFilter('today')" class="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold rounded-xl transition-all">Aujourd'hui</button>
          <button onclick="perfFilter('week')" class="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold rounded-xl transition-all">Cette semaine</button>
          <button onclick="perfFilter('month')" class="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold rounded-xl transition-all">Ce mois</button>
          <button onclick="perfFilter('year')" class="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold rounded-xl transition-all">Cette année</button>
        </div>
      </div>
      <button onclick="applyPerfFilter()" class="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all">
        Appliquer le filtre
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border dark:border-gray-700">
        <p class="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">Total Salariés</p>
        <p class="text-2xl font-bold text-gray-800 dark:text-white">${totalEmployees}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border dark:border-gray-700">
        <p class="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">Gain Société</p>
        <p class="text-2xl font-bold text-gray-800 dark:text-white">${totalGain.toLocaleString()} DA</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border dark:border-gray-700">
        <p class="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">Valeur 30%</p>
        <p class="text-2xl font-bold text-gray-800 dark:text-white">${Math.round(totalShare).toLocaleString()} DA</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border dark:border-gray-700">
        <p class="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">Total Primes</p>
        <p class="text-2xl font-bold text-gray-800 dark:text-white">${totalPrime.toLocaleString()} DA</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border dark:border-gray-700">
        <p class="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">Bénéfice Net</p>
        <p class="text-2xl font-bold text-gray-800 dark:text-white">${totalNet.toLocaleString()} DA</p>
      </div>
    </div>

    <!-- Monthly Chart -->
    <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border dark:border-gray-700 mb-8">
      <h3 class="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white">
        <i class="fas fa-chart-bar text-indigo-500"></i>Performance Mensuelle (12 derniers mois)
      </h3>
      <div class="h-64">
        <canvas id="employeePerformanceChart"></canvas>
      </div>
    </div>

    <!-- Employee Table -->
    <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border dark:border-gray-700">
      <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-3">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Classement Salariés</h2>
        <button onclick="exportPerformanceCSV()" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl shadow-lg transition-all">
          <i class="fas fa-download mr-2"></i>Exporter CSV
        </button>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-100 dark:bg-gray-700">
              <th class="p-4 text-left rounded-tl-xl font-bold text-gray-700 dark:text-white">Nom</th>
              <th class="p-4 text-center font-bold text-gray-700 dark:text-white">Aujourd'hui</th>
              <th class="p-4 text-center font-bold text-gray-700 dark:text-white">Hier</th>
              <th class="p-4 text-center font-bold text-gray-700 dark:text-white">Cette Semaine</th>
              <th class="p-4 text-center font-bold text-gray-700 dark:text-white">Ce Mois</th>
              <th class="p-4 text-center font-bold text-gray-700 dark:text-white">Période</th>
              <th class="p-4 text-center font-bold text-gray-700 dark:text-white">Gain</th>
              <th class="p-4 text-center font-bold text-gray-700 dark:text-white">30%</th>
              <th class="p-4 text-center font-bold text-gray-700 dark:text-white">Prime</th>
              <th class="p-4 text-center rounded-tr-xl font-bold text-gray-700 dark:text-white">Net</th>
            </tr>
          </thead>
          <tbody class="divide-y dark:divide-gray-700">
            ${rows.length === 0 ? `
              <tr>
                <td colspan="10" class="text-center p-12 text-gray-500 dark:text-gray-400 italic">Aucune performance enregistrée</td>
              </tr>
            ` : rows.map(r => `
              <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="p-4 font-medium text-gray-800 dark:text-white">${r.name}</td>
                <td class="p-4 text-center text-indigo-600 font-bold">${r.today}</td>
                <td class="p-4 text-center text-indigo-600 font-bold">${r.yesterday}</td>
                <td class="p-4 text-center text-indigo-600 font-bold">${r.week}</td>
                <td class="p-4 text-center text-indigo-600 font-bold">${r.month}</td>
                <td class="p-4 text-center text-green-600 font-bold">${r.range}</td>
                <td class="p-4 text-center text-gray-700 dark:text-gray-300">${r.gain.toLocaleString()} DA</td>
                <td class="p-4 text-center text-gray-700 dark:text-gray-300">${Math.round(r.share).toLocaleString()} DA</td>
                <td class="p-4 text-center text-gray-700 dark:text-gray-300">${r.prime.toLocaleString()} DA</td>
                <td class="p-4 text-center text-gray-700 dark:text-gray-300">${r.net.toLocaleString()} DA</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Employee Payments -->
    <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border dark:border-gray-700">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">Gestion des paiements des salariés</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${employees.filter(e => e.active).map(emp => {
          const empPayments = (appState.employeePayments || []).filter(p => p.employeeId === emp.id);
          const totalPaid = empPayments.filter(p => p.paid).reduce((sum, p) => sum + Number(p.amount), 0);
          
          // Calculate for current month (from selected range)
          const fromDate = parseYmd(ui.startDate);
          const toDate = parseYmd(ui.endDate);
          const monthStart = new Date(fromDate.getFullYear(), fromDate.getMonth(), 1);
          const monthEnd = new Date(toDate.getFullYear(), toDate.getMonth() + 1, 0);
          const fromStr = toYmd(monthStart);
          const toStr = toYmd(monthEnd);
          
          // Get absences in that month
          const monthAbsences = (appState.absences || []).filter(a => 
            a.employeeId === emp.id && a.date >= fromStr && a.date <= toStr
          );
          
          // Calculate prime for that month
          const empStats = getEmployeeStats(emp.id, fromStr, toStr);
          const tasksInMonth = empStats.range;
          const gain = tasksInMonth * (config.ratePerTask || 1700);
          const prime = calculPrime(gain);
          
          // Calculate adjusted salary
          const baseSalary = emp.salary || 0;
          const dailySalary = baseSalary / 30; // Assume 30-day month
          const absenceDeduction = dailySalary * monthAbsences.length;
          const adjustedSalary = Math.max(0, baseSalary + prime - absenceDeduction);
          
          const totalDue = Math.max(0, adjustedSalary - totalPaid);
          
          return `
            <div class="p-4 border rounded-2xl bg-gray-50 dark:bg-gray-700">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h4 class="font-bold text-gray-800 dark:text-white">${emp.name || emp.login}</h4>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Salaire: ${(baseSalary).toLocaleString()} DA</p>
                </div>
                <button onclick="openAddPaymentModal('${emp.id}')" class="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700">
                  Ajouter paiement
                </button>
              </div>
              
              <!-- Salary breakdown -->
              <div class="bg-white dark:bg-gray-900 p-3 rounded-xl mb-4 border">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">Détail du mois:</p>
                <div class="space-y-1 text-sm">
                  <div class="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Salaire de base</span>
                    <span>${baseSalary.toLocaleString()} DA</span>
                  </div>
                  <div class="flex justify-between text-green-700 dark:text-green-400">
                    <span>Prime</span>
                    <span>+${prime.toLocaleString()} DA</span>
                  </div>
                  <div class="flex justify-between text-red-700 dark:text-red-400">
                    <span>Absences (${monthAbsences.length}j)</span>
                    <span>-${Math.round(absenceDeduction).toLocaleString()} DA</span>
                  </div>
                  <div class="border-t border-gray-200 dark:border-gray-700 pt-1 mt-1 flex justify-between font-bold text-gray-800 dark:text-white">
                    <span>Total à payer</span>
                    <span>${Math.round(adjustedSalary).toLocaleString()} DA</span>
                  </div>
                </div>
              </div>
              
              <div class="grid grid-cols-2 gap-4 mb-4">
                <div class="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl">
                  <p class="text-xs text-green-700 dark:text-green-400 font-bold">Payé</p>
                  <p class="text-lg font-black text-green-800 dark:text-green-300">${totalPaid.toLocaleString()} DA</p>
                </div>
                <div class="bg-red-100 dark:bg-red-900/30 p-3 rounded-xl">
                  <p class="text-xs text-red-700 dark:text-red-400 font-bold">Restant</p>
                  <p class="text-lg font-black text-red-800 dark:text-red-300">${Math.round(totalDue).toLocaleString()} DA</p>
                </div>
              </div>
              
              <div class="space-y-2 max-h-40 overflow-y-auto">
                ${empPayments.length === 0 ? `
                  <p class="text-sm text-gray-500 italic">Aucun paiement enregistré</p>
                ` : empPayments.slice().reverse().map(p => `
                  <div class="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded-xl border">
                    <div>
                      <p class="text-sm font-bold text-gray-800 dark:text-white">${p.description || 'Paiement'}</p>
                      <p class="text-xs text-gray-500">${p.date}</p>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-bold ${p.paid ? 'text-green-600' : 'text-red-600'}">${Number(p.amount).toLocaleString()} DA</span>
                      <button onclick="togglePaymentStatus('${p.id}')" class="px-2 py-1 text-xs font-bold rounded-lg ${p.paid ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}">
                        ${p.paid ? 'Payé ✓' : 'Non payé'}
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }).join('')}
        ${employees.filter(e => e.active).length === 0 ? `
          <div class="col-span-full text-center py-8 text-gray-500 dark:text-gray-400 italic">Aucun employé actif</div>
        ` : ''}
      </div>
    </div>
  `;

  // Render the chart
  if (typeof Chart !== 'undefined') {
    const ctx = document.getElementById('employeePerformanceChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: monthlyHistory.map(m => m.label),
        datasets: employees.slice(0, 5).map((emp, i) => {
          const colors = [
            { bg: 'rgba(99, 102, 241, 0.7)', border: 'rgb(99, 102, 241)' },
            { bg: 'rgba(16, 185, 129, 0.7)', border: 'rgb(16, 185, 129)' },
            { bg: 'rgba(245, 158, 11, 0.7)', border: 'rgb(245, 158, 11)' },
            { bg: 'rgba(239, 68, 68, 0.7)', border: 'rgb(239, 68, 68)' },
            { bg: 'rgba(139, 92, 246, 0.7)', border: 'rgb(139, 92, 246)' }
          ];
          return {
            label: emp.name,
            data: monthlyHistory.map(m => m.counts[emp.id] || 0),
            backgroundColor: colors[i].bg,
            borderColor: colors[i].border,
            borderWidth: 1
          };
        })
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
};

// Helper functions for filter buttons
window.perfFilter = function(period) {
  const toYmd = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const now = new Date();
  const algeriaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Algiers' }));
  const today = new Date(algeriaTime);
  today.setHours(0,0,0,0);
  let start, end;
  
  if (period === 'today') {
    start = toYmd(today);
    end = start;
  } else if (period === 'week') {
    start = new Date(today);
    start.setDate(start.getDate() - start.getDay()); // Sunday
    end = toYmd(today);
    start = toYmd(start);
  } else if (period === 'month') {
    start = new Date(today.getFullYear(), today.getMonth(), 1);
    end = toYmd(today);
    start = toYmd(start);
  } else if (period === 'year') {
    start = new Date(today.getFullYear(), 0, 1);
    end = toYmd(today);
    start = toYmd(start);
  }
  
  if (document.getElementById('perf-start')) {
    document.getElementById('perf-start').value = start;
  }
  if (document.getElementById('perf-end')) {
    document.getElementById('perf-end').value = end;
  }
  
  if (appState.ui?.performance) {
    appState.ui.performance.startDate = start;
    appState.ui.performance.endDate = end;
  }
};

window.applyPerfFilter = function() {
  const start = document.getElementById('perf-start')?.value;
  const end = document.getElementById('perf-end')?.value;
  if (start && end && appState.ui?.performance) {
    appState.ui.performance.startDate = start;
    appState.ui.performance.endDate = end;
  }
  renderCurrentTab();
};
