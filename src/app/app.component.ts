import { Component } from '@angular/core';

type Position = { x: number; y: number };

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  boardSize = [5, 10];
  board: Position[][] = [];
  firstClick: Position | null = null;
  secondClick: Position | null = null;
  distance: number | null = null;

  constructor() {
    this.initBoard();
  }

  private initBoard() {
    for (let x = 0; x < this.boardSize[0]; x++) {
      this.board[x] = this.board[x] || [];
      for (let y = 0; y < this.boardSize[1]; y++) {
        this.board[x][y] = { x, y };
      }
    }
  }

  onCellClick({ x, y }: Position) {
    if (!this.firstClick) {
      this.firstClick = { x, y };
      return;
    }

    if (!this.secondClick) {
      this.secondClick = { x, y };
      this.calculateDistance();
      return;
    }

    this.reset();
  }

  isCell(cell: Position, firstClick: Position | null) {
    if (!firstClick) {
      return false;
    }

    return cell.x === firstClick.x && cell.y === firstClick.y;
  }

  calculateDistance() {
    if (this.firstClick && this.secondClick) {
      const dx = this.secondClick.x - this.firstClick.x;
      const dy = this.secondClick.y - this.firstClick.y;
      this.distance = Math.sqrt(dx * dx + dy * dy);
    }
  }

  reset() {
    this.firstClick = null;
    this.secondClick = null;
    this.distance = null;
  }
}
