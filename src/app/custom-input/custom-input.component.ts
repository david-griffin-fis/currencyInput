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
   
        if (this.amount && this.amount.trim() !== '') {
            this.value = +this.amount;
            this.amountEntered.emit(+this.amount);
        }
    }

    handleKeyUp(event: KeyboardEvent) {
        // this handles keyboard input for backspace
        if (event.key === CustomInputComponent.BACKSPACE_KEY) {
            this.delDigit();
        }
    }

    handleInput(event: CustomEvent) {
        this.clearInput();
        // check if digit
        if (event.detail.data && !isNaN(event.detail.data)) {
            if(this.amount.length >= this.maxLength) {
                console.log('max digits reached');
                return;
            }
            this.addDigit(event.detail.data);
        } else if (event.detail.inputType === CustomInputComponent.BACKSPACE_INPUT_TYPE) {
            // handles numpad input for delete/backspace
            this.delDigit();
        }
    }

    private addDigit(key: string) {
        // if (this.amount.length >= this.maxLength) {
        //     console.log('max digits reached');
        //     return;
        // }
        // else {
            this.amount = this.amount + key;
            console.log('in addDigit, emitting this.getTrimmedAmount(): ' + +this.getTrimmedAmount());
            this.amountEntered.emit(+this.getTrimmedAmount());
        // }
    }

    getTrimmedAmount(): string {
        return this.formattedAmount.replace('$', '').replace(',', '');
    }

    onChange(event: Event): void {
        this.amountEntered.emit(+this.getTrimmedAmount());
    }

    private delDigit() {
        this.amount = this.amount.substring(0, this.amount.length - 1);
        // this.value = +this.amount;
        console.log('in delDigit, emitting amoountEntered.emit(+this.amount): ' + +this.amount);
        this.amountEntered.emit(+this.amount);
    }

    private clearInput() {
        console.log('in clearInput(), value is: ' + this.value);
        this.dummyFacade.value = ''; // ensures works on mobile devices
        //ensure works on browser
        this.dummyFacade.getInputElement().then((native: HTMLInputElement) => {
            native.value = '';
        });
        console.log('end of clearInput, value is: ' + this.value);
    }

    get formattedAmount(): string {
        return this.currencyPipe.transform(+this.amount / Math.pow(10, this.precision));
    }
    openInput() {
        console.log('openInput');
        this.dummyFacade.setFocus();
    }


    // methods for ControlValueAccessor
    writeValue(value: number): void {
        this.value = value ? value : null
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: any): void {
        // this.onTouch = fn;
        this.openInput = fn;
    }
    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    // end ControlValueAccessor methods
}
