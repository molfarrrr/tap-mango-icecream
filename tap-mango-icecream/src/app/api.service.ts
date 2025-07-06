import { Injectable } from '@angular/core';
import { Product, TopProduct } from './models';
import { catchError, debounceTime, delay, distinctUntilChanged, Observable, of, switchMap } from 'rxjs';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  #data: Product[] = [];
  #dataMap: Record<number, Product> = {};

  readonly #flavors = [
    'Vanilla', 'Chocolate', 'Strawberry', 'Mint', 'Cookies', 'Cream', 'Rocky Road',
    'Butter Pecan', 'Mango', 'Pistachio', 'Coffee', 'Banana', 'Lemon', 'Raspberry',
    'Peach', 'Caramel', 'Cookie Dough', 'Blueberry', 'Matcha', 'Cherry', 'Hazelnut',
    'Coconut', 'Tiramisu', 'Apple Pie', 'Maple', 'Chai', 'Pumpkin', 'Blackberry',
    'Lychee', 'Ginger', 'Green Tea', 'Orange Cream', 'Salted Caramel', 'Rum Raisin',
    'Almond', 'S’mores', 'Cinnamon', 'Honeycomb', 'Bubblegum', 'Watermelon', 'Kiwi',
    'Toffee', 'Cranberry', 'Yogurt', 'Macadamia', 'Pineapple', 'Espresso', 'Plum',
    'Marshmallow', 'Fig'
  ];

  #largestID: number = this.#flavors.length;

  #topProductsByMonth: Record<string, TopProduct[]> = {
    'April': [
      {
        name: 'Pistachio',
        quantity: 734
      },
      {
        name: 'Bubblegum',
        quantity: 845
      },
      {
        name: 'Espresso',
        quantity: 477
      },
      {
        name: 'Matcha',
        quantity: 534
      },
      {
        name: 'Watermelon',
        quantity: 768
      }
    ],
    'May': [
      {
        name: 'Caramel',
        quantity: 1634
      },
      {
        name: 'Yogurt',
        quantity: 345
      },
      {
        name: 'Macadamia',
        quantity: 777
      },
      {
        name: 'Honeycomb',
        quantity: 1534
      },
      {
        name: 'Watermelon',
        quantity: 768
      }
    ],
    'June': [
      {
        name: 'Mango',
        quantity: 1234
      },
      {
        name: 'Lemon',
        quantity: 445
      },
      {
        name: 'Cookie Dough',
        quantity: 999
      },
      {
        name: 'Watermelon',
        quantity: 1434
      },
      {
        name: 'Fig',
        quantity: 768
      }
    ],
    'July': [
      {
        name: 'Strawberry',
        quantity: 234
      },
      {
        name: 'Blueberry',
        quantity: 45
      },
      {
        name: 'Vanilla',
        quantity: 199
      },
      {
        name: 'Watermelon',
        quantity: 34
      },
      {
        name: 'Coconut',
        quantity: 68
      }
    ]
  };

  constructor() {
    this.#flavors.forEach((name, index) => {
      const product = {
        id: index + 1,
        name,
        price: this.#getRandomPrice(),
        quantity: this.#getRandomQuantity()
      };

      this.#data.push(product);
      this.#dataMap[index] = product;
    })
  }

  getProducts(): Observable<Product[]> {
    return of(JSON.parse(JSON.stringify(this.#data))).pipe(delay(500));
  }

  updateProduct(product: Product): Observable<boolean> {
    if (!this.#dataMap[product.id]) {
      return of(false).pipe(delay(500));
    }

    this.#dataMap[product.id] = {...product};

    return of(true).pipe(delay(500))
  }

  deleteProduct(id: number): Observable<boolean> {
    if (!this.#dataMap[id]) {
      return of(false).pipe(delay(500));
    }

    delete this.#dataMap[id];
    const index = this.#data.findIndex(x => x.id === id);
    this.#data.splice(index, 1);

    return of(false).pipe(delay(500));
  }

  createProduct(newProduct: Product): Observable<boolean> {
    if (this.#flavors.includes(newProduct.name)) {
      return of(false).pipe(delay(500));
    }
    this.#largestID++;

    const product: Product = {
      id: this.#largestID,
      name: newProduct.name,
      price: newProduct.price,
      quantity: newProduct.quantity,
    };

    this.#flavors.push(product.name);
    this.#dataMap[product.id] = product;
    this.#data.push(product);

    return of(false).pipe(delay(500));
  }

  getTopProductForMonth(month: number): Observable<TopProduct[]> {
    return of(this.#topProductsByMonth[month]).pipe(delay(500));
  }

  validateFlavor(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors  | null> => {
      if (!control.value) {
        return null;
      }

      return control.valueChanges.pipe(
        debounceTime(500), // Debounce to prevent excessive API calls
        distinctUntilChanged(), // Only emit when value changes
        switchMap(value => this.#flavorExists(value)),
        map(exists => (exists ? { uniqueNameError: true } : null)),
        catchError(() => of(null)) // Handle errors gracefully
      );
    }
  }

  #getRandomPrice(): number {
    return parseFloat((Math.random() * 5 + 2).toFixed(2)); // $2.00 - $7.00
  }

  #getRandomQuantity(): number {
    return Math.floor(Math.random() * 201); // 0 - 200
  }

  #flavorExists(flavor: string): Observable<boolean> {
    return of (this.#flavors.includes(flavor));
  }
}
