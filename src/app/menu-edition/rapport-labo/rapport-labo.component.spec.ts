import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportLaboComponent } from './rapport-labo.component';

describe('RapportLaboComponent', () => {
  let component: RapportLaboComponent;
  let fixture: ComponentFixture<RapportLaboComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RapportLaboComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RapportLaboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
