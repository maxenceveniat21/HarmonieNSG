/* =============================================
   HARMONIE DE NUITS-ST-GEORGES — Script global
   Toutes les fonctions sont conditionnées par
   l'existence des éléments dans le DOM, pour
   éviter les erreurs sur les autres pages.
   ============================================= */

window.addEventListener('DOMContentLoaded', function () {


  /* =========================================
     MENU HAMBURGER
     Commun à toutes les pages
     ========================================= */

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

  document.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });


  /* =========================================
     CARROUSEL
     Uniquement sur les pages qui en ont un
     ========================================= */

  function initCarousel(trackId, prevId, nextId) {
    var track   = document.getElementById(trackId);
    var btnPrev = document.getElementById(prevId);
    var btnNext = document.getElementById(nextId);

    if (!track || !btnPrev || !btnNext) return;

    var current = 0;

    function getVisible() {
      var w = track.parentElement.offsetWidth;
      if (w < 600) return 1;
      if (w < 960) return 2;
      return 3;
    }

    function getTotal() { return track.children.length; }

    function update() {
      var visible = getVisible();
      var cardW   = track.parentElement.offsetWidth / visible;
      track.style.transform = 'translateX(-' + (current * cardW) + 'px)';
      btnPrev.classList.toggle('carousel-arrow--disabled', current === 0);
      btnNext.classList.toggle('carousel-arrow--disabled', current >= getTotal() - visible);
    }

    btnNext.addEventListener('click', function () {
      if (current < getTotal() - getVisible()) { current++; update(); }
    });

    btnPrev.addEventListener('click', function () {
      if (current > 0) { current--; update(); }
    });

    window.addEventListener('resize', function () { current = 0; update(); });

    update();
  }

  // Ne s'exécute que si les éléments existent (page agenda)
  if (document.getElementById('concertsTrack')) {
    initCarousel('concertsTrack', 'concertsPrev', 'concertsNext');
  }
  if (document.getElementById('animsTrack')) {
    initCarousel('animsTrack', 'animsPrev', 'animsNext');
  }


  /* =========================================
     CARTE LEAFLET (OpenStreetMap)
     Deux cartes indépendantes : concerts / animations
     Avec champ itinéraire → Google Maps
     ========================================= */

  function initMapBlock(containerId, leafletDivId, lieuLabelId, inputId, itineraryBtnId) {
    var container    = document.getElementById(containerId);
    if (!container) return;

    var lieuLabel    = document.getElementById(lieuLabelId);
    var input        = document.getElementById(inputId);
    var itineraryBtn = document.getElementById(itineraryBtnId);

    var map    = null;
    var marker = null;
    var currentLat = null;
    var currentLng = null;

    function initLeaflet(lat, lng) {
      if (!map) {
        map = L.map(leafletDivId).setView([lat, lng], 14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);
      }
    }

    // Appelée depuis les boutons des cartes
    container._showMap = function (lat, lng, lieu) {
      currentLat = lat;
      currentLng = lng;

      container.classList.add('map-visible');
      lieuLabel.textContent = lieu;

      initLeaflet(lat, lng);
      map.setView([lat, lng], 14);
      if (marker) map.removeLayer(marker);
      marker = L.marker([lat, lng]).addTo(map).bindPopup(lieu).openPopup();

      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(function () { map.invalidateSize(); }, 300);
    };

    // Bouton fermer
    container.querySelector('.map-close').addEventListener('click', function () {
      container.classList.remove('map-visible');
    });

    // Bouton itinéraire → ouvre Google Maps dans un nouvel onglet
    itineraryBtn.addEventListener('click', function () {
      var depart = input.value.trim();
      if (!depart) {
        input.focus();
        input.placeholder = 'Entrez votre adresse d\'abord…';
        return;
      }
      var destination = currentLat + ',' + currentLng;
      var url = 'https://www.google.com/maps/dir/?api=1'
              + '&origin=' + encodeURIComponent(depart)
              + '&destination=' + encodeURIComponent(destination)
              + '&travelmode=driving';
      window.open(url, '_blank');
    });

    // Touche Entrée dans le champ
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') itineraryBtn.click();
    });
  }

  // Initialise les deux blocs carte
  initMapBlock('mapConcerts', 'mapConcertsLeaflet', 'mapLieuConcerts', 'inputConcerts', 'btnItineraryConcerts');
  initMapBlock('mapAnims',    'mapAnimsLeaflet',    'mapLieuAnims',    'inputAnims',    'btnItineraryAnims');

  // Clic sur les boutons "Voir sur la carte"
  document.querySelectorAll('.map-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card       = btn.closest('.event-card');
      var lat        = parseFloat(card.getAttribute('data-lat'));
      var lng        = parseFloat(card.getAttribute('data-lng'));
      var lieu       = card.getAttribute('data-lieu');
      var targetId   = card.getAttribute('data-map');
      var container  = document.getElementById(targetId);
      if (container && container._showMap) {
        container._showMap(lat, lng, lieu);
      }
    });
  });


  /* =========================================
     FILTRES PHOTOS
     Uniquement sur la page galerie
     ========================================= */

  var filterBtns = document.querySelectorAll('.filter-btn');

  if (filterBtns.length > 0) {
    var photoItems = document.querySelectorAll('.photo-item');

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        var filter = btn.getAttribute('data-filter');
        photoItems.forEach(function (item) {
          if (filter === 'all' || item.getAttribute('data-cat') === filter) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }


  /* =========================================
     NAVIGATION INTERNE GALERIE
     Lien actif mis à jour au scroll
     ========================================= */

  var galerieNavLinks = document.querySelectorAll('.galerie-nav-link');

  if (galerieNavLinks.length > 0) {
    var sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', function () {
      var scrollY = window.scrollY + 140;
      sections.forEach(function (section) {
        if (scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight) {
          galerieNavLinks.forEach(function (l) { l.classList.remove('active'); });
          var active = document.querySelector('.galerie-nav-link[href="#' + section.id + '"]');
          if (active) active.classList.add('active');
        }
      });
    });
  }


});
