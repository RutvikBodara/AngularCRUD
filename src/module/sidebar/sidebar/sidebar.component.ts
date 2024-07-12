import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatIconModule} from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button';
import {MatDrawer, MatSidenavModule} from '@angular/material/sidenav';
import { pathToFileURL } from 'url';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatDrawer,MatSidenavModule,MatButtonModule,MatIconModule,MatSlideToggleModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
@Input()
toggler:boolean=true;

@ViewChild('drawer') sideBar :MatDrawer;

ngOnChanges(changes: SimpleChanges) {
  if (changes['toggler']) {
    console.log("toggler changed to", changes['toggler'].currentValue);
    if (this.sideBar) {
      this.toggleDrawer();
    }
  }
}

ngAfterViewInit() {
  // ViewChild is initialized after this lifecycle hook
  if (this.toggler) {
    this.sideBar.open();
  } else {
    this.sideBar.close();
  }
}

toggleDrawer() {
  if (this.toggler) {
    this.sideBar.open();
  } else {
    this.sideBar.close();
  }
}
}
