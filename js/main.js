const ADMIN_KEY = "budun";
const STORAGE_KEY = "valesDelAmorEstado";
const SECRET_UNLOCK_COUNT = 12;

const rulesImage = "img/REGLAMENTO.png";

const vouchers = [
    { id: 1, title: "Cupón 1", image: "img/CUPON1.png", locked: false },
    { id: 2, title: "Cupón 2", image: "img/CUPON2.png", locked: false },
    { id: 3, title: "Cupón 3", image: "img/CUPON3.png", locked: false },
    { id: 4, title: "Cupón 4", image: "img/CUPON4.png", locked: false },
    { id: 5, title: "Cupón 5", image: "img/CUPON5.png", locked: false },
    { id: 6, title: "Cupón 6", image: "img/CUPON6.png", locked: false },
    { id: 7, title: "Cupón 7", image: "img/CUPON7.png", locked: false },
    { id: 8, title: "Cupón 8", image: "img/CUPON8.png", locked: false },
    { id: 9, title: "Cupón 9", image: "img/CUPON9.png", locked: false },
    { id: 10, title: "Cupón 10", image: "img/CUPON10.png", locked: false },
    { id: 11, title: "Cupón 11", image: "img/CUPON11.png", locked: false },
    { id: 12, title: "Cupón 12", image: "img/CUPON12.png", locked: false },
    { id: 13, title: "Cupón especial", image: "img/CUPONESPECIAL.png", locked: true }
];

const voucherMessages = {
    1: "Activando modo sorpresa 🎁",
    2: "Preparando experiencia gastronómica especial 🍝",
    3: "Sistema de compra especial iniciada 🤗",
    4: "Modo pelis y mimos desbloqueado 🍿",
    5: "Nivel de cariño aumentado ❤️",
    6: "Relajación máxima en progreso 💆",
    7: "Nivel de diversión aumentado 🎉",
    8: "Cupón romántico ejecutado 🌹",
    9: "Sistema de besos detectado 💋",
    10: "Modo aventura activado 🚀",
    11: "Preparando momento especial ✨",
    12: "Último paso antes del secreto… 👀",
    13: "✨ Cupón legendario activado ✨"
};

const finalScreen = document.getElementById("finalScreen");
const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");
const voucherGrid = document.getElementById("voucherGrid");
const emptyState = document.getElementById("emptyState");
const availableCount = document.getElementById("availableCount");
const usedCount = document.getElementById("usedCount");
const specialStatus = document.getElementById("specialStatus");
const progressText = document.getElementById("progressText");
const progressBar = document.getElementById("progressBar");
const dialog = document.getElementById("imageDialog");
const modalEyebrow = document.getElementById("modalEyebrow");
const modalTitle = document.getElementById("modalTitle");
const modalImage = document.getElementById("modalImage");
const useVoucherBtn = document.getElementById("useVoucherBtn");
const closeDialog = document.getElementById("closeDialog");
const cancelBtn = document.getElementById("cancelBtn");
const openRules = document.getElementById("openRules");
const resetProgress = document.getElementById("resetProgress");
const toggleSecret = document.getElementById("toggleSecret");
const secretWrap = document.getElementById("secretWrap");
const secretInput = document.getElementById("secretInput");
const unlockAll = document.getElementById("unlockAll");
const mainTitle = document.getElementById("mainTitle");
const secretMessage = document.getElementById("secretMessage");
const unlockToast = document.getElementById("unlockToast");
const useToast = document.getElementById("useToast");

let heartInterval;
let currentVoucherId = null;
let currentMode = "voucher";
let state = loadState();

function defaultState() {
    return vouchers.reduce((acc, voucher) => {
        acc[voucher.id] = { used: false, unlocked: !voucher.locked };
        return acc;
    }, {});
}

function loadState() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return saved && typeof saved === "object"
            ? { ...defaultState(), ...saved }
            : defaultState();
    } catch {
        return defaultState();
    }
}

function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getUsedCount() {
    return vouchers.filter(v => state[v.id]?.used).length;
}

