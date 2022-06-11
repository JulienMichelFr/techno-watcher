import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { Meta, moduleMetadata, Story } from '@storybook/angular';

import { MarkdownInputComponent, MarkdownInputComponentModule } from './markdown-input.component';

export default {
  title: 'Shared/Components/MarkdownInput',
  component: MarkdownInputComponent,
  decorators: [
    moduleMetadata({
      imports: [MarkdownInputComponentModule, BrowserAnimationsModule],
    }),
  ],
  args: {
    ngModel: 'Hello world \n\n# This is a header\n\nThis is a paragraph',
    ngModelChange: action('ngModelChange'),
  },
  argTypes: {
    ngModelChange: { action: 'ngModelChange' },
  },
} as Meta<MarkdownInputComponent>;

const Template: Story<MarkdownInputComponent> = (args: MarkdownInputComponent) => ({
  props: args,
  template: `<techno-watcher-markdown-input [(ngModel)]="ngModel" (ngModelChange)="ngModelChange($event)" [required]="required"></techno-watcher-markdown-input>`,
});

export const Primary: Story<MarkdownInputComponent> = Template.bind({});
Primary.args = {};

export const Required: Story<MarkdownInputComponent> = Template.bind({});
Required.args = {
  required: true,
};
