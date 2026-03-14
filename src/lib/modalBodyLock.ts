export let modalBodyLockCount = 0;
let previousOverflow: string | null = null;

export function acquireBodyLock() {
  if (typeof document === "undefined") return;

  if (modalBodyLockCount === 0) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  modalBodyLockCount += 1;
}

export function releaseBodyLock() {
  if (typeof document === "undefined") return;
  if (modalBodyLockCount === 0) return;

  modalBodyLockCount -= 1;

  if (modalBodyLockCount === 0) {
    if (previousOverflow !== null) {
      document.body.style.overflow = previousOverflow;
    } else {
      document.body.style.overflow = "";
    }
    previousOverflow = null;
  }
}

