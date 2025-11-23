import { Component, Input, OnInit } from '@angular/core';
import { isNullOrEmpty } from '../types';

@Component({
  selector: 'base-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  standalone: false,
})
export class CardComponent implements OnInit {
  @Input({ required: false }) title: string = '';

  constructor() {}

  ngOnInit() {}

  get isHasTitle() {
    return !isNullOrEmpty(this.title);
  }
}
