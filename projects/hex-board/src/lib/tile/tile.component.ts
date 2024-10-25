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
  text = input<string | null>(null);

  svg = SVG();

  constructor(private tile: ElementRef<HTMLElement>) {
    effect(() => {
      this.svg.clear();
      this.renderText();
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
    this.renderText();

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

  private renderText(): void {
    this.tile.nativeElement
      .querySelectorAll('div')
      .forEach((el) => el.remove());

    const text = this.text();

    if (text === null || text === undefined || text === '') {
      return;
    }

    const div = document.createElement('div');
    div.innerText = text;

    this.tile.nativeElement.prepend(div);
  }

  private renderSVG() {
    return this.svg.polygon(this.getHexCoords());
  }
}
