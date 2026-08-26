/* ==========================================
   1. DARK MODE TOGGLE
========================================== */
const themeToggle = document.getElementById("theme-toggle");

// Load saved theme state from localStorage on page load
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    if (themeToggle) {
        themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
}

// Attach theme toggle click event
if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {
            localStorage.setItem("theme", "dark");
            themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
        } else {
            localStorage.setItem("theme", "light");
            themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
        }
    });
}


/* ==========================================
   2. HAMBURGER MENU TOGGLE
========================================== */
const hamburgerBtn = document.getElementById("hamburger-btn");
const navLinks = document.getElementById("nav-links");

if (hamburgerBtn && navLinks) {
    // Toggle menu open/close on button click
    hamburgerBtn.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        
        // Switch icon between 'bars' and 'X'
        const icon = hamburgerBtn.querySelector("i");
        if (icon) {
            if (navLinks.classList.contains("active")) {
                icon.classList.remove("fa-bars");
                icon.classList.add("fa-xmark");
            } else {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }
        }
    });

    // Close menu when clicking anywhere outside of it
    document.addEventListener("click", (event) => {
        if (!hamburgerBtn.contains(event.target) && !navLinks.contains(event.target)) {
            navLinks.classList.remove("active");
            const icon = hamburgerBtn.querySelector("i");
            if (icon) {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }
        }
    });
}