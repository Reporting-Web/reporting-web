import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuPharmacieComponent } from './menu-pharmacie.component';

describe('MenuPharmacieComponent', () => {
  let component: MenuPharmacieComponent;
  let fixture: ComponentFixture<MenuPharmacieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuPharmacieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuPharmacieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
