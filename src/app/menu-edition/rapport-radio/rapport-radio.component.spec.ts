import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportRadioComponent } from './rapport-radio.component';

describe('RapportRadioComponent', () => {
  let component: RapportRadioComponent;
  let fixture: ComponentFixture<RapportRadioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RapportRadioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RapportRadioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
