import {
  Component,
  Signal,
  WritableSignal,
  computed,
  signal,
} from '@angular/core';
import { GridOptions, HexBoardComponent } from 'hex-board';
import { Grid, Hex, defineHex, spiral } from 'honeycomb-grid';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HexBoardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  distance: WritableSignal<number | null> = signal(null);
  radius: WritableSignal<number> = signal(3);
  hexSize: WritableSignal<number> = signal(30);

  grid: Signal<Grid<Hex>> = computed(
    () =>
      new Grid(
        defineHex({
          dimensions: this.hexSize(),
          origin: 'topLeft',
        }),
        spiral({
          start: [this.radius(), this.radius()],
          radius: this.radius(),
        })
      )
  );

  options: Signal<GridOptions> = computed(() => {
    const options: GridOptions = {};

    const firstClick = this.firstClick();
    if (firstClick) {
      options[`${firstClick.q},${firstClick.r}`] = { cssClass: 'first-click' };
    }

    const secondClick = this.secondClick();
    if (secondClick) {
      options[`${secondClick.q},${secondClick.r}`] = {
        cssClass: 'second-click',
      };
    }

    return options;
  });

  firstClick: WritableSignal<Hex | null> = signal(null);
  secondClick: WritableSignal<Hex | null> = signal(null);

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
      this.distance.set(this.grid().distance(firstClick, secondClick));
    }
  }

  private resetClicks(): void {
    this.firstClick.set(null);
    this.secondClick.set(null);
    this.distance.set(null);
  }

  setRadius(radius: number): void {
    this.radius.set(radius);
    this.resetClicks();
  }

  setHexSize(hexSize: number): void {
    this.hexSize.set(hexSize);
  }

  onCellClick(hex: Hex): void {
    const firstClick = this.firstClick();
    const secondClick = this.secondClick();

    if (firstClick && secondClick) {
      this.resetClicks();
    }

    if (!firstClick) {
      this.firstClick.set(hex);
      return;
    }

    if (!secondClick) {
      this.secondClick.set(hex);

      if (this.equals(firstClick, secondClick)) {
        this.resetClicks();
      } else {
        this.calculateDistance();
      }
      return;
    }
  }
}
