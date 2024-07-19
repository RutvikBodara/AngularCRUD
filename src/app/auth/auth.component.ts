import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterOutlet,CommonModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css','./auth.component.scss']
})
export class AuthComponent {

}
