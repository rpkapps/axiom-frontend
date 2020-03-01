import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { InputBoolean } from 'ng-zorro-antd';

@Component({
  selector: 'lx-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepsComponent {
  @Input() step: number;
  @Input() @InputBoolean() showBack = false;
  @Input() @InputBoolean() backDisabled = false;
  @Input() @InputBoolean() showNext = false;
  @Input() @InputBoolean() nextDisabled = false;
  @Input() nextText = 'Next';
  @Output() back = new EventEmitter();
  @Output() next = new EventEmitter();
}