function isUnlocked(voucher) {
    if (voucher.id !== 13) return true;
    return state[13]?.unlocked || getUsedCount() >= SECRET_UNLOCK_COUNT;
}

function updateSpecialUnlock() {
    if (getUsedCount() >= SECRET_UNLOCK_COUNT && !state[13].unlocked) {
        state[13].unlocked = true;
        saveState();
        showUnlockCelebration();
    }
}

function formatId(id) {
    return String(id).padStart(2, "0");
}

function checkFinalCompletion() {

    const totalUsed = getUsedCount();

    if (totalUsed === vouchers.length) {

        setTimeout(() => {
            finalScreen.classList.add("show");
            createConfettiBurst();
        }, 600);

    }

}

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

    useToast.querySelector("span").textContent = message;

    useToast.classList.add("show");

    setTimeout(() => {
        useToast.classList.remove("show");
    }, 2400);

}

function renderStats() {
    updateSpecialUnlock();
    const used = getUsedCount();
    availableCount.textContent = vouchers.length - used;
    usedCount.textContent = used;
    specialStatus.textContent = isUnlocked(vouchers[12]) ? "Desbloqueado ✨" : "Bloqueado 🔒";
}

function renderProgress() {
    const used = Math.min(getUsedCount(), SECRET_UNLOCK_COUNT);
    const percent = (used / SECRET_UNLOCK_COUNT) * 100;

    progressText.textContent = `${used} / ${SECRET_UNLOCK_COUNT}`;
    progressBar.style.width = `${percent}%`;
}

function getFilteredVouchers() {
    const term = searchInput.value.trim().toLowerCase();
    const filter = filterSelect.value;

    return vouchers.filter(voucher => {
        const unlocked = isUnlocked(voucher);
        const used = state[voucher.id]?.used;
        const textMatch =
            voucher.title.toLowerCase().includes(term) ||
            `cupón ${voucher.id}`.includes(term) ||
            `cupon ${voucher.id}`.includes(term);

        if (!textMatch) return false;
        if (filter === "available") return !used && unlocked;
        if (filter === "used") return used;
        if (filter === "locked") return !unlocked;
        return true;
    });
}

function createCard(voucher) {
    const used = state[voucher.id]?.used;
    const unlocked = isUnlocked(voucher);
    const isSpecialLocked = voucher.id === 13 && !unlocked;
    const card = document.createElement("article");
    card.className = `card ${used ? "used" : ""}`.trim();

    const imageMarkup = isSpecialLocked
        ? `<div class="thumb-wrap" style="display:flex;align-items:center;justify-content:center;padding:20px;text-align:center;color:var(--muted);font-weight:700;line-height:1.4;">🔒<br>Cupón especial oculto<br><span style="font-weight:400;opacity:.9;">Se revelará cuando llegue el momento.</span></div>`
        : `<div class="thumb-wrap">
         <img class="thumb" src="${voucher.image}" alt="${voucher.title}" loading="lazy" />
       </div>`;

    card.innerHTML = `
    <div class="ticket-top">
      <div class="ticket-id">CUPÓN ${formatId(voucher.id)} / 13</div>
      <div class="badge">${used ? "Usado" : unlocked ? "Disponible" : "Bloqueado"}</div>
    </div>
    ${imageMarkup}
    <h3 class="title">${isSpecialLocked ? "Cupón especial" : voucher.title}</h3>
    <div class="actions">
      <button class="btn primary" data-open="${voucher.id}">${unlocked ? "Abrir cupón" : "Ver bloqueado"}</button>
    </div>
  `;

    card.querySelector("[data-open]").addEventListener("click", () => openVoucher(voucher.id));
    card.style.animationDelay = `${voucher.id * 0.06}s`;
    return card;
}

function renderGrid() {
    renderStats();
    renderProgress();
    voucherGrid.innerHTML = "";
    const filtered = getFilteredVouchers();
    emptyState.hidden = filtered.length !== 0;
    filtered.forEach(voucher => voucherGrid.appendChild(createCard(voucher)));
}

