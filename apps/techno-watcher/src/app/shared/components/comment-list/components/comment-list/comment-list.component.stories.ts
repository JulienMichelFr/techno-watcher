import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { CommentListComponent } from './comment-list.component';
import { CommentListModule } from '../../comment-list.module';
import { generateCommentList } from '../../../../../../mocks/comment.mock';

export default {
  title: 'Shared/Components/CommentList',
  component: CommentListComponent,
  decorators: [
    moduleMetadata({
      imports: [CommentListModule],
    }),
  ],
  args: {
    comments: generateCommentList(),
  },
} as Meta;

const Template: Story<CommentListComponent> = (args: CommentListComponent) => ({
  props: args,
});

export const Default: Story<CommentListComponent> = Template.bind({});
Default.args = {};
