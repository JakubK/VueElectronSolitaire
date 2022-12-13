import { Position } from "./position";

export interface Cell {
    position: Position
    isTaken: boolean;
}