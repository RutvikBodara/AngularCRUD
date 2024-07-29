import {ChangeDetectionStrategy, Component, computed,signal, input, booleanAttribute} from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatGridListModule} from '@angular/material/grid-list';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { CommonService } from '../../../../services/common.service';
import { CheckboxCellEditor, ComponentSelector } from 'ag-grid-community';
import { ComponentService } from '../../../../services/component.service';
import { APIURL } from '../../../../environment/redirection';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { product, productEdit } from '../../../../interface/result';
import { NewProductComponent } from '../new-product/new-product.component';
import { category, Task } from '../../../../interface/common';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { Conditional } from '@angular/compiler';
import { Sort } from '@angular/material/sort';
import { ContentObserver } from '@angular/cdk/observers';


@Component({
  selector: 'app-manipulate-product',
  standalone: true,
  providers: [provideNativeDateAdapter(),DatePipe],
  imports: [MatCheckboxModule, MatRadioModule, CommonModule, MatButtonModule,MatIconButton, MatFormFieldModule,FormsModule,ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule,MatGridListModule,MatDatepickerModule],
  templateUrl: './manipulate-product.component.html',
  styleUrl: './manipulate-product.component.css'
})
export class ManipulateProductComponent {
  productForm: FormGroup;
  file: File = null;
  url;
  urlInstance;
  categories:category[];
  countryList;
  filename;
  selectedCountry : Sort[] = [];

   task = signal<Task>({
    id:-1,
    name: 'Select All',
    completed: true,
    subtasks: [],
  });

  update(completed: boolean, index?: number) {
    this.task.update(task => {
      if (index === undefined) {
        task.completed = completed;
        task.subtasks?.forEach(t => (t.completed = completed));
      } else {
        task.subtasks![index].completed = completed;
        task.completed = task.subtasks?.every(t => t.completed) ?? true;
      }
      return {...task};
    });
  }
  
  // requestData :product;
  constructor(private router:Router, private datePipe:DatePipe, private fb:FormBuilder,private commonService :CommonService,private componentService :ComponentService){}

  currentProduct :product;
  currentProductUrl :string;
  requestData : productEdit;
  // addSubtasks(subtasks: any[]): void {
  //   const currentTask = this.task();
  //   if (currentTask.subtasks) {
  //     subtasks.forEach(subtask => {
  //       currentTask.subtasks.push({id:subtask.id, name: subtask.name, completed: subtask.completed || false });
  //     });
  //     this.task.set({ ...currentTask });
  //   }
  // }

  checkSubTask(checksubtask:any[]){
    console.log("enter")

    this.componentService.get(APIURL.getCountry).subscribe((res)=>{
      // this.addSubtasks(res)
      
      this.countryList=res
      console.log(this.countryList)

      const currentTask = this.task();
      
      if (currentTask.subtasks) {
      this.countryList.forEach(subtask => {
        console.log(subtask)
        console.log(subtask.id)

        if(checksubtask==null ||  !checksubtask.includes(subtask.id)){
          currentTask.completed =false;
        }
        console.log(subtask)
        currentTask.subtasks.push({id:subtask.id, name: subtask.name, completed: (checksubtask != null &&  checksubtask.includes(subtask.id))? true :false  });
      });
      
      this.task.set({ ...currentTask });
    }

    });

    

    // const currentTask = this.task();
    // if (currentTask.subtasks) {
    //   currentTask.subtasks.forEach(subtask => {
    //     console.log("hey")
    //     if(checksubtask!=null && checksubtask.includes(subtask.id)){
    //       subtask.completed =true;
    //       console.log("he true y")
    //     }
    //   });
    //   this.task.set({ ...currentTask });
    // }

  }
   ngOnInit(){
    this.commonService.updatePage("Edit Products")
    this.commonService.product$.subscribe((value:product)=>{

      if(value == null || value == undefined){
        this.router.navigate(['/contact/product'])
      }
      this.currentProduct = value
      this.checkSubTask(this.currentProduct.countryServed)
    });
    this.getCategory()
    
    console.log(this.currentProduct)
    
     this.productForm = this.fb.group({
      id:[this.currentProduct.id],
      name:[(this.currentProduct != null)? this.currentProduct.name  : '' , [Validators.required,Validators.minLength(2)]],
      description:[(this.currentProduct != null)? this.currentProduct.description  : '' ,[Validators.required , Validators.minLength(10)]],
      categoryId:[(this.currentProduct != null)?  this.currentProduct.categoryId.toString()  : '',[Validators.required]],
      launchDate:[(this.currentProduct != null)? this.stringToDate(this.currentProduct.launchDate)  : '',[Validators.required]],
      lastDate:[(this.currentProduct != null)?  this.stringToDate(this.currentProduct.lastDate)  : '',[Validators.required]],
      file:[this.urlInstance],
      price:[(this.currentProduct != null)?  this.currentProduct.price  : '',[Validators.required]],
      availableForSale:[(this.currentProduct != null && this.currentProduct.availableForSale == true)?  'true'  : 'false',[Validators.required]],
      helplineNumber:[(this.currentProduct != null)? this.currentProduct.helplineNumber  : '',[Validators.required,Validators.minLength(10),Validators.maxLength(10)]],
      countries:this.fb.array([]) 
    },
  )
    this.url=`data:image/jpeg;base64,${this.currentProduct.image}`;
    this.urlInstance=`data:image/jpeg;base64,${this.currentProduct.image}`;
  }

