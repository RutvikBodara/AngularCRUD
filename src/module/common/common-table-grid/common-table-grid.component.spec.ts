import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonTableGridComponent } from './common-table-grid.component';

describe('CommonTableGridComponent', () => {
  let component: CommonTableGridComponent;
  let fixture: ComponentFixture<CommonTableGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonTableGridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommonTableGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
