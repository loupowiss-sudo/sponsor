// === THEME.JS ===
// Initialisation du thème avant le rendu de la page pour éviter le flash

(function () {
  'use strict';

  // Appliquer le thème sauvegardé immédiatement
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  }

  // Exposer la fonction de basculement
  window.toggleTheme = function () {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    const icon = document.getElementById('themeIcon');
    if (icon) {
      icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }
  };

  // Mettre à jour l'icône au chargement
  document.addEventListener('DOMContentLoaded', function () {
    const icon = document.getElementById('themeIcon');
    if (icon) {
      const isDark = document.documentElement.classList.contains('dark');
      icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }
  });
})();
