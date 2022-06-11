import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

@Injectable({
  providedIn: 'root',
})
export class MarkdownParserService {
  public constructor(private sanitizer: DomSanitizer) {}

  public parse(markdown: string = ''): SafeHtml {
    const parsed: string = marked(markdown, {
      gfm: true,
      xhtml: true,
      breaks: true,
    });

    return this.sanitizer.bypassSecurityTrustHtml(parsed);
  }
}
