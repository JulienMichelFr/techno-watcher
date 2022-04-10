import {Meta, moduleMetadata, Story} from '@storybook/angular';
import {CommentModel} from '@techno-watcher/api-models';
import {plainToInstance} from 'class-transformer';
import {CommentComponent} from './comment.component';
import {CommentComponentModule} from './comment-component.module';
import {randBoolean, randEmail, randNumber, randParagraph, randRecentDate, randUserName, seed} from '@ngneat/falso';

seed('my-seed-2');

function generateComment(withSubComments?: boolean, deep: number = 0): CommentModel {
  const arrayLength: number = (withSubComments && deep < 4) ? randNumber({min: 1, max: 5}) : 0;
  const comments: CommentModel[] = Array.from({length: arrayLength}, () => generateComment(randBoolean(), deep++));

  return plainToInstance(
    CommentModel,
    {
      id: randNumber(),
      createdAt: randRecentDate(),
      updatedAt: randRecentDate(),
      content: randParagraph(),
      author: {
        id: randNumber(),
        createdAt: randRecentDate(),
        updatedAt: randRecentDate(),
        username: randUserName(),
        email: randEmail(),
      },
      comments,
    },
    { excludeExtraneousValues: true }
  );
}

export default {
  title: 'Shared/Components/Comment',
  component: CommentComponent,
  decorators: [
    moduleMetadata({
      imports: [CommentComponentModule],
    }),
  ],
} as Meta;

const Template: Story<CommentComponent> = (args: CommentComponent) => ({
  props: args,
});

export const Default: Story<CommentComponent> = Template.bind({});
Default.args = {
  comment: generateComment(false),
};

export const WithSubComments: Story<CommentComponent> = Template.bind({});
WithSubComments.args = {
  comment: generateComment(true),
};
