import {
  Component,
  computed,
  HostBinding,
  input,
  InputSignal,
  output,
  Signal,
} from '@angular/core';
import { Grid, Hex } from 'honeycomb-grid';
import { TileComponent } from './tile/tile.component';

export type GridOptions = { [coords: string]: { cssClass: string } };

@Component({
  selector: 'hex-board',
  standalone: true,
  imports: [TileComponent],
  templateUrl: './hex-board.component.html',
  styleUrls: [`./hex-board.component.scss`],
})
export class HexBoardComponent {
  radius: InputSignal<number> = input(3);
  hexSize: InputSignal<number> = input(30);
  grid: InputSignal<Grid<Hex>> = input.required();
  options: InputSignal<GridOptions> = input({});

  clicked = output<Hex>();

  tiles: Signal<Hex[]> = computed(() => {
    const tiles: Hex[] = [];
    this.grid().forEach((hex) => tiles.push(hex));
    return tiles;
  });

  offsetX: Signal<number> = computed(() => {
    return Math.ceil(Math.sqrt(3) * this.hexSize() * this.radius()) * -1;
  });

  offsetY: Signal<number> = computed(() => {
    return this.hexSize() * 1.5 * this.radius() * -1;
  });

  @HostBinding('style.height') get height() {
    return this.grid().pixelHeight + 'px';
  }

  @HostBinding('style.width') get width() {
    return Math.ceil(this.grid().pixelWidth) + 2 + 'px';
  }

  getLeft(hex: Hex): number {
    return hex.corners[3].x - this.offsetX() + 1;
  }

  getTop(hex: Hex): number {
    return hex.corners[5].y - this.offsetY();
  }

  getCssClass(hex: Hex): string {
    return this.options()[`${hex.q},${hex.r}`]?.cssClass || '';
  }
}
