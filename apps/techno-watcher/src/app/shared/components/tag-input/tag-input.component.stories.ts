import {FormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { action } from '@storybook/addon-actions';
import {Meta,moduleMetadata, Story} from '@storybook/angular';

import { TagInputComponent } from './tag-input.component';
import { TagInputModule } from './tag-input.module';

export default {
  title: 'Shared/Components/TagInput',
  component: TagInputComponent,
  decorators: [
    moduleMetadata({
      imports: [TagInputModule, MatFormFieldModule, BrowserAnimationsModule, FormsModule],
    }),
  ],
  args: {
    ngModel: [],
    ngModelChange: action('ngModelChange'),
  },
  argTypes: {
    ngModelChange: { action: 'ngModelChange' },
  }
} as Meta<TagInputComponent>;

const Template: Story<TagInputComponent> = (args: TagInputComponent) => ({
  props: args,
  template: `<techno-watcher-tag-input [(ngModel)]="ngModel" (ngModelChange)="ngModelChange($event)" [required]="required"></techno-watcher-tag-input>`
});

export const Primary: Story<TagInputComponent> = Template.bind({});
Primary.args = {
};


export const Required: Story<TagInputComponent> = Template.bind({});
Required.args = {
  required: true
};
