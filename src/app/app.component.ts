import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,RouterOutlet,RouterLink,ContactComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'CrudAngular';
}
