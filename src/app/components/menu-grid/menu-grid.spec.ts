import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuGrid } from './menu-grid';

describe('MenuGrid', () => {
  let component: MenuGrid;
  let fixture: ComponentFixture<MenuGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuGrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
