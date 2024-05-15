import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

type Position = { q: number; r: number };

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  providers: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit {
  private readonly TILESIZE = 100;
  boardSize: [q: number, r: number] = [7, 7];
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
    for (let q = 0; q < this.boardSize[0]; q++) {
      this.cells[q] = this.cells[q] || [];
      for (let r = 0; r < this.boardSize[1]; r++) {
        this.cells[q][r] = { q, r };
      }
    }
  }

  private setBoardSize(): void {
    this.board.nativeElement.style.width = `${
      (this.boardSize[0] + 1.12) * this.TILESIZE
    }px`;
    this.board.nativeElement.style.height = `${
      this.boardSize[1] * this.TILESIZE
    }px`;
  }

  onCellClick({ q, r }: Position): void {
    if (!this.firstClick) {
      this.firstClick = { q, r };
      return;
    }

    if (!this.secondClick) {
      this.secondClick = { q, r };
      this.calculateDistance();
      return;
    }

    this.reset();
  }

  isCell(cell: Position, firstClick: Position | null): boolean {
    if (!firstClick) {
      return false;
    }

    return cell.r === firstClick.r && cell.q === firstClick.q;
  }

  calculateDistance(): void {
    if (this.firstClick && this.secondClick) {
      const dx = this.secondClick.r - this.firstClick.r;
      const dy = this.secondClick.q - this.firstClick.q;
      this.distance = Math.sqrt(dx * dx + dy * dy);
    }
  }

  reset(): void {
    this.firstClick = null;
    this.secondClick = null;
    this.distance = null;
  }
}
