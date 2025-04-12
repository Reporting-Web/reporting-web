import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportOPDComponent } from './rapport-opd.component';

describe('RapportOPDComponent', () => {
  let component: RapportOPDComponent;
  let fixture: ComponentFixture<RapportOPDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RapportOPDComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RapportOPDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
