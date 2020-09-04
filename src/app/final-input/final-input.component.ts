import { Component, OnInit, ViewChild, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { IonInput } from '@ionic/angular';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


@Component({
  selector: 'app-final-input',
  templateUrl: './final-input.component.html',
  styleUrls: ['./final-input.component.scss'],
  providers: [CurrencyPipe, {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FinalInputComponent),
    multi: true
  }]
})
export class FinalInputComponent implements OnInit, ControlValueAccessor {

  value: number;

  private static BACKSPACE_KEY = 'Backspace';
  private static BACKSPACE_INPUT_TYPE = 'deleteContentBackward';

  @ViewChild('dummyFacade', {static: false}) private dummyFacade: IonInput;

  @Input() precision: number;

  @Input() amount: string;

  @Output() amountEntered = new EventEmitter<number>();

  constructor(private currencyPipe: CurrencyPipe) { }
 

  ngOnInit() {
    if (this.amount && this.amount.trim() !== '') {
      this.amountEntered.emit(+this.amount);
    }
  }

  handleKeyUp(event: KeyboardEvent) {
    // this handles keyboard input for backspace
    if (event.key === FinalInputComponent.BACKSPACE_KEY) {
      this.delDigit();
    }
  }

  // maybe change name to onChange()?
  handleEvent(event: CustomEvent) {
    this.clearInput();
    // check if digit
    if (event.detail.data && !isNaN(event.detail.data)) {
      this.addDigit(event.detail.data);
    } else if (event.detail.inputType === FinalInputComponent.BACKSPACE_INPUT_TYPE) {
      // this handles numpad input for delete/backspace
      this.delDigit();
    }
  }

  private addDigit(key: string) {
    this.amount = this.amount + key;
    this.amountEntered.emit(+this.amount);
  }

  private delDigit() {
    this.amount = this.amount.substring(0, this.amount.length - 1);
    this.amountEntered.emit(+this.amount);
  }

  private clearInput() {
    this.dummyFacade.value = ''; // ensures work for mobile devices
    // ensures work for browser
    this.dummyFacade.getInputElement().then((native: HTMLInputElement) => {
      native.value = '';
    });
  }

  get formattedAmount(): string {
    return this.currencyPipe.transform(+this.amount / Math.pow(10, this.precision));
  }

  openInput() {
    this.dummyFacade.setFocus();
  }




  onChange: () => void;
  onTouched: () => void;
  disabled: boolean;


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

}