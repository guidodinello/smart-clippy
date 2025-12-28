import type { ToastType } from "@/lib/types/toast";
import { TOAST_TYPES } from "@/lib/types/toast";
import { TOAST_DURATION } from "@/lib/constants";

let toastContainer: HTMLDivElement | null = null;

export function showToast(
    message: string,
    type: ToastType = TOAST_TYPES.INFO,
    duration: number = TOAST_DURATION.DEFAULT
) {
    // Ensure container exists
    if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.id = "smart-clippy-toast-container";
        toastContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 999999;
            pointer-events: none;
        `;
        document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toast = document.createElement("div");
    toast.style.cssText = `
        background-color: ${getBackgroundColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        margin-bottom: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        animation: slideIn 0.3s ease-out;
        pointer-events: auto;
        max-width: 300px;
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 14px;
        line-height: 1.5;
    `;
    toast.textContent = message;

    // Add animation styles if not already present
    if (!document.getElementById("smart-clippy-toast-styles")) {
        const style = document.createElement("style");
        style.id = "smart-clippy-toast-styles";
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    toastContainer.appendChild(toast);

    // Auto-remove after duration
    setTimeout(() => {
        toast.style.animation = "slideOut 0.3s ease-in";
        setTimeout(() => {
            toast.remove();
            // Remove container if no toasts left
            if (toastContainer && toastContainer.children.length === 0) {
                toastContainer.remove();
                toastContainer = null;
            }
        }, 300);
    }, duration);
}

function getBackgroundColor(type: ToastType): string {
    switch (type) {
        case TOAST_TYPES.SUCCESS:
            return "#4CAF50";
        case TOAST_TYPES.ERROR:
            return "#f44336";
        case TOAST_TYPES.WARNING:
            return "#ff9800";
        case TOAST_TYPES.INFO:
        default:
            return "#2196F3";
    }
}
