document.addEventListener("DOMContentLoaded", function () {
    // === 1. TYPING EFFECT (REPL HERO) ===
    const lines = [
        { text: ">>> import portfolio", cls: "" },
        { text: ">>> print(portfolio.name)", cls: "" },
        { text: "Максим Панчиха", cls: "str" },
        { text: ">>> print(portfolio.role)", cls: "" },
        { text: "Python Developer", cls: "str" },
        { text: ">>> print(portfolio.status)", cls: "" },
        { text: "Open to new projects", cls: "str" }
    ];

    const replContainer = document.getElementById("repl");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (replContainer) {
        replContainer.innerHTML = "";

        if (reduceMotion) {
            lines.forEach(lineObj => {
                const p = document.createElement("p");
                p.className = "repl-line " + lineObj.cls;
                if (lineObj.text.startsWith(">>> ")) {
                    p.innerHTML = '<span class="prompt">&gt;&gt;&gt; </span>' + lineObj.text.replace(">>> ", "");
                } else {
                    p.textContent = lineObj.text;
                }
                replContainer.appendChild(p);
            });
        } else {
            let lineIndex = 0;

            function typeNextLine() {
                if (lineIndex >= lines.length) return;

                const lineObj = lines[lineIndex];
                const p = document.createElement("p");
                p.className = "repl-line " + lineObj.cls;

                const isPrompt = lineObj.text.startsWith(">>> ");
                const textToType = isPrompt ? lineObj.text.replace(">>> ", "") : lineObj.text;

                if (isPrompt) {
                    const promptSpan = document.createElement("span");
                    promptSpan.className = "prompt";
                    promptSpan.textContent = ">>> ";
                    p.appendChild(promptSpan);
                }

                const textSpan = document.createElement("span");
                const cursor = document.createElement("span");
                cursor.className = "cursor";

                p.appendChild(textSpan);
                p.appendChild(cursor);
                replContainer.appendChild(p);

                let charIndex = 0;
                const speed = 35;

                function typeChar() {
                    if (charIndex < textToType.length) {
                        textSpan.textContent += textToType.charAt(charIndex);
                        charIndex++;
                        setTimeout(typeChar, speed);
                    } else {
                        cursor.remove();
                        lineIndex++;
                        setTimeout(typeNextLine, 300);
                    }
                }

                typeChar();
            }

            typeNextLine();
        }
    }

    // === 2. DARK / LIGHT THEME TOGGLE ===
    const themeBtn = document.getElementById("theme-toggle");
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        if (themeBtn) themeBtn.textContent = "☀️ Mode";
    }

    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            const isDark = document.body.classList.contains("dark-mode");
            themeBtn.textContent = isDark ? "☀️ Mode" : "🌙 Mode";
            localStorage.setItem("theme", isDark ? "dark" : "light");
        });
    }

    // === 3. INTERACTIVE TERMINAL SHELL ===
    const termInput = document.getElementById("terminal-input");
    const termOutput = document.getElementById("terminal-output");

    const commands = {
        help: "Доступні команди: <span class='kw'>skills</span>, <span class='kw'>projects</span>, <span class='kw'>contact</span>, <span class='kw'>about</span>, <span class='kw'>clear</span>",
        skills: "Навички: Python, Django, Pygame, Tkinter, SQLAlchemy, SQLite, Git",
        projects: "Проєкти: [1] 2DTanksGame (Pygame), [2] MarsColonization (Pygame), [3] DjangoWebApp",
        contact: "Email: email@example.com | GitHub: github.com | Telegram: @telegram",
        about: "Максим Панчиха — Python розробник. Створює бекенд, ігри та скрипти."
    };

    if (termInput && termOutput) {
        termInput.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                const val = termInput.value.trim().toLowerCase();
                termInput.value = "";

                if (!val) return;

                const cmdLine = document.createElement("p");
                cmdLine.className = "repl-line";
                cmdLine.innerHTML = `<span class="prompt">&gt;&gt;&gt; </span>${val}`;
                termOutput.appendChild(cmdLine);

                if (val === "clear") {
                    termOutput.innerHTML = "";
                    return;
                }

                const resLine = document.createElement("p");
                resLine.className = "repl-line str";

                if (commands[val]) {
                    resLine.innerHTML = commands[val];
                } else {
                    resLine.innerHTML = `<span class="cm">CommandError: unknown command '${val}'. Type 'help'.</span>`;
                }

                termOutput.appendChild(resLine);
                termOutput.scrollTop = termOutput.scrollHeight;
            }
        });
    }

    // === 4. PROJECT FILTERING ===
    const filterBtns = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project");

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filter = btn.getAttribute("data-filter");

            projectCards.forEach(card => {
                const cat = card.getAttribute("data-category");
                if (filter === "all" || cat === filter) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });

    // === 5. COPY EMAIL TO CLIPBOARD ===
    const copyBtn = document.getElementById("copy-email-btn");
    const emailText = document.getElementById("email-text");

    if (copyBtn && emailText) {
        copyBtn.addEventListener("click", () => {
            navigator.clipboard.writeText(emailText.textContent).then(() => {
                const orig = copyBtn.textContent;
                copyBtn.textContent = "Скопійовано!";
                setTimeout(() => { copyBtn.textContent = orig; }, 1500);
            });
        });
    }

    // === 6. SCROLL REVEAL ANIMATION ===
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("in");
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(el => observer.observe(el));
});