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