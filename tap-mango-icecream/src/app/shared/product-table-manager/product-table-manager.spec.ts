import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTableManager } from './product-table-manager';

describe('ProductTableManager', () => {
  let component: ProductTableManager;
  let fixture: ComponentFixture<ProductTableManager>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductTableManager]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductTableManager);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
