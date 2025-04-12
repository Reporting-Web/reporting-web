import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportPharmacieNormalComponent } from './rapport-pharmacie-normal.component';

describe('RapportPharmacieNormalComponent', () => {
  let component: RapportPharmacieNormalComponent;
  let fixture: ComponentFixture<RapportPharmacieNormalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RapportPharmacieNormalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RapportPharmacieNormalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
