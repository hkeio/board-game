import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  WritableSignal,
  signal,
} from '@angular/core';
import { Svg } from '@svgdotjs/svg.js';
import { Grid, Hex, defineHex, spiral } from 'honeycomb-grid';
import { TileComponent } from './tile/tile.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TileComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit {
  distance: WritableSignal<number | null> = signal(null);
  radius: WritableSignal<number> = signal(3);
  tiles: WritableSignal<Hex[]> = signal([]);
  offset: WritableSignal<number> = signal(0);

  draw!: Svg;
  grid!: Grid<Hex>;

  firstClick: WritableSignal<Hex | null> = signal(null);
  secondClick: WritableSignal<Hex | null> = signal(null);

  private hexSize = 30;

  @ViewChild('board') board!: ElementRef;

  ngAfterViewInit() {
    this.addGrid();
  }

  private addGrid() {
    const Hex = defineHex({
      dimensions: this.hexSize,
      origin: 'topLeft',
    });
    this.grid = new Grid(
      Hex,
      spiral({
        start: [this.radius(), this.radius()],
        radius: this.radius(),
      })
    );

    this.board.nativeElement.style.height = this.grid.pixelHeight + 'px';
    this.board.nativeElement.style.width =
      Math.ceil(this.grid.pixelWidth) + 2 + 'px';
    this.offset.set(
      Math.floor(Math.sqrt(3) * this.hexSize * (this.radius() / 2))
    );

    const tiles: Hex[] = [];
    this.grid.forEach((hex) => {
      tiles.push(hex);
    });
    this.tiles.set(tiles);
  }

  getLeft(hex: Hex): number {
    return hex.corners[3].x - this.offset() + 1;
  }

  getTop(hex: Hex): number {
    return hex.corners[5].y;
  }

  equals(cellA: Hex | null, cellB: Hex | null): boolean {
    if (!cellA || !cellB) {
      return false;
    }

    return cellA.x === cellB.x && cellA.y === cellB.y;
  }

  private calculateDistance(): void {
    const firstClick = this.firstClick();
    const secondClick = this.secondClick();
    if (firstClick && secondClick) {
      this.distance.set(this.grid.distance(firstClick, secondClick));
    }
  }

  private resetClicks(): void {
    this.firstClick.set(null);
    this.secondClick.set(null);
    this.distance.set(null);
  }

  setRadius(radius: number): void {
    this.radius.set(radius);
    this.addGrid();
  }

  onCellClick(hex: Hex): void {
    if (this.firstClick() && this.secondClick()) {
      this.resetClicks();
    }

    if (!this.firstClick()) {
      this.firstClick.set(hex);
      return;
    }

    if (!this.secondClick()) {
      this.secondClick.set(hex);

      if (this.equals(this.firstClick(), this.secondClick())) {
        this.resetClicks();
      } else {
        this.calculateDistance();
      }
      return;
    }
  }
}
