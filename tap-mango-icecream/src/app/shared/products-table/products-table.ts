import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  InputSignal,
  OnChanges,
  output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Product } from '../../models';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialog, ConfirmationDialogData } from '../confirmation-dialog/confirmation-dialog';
import { EditDialogData, ProductEditDialog } from '../product-edit-dialog/product-edit-dialog';

@Component({
  selector: 'app-products-table',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatProgressSpinnerModule, MatIconModule, MatButtonModule, MatDialogModule],
  templateUrl: './products-table.html',
  styleUrl: './products-table.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsTable implements AfterViewInit, OnChanges {
  readonly #dialog = inject(MatDialog);

  data: InputSignal<Product[]> = input.required();
  editProduct = output<Product>();
  deleteProduct = output<number>()

  dataSource: MatTableDataSource<Product> = new MatTableDataSource([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  readonly displayColumns: string[] = [
    'name', 'price', 'quantity', 'actions',
  ]

  ngOnChanges({data}: SimpleChanges) {
    if (data) {
      this.dataSource.data = data.currentValue || [];
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  doDeleteProduct(row: Product) {
    this.#dialog.open(ConfirmationDialog, {
      width: '500px',
      data: {
        message: `Would you like to delete "${row.name}" product?`
      } as ConfirmationDialogData
    })
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.deleteProduct.emit(row.id);
        }
      });
  }

  doEditProduct(row: Product) {
    this.#dialog.open(ProductEditDialog, {
      width: '500px',
      data: {
        isEdit: true,
        product: row
      } as EditDialogData
    }).afterClosed()
      .subscribe(x => {
        if (!x) {
          return;
        }

        this.editProduct.emit(x);
      });
  }
}
