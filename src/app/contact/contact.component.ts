import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Routes } from '@angular/router';
import { EditComponent } from './edit/edit.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule,RouterOutlet,RouterLink,RouterLinkActive,EditComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {

}
