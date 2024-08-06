import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMatComponent } from './product-mat.component';

describe('ProductMatComponent', () => {
  let component: ProductMatComponent;
  let fixture: ComponentFixture<ProductMatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductMatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductMatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
