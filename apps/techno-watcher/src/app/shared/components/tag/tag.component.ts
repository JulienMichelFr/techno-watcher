import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'techno-watcher-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagComponent implements OnInit {
  @Input() public tag!: string;

  public color: string = '#000';

  private static generateColorFromString(input: string): string {
    let hash: number = 0;
    for (let i: number = 0; i < input.length; i++) {
      hash = input.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color: string = '#';
    for (let i: number = 0; i < 3; i++) {
      const value: number = (hash >> (i * 8)) & 0xff;
      color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
  }

  public ngOnInit(): void {
    this.color = TagComponent.generateColorFromString(this.tag);
    console.log(this.color);
  }
}
