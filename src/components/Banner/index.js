import React from 'react';

export const GameOverBanner = ({  winner = "" }) => {
    const winnerTextEnum = {
        player1: "You win",
        player2: "You lose",
    };

    const renderWinnerText = () => {
        if (winner === "player1") {
            return `${winnerTextEnum[winner]}!!! 🎉`;
        } else if (winner === "player2") {
            return winnerTextEnum[winner];
        } else if(winner === 'Draw') {
            return "Draw";
        }
    };

    return <div>{renderWinnerText()}</div>;
};
