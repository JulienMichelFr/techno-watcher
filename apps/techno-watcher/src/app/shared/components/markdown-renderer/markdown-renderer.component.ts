import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Input, NgModule, OnChanges, ViewEncapsulation } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

import { MarkdownParserService } from '../../services/markdown-parser/markdown-parser.service';

@Component({
  selector: 'techno-watcher-markdown-renderer',
  templateUrl: './markdown-renderer.component.html',
  styleUrls: ['./markdown-renderer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarkdownRendererComponent implements OnChanges {
  @Input() public content: string | null = '';

  public parsed: SafeHtml | null = null;

  public constructor(private element: ElementRef, private markdownParserService: MarkdownParserService) {}

  public ngOnChanges(): void {
    this.parsed = this.markdownParserService.parse(this.content ?? '');
  }
}

@NgModule({
  imports: [CommonModule],
  declarations: [MarkdownRendererComponent],
  exports: [MarkdownRendererComponent],
})
export class MarkdownRendererComponentModule {}
