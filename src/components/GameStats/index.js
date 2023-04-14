import React from "react";

const currentPlayerEnum = {
    player1: "red",
    player2: "black",
};

export const GameStats = ({ gameDuration, numberOfMoves, currentPlayer }) => (
    <div className="game-stats">
        <div className="game-time">Game Time: {gameDuration}</div>
        <div className="number-of-moves">Number of Moves: {numberOfMoves}</div>
        <div className="number-of-moves">Current player: {currentPlayerEnum[currentPlayer]}</div>
    </div>
);
