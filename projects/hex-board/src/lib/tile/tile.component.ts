import { Component, computed, input } from '@angular/core';
import { Hex } from 'honeycomb-grid';

@Component({
  selector: 'hex-board-tile',
  standalone: true,
  templateUrl: './tile.component.html',
  styleUrl: './tile.component.scss',
  host: {
    '[style.height]': 'hex().height + "px"',
    '[style.width]': 'hex().width + "px"',
    '[style.left]': 'left()',
    '[style.top]': 'top()',
  },
})
export class TileComponent {
  hex = input.required<Hex>();
  text = input<string | null>(null);

  left = computed(() => {
    return this.hex().x + 'px';
  });

  top = computed(() => {
    return this.hex().y + 'px';
  });
}
