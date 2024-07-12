import { Component, EventEmitter, Input, Output } from '@angular/core';
import {MatIconModule} from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button';
import {MatDrawer, MatSidenavModule} from '@angular/material/sidenav';
import { SidebarComponent } from '../../module/sidebar/sidebar/sidebar.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { INPUT_MODALITY_DETECTOR_DEFAULT_OPTIONS } from '@angular/cdk/a11y';
@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [MatFormFieldModule,MatInputModule,MatIconModule,MatButtonModule,MatDrawer,MatSidenavModule,SidebarComponent],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent {

  @Input()
  currentPage:string;
  @Output()
  sideBarToggle :EventEmitter<boolean> = new EventEmitter<boolean>(true)
  
  ngOnInit(){
    this.sideBarToggle.emit()
  }
  onClickToggle(){
    this.sideBarToggle.emit()
  }
}
