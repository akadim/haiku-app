"use client";

import { FC, useRef } from "react";
import { X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  const confirmModal = useRef<HTMLDialogElement>(undefined);
  return (
    <>
      <input
        type="checkbox"
        id="confirmation-modal"
        className="modal-toggle"
        checked={isOpen}
        onChange={() => {}}
      />
      <div className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={onCancel}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="py-4">{message}</p>
          <div className="modal-action">
            <label
              htmlFor="confirmation-modal"
              className="btn btn-error"
              onClick={onConfirm}
            >
              Confirm
            </label>
            <label
              htmlFor="confirmation-modal"
              className="btn"
              onClick={onCancel}
            >
              Cancel
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmModal;
