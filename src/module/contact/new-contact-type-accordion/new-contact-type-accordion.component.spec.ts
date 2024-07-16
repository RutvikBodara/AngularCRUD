import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewContactTypeAccordionComponent } from './new-contact-type-accordion.component';

describe('NewContactTypeAccordionComponent', () => {
  let component: NewContactTypeAccordionComponent;
  let fixture: ComponentFixture<NewContactTypeAccordionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewContactTypeAccordionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewContactTypeAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
