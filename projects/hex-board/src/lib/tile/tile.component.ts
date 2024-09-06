import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { SVG, Svg } from '@svgdotjs/svg.js';
import { Hex } from 'honeycomb-grid';

@Component({
  selector: 'hex-board-tile',
  standalone: true,
  template: '',
  styleUrl: './tile.component.scss',
})
export class TileComponent implements AfterViewInit {
  @Input() hex!: Hex;

  @Output() clicked = new EventEmitter<Hex>();

  @HostListener('click') onClick() {
    this.clicked.emit(this.hex);
  }

  private draw!: Svg;
  private x!: number;
  private y!: number;

  constructor(private tile: ElementRef) {}

  ngAfterViewInit() {
    this.y = this.hex.dimensions.yRadius;
    this.x = Math.sqrt(3) * this.hex.dimensions.xRadius;

    this.draw = SVG()
      .addTo(this.tile.nativeElement)
      .size(this.x, this.y * 2);

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
    const text = this.draw
      .plain(`${this.hex.q},${this.hex.r}`)
      .center(
        Math.sqrt(3) * this.hex.dimensions.xRadius * 0.5,
        this.hex.dimensions.yRadius
      );

    const polygon = this.draw.polygon(this.getHexCoords());

    return this.draw.add(polygon).add(text);
  }
}
