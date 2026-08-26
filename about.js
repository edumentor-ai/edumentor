/* ==========================================
   DARK MODE
========================================== */

const toggle = document.getElementById("theme-toggle");

if (toggle) {

    toggle.addEventListener("click", () => {

        document.body.classList.toggle("dark");

        const icon = toggle.querySelector("i");

        if (document.body.classList.contains("dark")) {

            icon.classList.remove("fa-moon");

            icon.classList.add("fa-sun");

            localStorage.setItem("theme", "dark");

        } else {

            icon.classList.remove("fa-sun");

            icon.classList.add("fa-moon");

            localStorage.setItem("theme", "light");

        }

    });


    if (localStorage.getItem("theme") === "dark") {

        document.body.classList.add("dark");

        toggle.innerHTML =
            '<i class="fa-solid fa-sun"></i>';

    }

}


/* ==========================================
   SIMPLE MOBILE MENU
========================================== */

const menuToggle =
    document.getElementById("menu-toggle");

const navLinks =
    document.getElementById("nav-links");


if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

        const isOpen =
            navLinks.classList.toggle("active");


        menuToggle.setAttribute(
            "aria-expanded",
            isOpen
        );


        if (isOpen) {

            menuToggle.innerHTML =
                '<i class="fa-solid fa-xmark"></i>';

        } else {

            menuToggle.innerHTML =
                '<i class="fa-solid fa-bars"></i>';

        }

    });


    /* Close menu when a link is clicked */

    navLinks.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            navLinks.classList.remove("active");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            menuToggle.innerHTML =
                '<i class="fa-solid fa-bars"></i>';

        });

    });

}