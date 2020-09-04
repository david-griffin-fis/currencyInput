import { Component, OnInit, ViewChild, Input, Output, EventEmitter, Self } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { CurrencyPipe } from '@angular/common';
import { NgControl, FormControl, Validators, ControlValueAccessor, NG_VALUE_ACCESSOR, FormBuilder, FormGroup } from '@angular/forms';
import { ValueAccessor } from '@ionic/angular/directives/control-value-accessors/value-accessor';
import { __values } from 'tslib';
// import { Validator } from '@angular/forms';

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: NumberInputComponent, 
    multi: true
  }]
})
export class NumberInputComponent implements OnInit, ControlValueAccessor {

  formattedLength: number;
  // valid = false
  newFormattedLength: number;
  trimmedValue: string;
  trimmedLength: number
  // private static MAX_LENGTH: number = 12;

  private static BACKSPACE_KEY = 'Backspace';
  private static BACKSPACE_INPUT_TYPE = 'deleteContentBackward';

  @ViewChild('dummyFacade', { static: false }) private dummyFacade: IonInput;

  // number of decimal places - doesn't work very well right now. 
  // anything beyond 2 is hidden...
  @Input() precision: number;

  // amount the user entered
  @Input() amount: string;

  // max digits the number can be
  @Input() MAX_LENGTH: number;

  // smallest valid number
  @Input() min: number;

  // largest valid number
  @Input() max: number;

  // name of the field that will be dispalyed on error messages, or any
  // other user facing display
  @Input() fieldDisplay: string;

  @Input() form: FormGroup;

  @Output() amountEntered = new EventEmitter<number>();

  @Output() newFormattedAmount = new EventEmitter<number>();


  // sends back validity to parent component
  @Output() validity = new EventEmitter<boolean>();

  // sends back errorMessage to parent component
  @Output() errorMessage = new EventEmitter<string>();

  constructor(
    private fb: FormBuilder,
    private currencyPipe: CurrencyPipe,
    @Self() public ngControl: NgControl
  ) {
    this.ngControl.valueAccessor = this;
  }

  test: any;
  validation_messages: any;

  ngOnInit() {
    this.form.addControl('ngControl', new FormControl('', Validators.compose([Validators.required, Validators.min(this.min), Validators.max(this.max)])))
    this.test = this.max;
    this.validation_messages = {
      ngControl: [
        // { type: 'required', message: 'This field is required' },
        // { type: 'max', message: 'max value: ' + this.test },
        // { type: 'min', message: 'Min...' },
      ]
    };

    if (this.amount && this.amount.trim() !== '') {
      this.amountEntered.emit(+this.amount);
    }


    console.log('number-input.component.ts oninit');
    console.log('max: ' + this.max);
    console.log('min: ' + this.min);
    console.log('precision: ' + this.precision);
  
  }

  handleKeyUp(event: KeyboardEvent) {
    // this handles keyboard input for backspace
    if (event.key === NumberInputComponent.BACKSPACE_KEY) {
      this.delDigit();
    }
  }

  handleInput(event: CustomEvent) {
    this.clearInput();
    // check if digit
    if (event.detail.data && !isNaN(event.detail.data)) {
      this.addDigit(event.detail.data);
    } else if (event.detail.inputType === NumberInputComponent.BACKSPACE_INPUT_TYPE) {
      // this handles numpad input for delete/backspace
      this.delDigit();
    }
  }

  private addDigit(key: string) {
    const newAmount = this.amount + key;
    if (this.amount.length >= this.MAX_LENGTH) {
      return;
    }
    else {
      this.amount = this.amount + key;
      this.amountEntered.emit(+this.amount);
      this.checkValidity();
      this.checkErrorMessage();
    }
  }

  private delDigit() {
    this.amount = this.amount.substring(0, this.amount.length - 1);
    this.amountEntered.emit(+this.amount);
  }

  private clearInput() {
    this.dummyFacade.value = ""; // ensures work for mobile devices
    // ensures work for browser
    this.dummyFacade.getInputElement().then((native: HTMLInputElement) => {
      native.value = "";
    });
  }

  get formattedAmount(): string {
    return this.currencyPipe.transform(+this.amount / Math.pow(10, this.precision));
  }

  getTrimmedValue(): string {
    // let newAmount: string = this.formattedAmount.replace(/$/,'').replace(/,/g,'');
    return this.formattedAmount.replace('$', '').replace(/,/g, '');
  }

  getNewFormattedLength(): void {
    this.getTrimmedValue().length;
  }

  openInput() {
    this.dummyFacade.setFocus();
  }


  checkValidity() {
    let valid = false;
    // subscribe to validity of the component? pass the rseult back to parent
    // if (this.ngControl.hasError) {
    //   this.validity.emit(true);
    // }
    // else this.validity.emit(false);
    valid = this.ngControl.hasError ? false : true;
    this.validity.emit(valid);
  }

  checkErrorMessage() {
    // if(this.ngControl.hasError(this.validation_messages.ngControl.type) && this.ngControl.control.dirty || 
    // this.ngControl.touched {
    // this.errorMessage.emit(this.validation_messages.ngControl.validation.message);
    // })
    // subscribe to error message? pass result back to parent
  }

  //ControlValueAccessor interface
  writeValue(obj: any) { }

  registerOnChange(fn: any) { }

  registerOnTouched(fn: any) { }

  setDisabledState?(isDisabled: boolean) { }


  showValue() {
    // console.log('value: ' + NG_VALUE_ACCESSOR);
  }
}
