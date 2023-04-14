import React from "react";
import "./Checker.css";

export const Checker = ({ player, isKing, isSelected, onDragStart }) => {
    const className = `checker ${player} ${isKing ? "king" : ""} ${isSelected ? "selected" : ""}`;

    return <div className={className} draggable={true} onDragStart={onDragStart} />;
};

export default Checker;
