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

const SQRT_3 = Math.sqrt(3);
const HEX_SIZE_MULTIPLIER = 1.5;

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
  hovered = output<Hex | null>();

  tiles: Signal<Hex[]> = computed(() => {
    const tiles: Hex[] = [];
    this.grid().forEach((hex) => tiles.push(hex));
    return tiles;
  });

  offsetX: Signal<number> = computed(() => {
    return this.calculateOffset(SQRT_3);
  });

  offsetY: Signal<number> = computed(() => {
    return this.calculateOffset(HEX_SIZE_MULTIPLIER);
  });

  @HostBinding('style.height') get height(): string {
    return `${this.grid().pixelHeight}px`;
  }

  @HostBinding('style.width') get width(): string {
    return `${Math.ceil(this.grid().pixelWidth) + 2}px`;
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

  private calculateOffset(multiplier: number): number {
    return Math.ceil(multiplier * this.hexSize() * this.radius()) * -1;
  }
}
