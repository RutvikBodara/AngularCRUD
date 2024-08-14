import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { ComponentService } from '../../../services/component.service';
import { fromEvent, Subscription } from 'rxjs';
import { APIURL } from '../../../environment/redirection';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  genericResponeDemo,
  myProfile,
  updateProfileRequest,
} from '../../../interface/result';
import { isEqual } from 'lodash'; // Import lodash's isEqual function for deep comparison

@Component({
  selector: 'app-profile',
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
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  ProfileForm: FormGroup;
  productSubscription: Subscription;
  profileDetails: myProfile;
  fieldsetDisabled: boolean = false;
  hiddenValue: boolean = true;
  isFormChanged: boolean =false;
  RequestData: updateProfileRequest;
  @ViewChild('editBtns') editBtnClick: ElementRef;
  @ViewChild('resetBtn') resetBtnClick: ElementRef;

  constructor(
    private router: Router,

    private fb: FormBuilder,
    private commonService: CommonService,
    private componentService: ComponentService
  ) {}

  ngOnInit() {
    this.commonService.updatePage('My Profile');
    //get profile details
    this.callData();
  }

  checkFormChanges(): void {
    console.log(this.ProfileForm.dirty);
    this.isFormChanged = this.ProfileForm.dirty;
  }
  // ngAfterViewInit() {
  //   fromEvent(this.resetBtnClick.nativeElement, 'click').subscribe((Res) => {
  //     this.callData;
  //   });
  // }

  hideToggle(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    this.hiddenValue = !this.hiddenValue;
    this.fieldsetDisabled = !this.fieldsetDisabled;
  }
  callData() {
    this.componentService
      .get(
        APIURL.myProfile,
        null,
        null,
        Number(this.commonService.getLocal('AccountId').split('"')[3])
      )
      .subscribe((res: genericResponeDemo<myProfile>) => {
        this.profileDetails = res.responseData;
        this.addDetails();
      });
  }
  resetToggle(event: Event) {
    event.preventDefault();
    if (this.isFormChanged) {
      this.isFormChanged =false
      this.callData();
    }
    this.hideToggle();
  }
  addDetails() {
    this.ProfileForm = this.fb.group({
      username: [
        this.profileDetails != null ? this.profileDetails.username : '',
        [Validators.required, Validators.minLength(2)],
      ],
      firstname: [
        this.profileDetails != null ? this.profileDetails.firstname : '',
        [Validators.required],
      ],
      lastname: [
        this.profileDetails != null ? this.profileDetails.lastname : '',
        [Validators.required],
      ],
      emailid: [
        this.profileDetails != null ? this.profileDetails.emailid : '',
        [Validators.required, Validators.email],
      ],
      createddate: [
        this.profileDetails != null ? this.profileDetails.createddate : '',
        [Validators.required],
      ],
    });

    this.onCreateGroupFormValueChange();
  }

  onCreateGroupFormValueChange() {
    const initialValue = this.ProfileForm.value;
    this.ProfileForm.valueChanges.subscribe((value) => {
      this.isFormChanged = !isEqual(initialValue, this.ProfileForm.value);
    });
  }
  onSubmit() {
    if (!this.isFormChanged) {
      this.commonService.showAlert(
        'no changes found',
        'please change some of the fields',
        'error'
      );
      return false;
    }
    else if (this.ProfileForm.valid) {
      const formData = this.ProfileForm.value;
      this.RequestData = {
        FirstName: formData.firstname,
        LastName: formData.lastname,
        UserName: formData.username,
        Email: formData.emailid,
        Id: Number(this.commonService.getLocal('AccountId').split('"')[3]),
      };
      console.log(this.RequestData);
      this.componentService
        .update(this.RequestData, APIURL.updateProfile)
        .subscribe(
          (Res) => {
            if (Res.code == 100) {
              this.commonService.showAlert(
                'Profile Data Updated!',
                Res.message.toString(),
                'success'
              );
              this.isFormChanged =false
            } else {
              this.commonService.showAlert(
                'Something Went Wrong!',
                Res.message.toString(),
                'error'
              );
            }
            this.hideToggle();
          },
          (error) => {
            this.commonService.showSnackBar(error.toString());
          }
        );

      return true;
    }
    return false;
  }
}
