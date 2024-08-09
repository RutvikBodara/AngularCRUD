import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ComponentService } from '../../services/component.service';
import { routes } from './auth.route';
import { CommonService } from '../../services/common.service';
@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterOutlet,CommonModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css','./auth.component.scss']
})
export class AuthComponent {
  constructor(private router:Router ,private componentService:ComponentService,private commonService :CommonService){}
  ngOnInit(){
    console.log("auth hitted")
  }
  ngAfterViewInit(){
    
  }
}
