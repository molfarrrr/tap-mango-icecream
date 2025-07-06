import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../api.service';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent, MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { Product } from '../../models';
import { MatInput } from '@angular/material/input';

export interface EditDialogData {
  product: Product;
  isEdit: boolean;
}

interface EdictProductForm {
  name: FormControl<string>;
  price: FormControl<number>;
  quantity: FormControl<number>;
}

@Component({
  selector: 'app-product-edit-dialog',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatButtonModule, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle, MatInput],
  templateUrl: './product-edit-dialog.html',
  styleUrl: './product-edit-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductEditDialog {
  readonly #fb = inject(FormBuilder);
  readonly #api = inject(ApiService);
  readonly data: EditDialogData = inject<EditDialogData>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<ProductEditDialog>);

  form: FormGroup<EdictProductForm> = this.#fb.group<EdictProductForm>({
    name: this.#fb.control({value: this.data.product.name, disabled: this.data.isEdit}, [Validators.required], [this.#api.validateFlavor()]),
    price: this.#fb.control(this.data.product.price || 0, [Validators.required, Validators.min(1)]),
    quantity: this.#fb.control(this.data.product.quantity || 0, [Validators.required, Validators.min(0)]),
  });

  done() {
    this.form.updateValueAndValidity({ emitEvent: true });
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.dialogRef.close({
      ...this.data.product,
      ...this.form.value
    });
  }
}
