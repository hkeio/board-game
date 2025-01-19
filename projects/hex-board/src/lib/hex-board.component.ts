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

export type GridOptions = {
  [coords: string]: { cssClass: string; text?: string };
};

export type HexEvent = {
  hex: Hex;
  event: MouseEvent;
};

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
  grid: InputSignal<Grid<Hex>> = input.required();
  options: InputSignal<GridOptions> = input({});

  clicked = output<HexEvent>();
  hovered = output<HexEvent | null>();

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

  getText(hex: Hex): string {
    return this.options()[`${hex.q},${hex.r}`]?.text || '';
  }

  private calculateRadius(N: number): number {
    const a = 3;
    const b = 3;
    const c = 1 - N;

    // Calculate the discriminant
    const discriminant = b * b - 4 * a * c;

    if (discriminant < 0) {
      // No real solution exists
      throw new Error('Invalid grid size');
    }

    // Calculate the positive root
    const r = (-b + Math.sqrt(discriminant)) / (2 * a);

    // Round the result to the nearest integer
    return Math.round(r);
  }

  private calculateOffset(multiplier: number): number {
    const tile = this.grid().toArray()[0];
    const hexSize = tile.isPointy
      ? this.grid().toArray()[0].dimensions.xRadius
      : this.grid().toArray()[0].dimensions.yRadius;
    const radius = this.calculateRadius(this.grid().size);

    return Math.ceil(multiplier * hexSize * radius) * -1;
  }
}
