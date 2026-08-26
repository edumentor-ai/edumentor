/* ==========================================
   DARK MODE
========================================== */

const toggle = document.getElementById("theme-toggle");

toggle.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const icon = toggle.querySelector("i");

    if(document.body.classList.contains("dark")){

        icon.classList.remove("fa-moon");

        icon.classList.add("fa-sun");

        localStorage.setItem("theme","dark");

    }else{

        icon.classList.remove("fa-sun");

        icon.classList.add("fa-moon");

        localStorage.setItem("theme","light");

    }

});


if(localStorage.getItem("theme") === "dark"){

    document.body.classList.add("dark");

    toggle.innerHTML =
        '<i class="fa-solid fa-sun"></i>';

}


/* ==========================================
   LOAD QUIZ RESULTS
========================================== */

function loadDashboard(){

    const savedResults = localStorage.getItem("quizResults");

    const results = savedResults
        ? JSON.parse(savedResults)
        : [];


    /* ======================================
       QUIZ COUNT
    ====================================== */

    document.getElementById("quizCount").innerText =
        results.length;


    /* ======================================
       NO RESULTS
    ====================================== */

    if(results.length === 0){

        document.getElementById("averageScore").innerText = "0%";

        document.getElementById("bestScore").innerText = "0%";

        document.getElementById("topicCount").innerText = "0";

        return;

    }


    /* ======================================
       AVERAGE SCORE
    ====================================== */

    const totalPercentage = results.reduce(
        (sum, result) => sum + Number(result.percentage),
        0
    );

    const average = Math.round(
        totalPercentage / results.length
    );

    document.getElementById("averageScore").innerText =
        `${average}%`;


    /* ======================================
       BEST SCORE
    ====================================== */

    const best = Math.max(
        ...results.map(result =>
            Number(result.percentage)
        )
    );

    document.getElementById("bestScore").innerText =
        `${best}%`;


    /* ======================================
       UNIQUE TOPICS
    ====================================== */

    const topics = new Set(
        results.map(result => result.topic)
    );

    document.getElementById("topicCount").innerText =
        topics.size;


    /* ======================================
       RECENT RESULTS
    ====================================== */

    const recentResults =
        document.getElementById("recentResults");


    recentResults.innerHTML = "";


    const latestResults = [...results]
        .reverse()
        .slice(0, 10);


    latestResults.forEach(result => {

        const card = document.createElement("div");

        card.className = "result-card";

        card.innerHTML = `

            <div class="result-info">

                <div class="result-icon">

                    <i class="fa-solid fa-book"></i>

                </div>

                <div>

                    <h3>
                        ${result.subject}
                    </h3>

                    <p>
                        ${result.topic}
                    </p>

                    <small>
                        ${result.date}
                    </small>

                </div>

            </div>


            <div class="result-score">

                <strong>
                    ${result.percentage}%
                </strong>

                <span>
                    ${result.score}/${result.total}
                </span>

            </div>

        `;

        recentResults.appendChild(card);

    });

}


loadDashboard();

/* ==========================================
   HAMBURGER MENU ONLY
========================================== */
document.addEventListener("DOMContentLoaded", () => {
    const hamburgerBtn = document.getElementById("hamburger-btn");
    const navLinks = document.getElementById("nav-links");

    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            
            const icon = hamburgerBtn.querySelector("i");
            if (icon) {
                icon.classList.toggle("fa-bars");
                icon.classList.toggle("fa-xmark");
            }
        });
    }
});