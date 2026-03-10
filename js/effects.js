function spawnHeart() {
    const container = document.getElementById("heartContainer");
    const heart = document.createElement("div");

    heart.className = "heart";
    heart.innerText = "❤️";
    heart.style.left = Math.random() * 100 + "vw";

    container.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 2000);
}

function startHearts() {
    clearInterval(heartInterval);
    heartInterval = setInterval(spawnHeart, 150);
}

function stopHearts() {
    clearInterval(heartInterval);
}

function setupSecretMessage() {
    let titleClicks = 0;

    mainTitle.addEventListener("click", () => {
        titleClicks++;

        if (titleClicks >= 5) {
            secretMessage.style.display = "block";

            setTimeout(() => {
                secretMessage.style.display = "none";
                titleClicks = 0;
            }, 4000);
        }
    });
}

function showUnlockCelebration() {
    unlockToast.classList.add("show");
    setTimeout(() => unlockToast.classList.remove("show"), 3200);
    createConfettiBurst();
}

function createConfettiBurst() {
    const colors = ["#ff5c8a", "#ffd166", "#ffffff", "#ff8fab", "#cdb4db"];
    const pieces = 36;

    for (let i = 0; i < pieces; i += 1) {
        const piece = document.createElement("span");
        piece.className = "confetti";
        piece.style.left = `${Math.random() * 100}vw`;
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDelay = `${Math.random() * 0.35}s`;
        piece.style.transform = `translateY(-10vh) rotate(${Math.random() * 180}deg)`;
        document.body.appendChild(piece);

        setTimeout(() => piece.remove(), 3200);
    }
}

function showUseCelebration(voucherId) {
    const message = voucherMessages[voucherId] || "El amor avanza al siguiente nivel.";

    if (useSound) {
        useSound.currentTime = 0;
        useSound.play().catch(error => {
            console.log("Error al reproducir sonido:", error);
        });
    }

    useToast.querySelector("span").textContent = message;
    useToast.classList.add("show");

    setTimeout(() => {
        useToast.classList.remove("show");
    }, 2400);
}

function showSpecialIntro(callback) {
    modalImage.style.display = "none";
    modalTitle.textContent = "Accediendo a contenido sensible...";
    modalEyebrow.textContent = "SISTEMA SECRETO";

    useVoucherBtn.disabled = true;
    useVoucherBtn.textContent = "Verificando...";

    setTimeout(() => {
        modalTitle.textContent = "Verificando nivel de ternura...";
    }, 1200);

    setTimeout(() => {
        modalTitle.textContent = "Acceso concedido 💖";
    }, 2400);

    setTimeout(() => {
        callback();
    }, 3600);
}

function startBootSequence() {
    const bootScreen = document.getElementById("bootScreen");
    const bootBar = document.getElementById("bootBar");
    let progress = 0;

    const timer = setInterval(() => {
        progress += Math.random() * 10 + 5;

        if (progress >= 100) {
            progress = 100;
            clearInterval(timer);

            setTimeout(() => {
                bootScreen.style.opacity = "0";
                bootScreen.style.visibility = "hidden";
            }, 3200);
        }

        bootBar.style.width = `${progress}%`;
    }, 260);
}