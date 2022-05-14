import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { CommentComponent } from './comment.component';
import { CommentComponentModule } from './comment-component.module';
import { generateComment } from '../../../../mocks/comment.mock';
import { provideMockStore } from '@ngrx/store/testing';

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
} as Meta;

const Template: Story<CommentComponent> = (args: CommentComponent) => ({
  props: args,
});

export const Default: Story<CommentComponent> = Template.bind({});
Default.args = {
  comment: generateComment(),
};

export const Loading: Story<CommentComponent> = Template.bind({});
Loading.args = {
  comment: undefined,
};
