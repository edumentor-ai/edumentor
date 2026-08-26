/* ==========================================
   DARK MODE
========================================== */

const toggle = document.getElementById("theme-toggle");

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
    toggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
}

/* ==========================================
   GENERATE QUIZ
========================================== */

const generateBtn = document.getElementById("generateQuizBtn");
const newQuizBtn = document.getElementById("newQuizBtn");

generateBtn.addEventListener("click", generateQuiz);

if (newQuizBtn) {
    newQuizBtn.addEventListener("click", resetQuiz);
}

async function generateQuiz() {
    const subject = document.getElementById("subject").value.trim();
    const topic = document.getElementById("topic").value.trim();
    const difficulty = document.getElementById("difficulty").value;
    const questions = document.getElementById("questionCount").value;
    const language = document.getElementById("language").value;

    if (subject === "" || topic === "") {
        alert("Please enter Subject and Topic.");
        return;
    }

    // Hide score section on new generation
    document.getElementById("scoreSection").style.display = "none";

    document.getElementById("quizArea").innerHTML = `
        <div class="placeholder">
            <i class="fa-solid fa-spinner fa-spin"></i>
            <h3>Generating AI Quiz...</h3>
            <p>Please wait a few seconds.</p>
        </div>
    `;

    try {
        const response = await fetch("https://edumentor-ai-backend.abasthan.app/generate-quiz", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                subject,
                topic,
                difficulty,
                questions,
                language
            })
        });

        const data = await response.json();
        console.log("Quiz Data Received:", data);

        displayQuiz(data.quiz);

    } catch (error) {
        console.error(error);

        document.getElementById("quizArea").innerHTML = `
            <div class="placeholder">
                <i class="fa-solid fa-circle-exclamation"></i>
                <h3>Unable to connect.</h3>
                <p>Check your backend server.</p>
            </div>
        `;
    }
}

/* ==========================================
   DISPLAY QUIZ
========================================== */

function displayQuiz(quiz) {
    const quizArea = document.getElementById("quizArea");
    let html = "";

    quiz.forEach((q, index) => {
        html += `
        <div class="question-card" id="question-${index}">
            <div class="question-number">
                Question ${index + 1}
            </div>
            <div class="question-text">
                ${q.question}
            </div>
            <div class="options">
                ${q.options.map(option => `
                    <label class="option">
                        <input
                            type="radio"
                            name="q${index}"
                            value="${option}">
                        <span>${option}</span>
                    </label>
                `).join("")}
            </div>
        </div>
        `;
    });

    quizArea.innerHTML = html;

    // Attach click handler to Submit Button
    document.getElementById("submitQuizBtn").onclick = function () {
        calculateScore(quiz);
    };
}

/* ==========================================
   CALCULATE SCORE & SHOW RESULT
========================================== */

function calculateScore(quiz) {
    let score = 0;
    const totalQuestions = quiz.length;

    quiz.forEach((q, index) => {
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        const questionCard = document.getElementById(`question-${index}`);
        const allLabels = questionCard.querySelectorAll(".option");

        // Highlight options for feedback
        allLabels.forEach(label => {
            const input = label.querySelector("input");
            label.style.padding = "8px 12px";
            label.style.borderRadius = "6px";
            label.style.display = "block";
            label.style.margin = "4px 0";

            if (input.value === q.answer) {
                // Correct answer in Green
                label.style.backgroundColor = "#d4edda";
                label.style.color = "#155724";
                label.style.borderColor = "#c3e6cb";
            } else if (selected && input === selected && selected.value !== q.answer) {
                // Wrong selected answer in Red
                label.style.backgroundColor = "#f8d7da";
                label.style.color = "#721c24";
                label.style.borderColor = "#f5c6cb";
            }
        });

        if (selected && selected.value === q.answer) {
            score++;
        }
    });

    // Calculate percentage
    const percent = Math.round((score / totalQuestions) * 100);

    // Performance Feedback Message
    let performanceMsg = "";
    if (percent === 100) {
        performanceMsg = "🌟 Outstanding! Perfect score!";
    } else if (percent >= 70) {
        performanceMsg = "🎉 Great job! You have a solid grasp of this topic.";
    } else if (percent >= 50) {
        performanceMsg = "👍 Good effort! Review your weak spots and try again.";
    } else {
        performanceMsg = "📚 Don't give up! Re-read the notes and retry.";
    }

    // Update UI Result Section
    document.getElementById("score").innerText = `${score} / ${totalQuestions}`;
    document.getElementById("percentage").innerText = `${percent}%`;
    document.getElementById("performance").innerText = performanceMsg;
    // ==========================================
// SAVE QUIZ RESULT FOR DASHBOARD
// ==========================================

const quizResult = {
    subject: document.getElementById("subject").value,
    topic: document.getElementById("topic").value,
    score: score,
    total: totalQuestions,
    percentage: percent,
    date: new Date().toLocaleDateString()
};

let savedResults = JSON.parse(
    localStorage.getItem("quizResults") || "[]"
);

savedResults.push(quizResult);

localStorage.setItem(
    "quizResults",
    JSON.stringify(savedResults)
);

    // Display the Score Card Section & Scroll into view
    const scoreSection = document.getElementById("scoreSection");
    scoreSection.style.display = "block";
    scoreSection.scrollIntoView({ behavior: "smooth" });
}

/* ==========================================
   RESET QUIZ
========================================== */

function resetQuiz() {
    document.getElementById("quizArea").innerHTML = `
        <div class="placeholder">
            <i class="fa-solid fa-robot"></i>
            <h3>Your AI Quiz will appear here</h3>
            <p>
                Fill in the details and click
                <strong>Generate AI Quiz</strong>.
            </p>
        </div>
    `;
    document.getElementById("scoreSection").style.display = "none";
}
/* ==========================================
   HAMBURGER MENU TOGGLE ONLY
========================================== */
document.addEventListener("DOMContentLoaded", () => {
    const hamburgerBtn = document.getElementById("hamburger-btn");
    const navLinks = document.getElementById("nav-links");

    if (hamburgerBtn && navLinks) {
        // Toggle menu open/close on hamburger click
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

        // Close menu when clicking outside of it
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
});