  stringToDate(dateString: string): Date {

    const [day, month, year] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  get countries(): FormArray {
    return this.productForm.get('countries') as FormArray;
  }
  setTaskToCountries(): void {
    // Clear existing countries

    const currentTask = this.task();

    this.countries.clear();

    // Add task data to countries FormArray if it's checked
    if (currentTask.completed) {
      this.countries.push(this.fb.group({
        id:[currentTask.id,Validators.required],
        name: [currentTask.name, Validators.required],
        completed: [currentTask.completed],
      }));
    }
    else{
      // Add subtasks to countries FormArray if they are checked
      currentTask.subtasks.forEach((subtask: any) => {
        if (subtask.completed) {
        this.countries.push(this.fb.group({
          id:[subtask.id,Validators.required],
          name: [subtask.name, Validators.required],
          completed: [subtask.completed],
          }));
        }
      });
    }
  }
  onFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.file= event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.filename = this.file.name
        this.url = (<FileReader>event.target).result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  getCategory(){
    this.componentService.get<string>(APIURL.getCategory).subscribe(
      (res)=>{
        this.categories=res.responseData
      }
    )
  }
  removefile(){
    this.productForm.get('file').setValue(null);
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
      this.filename=undefined
      this.url=this.urlInstance;
      console.log(this.url)
    }
  }

  
  async onSubmit(){
    this.setTaskToCountries();
    console.log(this.productForm.value)
    console.log(this.productForm.valid)
    var data = this.productForm.value;
    const formattedLaunchDate = this.datePipe.transform(data.launchDate, 'dd-MM-YYYY');
    const formattedLastDate = this.datePipe.transform(data.lastDate, 'dd-MM-YYYY');
    const checkedSubtasks = data.countries.filter((subtask: any) => subtask.completed);
    
    for (let i = 0; i < checkedSubtasks.length; i++) {
      console.log(checkedSubtasks[i])
      console.log(checkedSubtasks.length  +"   "+ checkedSubtasks[i].id)
      if(checkedSubtasks[i].id == -1 )
      {
          this.selectedCountry.push(checkedSubtasks[i].id)
          break;
      }
      else{
        this.selectedCountry.push(checkedSubtasks[i].id)
      }
    }
    if(data.lastDate < data.launchDate){
      this.commonService.showSnackBar("last date must be greater than launch date")
      return false;
    }
    if(this.productForm.valid){

      const base64File:string=this.file? await this.getBase64(this.file) : null;
      this.requestData = {
        id:data.id,
        name :data.name,
        description:data.description,
        categoryId:data.categoryId,
        helplineNumber:data.helplineNumber,
        lastDate:formattedLastDate,
        launchDate:formattedLaunchDate,
        availableForSale: data.availableForSale.toLowerCase() === 'true' ,
        price:data.price,
        file:base64File?base64File.split(',')[1]:null,
        countryServed:this.selectedCountry
      }
      
      console.log(this.requestData)
      this.postEditProduct()
    }
    return true;
  }
  
  postEditProduct(){
    this.componentService.updateProduct(this.requestData,APIURL.editProduct).subscribe((res)=>{
      if(res.code == 100){
        this.router.navigate(['contact/product'])
        this.commonService.showSnackBar("product edited")
      }
      else{
        this.commonService.showSnackBar(res.message.toString())
      }
    });
  }
  getBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
  }
}



