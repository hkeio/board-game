import { AfterViewInit, Component, ElementRef, input } from '@angular/core';
import { Svg, SVG } from '@svgdotjs/svg.js';
import { Hex } from 'honeycomb-grid';

@Component({
  selector: 'hex-board-tile',
  standalone: true,
  template: '',
  styleUrl: './tile.component.scss',
})
export class TileComponent implements AfterViewInit {
  hex = input.required<Hex>();

  constructor(private tile: ElementRef) {}

  get x() {
    return Math.sqrt(3) * this.hex().dimensions.xRadius;
  }

  get y() {
    return this.hex().dimensions.yRadius;
  }

  ngAfterViewInit() {
    const svg = SVG()
      .addTo(this.tile.nativeElement)
      .size(this.x, this.y * 2);

    this.renderSVG(svg);
  }

  private getHexCoords(): string {
    return [
      { x: this.x, y: this.y * 0.5 },
      { x: this.x, y: this.y * 1.5 },
      { x: this.x * 0.5, y: this.y * 2 },
      { x: 0, y: this.y * 1.5 },
      { x: 0, y: this.y * 0.5 },
      { x: this.x * 0.5, y: 0 },
    ]
      .map(({ x, y }) => `${x},${y}`)
      .join(' ');
  }

  private renderSVG(svg: Svg) {
    const text = svg
      .plain(`${this.hex().q},${this.hex().r}`)
      .center(
        Math.sqrt(3) * this.hex().dimensions.xRadius * 0.5,
        this.hex().dimensions.yRadius
      );

    const polygon = svg.polygon(this.getHexCoords());

    return svg.add(polygon).add(text);
  }
}
