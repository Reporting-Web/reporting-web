import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuEditionComponent } from './menu-edition.component';

describe('MenuEditionComponent', () => {
  let component: MenuEditionComponent;
  let fixture: ComponentFixture<MenuEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuEditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
