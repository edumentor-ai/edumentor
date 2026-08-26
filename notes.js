nu/* ==========================================
   DARK MODE & HAMBURGER MENU TOGGLE
========================================== */
document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("theme-toggle");
    const hamburgerBtn = document.getElementById("hamburger-btn");
    const navLinks = document.getElementById("nav-links");

    // Load saved theme state on load
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
        }
    }

    // Toggle Dark Mode
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

    // Toggle Mobile Hamburger Menu
    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            const icon = hamburgerBtn.querySelector("i");
            if (icon) {
                if (navLinks.classList.contains("active")) {
                    icon.className = "fa-solid fa-xmark";
                } else {
                    icon.className = "fa-solid fa-bars";
                }
            }
        });

        // Close menu on click outside
        document.addEventListener("click", (event) => {
            if (!hamburgerBtn.contains(event.target) && !navLinks.contains(event.target)) {
                navLinks.classList.remove("active");
                const icon = hamburgerBtn.querySelector("i");
                if (icon) icon.className = "fa-solid fa-bars";
            }
        });
    }
});

// =================================
// AI NOTES GENERATOR
// =================================

const generateBtn = document.getElementById("generateBtn");

generateBtn.addEventListener("click", async () => {

    const subject = document.getElementById("subject").value;
    const topic = document.getElementById("topic").value;

    if (subject === "" || topic === "") {
        alert("Please enter subject and topic");
        return;
    }

    generateBtn.innerHTML = "⏳ Generating...";

    try {
        // 1. Get the language value FIRST
        const language = document.getElementById("language").value;
       const notesContainer =
    document.getElementById("notesContainer");

if (language === "Urdu") {

    notesContainer.classList.add("urdu-notes");

} else {

    notesContainer.classList.remove("urdu-notes");

}

        // 2. Make the fetch call
        const response = await fetch(
            "https://edumentor-ai-backend.abasthan.app/generate-notes",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    subject: subject,
                    topic: topic,
                    language: language
                })
            }
        );

        const data = await response.json();

        console.log(data);

        // Show Summary
        document.getElementById("summary").innerHTML = data.summary;
 

        // Show Key Points
        const keyPoints = document.getElementById("keyPoints");
        keyPoints.innerHTML = "";
        data.keyPoints.forEach(point => {
            let li = document.createElement("li");
            li.textContent = point;
            keyPoints.appendChild(li);
        });

        // Show Questions
        const questions = document.getElementById("questions");
        questions.innerHTML = "";
        data.questions.forEach(question => {
            let li = document.createElement("li");
            li.textContent = question;
            questions.appendChild(li);
        });

        // Show Tips
        document.getElementById("tips").innerHTML = data.tips;

    } catch (error) {

        console.log(error);
        alert("Backend is not connected");

    }

    generateBtn.innerHTML = "✨ Generate AI Notes";

});

document.getElementById("copyBtn").addEventListener("click", () => {
    let text = document.getElementById("notesContainer").innerText;
    navigator.clipboard.writeText(text);
    alert("Notes copied!");
});
document.getElementById("printBtn").addEventListener("click", () => {

    window.print();

});


document.getElementById("pdfBtn").addEventListener("click", () => {

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const subject = document.getElementById("subject").value || "";
    const topic = document.getElementById("topic").value || "";

    const summary = document.getElementById("summary").innerText || "";
    const tips = document.getElementById("tips").innerText || "";

    const keyPoints = Array.from(
        document.querySelectorAll("#keyPoints li")
    ).map(li => "• " + li.innerText);

    const questions = Array.from(
        document.querySelectorAll("#questions li")
    ).map((li, index) => (index + 1) + ". " + li.innerText);

    let y = 20;
    const maxWidth = 170; // Printable area (210mm width - 40mm margins)

    // Helper function: Checks if content will overflow bottom of page
    function checkPageOverflow(linesNeeded = 1) {
        if (y + (linesNeeded * 7) > 280) {
            doc.addPage();
            y = 20;
        }
    }

    // --- HEADER ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("EduMentor AI", 20, y);

    y += 12;

    doc.setFontSize(14);
    doc.text("AI Study Notes", 20, y);

    y += 12;

    doc.setFont("helvetica", "normal");

    // Wrap subject & topic if long
    const subjectLines = doc.splitTextToSize("Subject: " + subject, maxWidth);
    doc.text(subjectLines, 20, y);
    y += subjectLines.length * 8;

    const topicLines = doc.splitTextToSize("Topic: " + topic, maxWidth);
    doc.text(topicLines, 20, y);
    y += topicLines.length * 8 + 4;

    // --- SUMMARY ---
    checkPageOverflow(2);
    doc.setFont("helvetica", "bold");
    doc.text("Summary", 20, y);

    y += 8;

    doc.setFont("helvetica", "normal");
    const summaryLines = doc.splitTextToSize(summary, maxWidth);
    
    // Write summary with page overflow protection
    summaryLines.forEach(line => {
        checkPageOverflow();
        doc.text(line, 20, y);
        y += 7;
    });

    y += 5;

    // --- KEY POINTS ---
    checkPageOverflow(2);
    doc.setFont("helvetica", "bold");
    doc.text("Key Points", 20, y);

    y += 8;

    doc.setFont("helvetica", "normal");
    keyPoints.forEach(point => {
        // FIX: Wrap bullet points so long text doesn't extend past right edge
        const lines = doc.splitTextToSize(point, maxWidth);
        lines.forEach(line => {
            checkPageOverflow();
            doc.text(line, 20, y);
            y += 7;
        });
    });

    y += 5;

    // --- IMPORTANT QUESTIONS ---
    checkPageOverflow(2);
    doc.setFont("helvetica", "bold");
    doc.text("Important Questions", 20, y);

    y += 8;

    doc.setFont("helvetica", "normal");
    questions.forEach(question => {
        // FIX: Wrap questions so long text doesn't extend past right edge
        const lines = doc.splitTextToSize(question, maxWidth);
        lines.forEach(line => {
            checkPageOverflow();
            doc.text(line, 20, y);
            y += 7;
        });
    });

    y += 5;

    // --- REVISION TIPS ---
    checkPageOverflow(2);
    doc.setFont("helvetica", "bold");
    doc.text("Revision Tips", 20, y);

    y += 8;

    doc.setFont("helvetica", "normal");
    const tipLines = doc.splitTextToSize(tips, maxWidth);
    tipLines.forEach(line => {
        checkPageOverflow();
        doc.text(line, 20, y);
        y += 7;
    });

    doc.save("EduMentor-AI-Notes.pdf");

});

