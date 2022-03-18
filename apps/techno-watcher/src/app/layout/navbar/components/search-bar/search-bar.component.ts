import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'techno-watcher-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent {}
