import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'techno-watcher-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {}
