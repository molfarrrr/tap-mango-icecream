import { AfterViewInit, Component, inject, Signal, viewChild } from '@angular/core';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableModule, MatTable } from '@angular/material/table';
import { InventoryManagerStore } from './inventory-manager.store';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Product } from '../models';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Spinner } from '../shared/spinner/spinner';
import { ProductsTable } from '../shared/products-table/products-table';

@Component({
  selector: 'app-inventory-manager',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatProgressSpinnerModule, MatIconModule, MatButtonModule, Spinner, ProductsTable],
  templateUrl: './inventory-manager.component.html',
  styleUrl: './inventory-manager.component.scss',
  providers: [
    InventoryManagerStore
  ]
})
export class InventoryManagerComponent {
  #store = inject(InventoryManagerStore);

  data: Signal<Product[]> = this.#store.products;
  loading: Signal<boolean> = this.#store.loading;

  editProduct(product: Product) {}

  deleteProduct(product: Product) {

  }
}
