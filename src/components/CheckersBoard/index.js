import React, { useEffect, useState, useRef, useCallback } from "react";
import { BoardSquare } from "../BoardSquare";
import { Checker } from "../Checker";
import { GameOverBanner } from "../Banner";
import { Button } from "../Button";
import { GameStats } from "../GameStats";
import {
    makeMove,
    randomAImove,
    countWinner,
    anyMoveAvailable,
    allowMovesForCapture,
    getInitialBoard,
} from "../../utils/checkers";
import "./CheckersBoard.css";

export const CheckersBoard = () => {
    const [board, setBoard] = useState(() => {
        const storedBoard = localStorage.getItem("checkers-board");
        return storedBoard ? JSON.parse(storedBoard) : getInitialBoard();
    });

    const [selectedChecker, setSelectedChecker] = useState(null);
    const [highlightedCells, setHighlightedCells] = useState([]);
    const [currentPlayer, setCurrentPlayer] = useState("player1");
    const [winner, setWinner] = useState(null);
    const [moveHistory, setMoveHistory] = useState([]);
    const [startTime, setStartTime] = useState(null);
    const [gameTime, setGameTime] = useState(0);
    const [numberOfMoves, setNumberOfMoves] = useState(0);
    const intervalId = useRef();

    const stopGameTime = useCallback(() => {
        clearInterval(intervalId.current);
    }, []);

    useEffect(() => {
        localStorage.setItem("checkers-board", JSON.stringify(board));
    }, [board]);

    useEffect(() => {
        if (!startTime) return;

        intervalId.current = setInterval(() => {
            setGameTime(Date.now() - startTime);
        }, 1000);

        return () => {
            stopGameTime();
        };
    }, [startTime, stopGameTime]);

    const handleCheckerDragStart = (x, y) => {
        setSelectedChecker({ x, y });
        const validMoves = allowMovesForCapture(board, currentPlayer, { x, y });
        setHighlightedCells(validMoves);
    };

    const handleSquareDrop = (x, y) => {
        if (!selectedChecker) return;

        const validMoves = allowMovesForCapture(board, currentPlayer, selectedChecker);
        const move = validMoves.find((move) => move.x === x && move.y === y);

        if (move) {
            const newBoard = makeMove(board, selectedChecker, move);
            setBoard(newBoard);

            if (startTime === null) {
                setStartTime(Date.now());
            }

            setNumberOfMoves(numberOfMoves + 1);
            setMoveHistory([...moveHistory, { board, selectedChecker, move }]);

            const nextPlayer = currentPlayer === "player1" ? "player2" : "player1";
            setCurrentPlayer(nextPlayer);

            if (nextPlayer === "player2") {
                setTimeout(() => {
                    const aiMove = randomAImove(newBoard, nextPlayer);
                    if (aiMove) {
                        setBoard(aiMove);
                        setCurrentPlayer("player1");
                        if (!anyMoveAvailable(aiMove, "player1")) {
                            setWinner(countWinner(aiMove));
                            stopGameTime();
                        }
                    } else {
                        setWinner(countWinner(newBoard));
                        stopGameTime();
                    }
                }, 1000);
            }

            setSelectedChecker(null);
            setHighlightedCells([]);
        }
    };

    const handleUndoMove = () => {
        if (moveHistory.length > 0) {
            const lastMove = moveHistory[moveHistory.length - 1];
            setBoard(lastMove.board);
            setSelectedChecker(lastMove.selectedChecker);
            setCurrentPlayer(currentPlayer === "player1" ? "player1" : "player2");
            setWinner(null);
            setMoveHistory(moveHistory.slice(0, moveHistory.length - 1));
        }
    };

    const handleResetGame = () => {
        setBoard(getInitialBoard());
        setSelectedChecker(null);
        setHighlightedCells([]);
        setCurrentPlayer("player1");
        setWinner(null);
        setMoveHistory([]);
        setStartTime(null);
        setGameTime(0);
        setNumberOfMoves(0);
    };

    const gameDuration = new Date(gameTime).toISOString().substr(11, 8);

    const renderSquare = (x, y) => {
        const checker = board[y][x];
        const isHighlighted = highlightedCells.some((cell) => cell.x === x && cell.y === y);

        return (
            <BoardSquare
                key={`${x},${y}`}
                x={x}
                y={y}
                isHighlighted={isHighlighted}
                onDrop={() => handleSquareDrop(x, y)}
            >
                {checker && (
                    <Checker
                        player={checker.player}
                        isKing={checker.isKing}
                        isSelected={
                            selectedChecker && selectedChecker.x === x && selectedChecker.y === y
                        }
                        onDragStart={() => handleCheckerDragStart(x, y)}
                    />
                )}
            </BoardSquare>
        );
    };

    return (
        <div className="checkers-wrapper">
            <div className="game-panel">
                <GameStats
                    gameDuration={gameDuration}
                    numberOfMoves={numberOfMoves}
                    currentPlayer={currentPlayer}
                />
                <Button
                    className="undo-button"
                    onClick={handleUndoMove}
                    text="Undo move"
                    disabled={moveHistory.length === 0}
                />
                <Button className="reset-button" onClick={handleResetGame} text="Reset game" />
                <div className="game-status">
                    <GameOverBanner player={winner} winner={winner} />
                </div>
            </div>
            <div className="checkers-game">
                <div className="checkers-board">
                    {Array.from({ length: 8 }, (_, y) =>
                        Array.from({ length: 8 }, (_, x) => renderSquare(x, y))
                    )}
                </div>
                <span className="checkers-board__pseudo"></span>
            </div>
        </div>
    );
};

export default CheckersBoard;
