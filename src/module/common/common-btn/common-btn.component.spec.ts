import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonBtnComponent } from './common-btn.component';

describe('CommonBtnComponent', () => {
  let component: CommonBtnComponent;
  let fixture: ComponentFixture<CommonBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonBtnComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommonBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
