// === NAV-GROUPS.JS ===
// Gère l'accordéon des groupes de navigation dans la sidebar
// (un seul groupe ouvert à la fois, flèche animée).
// N'altère aucune fonction existante (showTab, updateNavButtonsVisibility, ...):
// ce fichier ne fait qu'ajouter un comportement purement visuel en plus.

(function () {
  function closeAllNavGroups(exceptName) {
    document.querySelectorAll('.nav-group').forEach(function (group) {
      if (group.getAttribute('data-group') === exceptName) return;
      const toggle = group.querySelector('.nav-group-toggle');
      const panel = group.querySelector('.nav-group-panel');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
      if (panel) panel.classList.remove('nav-group-panel--open');
      group.classList.remove('nav-group--open');
    });
  }

  // Ouvre/ferme un groupe donné. Un seul groupe reste ouvert à la fois.
  window.toggleNavGroup = function (name) {
    const group = document.querySelector('.nav-group[data-group="' + name + '"]');
    if (!group) return;
    const isOpen = group.classList.contains('nav-group--open');
    closeAllNavGroups(isOpen ? null : name);
    if (isOpen) {
      group.classList.remove('nav-group--open');
      const toggle = group.querySelector('.nav-group-toggle');
      const panel = group.querySelector('.nav-group-panel');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
      if (panel) panel.classList.remove('nav-group-panel--open');
    } else {
      group.classList.add('nav-group--open');
      const toggle = group.querySelector('.nav-group-toggle');
      const panel = group.querySelector('.nav-group-panel');
      if (toggle) toggle.setAttribute('aria-expanded', 'true');
      if (panel) panel.classList.add('nav-group-panel--open');
    }
  };

  // Ouvre automatiquement le groupe contenant le bouton donné (ex: quand on
  // clique sur "Clients", le groupe "Ventes & Clients" reste/devient ouvert).
  window.openNavGroupFor = function (el) {
    const group = el.closest('.nav-group');
    if (!group) return;
    const name = group.getAttribute('data-group');
    if (!group.classList.contains('nav-group--open')) {
      closeAllNavGroups(name);
      group.classList.add('nav-group--open');
      const toggle = group.querySelector('.nav-group-toggle');
      const panel = group.querySelector('.nav-group-panel');
      if (toggle) toggle.setAttribute('aria-expanded', 'true');
      if (panel) panel.classList.add('nav-group-panel--open');
    }
  };

  // Délégation d'événements : quand on clique sur un item de navigation situé
  // à l'intérieur d'un groupe, on ouvre ce groupe. On utilise la délégation
  // (plutôt que de modifier l'attribut onclick="showTab(...)" de chaque bouton)
  // pour ne jamais toucher au sélecteur exact utilisé par showTab() dans
  // ui-render.js (document.querySelector(`button[onclick="showTab('id')"]`)).
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.nav-group-panel .nav-item');
    if (btn) window.openNavGroupFor(btn);
  });

  // Au chargement, ouvre automatiquement le groupe contenant l'onglet actif
  // (utile si l'onglet par défaut n'est pas "dashboard", ex: mode employé).
  function syncNavGroupsWithActiveTab() {
    const activeBtn = document.querySelector('.app-sidebar .nav-item.bg-blue-600');
    if (activeBtn) {
      const group = activeBtn.closest('.nav-group');
      if (group) {
        const name = group.getAttribute('data-group');
        closeAllNavGroups(name);
        group.classList.add('nav-group--open');
        const toggle = group.querySelector('.nav-group-toggle');
        const panel = group.querySelector('.nav-group-panel');
        if (toggle) toggle.setAttribute('aria-expanded', 'true');
        if (panel) panel.classList.add('nav-group-panel--open');
      }
    }
  }

  window.addEventListener('load', function () {
    setTimeout(syncNavGroupsWithActiveTab, 350);
  });
})();
