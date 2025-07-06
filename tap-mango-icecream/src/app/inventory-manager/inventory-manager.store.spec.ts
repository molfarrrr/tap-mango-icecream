import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { InventoryManagerStore } from './inventory-manager.store';
import { ApiService } from '../api.service';
import { Product } from '../models';
import { of } from 'rxjs';

describe('InventoryManagerStore', () => {
  let store: InstanceType<typeof InventoryManagerStore>;
  let apiSpy: jasmine.SpyObj<ApiService>;

  const mockProducts: Product[] = [
    { id: 1, name: 'Vanilla', price: 5, quantity: 100 },
    { id: 2, name: 'Chocolate', price: 6, quantity: 30 },
    { id: 3, name: 'Strawberry', price: 5, quantity: 10 },
  ];

  beforeEach(() => {
    const spy = jasmine.createSpyObj<ApiService>('ApiService', [
      'getProducts',
      'updateProduct',
      'createProduct',
      'deleteProduct'
    ]);

    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useValue: spy }
      ]
    });

    apiSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;

    // Default spy responses
    apiSpy.getProducts.and.returnValue(of(mockProducts));
    apiSpy.updateProduct.and.returnValue(of(void 0));
    apiSpy.createProduct.and.returnValue(of(void 0));
    apiSpy.deleteProduct.and.returnValue(of(void 0));

    store =  TestBed.inject(InventoryManagerStore);
  });

  it('should initialize with loading true and products empty', () => {
    expect(store.loading()).toBeTrue();
    expect(store.products()).toEqual([]);
  });

  it('should load products on init and update state', (done) => {
    setTimeout(() => {
      expect(apiSpy.getProducts).toHaveBeenCalled();
      expect(store.products()).toEqual(mockProducts);
      expect(store.loading()).toBeFalse();
      done();
    }, 10);
  });

  it('should correctly compute lowStockProducts', (done) => {
    store.getProduct();

    setTimeout(() => {
      const lowStock = store.lowStockProducts();
      const expected = [...mockProducts.filter(p => p.quantity < 50)].sort();

      expect(lowStock).toEqual(expected);
      done();
    }, 1);
  });

  it('should call updateProduct and reload products', (done) => {
    store.updateProduct({ id: 1, name: 'Updated Vanilla', price: 6, quantity: 90 });

    setTimeout(() => {
      expect(apiSpy.updateProduct).toHaveBeenCalledWith({ id: 1, name: 'Updated Vanilla', price: 6, quantity: 90 });
      expect(apiSpy.getProducts).toHaveBeenCalled();
      done();
    }, 1);
  });

  it('should call addProduct and reload products', (done) => {
    store.addProduct({ id: null, name: 'Mango', price: 7, quantity: 120 });

    setTimeout(() => {
      expect(apiSpy.createProduct).toHaveBeenCalledWith({ id: null, name: 'Mango', price: 7, quantity: 120 });
      expect(apiSpy.getProducts).toHaveBeenCalled();
      done();
    }, 1);
  });

  it('should call deleteProduct and reload products', (done) => {
    store.deleteProduct(2);

    setTimeout(() => {
      expect(apiSpy.deleteProduct).toHaveBeenCalledWith(2);
      expect(apiSpy.getProducts).toHaveBeenCalled();
      done();
    }, 1);
  });

  it('should set loading true during each operation', fakeAsync(() => {
    store.getProduct();
    expect(store.loading()).toBeTrue();
    tick();
    expect(store.loading()).toBeFalse();

    store.addProduct({ id: null, name: 'Test', price: 1, quantity: 1 });
    expect(store.loading()).toBeTrue();
    tick();
    expect(store.loading()).toBeFalse();

    store.updateProduct(mockProducts[0]);
    expect(store.loading()).toBeTrue();
    tick();
    expect(store.loading()).toBeFalse();

    store.deleteProduct(1);
    expect(store.loading()).toBeTrue();
    tick();
    expect(store.loading()).toBeFalse();
  }));
});
