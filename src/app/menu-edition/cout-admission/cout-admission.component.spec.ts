import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoutAdmissionComponent } from './cout-admission.component';

describe('CoutAdmissionComponent', () => {
  let component: CoutAdmissionComponent;
  let fixture: ComponentFixture<CoutAdmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoutAdmissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoutAdmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
