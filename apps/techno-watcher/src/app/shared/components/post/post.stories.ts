import { randRecentDate, randUrl } from '@ngneat/falso';
import { Meta, moduleMetadata, Story } from '@storybook/angular';

import { PostModel } from '@techno-watcher/api-models';

import { TagComponentModule } from '../tag/tag-component.module';

import { PostComponent } from './post.component';
import { PostComponentModule } from './post-component.module';

const post: PostModel = {
  id: 1,
  title: 'Post title',
  author: {
    id: 1,
    username: 'username',
  },
  content: `# Content title

  - [ ] Item 1
  - [x] Item 2
  `,
  createdAt: randRecentDate(),
  updatedAt: randRecentDate(),
  link: randUrl(),
  tags: ['Tag 1', 'Tag 2'],
  totalComments: 0,
};

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

export const ContentHidden: Story<PostComponent> = Template.bind({});
ContentHidden.args = {
  post,
  showContent: false,
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
