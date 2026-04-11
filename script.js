/* =============================================
   HARMONIE DE NUITS-ST-GEORGES — Script global
   ============================================= */


/* =========================================
   INJECTION HEADER / FOOTER
   ========================================= */
(function () {
  var nav = ['index.html','historique.html','agenda.html','galerie.html','contact.html'];
  var labels = ['Accueil','Historique','Agenda','Galerie','Contact & Partenaires'];

  var navLinks = nav.map(function (href, i) {
    return '<a class="nav-link" href="' + href + '">' + labels[i] + '</a>';
  }).join('<div class="nav-divider"></div>');

  var headerHTML = '<header><div class="header-inner"><div class="header-left">'
    + '<a class="site-title" href="index.html"><img class="logo-header" src="cle/Logo Harmonie Municipale NSG 2.png" alt="">'
    + '<a class="site-title" href="index.html"><span class="label">Musique &amp; Partage</span>'
    + '<span class="name">L\'Harmonie de Nuits-St-Georges</span></a></div>'
    + '<button class="menu-toggle" id="menuToggle" aria-label="Ouvrir le menu">'
    + '<span></span><span></span><span></span></button>'
    + '</div></header>'
    + '<div class="nav-overlay" id="navOverlay"><nav>' + navLinks + '</nav></div>';

  document.body.insertAdjacentHTML('afterbegin', headerHTML);
  document.body.insertAdjacentHTML('beforeend',
    '<footer>'
    + '<div class="footer-inner">'
    + '<div class="footer-col">'
    + '<p class="footer-title">L\'Harmonie de Nuits-St-Georges</p>'
    + '<p class="footer-copy">&copy; 2026 &mdash; Tous droits réservés</p>'
    + '<div class="footer-socials">'
    + '<a class="footer-social" href="https://www.facebook.com/HarmonieNuitsStGeorges" target="_blank" rel="noopener" aria-label="Facebook">'
    + '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>'
    + '</a>'
    + '<a class="footer-social" href="https://www.youtube.com/@HarmonieMunicipaledeNSG" target="_blank" rel="noopener" aria-label="YouTube">'
    + '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58a2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>'
    + '</a>'
    + '</div>'
    + '</div>'
    + '<div class="footer-col footer-col--links">'
    + '<p class="footer-col-title">Liens rapides</p>'
    + '<div class="footer-links-grid">'
    + '<a class="footer-link" href="index.html">Accueil</a>'
    + '<a class="footer-link" href="historique.html">Historique</a>'
    + '<a class="footer-link" href="agenda.html">Agenda</a>'
    + '<a class="footer-link" href="galerie.html">Galerie</a>'
    + '<a class="footer-link" href="contact.html">Contact</a>'
    + '</div>'
    + '</div>'
    + '<div class="footer-col">'
    + '<p class="footer-col-title">Répétitions</p>'
    + '<p class="footer-info">Chaque vendredi soir à 20h30</p>'
    + '<p class="footer-info">Nuits-Saint-Georges</p>'
    + '</div>'
    + '<div class="footer-col">'
    + '<p class="footer-col-title">Contact</p>'
    + '<a class="footer-link" href="mailto:harmonie.nuits@yahoo.fr">harmonie.nuits@yahoo.fr</a>'
    + '</div>'
    + '</div>'
    + '</footer>');
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
      var nom    = document.getElementById('f-nom') ? document.getElementById('f-nom').value.trim() : '';
      var email  = document.getElementById('f-email').value.trim();
      var sujet  = document.getElementById('f-sujet').value;
      var msg    = document.getElementById('f-message').value.trim();
      if (!prenom || !email || !sujet || !msg) { alert('Merci de remplir tous les champs.'); return; }
      var nomComplet = nom ? prenom + ' ' + nom : prenom;
      var body = 'De : ' + nomComplet + ' (' + email + ')\n\n' + msg;
      window.location.href = 'mailto:harmonie.nuits@yahoo.fr'
        + '?subject=' + encodeURIComponent(sujet)
        + '&body=' + encodeURIComponent(body);
    };
  }

  /* =========================================
     AFFICHES PROGRAMMES — ouverture en lightbox
     ========================================= */
  var programmeImgWraps = document.querySelectorAll('.programme-img-wrap');
  if (programmeImgWraps.length && lightbox) {
    programmeImgWraps.forEach(function (wrap) {
      var img = wrap.querySelector('img');
      if (!img) return;
      wrap.addEventListener('click', function () {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        document.getElementById('lightboxPrev').style.display = 'none';
        document.getElementById('lightboxNext').style.display = 'none';
        document.getElementById('lightboxCounter').style.display = 'none';
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    function restoreLightboxNav() {
      document.getElementById('lightboxPrev').style.display = '';
      document.getElementById('lightboxNext').style.display = '';
      document.getElementById('lightboxCounter').style.display = '';
    }
    document.getElementById('lightboxClose').addEventListener('click', restoreLightboxNav);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) restoreLightboxNav();
    });
  }


  /* =========================================
     VIGNETTES AFFICHE + LIGHTBOX ÉVÉNEMENT
     ========================================= */
  var eventLightbox      = document.getElementById('eventLightbox');
  var eventLightboxImg   = document.getElementById('eventLightboxImg');
  var eventLightboxClose = document.getElementById('eventLightboxClose');

  if (eventLightbox) {
    document.querySelectorAll('.event-thumb-wrap').forEach(function (wrap) {
      var img = wrap.querySelector('img');
      if (!img) return;

      function openAffiche() {
        eventLightboxImg.src = img.src;
        eventLightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
      wrap.addEventListener('click', openAffiche);
      wrap.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') openAffiche();
      });
    });

    function closeAffiche() {
      eventLightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
    eventLightboxClose.addEventListener('click', closeAffiche);
    eventLightbox.addEventListener('click', function (e) { if (e.target === eventLightbox) closeAffiche(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && eventLightbox.classList.contains('open')) closeAffiche();
    });
  }
});
