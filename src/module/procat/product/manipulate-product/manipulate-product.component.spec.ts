import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManipulateProductComponent } from './manipulate-product.component';

describe('ManipulateProductComponent', () => {
  let component: ManipulateProductComponent;
  let fixture: ComponentFixture<ManipulateProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManipulateProductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManipulateProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
