export const getValidMoves = (board, checker, player) => {
    const { x, y } = checker;
    const piece = board[y][x];
    if (player !== piece.player) {
        return [];
    }
    const directions = piece.isKing
        ? [
              [-1, -1],
              [-1, 1],
              [1, -1],
              [1, 1],
          ]
        : piece.player === "player2"
        ? [
              [1, 1],
              [-1, 1],
          ]
        : [
              [-1, -1],
              [1, -1],
          ];

    const moves = [];

    for (const [dx, dy] of directions) {
        const x2 = x + dx;
        const y2 = y + dy;
        if (isValidCoord(x2) && isValidCoord(y2) && !board[y2][x2]) {
            moves.push({ x: x2, y: y2 });
        } else if (
            isValidCoord(x2 + dx) &&
            isValidCoord(y2 + dy) &&
            board[y2][x2] &&
            board[y2][x2].player !== piece.player &&
            !board[y2 + dy][x2 + dx]
        ) {
            moves.push({ x: x2 + dx, y: y2 + dy });
        }
    }

    return moves;
};

export const makeMove = (board, checker, move) => {
    const newBoard = JSON.parse(JSON.stringify(board));
    const piece = newBoard[checker.y][checker.x];

    newBoard[move.y][move.x] = piece;
    newBoard[checker.y][checker.x] = null;

    if (Math.abs(move.y - checker.y) === 2) {
        const capturedX = (checker.x + move.x) / 2;
        const capturedY = (checker.y + move.y) / 2;
        newBoard[capturedY][capturedX] = null;
    }

    return newBoard;
};

export const randomAImove = (board, player) => {
    const validMoves = getAllValidMoves(board, player);
    if (validMoves.length === 0) {
        return null;
    }

    const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
    return makeMove(board, randomMove.checker, randomMove.move);
};

export const anyMoveAvailable = (board, player) => {
    return getAllValidMoves(board, player).length > 0;
};

export const countWinner = (board) => {
    let playerScore1 = 0;
    let playerScore2 = 0;
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            const piece = board[y][x];
            if (piece?.player === "player1") {
                playerScore1++;
            }
            if (piece?.player === "player2") {
                playerScore2++;
            }
        }
    }

    return playerScore1 > playerScore2
        ? "player1"
        : playerScore1 === playerScore2
        ? null
        : "player2";
};

const isValidCoord = (coord) => coord >= 0 && coord < 8;

const getAllValidMoves = (board, player) => {
    const checkers = [];
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            const piece = board[y][x];
            if (piece && piece.player === player) {
                checkers.push({ x, y });
            }
        }
    }

    const allMoves = checkers.flatMap((checker) =>
        getValidMoves(board, checker, player).map((move) => ({ checker, move }))
    );

    const capturingMoves = allMoves.filter(
        ({ checker, move }) => Math.abs(checker.y - move.y) === 2
    );

    return capturingMoves.length >= 1 ? capturingMoves : allMoves;
};

export const allowMovesForCapture = (board, currentPlayer, selectedChecker) =>
    getAllValidMoves(board, currentPlayer).reduce((accum, obj) => {
        if (obj.checker.x === selectedChecker.x && obj.checker.y === selectedChecker.y) {
            return [
                ...accum,
                {
                    x: obj.move.x,
                    y: obj.move.y,
                },
            ];
        }

        return accum;
    }, []);

export const getInitialBoard = () => {
    const board = Array.from({ length: 8 }, () => Array(8).fill(null));
    for (let y = 0; y < 8; y++) {
        for (let x = (y + 1) % 2; x < 8; x += 2) {
            const player = y < 3 ? "player2" : y > 4 ? "player1" : null;
            if (player) {
                board[y][x] = { player, isKing: false };
            }
        }
    }
    return board;
};
