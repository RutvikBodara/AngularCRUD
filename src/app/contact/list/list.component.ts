import { Component, QueryList } from '@angular/core';
import { ContactlistComponent } from '../../../module/contact/contactlist/contactlist.component';
import { contact } from '../../../environment/commonValues';
import { HttpClientModule } from '@angular/common/http';
import { ComponentService } from '../../../services/component.service';
import { result } from '../../../interface/result';
@Component({
  selector: 'app-list',
  standalone: true,
  imports: [ContactlistComponent,HttpClientModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {
  contactList:result<string>[];
  constructor(private contactservice:ComponentService){
  }
  ngOnInit(){
    this.contactservice.getContacts<string>().subscribe((response:result<string>[]) => {
      console.log(response)
      this.contactList =response
    });
  }
}
