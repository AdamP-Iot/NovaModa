document.addEventListener("DOMContentLoaded", () => {
  /* MOB. MENU*/
  const navToggle = document.querySelector(".nav-toggle");
  const navList   = document.querySelector(".nav-list");

  if (navToggle && navList) {
    navToggle.addEventListener("click", () => {
      const isOpen = navList.classList.toggle("active");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      console.log("Hamburger kliknutý, menu otevřeno:", isOpen);
    });
  } else {
    console.warn("Nenašel jsem .nav-toggle nebo .nav-list");
  }

  /* ROUTER */
  const sections = {
    home:    document.getElementById("home"),
    katalog: document.getElementById("katalog"),
    detail:  document.getElementById("detail"),
    kontakt: document.getElementById("kontakt"),
    kosik:   document.getElementById("kosik"),
  };

  function closeMobileNav() {
    if (!navList || !navToggle) return;
    navList.classList.remove("active");
    navToggle.setAttribute("aria-expanded", "false");
  }

  function showSection(name) {
    Object.entries(sections).forEach(([key, el]) => {
      if (!el) return;
      if (key === name) {
        el.classList.remove("is-hidden");
      } else {
        el.classList.add("is-hidden");
      }
    });

    if ((name === "home" || !name) && sections.home) {
      sections.home.classList.remove("is-hidden");
    }

    closeMobileNav();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleHashChange() {
    const hash = window.location.hash.replace("#", "") || "home";
    if (sections[hash]) {
      showSection(hash);
    } else {
      showSection("home");
    }
  }

  window.addEventListener("hashchange", handleHashChange);
  handleHashChange();

  /* DETAIL */

  const detailImage       = document.getElementById("detail-image");
  const detailCategory    = document.getElementById("detail-category");
  const detailTitle       = document.getElementById("detail-title");
  const detailRating      = document.getElementById("detail-rating");
  const detailPrice       = document.getElementById("detail-price");
  const detailDescription = document.getElementById("detail-description");

  function openDetailFromCard(card) {
    if (!card) return;

    const {
      title,
      category,
      price,
      rating,
      image,
      description,
    } = card.dataset;

    if (detailImage && image) {
      detailImage.src = image;
      detailImage.alt = title || "";
    }
    if (detailCategory && category) {
      detailCategory.textContent = category;
    }
    if (detailTitle && title) {
      detailTitle.textContent = title;
    }
    if (detailRating && rating) {
      detailRating.textContent = rating;
    }
    if (detailPrice && price) {
      detailPrice.textContent = price;
    }
    if (detailDescription && description) {
      detailDescription.textContent = description;
    }

    window.location.hash = "#detail";
  }


  document.addEventListener("click", (e) => {

    const link = e.target.closest("a[href^='#']");
    if (link) {
      const target = link.getAttribute("href").replace("#", "");
      if (sections[target]) {
        e.preventDefault();
        window.location.hash = "#" + target;
        return; 
      }
    }

    const btn = e.target.closest("[data-open-detail]");
    if (btn) {
      const card = btn.closest(".product-card");
      if (card) {
        openDetailFromCard(card);
      }
    }
  });
});
