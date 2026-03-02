import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'base-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss'],
  standalone: false
})
export class PageTitleComponent implements OnInit {
  @Input() title: string = ''
  constructor() { }

  ngOnInit() { }

}
