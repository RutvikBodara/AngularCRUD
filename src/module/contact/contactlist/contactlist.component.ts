import { CommonModule } from '@angular/common';
import { Component, Input, QueryList } from '@angular/core';
import { contact } from '../../../environment/commonValues';
import { result } from '../../../interface/result';

@Component({
  selector: 'app-contactlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contactlist.component.html',
  styleUrl: './contactlist.component.css'
})
export class ContactlistComponent {
  @Input()
  contactList:result<string>[]=undefined;
}
