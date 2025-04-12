import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportPharmacieChroniqueComponent } from './rapport-pharmacie-chronique.component';

describe('RapportPharmacieChroniqueComponent', () => {
  let component: RapportPharmacieChroniqueComponent;
  let fixture: ComponentFixture<RapportPharmacieChroniqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RapportPharmacieChroniqueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RapportPharmacieChroniqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
