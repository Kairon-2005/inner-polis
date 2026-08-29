const THRONE_SELECTOR = "button.throne[data-figure]";
const DIALOG_SELECTOR = "dialog[data-figure-dialog]";
const CLOSE_SELECTOR = "[data-dialog-close]";
const BODY_LOCK_CLASS = "dialog-open";

export function initDialogController(root: Document): () => void {
  const dialogs = Array.from(root.querySelectorAll<HTMLDialogElement>(DIALOG_SELECTOR));
  const thrones = Array.from(root.querySelectorAll<HTMLButtonElement>(THRONE_SELECTOR));
  let activeDialog: HTMLDialogElement | null = null;
  let activatingThrone: HTMLButtonElement | null = null;

  const unlockBody = () => {
    root.body.classList.remove(BODY_LOCK_CLASS);
  };

  const handleClose = (event: Event) => {
    const dialog = event.currentTarget as HTMLDialogElement;
    if (dialog !== activeDialog) return;

    activeDialog = null;
    unlockBody();
    activatingThrone?.focus();
    activatingThrone = null;
  };

  const closeDialog = (dialog: HTMLDialogElement) => {
    if (dialog.open && typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
      dialog.dispatchEvent(new Event("close"));
    }
  };

  const openDialog = (throne: HTMLButtonElement) => {
    const figure = throne.dataset.figure;
    const requestedDialog = dialogs.find((dialog) => dialog.dataset.figureDialog === figure);
    if (!requestedDialog) return;

    if (activeDialog?.open) closeDialog(activeDialog);

    activatingThrone = throne;
    activeDialog = requestedDialog;

    if (typeof requestedDialog.showModal === "function") {
      requestedDialog.showModal();
    } else {
      requestedDialog.setAttribute("open", "");
    }
    root.body.classList.add(BODY_LOCK_CLASS);
  };

  const handleThroneClick = (event: Event) => {
    openDialog(event.currentTarget as HTMLButtonElement);
  };

  const handleCloseClick = (event: Event) => {
    const dialog = (event.currentTarget as HTMLElement).closest<HTMLDialogElement>(DIALOG_SELECTOR);
    if (dialog) closeDialog(dialog);
  };

  for (const throne of thrones) throne.addEventListener("click", handleThroneClick);
  for (const dialog of dialogs) {
    dialog.addEventListener("close", handleClose);
    dialog.querySelector<HTMLElement>(CLOSE_SELECTOR)?.addEventListener("click", handleCloseClick);
  }

  return () => {
    for (const throne of thrones) throne.removeEventListener("click", handleThroneClick);
    for (const dialog of dialogs) {
      dialog.removeEventListener("close", handleClose);
      dialog.querySelector<HTMLElement>(CLOSE_SELECTOR)?.removeEventListener("click", handleCloseClick);
      if (dialog.open) closeDialog(dialog);
    }
    activeDialog = null;
    activatingThrone = null;
    unlockBody();
  };
}
