import { Component } from '@angular/core';
import { DeleteCategoryComponent } from './delete-category/delete-category.component';
import { Route, Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { EditCategoryComponent } from '../edit-category/edit-category.component';

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
    this.commonservice.updateCategory(this.params.data)
    this.openEditDialog('0ms','0ms')
    // Access row data via this.params.data
    console.log('Row Data:', this.params.data);
  }

  openDeleteDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.commonservice.updateCategory(this.params.data)
    console.log(this.params.data)
    this.dialog.open(DeleteCategoryComponent, {
      width: '500px',
      height:'300px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  openEditDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.commonservice.updateProductDetails(this.params.data)
    this.dialog.open(EditCategoryComponent, {
      width: '500px',
      height:'500px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
}
