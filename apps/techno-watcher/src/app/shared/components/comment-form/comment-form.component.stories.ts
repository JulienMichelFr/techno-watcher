import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { CommentFormModule } from './comment-form.module';
import { CommentFormComponent } from './comment-form.component';

export default {
  title: 'Shared/Components/CommentForm',
  component: CommentFormComponent,
  decorators: [
    moduleMetadata({
      imports: [CommentFormModule],
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
