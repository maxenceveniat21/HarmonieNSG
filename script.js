/* =============================================
   HARMONIE DE NUITS-ST-GEORGES — Script global
   ============================================= */

/* =========================================
   INJECTION HEADER / FOOTER
   ========================================= */
(function () {
  var nav = ['index.html','historique.html','agenda.html','galerie.html','contact.html'];
  var labels = ['Accueil','Historique','Agenda','Galerie','Contact'];

  var navLinks = nav.map(function (href, i) {
    return (i === 1 ? '<div class="nav-divider"></div>' : '')
      + '<a class="nav-link" href="' + href + '">' + labels[i] + '</a>';
  }).join('');

  var headerHTML = '<header><div class="header-inner"><div class="header-left">'
    + '<img class="logo-header" src="cle/Logo Harmonie Municipale NSG 2.png" alt="">'
    + '<a class="site-title" href="index.html"><span class="label">Musique &amp; Partage</span>'
    + '<span class="name">L\'Harmonie de Nuits-St-Georges</span></a></div>'
    + '<button class="menu-toggle" id="menuToggle" aria-label="Ouvrir le menu">'
    + '<span></span><span></span><span></span></button>'
    + '</div></header>'
    + '<div class="nav-overlay" id="navOverlay"><nav>' + navLinks + '</nav></div>';

  document.body.insertAdjacentHTML('afterbegin', headerHTML);
  document.body.insertAdjacentHTML('beforeend',
    '<footer><p>&copy; 2025 &mdash; L\'Harmonie de Nuits-St-Georges &mdash; Tous droits réservés</p></footer>');
})();


