import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  input,
} from '@angular/core';
import { SVG } from '@svgdotjs/svg.js';
import { Hex } from 'honeycomb-grid';

@Component({
  selector: 'hex-board-tile',
  standalone: true,
  template: '',
  styleUrl: './tile.component.scss',
})
export class TileComponent implements AfterViewInit {
  hex = input.required<Hex>();
  text = input<string>();

  svg = SVG();

  constructor(private tile: ElementRef) {
    effect(() => {
      this.svg.clear();
      this.renderSVG();
    });
  }

  get x() {
    return Math.sqrt(3) * this.hex().dimensions.xRadius;
  }

  get y() {
    return this.hex().dimensions.yRadius;
  }

  ngAfterViewInit() {
    this.svg.addTo(this.tile.nativeElement).size(this.x, this.y * 2);

    this.renderSVG();
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

  private renderSVG() {
    const polygon = this.svg.polygon(this.getHexCoords());
    const text = this.text();

    if (text === undefined) {
      return polygon;
    }

    return this.svg.add(
      this.svg
        .plain(text)
        .center(
          Math.sqrt(3) * this.hex().dimensions.xRadius * 0.5,
          this.hex().dimensions.yRadius
        )
    );
  }
}
