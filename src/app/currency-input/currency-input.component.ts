import { Component, OnInit, forwardRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-currency-input',
  templateUrl: './currency-input.component.html',
  styleUrls: ['./currency-input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CurrencyInputComponent),
    multi: true
  }
  ]
})
export class CurrencyInputComponent implements OnInit, ControlValueAccessor {

  value: number;
  onChange:() => void;
  onTouched:() => void;
  disabled: boolean;

  private static BACKSPACE_KEY = 'Backspace';
  private static BACKSPACE_INPUT_TYPE = 'deleteContentBackward';


  @Input() amount: string;
  @Output() amountEntered = new EventEmitter<number>();

  @ViewChild('dummyFacade', {static: false}) private dummyFacade: IonInput;

  constructor() { }
  writeValue(value: number): void {
    this.value = value ? value : null;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnInit() {
    // if (this.amount && this.amount.trim() !== '') {
    //   this.amountEntered.emit(+this.amount);
    // }
   }


  handleKeyUp(event: KeyboardEvent) {
    // this handles keyboard input for backspace
    if (event.key === CurrencyInputComponent.BACKSPACE_KEY) {
      this.delDigit();
    }
  }

  handleEvent(event: CustomEvent) {
    this.clearInput();
    // check if digit
    if (event.detail.data && !isNaN(event.detail.data)) {
      this.addDigit(event.detail.data);
    } else if (event.detail.inputType === CurrencyInputComponent.BACKSPACE_INPUT_TYPE) {
      // handles numpad input for delete/backspace
      this.delDigit();
    }
    }
  

  private clearInput() {
    this.dummyFacade.value = ''; // ensures work for mobile devices
    // ensures work for browser
    this.dummyFacade.getInputElement().then((native: HTMLInputElement) => {
      native.value = '';
    });
  }

  private delDigit() {
    this.amount = this.amount.substring(0, this.amount.length - 1);
    this.value = +this.amount;
    // this.amountEntered.emit(+this.amount);
    this.amountEntered.emit(this.value); 
  }
  
  private addDigit(key: string) {
    this.amount = this.amount + key;
    this.value = +this.amount;
    // this.amountEntered.emit(+this.amount);
    this.amountEntered.emit(this.value);
    // this.value = this.value + +key;
  }

  
  get formattedAmount(): string {
    // return this.currencyPipe.transform(+this.amount / Math.pow(10, this.precision));
    return this.amount;
  }

  openInput() {
    this.dummyFacade.setFocus;
  }
}