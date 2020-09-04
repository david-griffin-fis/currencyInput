import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  numberMax = 100;
  numberMin = 20;

  companyNameMaxLength = 20;
  companyNameMinLength = 3;

  annualSalesMax = 50000;
  annualSalesMin = 100;
  validation_messages = {
    'number': [
      { type: 'min', message: 'Minimum Number is: ' + this.numberMin },
      { type: 'required', message: 'Number is required' },
      { type: 'max', message: 'Max number is: ' + this.numberMax }
    ],
    'companyName': [
      { type: 'minlength', message: 'Must be at least 3 characters' },
      { type: 'required', message: 'Company Name is required' },
      { type: 'maxlength', message: `Must be less than 20 characters` }
    ],
    'annualSales': [
      { type: 'required', message: 'This field is required' },
      { type: 'max', message: 'Max annual sales are: $' + this.annualSalesMax},
      { type: 'min', message: 'Min annual sales are: $' + this.currencyPipe.transform(this.annualSalesMin) },
    ],
  };
  newInput: any;
  submitAttempt = false;
  public testForm: FormGroup;

  valid: false;
  amount = '';
  // formattedAmount = '';

  constructor(
    private currencyPipe: CurrencyPipe,
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
      annualSales: [null, Validators.compose([Validators.required, Validators.min(this.annualSalesMin), Validators.max(this.annualSalesMax)])],
    })
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  amountChanged(event: string) {
    console.log('amountChanged(): ' + event);
    this.amount = event;
    this.testForm.get('annualSales').patchValue(event);
    this.testForm.updateValueAndValidity();
    // console.log('value: ' + this.testForm.get('annualSales').value);
  }

  submit() {
    console.log('form: ' + JSON.stringify(this.testForm.value));
  }

  showFormValues() { 
    console.log(JSON.stringify(this.testForm.value))
  }

  getErrorList(errorObject) {
    return Object.keys(errorObject);
  }


}
