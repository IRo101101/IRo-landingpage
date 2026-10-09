/* Vorschau r1 - Standort: Zwei-Klick-Karte (S-3)
   Erst nach Klick auf "Karte laden" wird Leaflet (lokal, assets/vendor/leaflet) gestartet und holt die Kacheln
   von swisstopo (Bund, ohne Schluessel). Vor dem Klick verlaesst keine Anfrage die Seite. */
(function () {
  'use strict';
  var LAT = 47.568190, LON = 9.382508, ZOOM = 16;
  var TILES = 'https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-grau/default/current/3857/{z}/{x}/{y}.jpeg';
  function load(site) {
    var box = site.querySelector('[data-map]'); if (!box || box.__map || !window.L) return;
    box.hidden = false;
    var map = L.map(box, { zoomControl: true, scrollWheelZoom: false, attributionControl: false }).setView([LAT, LON], ZOOM);
    L.control.attribution({ prefix: false }).addTo(map);
    L.tileLayer(TILES, { maxZoom: 18, attribution: '&copy; <a href="https://www.swisstopo.admin.ch" target="_blank" rel="noopener">swisstopo</a>' }).addTo(map);
    L.marker([LAT, LON], { icon: L.divIcon({ className: 'site__pinwrap', html: '<span class="site__pin"></span>', iconSize: [18, 18], iconAnchor: [9, 9] }), keyboard: false }).addTo(map)
      .bindPopup('IdeeRoth AG<br>Hafenstrasse 62<br>8590 Romanshorn');
    map.on('focus', function () { map.scrollWheelZoom.enable(); });
    map.on('blur', function () { map.scrollWheelZoom.disable(); });
    box.__map = map;
    site.classList.add('is-loaded');
    setTimeout(function () { map.invalidateSize(); }, 50);
  }
  document.querySelectorAll('[data-map-load]').forEach(function (btn) {
    btn.addEventListener('click', function () { load(btn.closest('.rail__site')); });
  });
  document.querySelectorAll('[data-map-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var box = btn.closest('.rail__site').querySelector('[data-map]'); if (!box) return;
      var plain = box.classList.toggle('is-plain');
      btn.querySelector('span').textContent = plain ? btn.getAttribute('data-label-dark') : btn.getAttribute('data-label-plain');
    });
  });
})();
