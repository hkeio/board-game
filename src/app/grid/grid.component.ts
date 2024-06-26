import { JsonPipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostBinding,
  InputSignal,
  Output,
  Signal,
  computed,
  input,
} from '@angular/core';
import { Grid, Hex } from 'honeycomb-grid';
import { TileComponent } from '../tile/tile.component';

export type GridOptions = { [coords: string]: { cssClass: string } };

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [TileComponent, JsonPipe],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
})
export class GridComponent {
  radius: InputSignal<number> = input(3);
  hexSize: InputSignal<number> = input(30);
  grid: InputSignal<Grid<Hex>> = input.required();
  options: InputSignal<GridOptions> = input({});

  @Output() clicked = new EventEmitter<Hex>();

  tiles: Signal<Hex[]> = computed(() => {
    const tiles: Hex[] = [];
    this.grid().forEach((hex) => tiles.push(hex));
    return tiles;
  });
  offset: Signal<number> = computed(() => {
    return Math.floor(Math.sqrt(3) * this.hexSize() * (this.radius() / 2));
  });

  @HostBinding('style.height') get height() {
    return this.grid().pixelHeight + 'px';
  }

  @HostBinding('style.width') get width() {
    return Math.ceil(this.grid().pixelWidth) + 2 + 'px';
  }

  getLeft(hex: Hex): number {
    return hex.corners[3].x - this.offset() + 1;
  }

  getTop(hex: Hex): number {
    return hex.corners[5].y;
  }

  getCssClass(hex: Hex): string {
    return this.options()[`${hex.q},${hex.r}`]?.cssClass || '';
  }
}
