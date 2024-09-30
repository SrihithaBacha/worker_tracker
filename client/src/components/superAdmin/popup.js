import React from "react";
import './popup.css'
const Popup = (props) => {

  return (
    <div className="pop-card">
      <div className="popup-header">
        <div className="popup-image">
          {/* SVG for the checkmark icon */}
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M20 7L9.00004 18L3.99994 13"
                stroke="#000000"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </g>
          </svg>
        </div>
        <div className="popup-content">
          <span className="popup-title">{props.message}</span>
        </div>
      </div>
    </div>
  );
};
export default Popup;
