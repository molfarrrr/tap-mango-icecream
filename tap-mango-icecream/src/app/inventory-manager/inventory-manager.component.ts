import { Component } from '@angular/core';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-inventory-manager',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule],
  templateUrl: './inventory-manager.component.html',
  styleUrl: './inventory-manager.component.scss'
})
export class InventoryManagerComponent {

}
