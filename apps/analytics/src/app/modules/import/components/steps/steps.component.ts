import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'lx-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepsComponent {
  @Input() step: number;
}
