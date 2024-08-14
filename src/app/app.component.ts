import { Component } from '@angular/core';
import { Route, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { CommonModule } from '@angular/common';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { CommonService } from '../services/common.service';
import { Subscription } from 'rxjs';

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
        animate('0.05s',style({opacity:0}))
      ])
    ])
  ]
})
export class AppComponent {
  constructor(private router :Router,private commonService:CommonService){}
  title = 'CrudAngular';
  //temporary
  backgoundColor:boolean;
  backgroundUnSubscribe:Subscription;
  calls :{
    top:number
    left:number
  }[] =[];

  ngOnInit(){
    // this.backgroundUnSubscribe = this.commonService.backgroundColor$.subscribe((Res)=>{
    //   this.backgoundColor= Res
    // })
    // console.log("heyyy")
    // console.log(this.commonService.getLocal("jwt"))
    // if(this.commonService.getLocal("jwt") == undefined || this.commonService.getLocal("jwt") == null){
      
    //   this.router.navigate(['auth'])
    // }
  }
  ngOnDestroy(){
    // this.backgroundUnSubscribe.unsubscribe()
  }
  addCallAnimation(event :MouseEvent):void{
    if(window.innerWidth - event.clientX  >15 && window.innerHeight - event.clientY >15){
      const newCall ={top:event.clientY, left:event.clientX}
      this.calls.push(newCall);
      setTimeout(() => {
        const index = this.calls.indexOf(newCall);
        if (index !== -1) {
          this.calls.splice(index, 1);
        }
      },50);
    }
    
  }
}
