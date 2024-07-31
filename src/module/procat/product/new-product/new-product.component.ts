import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  input,
  viewChild,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import {
  AbstractControl,
  Form,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { CommonService } from '../../../../services/common.service';
import { ComponentSelector } from 'ag-grid-community';
import { ComponentService } from '../../../../services/component.service';
import { APIURL } from '../../../../environment/redirection';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { product } from '../../../../interface/result';
import { category, Task } from '../../../../interface/common';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UndoRedoEditModule } from 'ag-grid-community/dist/types/core/edit/editModule';
import { lstat } from 'node:fs';
import { exhaustMap, fromEvent, of } from 'rxjs';

@Component({
  selector: 'app-new-product',
  standalone: true,
  providers: [provideNativeDateAdapter(), DatePipe],
  imports: [
    MatCheckboxModule,
    MatRadioModule,
    CommonModule,
    MatButtonModule,
    MatIconButton,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatGridListModule,
    MatDatepickerModule,
  ],
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.css',
})
export class NewProductComponent {
  productForm: FormGroup;
  file: File | null = null;
  filename;
  url;
  @ViewChild('newProductForm') form: ElementRef;
  @ViewChild('fileInput') selectedFile: ElementRef;
  categories: category[];
  task = signal<Task>({
    id: -1,
    name: 'Select All',
    completed: false,
    subtasks: [],
  });

  // readonly partiallyComplete = computed(() => {
  //   const task = this.task();
  //   if (!task.subtasks) {
  //     return false;
  //   }
  //   return task.subtasks.some(t => t.completed) && !task.subtasks.every(t => t.completed);
  // });

  // ngAfterViewInit(){
  //   fromEvent(this.form.nativeElement,'submit').pipe(exhaus).subscribe()
  // }
  update(completed: boolean, index?: number) {
    this.task.update((task) => {
      if (index === undefined) {
        task.completed = completed;
        task.subtasks?.forEach((t) => (t.completed = completed));
      } else {
        task.subtasks![index].completed = completed;
        task.completed = task.subtasks?.every((t) => t.completed) ?? true;
      }
      return { ...task };
    });
  }

  // requestData :product;
  constructor(
    private router: Router,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private commonService: CommonService,
    private componentService: ComponentService
  ) {}

  addSubtasks(subtasks: any[]): void {
    const currentTask = this.task();
    if (currentTask.subtasks) {
      subtasks.forEach((subtask) => {
        console.log(subtask.id);
        currentTask.subtasks.push({
          id: subtask.id,
          name: subtask.name,
          completed: subtask.completed || false,
        });
        console.log(currentTask.subtasks);
      });
      this.task.set({ ...currentTask });
    }
  }
  ngOnInit() {
    this.componentService.get(APIURL.getCountry).subscribe((res) => {
      console.log(res);
      this.addSubtasks(res);
    });

    this.commonService.updatePage('Add Products');
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      categoryId: ['', [Validators.required]],
      launchDate: ['', [Validators.required]],
      lastDate: ['', [Validators.required]],
      file: [null, [Validators.required]],
      availableForSale: ['true'],
      price: ['', [Validators.required]],
      helplineNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      countries: this.fb.array([]),
    });
    this.getCategory();
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
      this.countries.push(
        this.fb.group({
          id: [currentTask.id, Validators.required],
          name: [currentTask.name, Validators.required],
          completed: [currentTask.completed],
        })
      );
    } else {
      // Add subtasks to countries FormArray if they are checked
      currentTask.subtasks.forEach((subtask: any) => {
        if (subtask.completed) {
          this.countries.push(
            this.fb.group({
              id: [subtask.id, Validators.required],
              name: [subtask.name, Validators.required],
              completed: [subtask.completed],
            })
          );
        }
      });
    }
  }

  getCategory() {
    this.componentService.get<string>(APIURL.getCategory).subscribe((res) => {
      this.categories = res.responseData;
    });
  }
  fileValidator(control: AbstractControl) {
    const file = control.value;
    if (file) {
      const isValidFile = file.type.startsWith('image/');
      return isValidFile ? null : { invalidFileType: true };
    }
    return null;
  }
  onFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.file = event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.filename = this.file.name;
        this.url = (<FileReader>event.target).result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  removefile() {
    this.productForm.get('file').setValue(null);
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
      this.filename = undefined;
      this.url = undefined;
    }
  }
  onSubmit() {
    this.setTaskToCountries();

    if (this.productForm.valid) {
      const data = this.productForm.value;
      // console.log(data)

      if (data.lastDate < data.launchDate) {
        this.commonService.showSnackBar(
          'last date must be grater than launch date'
        );
        return false;
      }
      const formData = new FormData();
      Object.keys(this.productForm.controls).forEach((key) => {
        if (key != 'launchDate' && key != 'lastDate' && key != 'countries') {
          formData.append(key, this.productForm.get(key)?.value);
        }
      });

      if (this.file) {
        formData.append('file', this.file, this.file.name);
      }
      const formattedDate = this.datePipe.transform(
        data.launchDate,
        'dd-MM-YYYY'
      );
      const formValue = this.productForm.value;
      console.log(formValue);
      const checkedSubtasks = formValue.countries.filter(
        (subtask: any) => subtask.completed
      );
      const lastFormattedDate = this.datePipe.transform(
        data.lastDate,
        'dd-MM-YYYY'
      );
      formData.append('launchDate', formattedDate);
      formData.append('lastDate', lastFormattedDate);
      // checkedSubtasks.forEach((subtask: any, index: number) => {

      console.log(checkedSubtasks);
      console.log('ehfu');
      for (let i = 0; i < checkedSubtasks.length; i++) {
        console.log(checkedSubtasks[i]);
        if (checkedSubtasks[i].id == -1) {
          formData.append(`countries[${i}].id`, checkedSubtasks[i].id);
          break;
        } else {
          formData.append(`countries[${i}].id`, checkedSubtasks[i].id);
        }
      }
      // this.requestData={
      //   name : data.name,
      //   description:data.description,
      //   helplineNumber:data.helplineNumber,
      //   launchDate:formattedDate,
      //   categoryId:data.categoryId,
      //   file:data.file
      // }
      this.addProduct(formData);
    }
    return true;
  }

  addProduct(data) {
    this.componentService
      .add<string>(data, APIURL.AddProduct)
      .pipe(
        exhaustMap((res) => {
          return of(res);
        })
      )
      .subscribe((res) => {
        if (res.code == 100) {
          this.commonService.showSnackBar('product added successfully');
          this.router.navigate(['/contact/product']);
        } else {
          this.commonService.showSnackBar(res.message);
        }
      });
  }
  readUrl(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.url = (<FileReader>event.target).result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }
}
