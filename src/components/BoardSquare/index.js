import React from "react";
import "./BoardSquare.css";

export const BoardSquare = ({ x, y, isHighlighted = false, onDrop = () => {}, children }) => {
    const isDark = (x + y) % 2 === 1;
    const className = `board-square ${isDark ? "dark" : "light"} ${
        isHighlighted ? "highlighted" : ""
    }`;

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <div className={className} onDrop={onDrop} onDragOver={handleDragOver}>
            {children}
        </div>
    );
};
