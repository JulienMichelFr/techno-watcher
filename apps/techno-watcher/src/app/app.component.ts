import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'techno-watcher-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
}
