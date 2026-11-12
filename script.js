/* =========================================================
   SAFARI & CITY TOURS — MASTER SCRIPT
   Powers: navbar toggle, home hero slider,
           destination video modal, contact form
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* =======================================================
     1. MOBILE MENU TOGGLE  (all pages)
     ======================================================= */
  (function initMenu() {
    const toggle = document.getElementById("menuToggle");
    const nav = document.getElementById("navMenu");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
      // Swap icon between hamburger and close
      toggle.textContent = nav.classList.contains("open") ? "✕" : "☰";
    });

    // Close menu when a link is clicked (mobile)
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.textContent = "☰";
      });
    });
  })();


  /* =======================================================
     2. HOME HERO IMAGE SLIDER  (index.html)
     Auto-rotates every 3s, with arrows + dots.
     ======================================================= */
  (function initHeroSlider() {
    const track = document.getElementById("heroGalleryTrack");
    if (!track) return; // not on home page → exit safely

    const slides = track.querySelectorAll(".hero-slide");
    const dotsWrap = document.getElementById("heroDots");
    const prevBtn = document.getElementById("heroPrev");
    const nextBtn = document.getElementById("heroNext");
    const AUTOPLAY_MS = 3000;

    let index = 0;
    let timer = null;

    /* Build dots dynamically */
    if (dotsWrap) {
      slides.forEach(function (_, i) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", "Go to slide " + (i + 1));
        dot.addEventListener("click", function () {
          goTo(i);
        });
        dotsWrap.appendChild(dot);
      });
    }
    const dots = dotsWrap ? dotsWrap.querySelectorAll("button") : [];

    /* Render current slide + active dot */
    function render() {
      track.style.transform = "translateX(-" + index * 100 + "%)";
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === index);
      });
    }

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      render();
      restart();
    }

    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    function restart() {
      clearInterval(timer);
      timer = setInterval(next, AUTOPLAY_MS);
    }

    function stop() {
      clearInterval(timer);
    }

    /* Arrows */
    if (nextBtn) nextBtn.addEventListener("click", next);
    if (prevBtn) prevBtn.addEventListener("click", prev);

    /* Pause on hover (nice UX) */
    const slider = document.getElementById("heroGallery");
    if (slider) {
      slider.addEventListener("mouseenter", stop);
      slider.addEventListener("mouseleave", restart);
    }

    /* Keyboard arrows */
    document.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    });

    /* Touch swipe support */
    let touchStartX = 0;
    if (slider) {
      slider.addEventListener("touchstart", function (e) {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      slider.addEventListener("touchend", function (e) {
        const diff = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(diff) > 50) {
          diff < 0 ? next() : prev();
        }
      }, { passive: true });
    }

    /* Start */
    render();
    restart();
  })();


  /* =======================================================
     3. DESTINATIONS VIDEO MODAL  (destinations.html)
     Opens a modal player. Any element with
     class "card" containing data-video / data-title
     can trigger it (optional — hook below).
     ======================================================= */
  (function initVideoModal() {
    const modal = document.getElementById("videoModal");
    if (!modal) return;

    const closeBtn = document.getElementById("modalClose");
    const video = document.getElementById("modalVideo");
    const title = document.getElementById("modalTitle");

    /* Open function (callable from anywhere) */
    window.openVideoModal = function (src, heading) {
      modal.classList.add("open");
      if (heading && title) title.textContent = heading;
      if (video) {
        video.currentTime = 0;
        const playing = video.play();
        if (playing && playing.catch) playing.catch(function () {});
      }
    };

    function closeModal() {
      modal.classList.remove("open");
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    }

    /* Close button */
    if (closeBtn) closeBtn.addEventListener("click", closeModal);

    /* Click outside content → close */
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });

    /* Escape key → close */
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("open")) {
        closeModal();
      }
    });

    /* Optional: if any card has data-video, make it clickable */
    document.querySelectorAll(".card[data-video]").forEach(function (card) {
      card.style.cursor = "pointer";
      card.addEventListener("click", function () {
        const src = card.getAttribute("data-video");
        const heading =
          card.querySelector("h3") ?
          card.querySelector("h3").textContent :
          "Video";
        if (src) window.openVideoModal(src, heading);
      });
    });
  })();


  /* =======================================================
     4. CONTACT FORM  (contact.html)
     Client-side validation + friendly confirmation.
     (Replace the success block with a real fetch() call
      to your backend when ready.)
     ======================================================= */
  (function initContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = form.querySelector("#name").value.trim();
      const email = form.querySelector("#email").value.trim();
      const tour = form.querySelector("#tour").value;
      const message = form.querySelector("#message").value.trim();

      /* Basic validation */
      if (!name || !email || !tour || !message) {
        alert("Please fill in all fields before sending.");
        return;
      }

      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailOk) {
        alert("Please enter a valid email address.");
        return;
      }

      /* Simulate sending */
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";

      setTimeout(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;

        alert(
          "Thank you, " + name + "!\n\n" +
          "Your message about the \"" + tour + "\" tour has been received.\n" +
          "We'll reply to " + email + " within 24 hours."
        );

        form.reset();

        /* -------------------------------------------------
           REPLACE the block above with a real submission:

           fetch("https://your-server.com/contact", {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({ name, email, tour, message })
           })
           .then(function (res) { return res.json(); })
           .then(function () { alert("Message sent!"); form.reset(); })
           .catch(function () { alert("Something went wrong. Try again."); });
           ------------------------------------------------- */
      }, 900);
    });
  })();

});