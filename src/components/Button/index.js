import React from "react";
import "./Button.css";

export const Button = ({
    type = "button",
    onClick = () => {},
    className = "",
    text = "",
    disabled = false,
}) => (
    <button type={type} className={`button ${className}`} onClick={onClick} disabled={disabled}>
        <span>{text}</span>
    </button>
);
