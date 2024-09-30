import React from "react";
import './modal.css';
const Modal = ({ isOpen, onClose, onSubmit, children }) => {
    if (!isOpen) return null;
  
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <button className="button-close" onClick={onClose}>Close</button>
          {children}
          <button onClick={onSubmit}>Submit</button>
        </div>
      </div>
    );
  };
  
  export default Modal;
  