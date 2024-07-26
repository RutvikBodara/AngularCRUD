import { Component, Input, input } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { product } from '../../../../interface/result';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteProductDialogComponent } from './delete-product-dialog/delete-product-dialog.component';


@Component({
  selector: 'app-action-menu',
  standalone: true,
  imports: [],
  templateUrl: './action-menu.component.html',
  styleUrl: './action-menu.component.css'
})
export class ActionMenuComponent {
  params: any;

  constructor(private router :Router,private commonservice :CommonService,private dialog :MatDialog){}
  agInit(params: any): void {
    this.params = params;
  }

  onEditButtonClick(): void {
    // console.log(this.params.data)
    this.commonservice.updateProductDetails(this.params.data)
    this.router.navigate(['/contact/editproduct'])
    // Access row data via this.params.data
    console.log('Row Data:', this.params.data);
    // Or access specific field value
    // console.log('Specific Value:', this.params.data.fieldName);
  }

  openDeleteDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.commonservice.updateProductDetails(this.params.data)
    this.dialog.open(DeleteProductDialogComponent, {
      width: '500px',
      height:'300px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
}
