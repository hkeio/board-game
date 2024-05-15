import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

type Position = { x: number; y: number };

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit {
  private readonly TILESIZE = 100;
  boardSize = [5, 10];
  cells: Position[][] = [];
  firstClick: Position | null = null;
  secondClick: Position | null = null;
  distance: number | null = null;

  @ViewChild('board') board!: ElementRef;

  constructor() {
    this.fillBoard();
  }

  ngAfterViewInit() {
    this.setBoardSize();
  }

  private fillBoard() {
    for (let x = 0; x < this.boardSize[0]; x++) {
      this.cells[x] = this.cells[x] || [];
      for (let y = 0; y < this.boardSize[1]; y++) {
        this.cells[x][y] = { x, y };
      }
    }
  }

  private setBoardSize(): void {
    this.board.nativeElement.style.width = `${
      this.boardSize[1] * this.TILESIZE + this.TILESIZE * 1.732
    }px`;
  }

  onCellClick({ x, y }: Position): void {
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

  isCell(cell: Position, firstClick: Position | null): boolean {
    if (!firstClick) {
      return false;
    }

    return cell.x === firstClick.x && cell.y === firstClick.y;
  }

  calculateDistance(): void {
    if (this.firstClick && this.secondClick) {
      const dx = this.secondClick.x - this.firstClick.x;
      const dy = this.secondClick.y - this.firstClick.y;
      this.distance = Math.sqrt(dx * dx + dy * dy);
    }
  }

  reset(): void {
    this.firstClick = null;
    this.secondClick = null;
    this.distance = null;
  }
}
