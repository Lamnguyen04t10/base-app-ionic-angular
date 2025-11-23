import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'base-demo',
  templateUrl: './demo.page.html',
  styleUrls: ['./demo.page.scss'],
  standalone: false,
})
export class DemoPage implements OnInit {
  private fb: FormBuilder = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    inputTest1: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(20)])],
  });
  ngOnInit() {}
}
