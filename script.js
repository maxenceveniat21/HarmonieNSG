/* =============================================
   HARMONIE DE LA VILLE — Script commun
   Menu hamburger, partagé par toutes les pages
   ============================================= */

window.addEventListener('DOMContentLoaded', function () {
  var toggle  = document.getElementById('menuToggle');
  var overlay = document.getElementById('navOverlay');

  function closeMenu() {
    overlay.classList.remove('open');
    toggle.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggle.onclick = function () {
    if (overlay.classList.contains('open')) {
      closeMenu();
    } else {
      overlay.classList.add('open');
      toggle.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  // Fermer le menu au clic sur un lien
  document.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Fermer avec la touche Échap
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });
});
