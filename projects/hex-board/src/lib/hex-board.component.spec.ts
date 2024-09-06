import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HexBoardComponent } from './hex-board.component';

describe('HexBoardComponent', () => {
  let component: HexBoardComponent;
  let fixture: ComponentFixture<HexBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HexBoardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HexBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
