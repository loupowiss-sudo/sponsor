// === CALCULATIONS.JS ===

/**
 * Calcule le solde théorique basé sur l'historique
 */
window.calculateTheoreticalBalance = function() {
  let liq = 0;
  let bar = 0;
  let usdt = 0;

  // 1. Entrées (Paiements explicites)
  (appState.payments || []).forEach(p => {
      const amt = Number(p.amount || 0);
      const method = (p.method || '').toLowerCase();
      const account = p.account || (method === 'baridimob' ? 'baridimob' : (method === 'usdt' ? 'usdt' : 'liquide'));
      
      if (account === 'baridimob') bar += amt;
      else if (account === 'usdt') {
          const rate = getRedotpayRate();
          usdt += (amt / rate);
      }
      else liq += amt;
  });

  // 1.5. Entrées implicites (Transactions marquées 'Payée' directement lors de la création)
  (appState.transactions || []).forEach(t => {
      // Les transactions "Problème" ne sont pas comptées
      if (t.status === 'problem') return;
      
      if (t.paid) {
          // L'argent d'une transaction directement cochée comme payée entre par défaut en liquide
          liq += Number(t.priceDzd || 0);
      }
  });

  // 2. Sorties (Dépenses)
  (appState.expenses || []).forEach(e => {
      const amt = Number(e.amount || 0);
      const account = e.account || 'liquide';
      
      if (account === 'baridimob') bar -= amt;
      else if (account === 'usdt') {
          const rate = getRedotpayRate();
          usdt -= (amt / rate);
      }
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

  // 4. Ventes USD (Transactions) - Diminue le stock USDT global
  (appState.transactions || []).forEach(t => {
      // Les transactions validées consomment toujours de l'USD (du compte de facturation général ou spécifique)
      if (t.status === 'active' || !t.status) { // Include normal past transactions that didn't have 'status'
        const usdtAmt = Number(t.amount || 0);
        usdt -= usdtAmt;
        
        // Also deduct from specific ad account if recorded
        if (t.adAccountId) {
            const adAcc = (appState.adAccounts || []).find(a => a.id === t.adAccountId);
            if (adAcc) {
                adAcc.spent = (Number(adAcc.spent) || 0) + usdtAmt;
            }
        }
      }
  });

  // 5. Dépenses USDT
  (appState.usdtExpenses || []).forEach(e => {
      const usdtAmt = Number(e.amount || 0);
      usdt -= usdtAmt;
  });

  return { liquide: liq, baridimob: bar, usdt: usdt };
};

/**
 * Recalcule les soldes finaux (Théorique + Ajustements manuels)
 */
window.recalculateFinanceBalances = function() {
  const manual = appState.manualBalances || { liquide: 0, baridimob: 0, usdt: 0 };
  const theoretical = calculateTheoreticalBalance();

  const balances = { 
    liquide: theoretical.liquide + Number(manual.liquide || 0), 
    baridimob: theoretical.baridimob + Number(manual.baridimob || 0), 
    usdt: theoretical.usdt + Number(manual.usdt || 0) 
  };

  appState.balances = balances;
};

/**
 * Calcule le profit d'une transaction
 */
window.calculateTransactionProfit = function(amount, priceDzd, buyRate) {
  const costDzd = amount * buyRate;
  return priceDzd - costDzd;
};

function parseYmd(ymd) {
  if (!ymd || typeof ymd !== 'string') return null;
  const m = ymd.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  if (Number.isNaN(d.getTime())) return null;
  d.setHours(0, 0, 0, 0);
  return d;
}

function inRangeYmd(ymd, start, end) {
  const d = parseYmd(ymd);
  if (!d) return false;
  return d.getTime() >= start.getTime() && d.getTime() <= end.getTime();
}

function startOfWeek(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const day = x.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  x.setDate(x.getDate() - day); // subtract day to get to Sunday
  return x;
}

function endOfWeek(d) {
  const s = startOfWeek(d);
  const e = new Date(s);
  e.setDate(e.getDate() + 6);
  return e;
}

function startOfMonth(d) {
  const x = new Date(d.getFullYear(), d.getMonth(), 1);
  x.setHours(0, 0, 0, 0);
  return x;
}

function endOfMonth(d) {
  const x = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  x.setHours(0, 0, 0, 0);
  return x;
}

window.getProfitSummaryYmd = function(fromYmd, toYmd) {
  const from = parseYmd(fromYmd);
  const to = parseYmd(toYmd);
  if (!from || !to) return null;
  const start = from.getTime() <= to.getTime() ? from : to;
  const end = from.getTime() <= to.getTime() ? to : from;

  const buyRate = typeof getBuyRate === 'function' ? getBuyRate() : 255;

  let revenue = 0;
  let cost = 0;
  let txCount = 0;

  (appState.transactions || []).forEach(t => {
    if (!t || !t.date) return;
    if (t.status === 'problem') return; // Ignorer les problèmes dans le profit
    
    if (!inRangeYmd(t.date, start, end)) return;
    const price = Number(t.priceDzd || 0);
    const amt = Number(t.amount || 0);
    revenue += Number.isFinite(price) ? price : 0;
    cost += (Number.isFinite(amt) ? amt : 0) * buyRate;
    txCount += 1;
  });

  let expenses = 0;
  (appState.expenses || []).forEach(e => {
    if (!e || !e.date) return;
    if (!inRangeYmd(e.date, start, end)) return;
    const amt = Number(e.amount || 0);
    expenses += Number.isFinite(amt) ? amt : 0;
  });

  let usdtExpensesDzd = 0;
  (appState.usdtExpenses || []).forEach(e => {
    if (!e || !e.date) return;
    if (!inRangeYmd(e.date, start, end)) return;
    const amt = Number(e.amount || 0);
    usdtExpensesDzd += (Number.isFinite(amt) ? amt : 0) * buyRate;
  });

  const grossProfit = revenue - cost;
  const netProfit = grossProfit - expenses - usdtExpensesDzd;

  return { revenue, cost, expenses, usdtExpensesDzd, grossProfit, netProfit, txCount, fromYmd, toYmd };
};

window.getDefaultProfitRanges = function() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const today = new Date(now);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekStart = startOfWeek(now);
  const weekEnd = endOfWeek(now);
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const toYmd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return {
    today: { from: toYmd(today), to: toYmd(today) },
    yesterday: { from: toYmd(yesterday), to: toYmd(yesterday) },
    week: { from: toYmd(weekStart), to: toYmd(weekEnd) },
    month: { from: toYmd(monthStart), to: toYmd(monthEnd) }
  };
};
