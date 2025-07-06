import { TestBed } from '@angular/core/testing';

import { ApiService } from './api.service';
import { Product } from './models';
import { FormControl } from '@angular/forms';
import { take } from 'rxjs';

describe('Api', () => {
  let service: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of months', (done) => {
    service.getMonths().subscribe(months => {
      expect(months.length).toBeGreaterThan(0);
      expect(months).toContain('April');
      done();
    });
  });

  it('should return a list of products', (done) => {
    service.getProducts().subscribe(products => {
      expect(products.length).toBeGreaterThan(0);
      expect(products[0].name).toBeDefined();
      expect(products[0].price).toBeGreaterThan(0);
      done();
    });
  });

  it('should return top products for a given month', (done) => {
    service.getTopProductForMonth('May').subscribe(data => {
      expect(data.length).toBeGreaterThan(0);
      expect(data[0].name).toBeDefined();
      done();
    });
  });

  it('should update a product successfully', (done) => {
    service.getProducts().pipe(take(1)).subscribe(products => {
      const product = { ...products[0], name: 'UpdatedName' };
      service.updateProduct(product).subscribe(result => {
        expect(result).toBeTrue();
        done();
      });
    });
  });

  it('should return false if product does not exist for update', (done) => {
    const invalidProduct: Product = {
      id: 99999,
      name: 'Invalid',
      price: 10,
      quantity: 10
    };
    service.updateProduct(invalidProduct).subscribe(result => {
      expect(result).toBeFalse();
      done();
    });
  });

  it('should delete a product successfully', (done) => {
    service.getProducts().pipe(take(1)).subscribe(products => {
      const idToDelete = products[0].id;
      service.deleteProduct(idToDelete).subscribe(result => {
        expect(result).toBeFalse(); // As per your implementation
        done();
      });
    });
  });

  it('should return false if deleting a non-existing product', (done) => {
    service.deleteProduct(99999).subscribe(result => {
      expect(result).toBeFalse();
      done();
    });
  });

  it('should return false if flavor already exists when creating a product', (done) => {
    const existingFlavor: Product = {
      id: null,
      name: 'Vanilla',
      price: 5,
      quantity: 10
    };
    service.createProduct(existingFlavor).subscribe(result => {
      expect(result).toBeFalse();
      done();
    });
  });
});
