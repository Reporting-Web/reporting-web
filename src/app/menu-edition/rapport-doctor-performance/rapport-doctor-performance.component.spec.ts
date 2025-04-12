import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportDoctorPerformanceComponent } from './rapport-doctor-performance.component';

describe('RapportDoctorPerformanceComponent', () => {
  let component: RapportDoctorPerformanceComponent;
  let fixture: ComponentFixture<RapportDoctorPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RapportDoctorPerformanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RapportDoctorPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
