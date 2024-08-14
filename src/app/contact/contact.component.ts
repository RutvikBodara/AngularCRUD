import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  input,
  ViewChild,
} from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
  Routes,
} from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { SidebarComponent } from '../../module/sidebar/sidebar/sidebar.component';
import { FilterComponent } from '../../module/filter/filter.component';
import { CommonService } from '../../services/common.service';
import { fromEvent } from 'rxjs';
import { error } from 'console';
import { HeaderComponent } from '../../module/header/header/header.component';
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    FilterComponent,
    SidebarComponent,
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSlideToggleModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    HeaderComponent
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  @ViewChild('drawer') sideBar: MatDrawer;
  @ViewChild('newContact') newContactBtn: ElementRef;
  @ViewChild('logout') logoutBtn: ElementRef;

  loaderVisibility: boolean;
  constructor(
    private router: Router,
    private commonService: CommonService,
    private cdr: ChangeDetectorRef
  ) {}
  onToggle() {
    this.sideBar.toggle();
  }
  ngOnInit() {
  }
  ngAfterViewInit() {
    
    this.commonService.loaderVisibility$.subscribe((res) => {
      this.loaderVisibility = res;
      this.cdr.detectChanges();
    });

    fromEvent(this.newContactBtn.nativeElement, 'click').subscribe((res) => {
      this.commonService.showSnackBar('navigated to create contact page');
    });
    fromEvent(this.logoutBtn.nativeElement, 'click').subscribe(
      (Res) => {
        this.commonService.logout();
        this.router.navigate(['/auth']);
        this.commonService.showSnackBar('Logout Successfull');
      },
      (error) => {
        this.commonService.showSnackBar(error.toString());
      }
    );
  }
  // currentClickedBtn:string ="Dashboard"
  // toggleDiv(value: string) {
  //   // this.currentClickedBtn =div
  //   this.commonService.updatePage(value)
  // }

  // onSearch(value:string){
  // }
}
