import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewContactTypeComponent } from './new-contact-type.component';

describe('NewContactTypeComponent', () => {
  let component: NewContactTypeComponent;
  let fixture: ComponentFixture<NewContactTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewContactTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewContactTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
