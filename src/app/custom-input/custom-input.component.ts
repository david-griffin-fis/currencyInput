import { Component, OnInit, Input, Output, EventEmitter, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonInput } from '@ionic/angular';
import { CurrencyPipe } from '@angular/common';

@Component({
    selector: 'app-custom-input',
    templateUrl: './custom-input.component.html',
    styleUrls: ['./custom-input.component.scss'],
    providers: [CurrencyPipe, {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => CustomInputComponent),
        multi: true
    }]
})
export class CustomInputComponent implements OnInit, ControlValueAccessor {

    private static BACKSPACE_KEY = 'Backspace';
    private static BACKSPACE_INPUT_TYPE = 'deleteContentBackward';
   
    // what happens with this value
    value: number; // this needs to be the main value... will be what form.get().value shows
   
   
    onTouched: () => void;
    @Input() disabled: boolean;

    @ViewChild('dummyFacade', { static: false }) private dummyFacade: IonInput;

    @Input() precision: number;

    @Input() amount: string;  //the amount the user entered

    @Output() amountEntered = new EventEmitter<number>();

    @Input() maxLength: number; // max digits


    constructor(private currencyPipe: CurrencyPipe,
    ) { }

    ngOnInit() {
        console.log('ngOnInit, value is : ' + this.value);
        console.log('amount: ' + this.amount);
        console.log('amountEntered: ' + this.amountEntered);
        console.log('maxLength: ' + this.maxLength);

        if (this.amount && this.amount.trim() !== '') {
            // this.value = +this.amount;
            this.amountEntered.emit(+this.amount);
        }
        console.log('ngOnInit, value is : ' + this.value);
    }
    
    handleKeyUp(event: KeyboardEvent) {
        console.log('handleKeyUp');
        // this handles keyboard input for backspace
        if (event.key === CustomInputComponent.BACKSPACE_KEY) {
            this.delDigit();
        }
    }

    handleInput(event: CustomEvent) {
        console.log('handleInput');
        this.clearInput();
        // check if digit
        if (event.detail.data && !isNaN(event.detail.data)) {
            // if(this.amount.length >= this.maxLength) {
            //     console.log('max digits reached');
            //     return;
            // }
            this.addDigit(event.detail.data);
        } else if (event.detail.inputType === CustomInputComponent.BACKSPACE_INPUT_TYPE) {
            // handles numpad input for delete/backspace
            this.delDigit();
        }
    }

    private addDigit(key: string) {
        if (this.amount.length >= this.maxLength) {
            console.log('max digits reached');
            return;
        }
        else {
            this.amount = this.amount + key;
            console.log('in addDigit, emitting this.getTrimmedAmount(): ' + +this.getTrimmedAmount());
            // this.amountEntered.emit(+this.getTrimmedAmount());
            this.amountEntered.emit(+this.getTrimmedAmount());

        }
    }
    
    getTrimmedAmount(): string {
        return this.formattedAmount.replace('$', '').replace(',', '');
    }

    onChange(event: Event): void {
        // this.amountEntered.emit(+this.getTrimmedAmount());
    }

    private delDigit() {
        this.amount = this.amount.substring(0, this.amount.length - 1);
        this.amountEntered.emit(+this.amount);
    }

    private clearInput() {
        // ensures works on mobile devices
        this.dummyFacade.value = ''; 
        //ensure works on browser
        this.dummyFacade.getInputElement().then((native: HTMLInputElement) => {
            native.value = '';
        });
    }

    get formattedAmount(): string {
        return this.currencyPipe.transform(+this.amount / Math.pow(10, this.precision));
    }

    get formattedAmountAsNumber(): number {
        return +this.formattedAmount;
    }
    openInput() {
        console.log('openInput');
        this.dummyFacade.setFocus();
    }


    // methods for ControlValueAccessor
    writeValue(value: number): void {
        console.log('writeValue');
        this.value = value ? value : null
    }

    registerOnChange(fn: any): void {
        console.log('registerOnChange');
        this.onChange = fn;
    }
    registerOnTouched(fn: any): void {
        console.log('registerOnTouched');
        this.openInput = fn;
    }
    setDisabledState?(isDisabled: boolean): void {
        console.log('setDisabledState');
        this.disabled = isDisabled;
    }

}
