import { randRecentDate, randUrl } from '@ngneat/falso';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { plainToInstance } from 'class-transformer';

import { PostModel } from '@techno-watcher/api-models';

import { TagComponentModule } from '../tag/tag-component.module';

import { PostComponent } from './post.component';
import { PostComponentModule } from './post-component.module';

const post: PostModel = plainToInstance(
  PostModel,
  {
    _count: { comments: 2 },
    title: 'Post title',
    content: 'Post content',
    link: randUrl(),
    tags: ['Tag 1', 'Prisma', 'Storybook'],
    createdAt: randRecentDate(),
    updatedAt: randRecentDate(),
    id: 1,
    author: {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      username: 'UserName',
      email: 'email@domain.tld',
      password: '',
      deletedAt: null,
    },
    deletedAt: null,
    authorId: 1,
  },
  { excludeExtraneousValues: true }
);

export default {
  title: 'Shared/Components/Post',
  component: PostComponent,
  decorators: [
    moduleMetadata({
      imports: [PostComponentModule, TagComponentModule],
    }),
  ],
  argTypes: {
    canDelete: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
  },
} as Meta;

const Template: Story<PostComponent> = (args: PostComponent) => ({
  props: args,
});

export const Default: Story<PostComponent> = Template.bind({});
Default.args = {
  post,
};

export const CanDelete: Story<PostComponent> = Template.bind({});
CanDelete.args = {
  post,
  canDelete: true,
};

export const Loading: Story<PostComponent> = Template.bind({});
Loading.args = {
  post: null,
};
