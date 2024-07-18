import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { CommonModule } from '@angular/common';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,RouterOutlet,RouterLink,ContactComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations:[
    trigger("fadeoutanimation",[
      // transition("* => *",[
      //   animate('5s',keyframes([
      //     style({opacity: 1,transform:'scale(1)', offset: 0 },),
      //     style({ opacity: 0.4,transform:'scale(0.7)', offset: 0.5 }),
      //     style({ opacity: 1,transform:'scale(1.1)', offset: 1 })
      //   ])
      // )

      // ]),
      transition(":leave",[
        animate('1s',style({opacity:0}))
      ])
    ])

  ]
})
export class AppComponent {
  title = 'CrudAngular';
  calls :{
    top:number
    left:number
  }[] =[];

  addCallAnimation(event :MouseEvent):void{
    console.log(event.clientY +"  " + event.clientX)
    const newCall ={top:event.clientY, left:event.clientX}
    this.calls.push(newCall);

    setTimeout(() => {
      const index = this.calls.indexOf(newCall);
      if (index !== -1) {
        this.calls.splice(index, 1);
      }
    },5000);
  }
}
