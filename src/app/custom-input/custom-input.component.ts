 import { Component, OnInit, Input, Output, EventEmitter, ViewChild, Self, forwardRef, ElementRef, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup, Validators } from '@angular/forms';
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
    // disabled: boolean;

    @ViewChild('dummyFacade', { static: false }) private dummyFacade: IonInput;
    
    @Input() precision: number;
    
    @Input() amount: string;  //the amount the user entered
    
    @Output() amountEntered = new EventEmitter<number>();
    
    @Input() maxLength: number; // max digits
    
    // @Input() form: FormGroup;
    
    // @Input() formControlName: string;

    // @Output() finalFormattedAmount = new EventEmitter<string>();

    inputElement: any;
    constructor(private currencyPipe: CurrencyPipe,
        private element: ElementRef
        // private fb: FormBuilder,
        // @Self() public ngControl: NgControl

    ) {

    }

    ngOnInit() {
        console.log('in oninit');
        // if(this.form) {
        //     this.form.addControl(this.formControlName, new FormControl('', Validators.compose([Validators.required, Validators.max(10)])))
            
        // }
            if (this.amount && this.amount.trim() !== '') {
            this.value = +this.amount;
            this.amountEntered.emit(+this.amount);
            // this.finalFormattedAmount.emit(this.formattedAmount);
        }
    }

    handleKeyUp(event: KeyboardEvent) {
        // console.log('handleKeyUp');
        // this handles keyboard input for backspace
        if (event.key === CustomInputComponent.BACKSPACE_KEY) {
            this.delDigit();
        }
    }

    handleInput(event: CustomEvent) {
        // console.log('handleInput')
        this.clearInput();
        // check if digit
        if (event.detail.data && !isNaN(event.detail.data)) {
            this.addDigit(event.detail.data);
        } else if (event.detail.inputType === CustomInputComponent.BACKSPACE_INPUT_TYPE) {
            // handles numpad input for delete/backspace
            this.delDigit();
        }
    }

    private addDigit(key: string) {
        // console.log('CHILD> addDigit - this.amount: ' + this.amount);
        if(this.amount.length >=this.maxLength) {
            console.log('max digits reached');
            return;
        }
        else {
            this.amount = this.amount + key;
            this.value = +this.getTrimmedValue();
            // this.amountEntered.emit(+this.amount);
            // this.amountEntered.emit(this.value);
            // this.amountEntered.emit(+this.getTrimmedValue());
            this.amountEntered.emit(this.value);

            // console.log('CHILD > addDigit() - this.formattedAmount: ' + this.formattedAmount);
            // console.log('CHILD > addDigit() - this.trimmedValue: ' + this.getTrimmedValue());
            // console.log('form: ' + JSON.stringify(this.form.value));
        }
    }

    getTrimmedValue(): string {
        return this.formattedAmount.replace('$','').replace(',','');
    }

    onChange(event: Event): void {
        // this.value = +this.getTrimmedValue();
        // console.log('something changed: ' + event);
    }

    private delDigit() {
        // console.log('CHILD > delDigit');
        this.amount = this.amount.substring(0, this.amount.length - 1);
        this.value = +this.getTrimmedValue();
        this.amountEntered.emit(+this.amount);
    }

    private clearInput() {
        this.dummyFacade.value = ''; // ensures works on mobile devices

        //ensure works on browser
        this.dummyFacade.getInputElement().then((native: HTMLInputElement) => {
            native.value = '';
        });
    }


    get formattedAmount(): string {
        return this.currencyPipe.transform(+this.amount / Math.pow(10, this.precision));
    }
    openInput() {
        console.log('openInput');
        this.dummyFacade.setFocus();
    }



    // whenever a value comes from the parent, ti calls this if there is a pre set value, or default value...if you set the default as 10, it will assign it here
    writeValue(value: number): void {
        this.value = value ? value : null
    }

    registerOnChange(fn: any): void {
        console.log('CHILD > registerOnChange called');
        // this.addDigit = fn;
        this.onChange = fn;
    }
    registerOnTouched(fn: any): void {
        // this.onTouch = fn;
        this.openInput = fn;
    }
    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    ///////////////////////////////////////////
}