window.addEventListener('DOMContentLoaded', function () {

  /* =========================================
     MENU HAMBURGER
     ========================================= */
  var toggle  = document.getElementById('menuToggle');
  var overlay = document.getElementById('navOverlay');

  function closeMenu() {
    overlay.classList.remove('open');
    toggle.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggle.onclick = function () {
    var isOpen = overlay.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  document.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });


  /* =========================================
     CARROUSEL
     ========================================= */
  function initCarousel(trackId, prevId, nextId) {
    var track   = document.getElementById(trackId);
    var btnPrev = document.getElementById(prevId);
    var btnNext = document.getElementById(nextId);
    if (!track || !btnPrev || !btnNext) return;
    var current = 0;
    function getVisible() {
      var w = track.parentElement.offsetWidth;
      return w < 600 ? 1 : w < 960 ? 2 : 3;
    }
    function update() {
      var visible = getVisible();
      track.style.transform = 'translateX(-' + (current * track.parentElement.offsetWidth / visible) + 'px)';
      btnPrev.classList.toggle('carousel-arrow--disabled', current === 0);
      btnNext.classList.toggle('carousel-arrow--disabled', current >= track.children.length - visible);
    }
    btnNext.addEventListener('click', function () { if (current < track.children.length - getVisible()) { current++; update(); } });
    btnPrev.addEventListener('click', function () { if (current > 0) { current--; update(); } });
    window.addEventListener('resize', function () { current = 0; update(); });
    update();
  }

  if (document.getElementById('concertsTrack')) initCarousel('concertsTrack', 'concertsPrev', 'concertsNext');
  if (document.getElementById('animsTrack'))    initCarousel('animsTrack',    'animsPrev',    'animsNext');


  /* =========================================
     CARTE LEAFLET
     ========================================= */
  function initMapBlock(containerId, leafletDivId, lieuLabelId, inputId, itineraryBtnId) {
    var container = document.getElementById(containerId);
    if (!container) return;
    var lieuLabel = document.getElementById(lieuLabelId);
    var input     = document.getElementById(inputId);
    var itBtn     = document.getElementById(itineraryBtnId);
    var map = null, marker = null, currentLat, currentLng;

    container._showMap = function (lat, lng, lieu) {
      currentLat = lat; currentLng = lng;
      container.classList.add('map-visible');
      lieuLabel.textContent = lieu;
      if (!map) {
        map = L.map(leafletDivId).setView([lat, lng], 14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors' }).addTo(map);
      }
      map.setView([lat, lng], 14);
      if (marker) map.removeLayer(marker);
      marker = L.marker([lat, lng]).addTo(map).bindPopup(lieu).openPopup();
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(function () { map.invalidateSize(); }, 300);
    };

    container.querySelector('.map-close').addEventListener('click', function () {
      container.classList.remove('map-visible');
    });

    itBtn.addEventListener('click', function () {
      var depart = input.value.trim();
      if (!depart) { input.focus(); input.placeholder = "Entrez votre adresse d'abord…"; return; }
      window.open('https://www.google.com/maps/dir/?api=1&origin=' + encodeURIComponent(depart) + '&destination=' + currentLat + ',' + currentLng + '&travelmode=driving', '_blank');
    });
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') itBtn.click(); });
  }

  initMapBlock('mapConcerts', 'mapConcertsLeaflet', 'mapLieuConcerts', 'inputConcerts', 'btnItineraryConcerts');
  initMapBlock('mapAnims',    'mapAnimsLeaflet',    'mapLieuAnims',    'inputAnims',    'btnItineraryAnims');

  document.querySelectorAll('.map-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.event-card');
      var c = document.getElementById(card.getAttribute('data-map'));
      if (c && c._showMap) c._showMap(parseFloat(card.dataset.lat), parseFloat(card.dataset.lng), card.dataset.lieu);
    });
  });


  /* =========================================
     FILTRES PHOTOS + LIGHTBOX
     ========================================= */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var photoItems = document.querySelectorAll('.photo-item');
  var visibleImages = [];

  function refreshVisibleImages() {
    visibleImages = Array.from(photoItems)
      .filter(function (item) { return item.style.display !== 'none'; })
      .map(function (item) { return item.querySelector('img'); })
      .filter(Boolean);
  }

  if (filterBtns.length) {
    refreshVisibleImages();
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var filter = btn.getAttribute('data-filter');
        photoItems.forEach(function (item) {
          item.style.display = (filter === 'all' || item.getAttribute('data-cat') === filter) ? '' : 'none';
        });
        refreshVisibleImages();
      });
    });
  }

  var lightbox = document.getElementById('lightbox');
  if (lightbox) {
    var lightboxImg     = document.getElementById('lightboxImg');
    var lightboxCounter = document.getElementById('lightboxCounter');
    var currentIndex    = 0;

    function updateCounter() { lightboxCounter.textContent = (currentIndex + 1) + ' / ' + visibleImages.length; }

    function openLightbox(index) {
      currentIndex = index;
      lightboxImg.src = visibleImages[index].src;
      lightboxImg.alt = visibleImages[index].alt;
      updateCounter();
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() { lightbox.classList.remove('open'); document.body.style.overflow = ''; }

    function goTo(index) {
      currentIndex = (index + visibleImages.length) % visibleImages.length;
      lightboxImg.style.opacity = '0';
      setTimeout(function () {
        lightboxImg.src = visibleImages[currentIndex].src;
        lightboxImg.alt = visibleImages[currentIndex].alt;
        updateCounter();
        lightboxImg.style.opacity = '1';
      }, 150);
    }

    photoItems.forEach(function (item) {
      item.addEventListener('click', function () {
        var img = item.querySelector('img');
        if (!img) return;
        var idx = visibleImages.indexOf(img);
        if (idx !== -1) openLightbox(idx);
      });
    });

    document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
    document.getElementById('lightboxPrev').addEventListener('click', function () { goTo(currentIndex - 1); });
    document.getElementById('lightboxNext').addEventListener('click', function () { goTo(currentIndex + 1); });
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'ArrowRight') goTo(currentIndex + 1);
      if (e.key === 'ArrowLeft')  goTo(currentIndex - 1);
      if (e.key === 'Escape')     closeLightbox();
    });
  }


  /* =========================================
     NAVIGATION INTERNE GALERIE
     ========================================= */
  var galerieNavLinks = document.querySelectorAll('.galerie-nav-link');
  if (galerieNavLinks.length) {
    var sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', function () {
      var scrollY = window.scrollY + 140;
      sections.forEach(function (section) {
        if (scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight) {
          galerieNavLinks.forEach(function (l) { l.classList.remove('active'); });
          var a = document.querySelector('.galerie-nav-link[href="#' + section.id + '"]');
          if (a) a.classList.add('active');
        }
      });
    });
  }


  /* =========================================
     FORMULAIRE CONTACT
     ========================================= */
  var formBtn = document.getElementById('formBtn');
  if (formBtn) {
    formBtn.onclick = function () {
      var prenom = document.getElementById('f-prenom').value.trim();
      var email  = document.getElementById('f-email').value.trim();
      var sujet  = document.getElementById('f-sujet').value;
      var msg    = document.getElementById('f-message').value.trim();
      if (!prenom || !email || !sujet || !msg) { alert('Merci de remplir tous les champs.'); return; }
      alert('Merci ' + prenom + ' ! Votre message a bien été envoyé.');
    };
  }

});
