import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './input/input.component';
import { InputNumberComponent } from './input-number/input-number.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [InputComponent, InputNumberComponent],
  imports: [CommonModule, IonicModule, ReactiveFormsModule, FormsModule],
  exports: [ReactiveFormsModule,IonicModule, InputComponent, InputNumberComponent],
})
export class UiFormModule {}
