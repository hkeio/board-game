import {
  Component,
  computed,
  input,
  InputSignal,
  output,
  Signal,
} from '@angular/core';
import { Grid, Hex } from 'honeycomb-grid';
import { TileComponent } from './tile/tile.component';

export type HexOption = { cssClasses: string[]; text?: string };

export type GridOptions = {
  [coords: string]: HexOption;
};

export type HexEvent = {
  hex: Hex;
  event: MouseEvent;
};

@Component({
  selector: 'hex-board',
  standalone: true,
  imports: [TileComponent],
  templateUrl: './hex-board.component.html',
  styleUrl: './hex-board.component.scss',
  host: {
    '[style.height]': 'this.grid().pixelHeight + "px"',
    '[style.width]': 'this.grid().pixelWidth + "px"',
  },
})
export class HexBoardComponent {
  grid: InputSignal<Grid<Hex>> = input.required();
  options: InputSignal<GridOptions> = input({});

  clicked = output<HexEvent>();
  hovered = output<HexEvent | null>();

  tiles: Signal<Hex[]> = computed(() => this.grid().toArray());

  private radius = computed(() => this.getRadiusFromSize(this.grid().size));

  left = computed(() => {
    const mostLeftHex = this.grid().getHex([this.radius() * -1, 0]);
    if (!mostLeftHex) {
      return 0;
    }
    return mostLeftHex.x * -1;
  });

  top = computed(() => {
    const topLeftHex = this.grid().getHex([0, this.radius() * -1]);
    if (!topLeftHex) {
      return 0;
    }
    return topLeftHex.y * -1;
  });

  private getHexOption(hex: Hex): HexOption {
    return this.options()[`${hex.q},${hex.r}`];
  }

  getCssClasses(hex: Hex): string {
    const option = this.getHexOption(hex);
    if (!option) {
      return '';
    }
    return option.cssClasses.join(' ');
  }

  getText(hex: Hex): string {
    const option = this.getHexOption(hex);
    if (!option || !option.text) {
      return `${hex.q},${hex.r}`;
    }

    return option.text;
  }

  private getRadiusFromSize(count: number): number {
    if (count === 1) return 0;
    if (count < 1) return -1;

    const discriminant = 9 + 12 * (count - 1);
    const root = Math.sqrt(discriminant);
    const radius = (-3 + root) / 6;

    if (Math.abs(Math.round(radius) - radius) < 1e-10) {
      return Math.round(radius);
    }

    return -1;
  }
}
