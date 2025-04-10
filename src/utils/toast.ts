import type { ToastServiceMethods } from "primevue";


const showSuccess = (toast: ToastServiceMethods, message: string) => {
  toast.add({ severity: 'success', summary: 'Success', detail: message, life: 3000 });
};

const showInfo = (toast: ToastServiceMethods, message: string) => {
  toast.add({ severity: 'info', summary: 'Info', detail: message, life: 3000 });
};

const showWarn = (toast: ToastServiceMethods, message: string) => {
  toast.add({ severity: 'warn', summary: 'Warn', detail: message, life: 3000 });
};

const showError = (toast: ToastServiceMethods, message: string) => {
  toast.add({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
};

const showSecondary = (toast: ToastServiceMethods, message: string) => {
  toast.add({ severity: 'secondary', summary: 'Secondary', detail: message, life: 3000 });
};

const showContrast = (toast: ToastServiceMethods, message: string) => {
  toast.add({ severity: 'contrast', summary: 'Contrast', detail: message, life: 3000 });
};

export {
  showSuccess,
  showInfo,
  showWarn,
  showError,
  showSecondary,
  showContrast,
}
