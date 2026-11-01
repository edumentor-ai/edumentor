
/* ==========================================
   EDUMENTOR AI - CHAT SYSTEM
   Connected to Gemini Backend
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // CONFIGURATION
    // ==========================================

    const API_URL =
        "https://edumentor-ai-backend.abasthan.app/chat";

    const MAX_FILES = 5;
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
    const MAX_TOTAL_SIZE = 15 * 1024 * 1024; // 15 MB

    const ALLOWED_IMAGES = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif"
    ];

    // ==========================================
    // HTML ELEMENTS
    // ==========================================

    const messageInput = document.getElementById("messageInput");
    const sendBtn = document.getElementById("sendBtn");
    const chatMessages = document.getElementById("chatMessages");

    const uploadBtn = document.getElementById("uploadBtn");
    const imageInput = document.getElementById("imageInput");

    const fileUploadBtn = document.getElementById("fileUploadBtn");
    const fileInput = document.getElementById("fileInput");

    const attachmentPreview =
        document.getElementById("attachmentPreview");

    // Check required HTML elements
    if (
        !messageInput ||
        !sendBtn ||
        !chatMessages ||
        !uploadBtn ||
        !imageInput ||
        !fileUploadBtn ||
        !fileInput ||
        !attachmentPreview
    ) {
        console.error("EduMentor AI: Required chat HTML elements are missing.");
        return;
    }

    // ==========================================
    // VARIABLES
    // ==========================================

    let pendingAttachments = [];
    let isSending = false;

    // Generate unique attachment ID
    function generateId() {
        if (window.crypto && crypto.randomUUID) {
            return crypto.randomUUID();
        }

        return Date.now() + "-" + Math.random();
    }

    // Scroll chat to bottom
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // ==========================================
    // MESSAGE DISPLAY
    // ==========================================

    function appendTextMessage(text, sender) {

        const message = document.createElement("div");

        message.className = "message " + sender;
        message.textContent = text;

        chatMessages.appendChild(message);

        scrollToBottom();

        return message;
    }

    // Display uploaded image in chat
    function appendImageMessage(file) {

        const message = document.createElement("div");
        message.className = "message user";

        const img = document.createElement("img");

        img.src = URL.createObjectURL(file);
        img.alt = "Uploaded study image";

        img.style.maxWidth = "250px";
        img.style.width = "100%";
        img.style.borderRadius = "10px";

        message.appendChild(img);
        chatMessages.appendChild(message);

        scrollToBottom();
    }

    // Display uploaded PDF in chat
    function appendFileMessage(file) {

        const message = document.createElement("div");
        message.className = "message user";

        const fileBox = document.createElement("div");
        fileBox.className = "file-attachment";

        fileBox.textContent = "📄 " + file.name;

        message.appendChild(fileBox);
        chatMessages.appendChild(message);

        scrollToBottom();
    }

    // ==========================================
    // ERROR MESSAGE
    // ==========================================

    function showError(text) {
        appendTextMessage("⚠️ " + text, "ai");
    }

    // ==========================================
    // FILE VALIDATION
    // ==========================================

    function getFileType(file) {

        if (ALLOWED_IMAGES.includes(file.type)) {
            return "image";
        }

        const isPDF =
            file.type === "application/pdf" ||
            file.name.toLowerCase().endsWith(".pdf");

        if (isPDF) {
            return "pdf";
        }

        return null;
    }

    function addAttachments(files, expectedType) {

        for (const file of files) {

            const type = getFileType(file);

            if (!type) {
                showError(
                    "Unsupported file: " + file.name +
                    ". Only JPG, PNG, WEBP, GIF and PDF are supported."
                );
                continue;
            }

            if (expectedType && type !== expectedType) {
                showError("Please select a valid file type.");
                continue;
            }

            if (file.size > MAX_FILE_SIZE) {
                showError(
                    file.name + " exceeds the 10 MB file limit."
                );
                continue;
            }

            if (pendingAttachments.length >= MAX_FILES) {
                showError("You can upload a maximum of 5 files.");
                break;
            }

            const currentTotal = pendingAttachments.reduce(
                (total, item) => total + item.file.size,
                0
            );

            if (currentTotal + file.size > MAX_TOTAL_SIZE) {
                showError("Total attachment size cannot exceed 15 MB.");
                break;
            }

            pendingAttachments.push({
                id: generateId(),
                file: file,
                type: type
            });
        }

        renderAttachmentPreview();
    }

    // ==========================================
    // FILE SELECTION
    // ==========================================

    uploadBtn.addEventListener("click", () => {

        if (!isSending) {
            imageInput.click();
        }

    });

    fileUploadBtn.addEventListener("click", () => {

        if (!isSending) {
            fileInput.click();
        }

    });

    imageInput.addEventListener("change", () => {

        addAttachments(
            Array.from(imageInput.files),
            "image"
        );

        imageInput.value = "";

    });

    fileInput.addEventListener("change", () => {

        addAttachments(
            Array.from(fileInput.files),
            "pdf"
        );

        fileInput.value = "";

    });

    // ==========================================
    // ATTACHMENT PREVIEW
    // ==========================================

    function renderAttachmentPreview() {

        // Release old preview URLs
        attachmentPreview
            .querySelectorAll("img[data-preview-url]")
            .forEach(img => {
                URL.revokeObjectURL(img.dataset.previewUrl);
            });

        attachmentPreview.innerHTML = "";

        pendingAttachments.forEach(item => {

            const box = document.createElement("div");
            box.className = "attachment-item";

            if (item.type === "image") {

                const img = document.createElement("img");

                const previewURL = URL.createObjectURL(item.file);

                img.src = previewURL;
                img.dataset.previewUrl = previewURL;
                img.alt = "Selected image preview";

                box.appendChild(img);

            } else {

                const name = document.createElement("span");

                name.textContent = "📄 " + item.file.name;

                box.appendChild(name);
            }

            // Remove attachment button
            const removeBtn = document.createElement("button");

            removeBtn.type = "button";
            removeBtn.textContent = "×";
            removeBtn.className = "remove-attachment";

            removeBtn.setAttribute(
                "aria-label",
                "Remove " + item.file.name
            );

            removeBtn.addEventListener("click", () => {

                if (isSending) return;

                pendingAttachments =
                    pendingAttachments.filter(
                        attachment => attachment.id !== item.id
                    );

                renderAttachmentPreview();

            });

            box.appendChild(removeBtn);

            attachmentPreview.appendChild(box);

        });

    }

    // ==========================================
    // LOADING INDICATOR
    // ==========================================

    function showLoading() {

        const loading = document.createElement("div");

        loading.className = "message ai";
        loading.textContent = "EduMentor AI is thinking...";

        loading.id = "aiLoading";

        chatMessages.appendChild(loading);

        scrollToBottom();

        return loading;
    }

    // ==========================================
    // SEND MESSAGE TO BACKEND
    // ==========================================

    async function handleSendMessage() {

        if (isSending) return;

        const message = messageInput.value.trim();

        // Allow text-only or attachment-only messages
        if (!message && pendingAttachments.length === 0) {
            return;
        }

        // Final validation
        const totalSize = pendingAttachments.reduce(
            (total, item) => total + item.file.size,
            0
        );

        if (
            pendingAttachments.length > MAX_FILES ||
            totalSize > MAX_TOTAL_SIZE
        ) {
            showError("Please check your attachment count and total size.");
            return;
        }

        const attachmentsToSend = [...pendingAttachments];

        // Prepare multipart form data
        const formData = new FormData();

        formData.append("message", message);

        attachmentsToSend.forEach(item => {

            formData.append(
                "attachments",
                item.file
            );

        });

        // Lock send button
        isSending = true;
        sendBtn.disabled = true;
        sendBtn.setAttribute("aria-busy", "true");

        const loadingMessage = showLoading();

        try {

            // Send request to deployed backend
            const response = await fetch(API_URL, {

                method: "POST",

                body: formData

            });

            // Read server response
            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "The server could not process your request."
                );
            }

            if (!data.reply) {
                throw new Error("The AI returned an empty response.");
            }

            // Remove loading indicator
            loadingMessage.remove();

            // Display user's message
            if (message) {
                appendTextMessage(message, "user");
            }

            // Display uploaded attachments
            attachmentsToSend.forEach(item => {

                if (item.type === "image") {
                    appendImageMessage(item.file);
                } else {
                    appendFileMessage(item.file);
                }

            });

            // Display actual Gemini response
            appendTextMessage(data.reply, "ai");

            // Clear input and attachments after success
            messageInput.value = "";

            pendingAttachments = [];

            renderAttachmentPreview();

            messageInput.style.height = "auto";

        } catch (error) {

            console.error("EduMentor Chat Error:", error);

            loadingMessage.remove();

            showError(
                error.message ||
                "Unable to connect to EduMentor AI. Please try again."
            );

            // Keep the message and attachments so the user
            // can retry without entering everything again.

        } finally {

            isSending = false;

            sendBtn.disabled = false;
            sendBtn.removeAttribute("aria-busy");

            messageInput.focus();

            scrollToBottom();

        }

    }

    // ==========================================
    // SEND BUTTON
    // ==========================================

    sendBtn.addEventListener("click", handleSendMessage);

    // ==========================================
    // ENTER TO SEND
    // SHIFT + ENTER FOR NEW LINE
    // ==========================================

    messageInput.addEventListener("keydown", event => {

        if (
            event.key === "Enter" &&
            !event.shiftKey &&
            !event.isComposing
        ) {

            event.preventDefault();

            handleSendMessage();

        }

    });

    // ==========================================
    // AUTO RESIZE TEXTAREA
    // ==========================================

    messageInput.addEventListener("input", function () {

        this.style.height = "auto";

        this.style.height = this.scrollHeight + "px";

    });

    console.log("EduMentor AI Chat Connected Successfully.");

});

// ==========================================
// DARK / LIGHT MODE
// ==========================================

const themeToggle = document.getElementById("theme-toggle");

function applyTheme(theme) {

    document.body.classList.toggle(
        "dark-mode",
        theme === "dark"
    );

    if (themeToggle) {

        const icon = themeToggle.querySelector("i");

        if (icon) {
            icon.className = theme === "dark"
                ? "fa-solid fa-sun"
                : "fa-solid fa-moon";
        }

        themeToggle.setAttribute(
            "aria-label",
            theme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
        );
    }

    try {
        localStorage.setItem("edumentor-theme", theme);
    } catch (error) {
        console.warn("Theme preference could not be saved.");
    }
}

// Load saved theme
let savedTheme = "light";

try {
    savedTheme = localStorage.getItem("edumentor-theme") || "light";
} catch (error) {
    console.warn("Could not load saved theme.");
}

applyTheme(savedTheme);

// Toggle theme on button click
if (themeToggle) {

    themeToggle.addEventListener("click", () => {

        const isDark =
            document.body.classList.contains("dark-mode");

        applyTheme(isDark ? "light" : "dark");

    });

}


