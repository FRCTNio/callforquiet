(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile menu toggle
  var menuToggle = document.querySelector(".menu-toggle");
  var siteNav = document.getElementById("site-nav");
  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", function () {
      var open = siteNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    siteNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        siteNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Scroll reveal
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Drift-word scroll-linked motion:
  // slides in from its side and settles toward the resting opacity as it
  // approaches the middle of the viewport; reverses naturally on scroll up
  // since it's driven purely by scroll position, not direction.
  var driftWords = document.querySelectorAll(".drift-word");
  if (driftWords.length && !reduceMotion) {
    var START_OPACITY = 0.16;
    var REST_OPACITY = 0.045;
    var TRAVEL_VW = 7;
    var ticking = false;

    var updateDrift = function () {
      var vh = window.innerHeight;
      driftWords.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        var start = vh; // element top at viewport bottom -> progress 0
        var end = vh * 0.3; // element top near upper third -> progress 1
        var progress = (start - rect.top) / (start - end);
        progress = Math.max(0, Math.min(1, progress));

        var side = el.getAttribute("data-side") === "left" ? -1 : 1;
        var x = side * (1 - progress) * TRAVEL_VW;
        var opacity = START_OPACITY - (START_OPACITY - REST_OPACITY) * progress;

        el.style.setProperty("--drift-x", x.toFixed(2) + "vw");
        el.style.setProperty("--drift-opacity", opacity.toFixed(3));
      });
      ticking = false;
    };

    var requestDriftUpdate = function () {
      if (!ticking) {
        window.requestAnimationFrame(updateDrift);
        ticking = true;
      }
    };

    window.addEventListener("scroll", requestDriftUpdate, { passive: true });
    window.addEventListener("resize", requestDriftUpdate);
    updateDrift();
  }
})();
