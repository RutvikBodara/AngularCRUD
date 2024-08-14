import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryMatComponent } from './category-mat.component';

describe('CategoryMatComponent', () => {
  let component: CategoryMatComponent;
  let fixture: ComponentFixture<CategoryMatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryMatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoryMatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