function openVoucher(voucherId) {
    const voucher = vouchers.find(v => v.id === voucherId);
    if (!voucher) return;

    currentVoucherId = voucherId;
    currentMode = "voucher";
    modalEyebrow.textContent = `CUPÓN ${formatId(voucher.id)} / 13`;
    modalTitle.textContent = voucher.title;

    const unlocked = isUnlocked(voucher);
    const used = state[voucher.id]?.used;

    if (voucher.id === 13 && !unlocked) {
        modalImage.src = "";
        modalImage.alt = "Cupón especial bloqueado";
        modalImage.style.display = "none";
        modalTitle.textContent = "Cupón especial";
        modalEyebrow.textContent = "CUPÓN ESPECIAL / BLOQUEADO";
    } else {
        modalImage.src = voucher.image;
        modalImage.alt = voucher.title;
        modalImage.style.display = "block";
    }

    if (!unlocked) {
        useVoucherBtn.disabled = true;
        useVoucherBtn.textContent = "Aún bloqueado";
    } else if (used) {
        useVoucherBtn.disabled = true;
        useVoucherBtn.textContent = "Ya usado";
    } else {
        useVoucherBtn.disabled = false;
        useVoucherBtn.textContent = "Marcar como usado";
    }

    if (voucher.id === 13 && unlocked) {

        dialog.showModal();

        showSpecialIntro(() => {
            modalEyebrow.textContent = `CUPÓN ${formatId(voucher.id)} / 13`;
            modalTitle.textContent = voucher.title;
            modalImage.src = voucher.image;
            modalImage.alt = voucher.title;
            modalImage.style.display = "block";
        });

        return;
    }

    dialog.showModal();
}

function openRulesImage() {
    currentVoucherId = null;
    currentMode = "rules";
    modalEyebrow.textContent = "REGLAS OFICIALES";
    modalTitle.textContent = "Reglas de uso";
    modalImage.src = rulesImage;
    modalImage.alt = "Reglas de los cupones";
    modalImage.style.display = "block";
    useVoucherBtn.disabled = true;
    useVoucherBtn.textContent = "Solo lectura";
    dialog.showModal();
}

function markAsUsed() {
    if (currentMode !== "voucher" || currentVoucherId == null) return;

    const voucher = vouchers.find(v => v.id === currentVoucherId);
    if (!voucher || !isUnlocked(voucher)) return;

    state[currentVoucherId].used = true;
    saveState();
    renderGrid();
    showUseCelebration(currentVoucherId);
    checkFinalCompletion();
    openVoucher(currentVoucherId);
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

function setupEventListeners() {
    searchInput.addEventListener("input", renderGrid);
    filterSelect.addEventListener("change", renderGrid);
    useVoucherBtn.addEventListener("click", markAsUsed);
    closeDialog.addEventListener("click", () => dialog.close());
    cancelBtn.addEventListener("click", () => dialog.close());
    openRules.addEventListener("click", openRulesImage);

    resetProgress.addEventListener("click", () => {
        if (!confirm("¿Seguro que quieres reiniciar el progreso?")) return;
        state = defaultState();
        saveState();
        renderGrid();
        dialog.close();
    });

    toggleSecret.addEventListener("click", () => {
        secretWrap.classList.toggle("show");
    });

    unlockAll.addEventListener("click", () => {
        if (secretInput.value !== ADMIN_KEY) {
            alert("Clave incorrecta. El amor es libre, pero el panel admin no tanto.");
            return;
        }

        state[13].unlocked = true;
        saveState();
        renderGrid();
        secretInput.value = "";
        secretWrap.classList.remove("show");
    });

    mainTitle.addEventListener("mousedown", startHearts);
    mainTitle.addEventListener("mouseup", stopHearts);
    mainTitle.addEventListener("mouseleave", stopHearts);
    mainTitle.addEventListener("touchstart", startHearts, { passive: true });
    mainTitle.addEventListener("touchend", stopHearts);
    mainTitle.addEventListener("touchcancel", stopHearts);
}

function init() {
    renderGrid();
    startBootSequence();
    setupSecretMessage();
    setupEventListeners();
}

init();