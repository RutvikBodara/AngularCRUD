import { Component } from '@angular/core';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  constructor(private commonService:CommonService){}
  ngOnInit(){
    this.commonService.updatePage("My Profile")
  }
}
