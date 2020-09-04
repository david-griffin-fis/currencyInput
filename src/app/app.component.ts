import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  validation_messages = {
    'number': [
      { type: 'min', message: 'Number must be at least 20' },
      { type: 'required', message: 'Number is required' },
      { type: 'max', message: 'Max number is 100' }
    ],
    'companyName': [
      { type: 'minlength', message: 'Must be at least 3 characters' },
      { type: 'required', message: 'Company Name is required' },
      { type: 'maxlength', message: `Must be less than 20 characters` }
    ],
    'annualSales': [
      { type: 'required', message: 'This field is required' },
      { type: 'max', message: 'Max...' },
      { type: 'min', message: 'Min...' },
    ],
  };
  newInput: any;
  submitAttempt = false;
  public testForm: FormGroup;

  valid: false;
  amount = '';
  formattedAmount = '';

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private fb: FormBuilder,

  ) {
    this.initializeApp();
  }

  ngOnInit() {
    this.testForm = this.fb.group({
      number: [null, Validators.compose([Validators.required, Validators.min(20), Validators.max(100)])],
      companyName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(20)])],
      annualSales: [null, Validators.compose([Validators.required, Validators.min(.01), Validators.max(5)])],
    })
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  amountChanged(event: string) {
    this.amount = event;
    this.testForm.get('annualSales').patchValue(event);
    this.testForm.updateValueAndValidity();
    console.log('value: ' + this.testForm.get('annualSales').value);
  }

  getFormattedAmount(event: string) {
    this.formattedAmount = event;
  }

  submit() {
    console.log('form submitted');
    console.log('form: ' + JSON.stringify(this.testForm.value));
    console.log('child form: ' + JSON.stringify(this.testForm.get('annualSales').value));
  }

}
