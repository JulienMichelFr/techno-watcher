import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';

import { noop } from '../../utils/noop';

import { MarkdownParserService } from './markdown-parser.service';

describe('MarkdownParserService', () => {
  let service: MarkdownParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DomSanitizer,
          useValue: {
            bypassSecurityTrustHtml: noop,
          },
        },
        MarkdownParserService,
      ],
    });
    service = TestBed.inject(MarkdownParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
