import { Directive, Input, HostListener, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[limit-to]',
})
export class LimitToDirective {
  constructor(private formControl: NgControl, private el: ElementRef) {}
  @Input('limit-to') limitTo;

  @HostListener('keypress', ['$event'])
  _onKeypress(e) {
    const limit = +this.limitTo;
    if (e.target.value.length === limit) {
      e.preventDefault();
    } 
  }

  @HostListener('paste', ['$event'])
  onPaste(e): void {
    let pastedText = '';
    let combinedText = '';
    if (window['clipboardData'] && window['clipboardData'].getData) {
      // IE
      pastedText = window['clipboardData'].getData('Text');
    } else if (e.clipboardData && e.clipboardData.getData) {
      // Chrome
      pastedText = e.clipboardData.getData('text/plain');
    }
    pastedText = pastedText.substr(0, this.limitTo);
    if (this.formControl.control.value === null || 
        this.formControl.control.value === undefined || 
        this.formControl.control.value === '') {
      this.formControl.control.setValue(pastedText);
    } else {
      combinedText = (this.formControl.control.value + pastedText).substr(0, this.limitTo);
      this.formControl.control.setValue(combinedText);
    }
    event.preventDefault();
  }
}