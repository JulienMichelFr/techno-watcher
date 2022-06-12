import { provideMockStore } from '@ngrx/store/testing';
import { action } from '@storybook/addon-actions';
import { Meta, moduleMetadata, Story } from '@storybook/angular';

import { generateComment } from '../../../../mocks/comment.mock';

import { CommentComponent } from './comment.component';
import { CommentComponentModule } from './comment-component.module';

export default {
  title: 'Shared/Components/Comment',
  component: CommentComponent,
  decorators: [
    moduleMetadata({
      imports: [CommentComponentModule],
      providers: [
        provideMockStore({
          initialState: {
            auth: {},
          },
        }),
      ],
    }),
  ],
  args: {
    deleteComment: action('deleteComment'),
  },
  argTypes: {
    deleteComment: {
      action: 'deleteComment',
    },
  },
} as Meta;

const Template: Story<CommentComponent> = (args: CommentComponent) => ({
  props: args,
});

export const Default: Story<CommentComponent> = Template.bind({});
Default.args = {
  comment: generateComment({
    content: `# My comment title
     ---
     Hello`,
  }),
};

export const CanDelete: Story<CommentComponent> = Template.bind({});
CanDelete.args = {
  comment: generateComment({ username: 'username' }),
  username: 'username',
};

export const Deleted: Story<CommentComponent> = Template.bind({});
Deleted.args = {
  comment: {
    ...generateComment(),
    deletedAt: new Date(),
  },
};

export const Loading: Story<CommentComponent> = Template.bind({});
Loading.args = {
  comment: undefined,
};
