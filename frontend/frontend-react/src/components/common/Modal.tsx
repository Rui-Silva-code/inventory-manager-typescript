import { useEffect } from "react";
import type { ReactNode } from "react";

type ModalProps = {
  isOpen?: boolean;           // if omitted → treat as open
  title?: string;
  onClose: () => void;
  children: ReactNode;
};

export default function Modal({ isOpen, title, onClose, children }: ModalProps) {
  // Treat "undefined" as open (because you often conditionally render the modal anyway)
  const open = isOpen !== false;
  if (!open) return null;

  // ✅ ESC key closes
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  // ✅ Prevent background scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      onMouseDown={onClose} // ✅ click backdrop closes
    >
      <div
        className="modal"
        onMouseDown={(e) => e.stopPropagation()} // ✅ clicks inside do NOT close
      >
        <div className="modal-header">
          {title ? <h2>{title}</h2> : <div />}
          <button type="button" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
