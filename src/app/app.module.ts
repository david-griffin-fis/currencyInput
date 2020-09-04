import { NgModule } from '@angular/core';
import { FinalInputComponent } from '../app/final-input/final-input.component';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NumberInputComponent } from '../app/number-input/number-input.component';
import { LimitToDirective } from './limit-to.directive';
import { CustomInputComponent } from '../app/custom-input/custom-input.component';
import { CurrencyInputComponent } from '../app/currency-input/currency-input.component';
@NgModule({ 
  declarations: [AppComponent, CustomInputComponent, NumberInputComponent, LimitToDirective, FinalInputComponent, CurrencyInputComponent],
  entryComponents: [],
  imports: [CommonModule,BrowserModule, IonicModule.forRoot(), AppRoutingModule, FormsModule, ReactiveFormsModule],
  providers: [
    StatusBar,
    SplashScreen,
    CurrencyPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
