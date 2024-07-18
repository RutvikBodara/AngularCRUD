import { CommonModule } from '@angular/common';
import { Component, ElementRef, input, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, Routes } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatIconModule} from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button';
import {MatDrawer, MatSidenavModule} from '@angular/material/sidenav';
import { SidebarComponent } from '../../module/sidebar/sidebar/sidebar.component';
import { FilterComponent } from '../../module/filter/filter.component';
import { CommonService } from '../../services/common.service';
import { fromEvent } from 'rxjs';
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FilterComponent,SidebarComponent,CommonModule,RouterOutlet,RouterLink,RouterLinkActive,MatSlideToggleModule,MatIconModule,MatButtonModule,MatSidenavModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  @ViewChild('drawer') sideBar :MatDrawer;
  @ViewChild('newContact') newContactBtn : ElementRef;

  constructor(private router :Router, private commonService :CommonService){}
  onToggle(){
    this.sideBar.toggle();
  }
  ngAfterViewInit(){
    fromEvent(this.newContactBtn.nativeElement,"click").subscribe((res)=>{
      this.commonService.showSnackBar("navigated to create contact page")
    })
  }
  // currentClickedBtn:string ="Dashboard"
  // toggleDiv(value: string) {
  //   // this.currentClickedBtn =div
  //   this.commonService.updatePage(value)
  // }

  // onSearch(value:string){
  // }
}