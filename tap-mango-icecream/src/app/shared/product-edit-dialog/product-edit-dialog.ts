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
  imports: [ReactiveFormsModule, MatFormFieldModule, MatButtonModule, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle],
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
    name: this.#fb.control({value: '', disabled: this.data.isEdit}, [Validators.required], [this.#api.validateFlavor()]),
    price: this.#fb.control(null, [Validators.required, Validators.min(1)]),
    quantity: this.#fb.control(0, [Validators.required, Validators.min(0)]),
  });

  done() {
    if (this.form.invalid) {
      return;
    }

    this.dialogRef.close({
      ...this.data.product,
      ...this.form.value
    });
  }
}
