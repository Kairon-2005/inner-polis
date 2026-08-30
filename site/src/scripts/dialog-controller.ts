const TRIGGER_SELECTOR = "button[data-dialog-trigger]";
const DIALOG_SELECTOR = "dialog[data-dialog-id]";
const CLOSE_SELECTOR = "[data-dialog-close]";
const BODY_LOCK_CLASS = "dialog-open";

export function initDialogController(root: Document): () => void {
  const dialogs = Array.from(root.querySelectorAll<HTMLDialogElement>(DIALOG_SELECTOR));
  const triggers = Array.from(root.querySelectorAll<HTMLButtonElement>(TRIGGER_SELECTOR));
  let activeDialog: HTMLDialogElement | null = null;
  let activatingTrigger: HTMLButtonElement | null = null;

  const unlockBody = () => {
    root.body.classList.remove(BODY_LOCK_CLASS);
  };

  const handleClose = (event: Event) => {
    const dialog = event.currentTarget as HTMLDialogElement;
    if (dialog !== activeDialog) return;

    activeDialog = null;
    unlockBody();
    activatingTrigger?.focus();
    activatingTrigger = null;
  };

  const closeDialog = (dialog: HTMLDialogElement) => {
    if (dialog.open && typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
      dialog.dispatchEvent(new Event("close"));
    }
  };

  const openDialog = (trigger: HTMLButtonElement) => {
    const dialogId = trigger.dataset.dialogTrigger;
    const requestedDialog = dialogs.find((dialog) => dialog.dataset.dialogId === dialogId);
    if (!requestedDialog) return;

    if (activeDialog?.open) closeDialog(activeDialog);

    activatingTrigger = trigger;
    activeDialog = requestedDialog;

    if (typeof requestedDialog.showModal === "function") {
      requestedDialog.showModal();
    } else {
      requestedDialog.setAttribute("open", "");
    }
    root.body.classList.add(BODY_LOCK_CLASS);
  };

  const handleTriggerClick = (event: Event) => {
    openDialog(event.currentTarget as HTMLButtonElement);
  };

  const handleCloseClick = (event: Event) => {
    const dialog = (event.currentTarget as HTMLElement).closest<HTMLDialogElement>(DIALOG_SELECTOR);
    if (dialog) closeDialog(dialog);
  };

  for (const trigger of triggers) trigger.addEventListener("click", handleTriggerClick);
  for (const dialog of dialogs) {
    dialog.addEventListener("close", handleClose);
    dialog.querySelector<HTMLElement>(CLOSE_SELECTOR)?.addEventListener("click", handleCloseClick);
  }

  return () => {
    for (const trigger of triggers) trigger.removeEventListener("click", handleTriggerClick);
    for (const dialog of dialogs) {
      dialog.removeEventListener("close", handleClose);
      dialog.querySelector<HTMLElement>(CLOSE_SELECTOR)?.removeEventListener("click", handleCloseClick);
      if (dialog.open) closeDialog(dialog);
    }
    activeDialog = null;
    activatingTrigger = null;
    unlockBody();
  };
}
