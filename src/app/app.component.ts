import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  WritableSignal,
  signal,
} from '@angular/core';
import { SVG, Svg } from '@svgdotjs/svg.js';
import { Grid, Hex, defineHex, spiral } from 'honeycomb-grid';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit {
  distance: WritableSignal<number | null> = signal(null);
  radius: WritableSignal<number> = signal(3);

  private firstClick: Hex | null = null;
  private secondClick: Hex | null = null;

  private draw!: Svg;
  private grid!: Grid<Hex>;

  private hexSize = 30;

  @ViewChild('board') board!: ElementRef;

  ngAfterViewInit() {
    this.draw = SVG().addTo('#grid').size('100%', '100%');
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

    this.grid.forEach((hex) => this.renderSVG(hex));
  }

  private getOffset(): number {
    return Math.floor(Math.sqrt(3) * this.hexSize * (this.radius() / 2));
  }

  private getHexCoords(hex: Hex): string {
    return hex.corners
      .map(({ x, y }) => `${x - this.getOffset()},${y}`)
      .join(' ');
  }

  private renderSVG(hex: Hex) {
    const text = this.draw
      .plain(`${hex.q},${hex.r}`)
      .center(hex.x - this.getOffset(), hex.y);

    const polygon = this.draw.polygon(this.getHexCoords(hex));

    return this.draw
      .group()
      .addClass(this.getClass(hex))
      .add(polygon)
      .add(text);
  }

  private getClass(hex: Hex): string {
    if (this.firstClick && this.equals(this.firstClick, hex)) {
      return 'first-click';
    }

    if (this.secondClick && this.equals(this.secondClick, hex)) {
      return 'second-click';
    }

    return '';
  }

  private equals(cellA: Hex | null, cellB: Hex | null): boolean {
    if (!cellA || !cellB) {
      return false;
    }

    return cellA.x === cellB.x && cellA.y === cellB.y;
  }

  private calculateDistance(): void {
    if (this.firstClick && this.secondClick) {
      this.distance.set(this.grid.distance(this.firstClick, this.secondClick));
    }
  }

  private resetClicks(): void {
    this.firstClick = null;
    this.secondClick = null;
    this.distance.set(null);
  }

  setRadius(radius: number): void {
    this.radius.set(radius);
    this.draw.clear();
    this.addGrid();
  }

  onCellClick(hex: Hex): void {
    if (this.firstClick && this.secondClick) {
      this.resetClicks();
    }

    if (!this.firstClick) {
      this.firstClick = hex;
      return;
    }

    if (!this.secondClick) {
      this.secondClick = hex;

      if (this.equals(this.firstClick, this.secondClick)) {
        this.resetClicks();
      } else {
        this.calculateDistance();
      }
      return;
    }
  }
}
