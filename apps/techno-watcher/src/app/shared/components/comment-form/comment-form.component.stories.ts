import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, Story } from '@storybook/angular';

import { CommentFormComponent } from './comment-form.component';
import { CommentFormModule } from './comment-form.module';

export default {
  title: 'Shared/Components/CommentForm',
  component: CommentFormComponent,
  decorators: [
    moduleMetadata({
      imports: [CommentFormModule, BrowserAnimationsModule],
    }),
  ],
} as Meta;

const Template: Story<CommentFormComponent> = (args: CommentFormComponent) => ({
  props: args,
});

export const Default: Story<CommentFormComponent> = Template.bind({});
Default.args = {};

export const Loading: Story<CommentFormComponent> = Template.bind({});
Loading.args = {
  isLoading: true,
};
