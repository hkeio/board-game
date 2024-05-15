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

  get columnCount(): number {
    return this.boardSize[0];
  }

  get rowCount(): number {
    return this.boardSize[1];
  }

  ngAfterViewInit() {
    this.setBoardSize();
  }

  private fillBoard() {
    for (let r = 0; r < this.rowCount; r++) {
      this.cells[r] = this.cells[r] || [];
      for (let q = 0; q < this.columnCount; q++) {
        this.cells[r][q] = { q: q * 2, r };
      }
    }
  }

  private setBoardSize(): void {
    this.board.nativeElement.style.width = `${
      (this.rowCount + 1.1) * this.TILESIZE
    }px`;
    this.board.nativeElement.style.height = `${
      (this.columnCount - 0.1) * this.TILESIZE
    }px`;
  }

  onCellClick({ q, r }: Position): void {
    if (this.firstClick && this.secondClick) {
      this.reset();
    }

    if (!this.firstClick) {
      this.firstClick = { q, r };
      return;
    }

    if (!this.secondClick) {
      this.secondClick = { q, r };

      if (this.equals(this.firstClick, this.secondClick)) {
        this.reset();
      } else {
        this.calculateDistance();
      }
      return;
    }
  }

  equals(cellA: Position | null, cellB: Position | null): boolean {
    if (!cellA || !cellB) {
      return false;
    }

    return cellA.r === cellB.r && cellA.q === cellB.q;
  }

  private calculateRowDistance(a: Position, b: Position): number {
    var dcol = Math.abs(a.q - b.q);
    var drow = Math.abs(a.r - b.r);
    return drow + Math.max(0, (dcol - drow) / 2);
  }

  calculateDistance(): void {
    if (this.firstClick && this.secondClick) {
      const a = this.firstClick;
      const b = this.secondClick;
      var dcol = Math.abs(a.q - b.q);
      var drow = Math.abs(a.r - b.r);

      console.log(dcol, drow);

      this.distance = drow + Math.max(0, (dcol - drow) / 2);
    }
  }

  reset(): void {
    this.firstClick = null;
    this.secondClick = null;
    this.distance = null;
  }
}
