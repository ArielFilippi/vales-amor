const finalScreen = document.getElementById("finalScreen");
const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");
const voucherGrid = document.getElementById("voucherGrid");
const emptyState = document.getElementById("emptyState");
const searchEasterEgg = document.getElementById("searchEasterEgg");
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
const useSound = document.getElementById("useSound");

let heartInterval;
let currentVoucherId = null;
let currentMode = "voucher";
let state = loadState();

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