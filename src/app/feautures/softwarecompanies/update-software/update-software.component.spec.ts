import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSoftwareComponent } from './update-software.component';

describe('UpdateSoftwareComponent', () => {
  let component: UpdateSoftwareComponent;
  let fixture: ComponentFixture<UpdateSoftwareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateSoftwareComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateSoftwareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
