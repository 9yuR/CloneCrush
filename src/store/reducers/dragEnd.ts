import { WritableDraft } from 'immer/dist/types/types-external';
import { formulaForcolumnOfFour, formulaForcolumnOfThree, generateInvalidMoves } from '../../utils/formulas';
import { isColumnOfThree, checkForRowOfThree, checkForRowOfFour, isColumnOfFour } from '../../utils/moveCheckLogic';

export const dragEndReducer = (
    state: WritableDraft<{
        board: string[];
        boardSize: number;
        squareBeingReplaced: Element | undefined;
        squareBeingDragged: Element | undefined;
    }>
) => {
    const newBoard: string[] = [...state.board];
    let { boardSize, squareBeingDragged, squareBeingReplaced } = state;
    const squareBeingDraggedId: number = parseInt(squareBeingDragged?.getAttribute('candy-id') as string);
    const squareBeingReplacedId: number = parseInt(squareBeingReplaced?.getAttribute('candy-id') as string);

    newBoard[squareBeingReplacedId] = squareBeingDragged?.getAttribute('src') as string;
    newBoard[squareBeingDraggedId] = squareBeingReplaced?.getAttribute('src') as string;

    const validMoves: number[] = [
        squareBeingDraggedId - 1,
        squareBeingDraggedId - boardSize,
        squareBeingDraggedId + 1,
        squareBeingDraggedId + boardSize,
    ];

    const validMove: boolean = validMoves.includes(squareBeingDraggedId);

    const isAColumnOfFour: boolean | undefined = isColumnOfFour(newBoard, boardSize, formulaForcolumnOfFour(boardSize));

    const isARowOfFour: boolean | undefined = checkForRowOfFour(newBoard, boardSize, generateInvalidMoves(boardSize, true));

    const isAColumnofThree: boolean | undefined = isColumnOfThree(newBoard, boardSize, formulaForcolumnOfThree(boardSize));

    const isARowOfThree: boolean | undefined = checkForRowOfThree(newBoard, boardSize, generateInvalidMoves(boardSize));

    if (squareBeingReplacedId && validMove && (isARowOfThree || isARowOfFour || isAColumnOfFour || isAColumnofThree)) {
        squareBeingDragged = undefined;
        squareBeingReplaced = undefined;
    } else {
        newBoard[squareBeingReplacedId] = squareBeingReplaced?.getAttribute('src') as string;
        newBoard[squareBeingDraggedId] = squareBeingDragged?.getAttribute('src') as string;
    }
    state.board = newBoard;
};
