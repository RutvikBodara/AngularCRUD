import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-common-btn',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './common-btn.component.html',
  styleUrl: './common-btn.component.css'
})
export class CommonBtnComponent {

  @Input()
  bootstrapcolorClass;

  @Input()
  btnText = "click here";

  @Output()
  btnclicked = new EventEmitter();
  
  @ViewChild("commonBtn") commonBtnRef: ElementRef  
  // ngOnInit(){ 
  // }
  ngAfterViewInit(){
    fromEvent(this.commonBtnRef.nativeElement,"click").subscribe(()=>{
      this.btnclicked.emit(true);
    });
  }
}
