import { NgIf } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-match',
  templateUrl: './create-match.component.html',
  styleUrls: ['./create-match.component.scss'],
  standalone: true,
  imports: [FormsModule, NgIf]
})
export class CreateMatchComponent  {
  match = {
    name: '',
    time: '',
    stadium: ''
  };
  confirmStep = false; 
  @Output() doneInputForm = new EventEmitter<any>();
  constructor() { }

  onCreate() {
    if(this.match.name && this.match.time){
      this.confirmStep = true;
    }
    console.log('Form Data:', this.match); 
  }
  submitData(){ 
    this.doneInputForm.emit(this.match);
  }
  closeModal() { 
    console.log('Modal closed');
  }
}
