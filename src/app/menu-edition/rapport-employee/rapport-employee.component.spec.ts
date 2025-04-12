import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportEmployeeComponent } from './rapport-employee.component';

describe('RapportEmployeeComponent', () => {
  let component: RapportEmployeeComponent;
  let fixture: ComponentFixture<RapportEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RapportEmployeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RapportEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
