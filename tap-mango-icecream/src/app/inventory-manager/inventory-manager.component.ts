import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { InventoryManagerStore } from './inventory-manager.store';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductFilter } from '../models';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Spinner } from '../shared/spinner/spinner';
import { MatToolbar } from '@angular/material/toolbar';
import { ProductTableManager } from '../shared/product-table-manager/product-table-manager';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditDialogData, ProductEditDialog } from '../shared/product-edit-dialog/product-edit-dialog';

@Component({
  selector: 'app-inventory-manager',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    Spinner,
    MatToolbar,
    ProductTableManager,
    MatDialogModule
  ],
  templateUrl: './inventory-manager.component.html',
  styleUrl: './inventory-manager.component.scss',
  providers: [
    InventoryManagerStore
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventoryManagerComponent {
  #store = inject(InventoryManagerStore);
  #dialog = inject(MatDialog);
  loading: Signal<boolean> = this.#store.loading;

  readonly productFilter: ProductFilter = ProductFilter.all;

  create() {
    this.#dialog.open(ProductEditDialog, {
      width: '500px',
      data: {
        isEdit: false,
        product: {}
      } as EditDialogData
    }).afterClosed()
      .subscribe(x => {
        if (!x) {
          return;
        }

        this.#store.addProduct(x);
      });
  }
}
