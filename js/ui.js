function formatId(id) {
    return String(id).padStart(2, "0");
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

    const previousWidth = parseFloat(progressBar.style.width) || 0;

    progressText.textContent = `${used} / ${SECRET_UNLOCK_COUNT}`;
    progressBar.style.width = `${percent}%`;

    if (percent > previousWidth) {
        progressBar.classList.remove("sparkle");

        setTimeout(() => {
            progressBar.classList.add("sparkle");

            setTimeout(() => {
                progressBar.classList.remove("sparkle");
            }, 650);
        }, 20);
    }
}

function getFilteredVouchers() {
    const term = searchInput.value.trim().toLowerCase();
    const filter = filterSelect.value;

    if (searchEasterEgg) {
        searchEasterEgg.style.display = (term === "amor") ? "block" : "none";
    }

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
    card.className = `card ${used ? "used" : ""} ${voucher.id === 13 && unlocked ? "special-card" : ""}`.trim();

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
        useVoucherBtn.textContent = "Usar cupón 🎉";
    }

    if (voucher.id === 13 && unlocked) {
        dialog.showModal();

        showSpecialIntro(() => {
            modalEyebrow.textContent = `CUPÓN ${formatId(voucher.id)} / 13`;
            modalTitle.textContent = voucher.title;
            modalImage.src = voucher.image;
            modalImage.alt = voucher.title;
            modalImage.style.display = "block";

            if (used) {
                useVoucherBtn.disabled = true;
                useVoucherBtn.textContent = "Ya usado";
            } else {
                useVoucherBtn.disabled = false;
                useVoucherBtn.textContent = "Marcar como usado";
            }
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

function checkFinalCompletion() {
    const totalUsed = getUsedCount();

    if (totalUsed === vouchers.length && finalScreen) {
        setTimeout(() => {
            finalScreen.classList.add("show");
            createConfettiBurst();
        }, 600);
    }
}

function markAsUsed() {
    if (currentMode !== "voucher" || currentVoucherId == null) return;

    const voucher = vouchers.find(v => v.id === currentVoucherId);
    if (!voucher || !isUnlocked(voucher)) return;

    state[currentVoucherId].used = true;
    saveState();

    const rect = useVoucherBtn.getBoundingClientRect();
    createMiniConfettiExplosion(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2
    );

    renderGrid();
    showUseCelebration(currentVoucherId);
    checkFinalCompletion();
    openVoucher(currentVoucherId);
}

function checkFinalCompletion() {

    const total = vouchers.length;
    const used = vouchers.filter(v => state[v.id]?.used).length;

    if (used === total) {

        const finalScreen = document.getElementById("finalScreen");

        if (finalScreen) {
            setTimeout(() => {
                finalScreen.classList.add("show");
            }, 600);
        }

    }

}