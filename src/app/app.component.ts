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

    // function doublewidth_distance(a, b):
    //     var dcol = abs(a.col - b.col)
    //     var drow = abs(a.row - b.row)
    //     return drow + max(0, (dcol-drow)/2)

    // function doubleheight_distance(a, b):
    //     var dcol = abs(a.col - b.col)
    //     var drow = abs(a.row - b.row)
    //     return dcol + max(0, (drow−dcol)/2)
  }

  reset(): void {
    this.firstClick = null;
    this.secondClick = null;
    this.distance = null;
  }
}
