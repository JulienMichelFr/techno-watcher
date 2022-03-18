import { PostComponent } from './post.component';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { TagComponentModule } from '../tag/tag-component.module';
import { PostComponentModule } from './post-component.module';
import { Post } from '../../../services/post/post.service';

const post: Post = {
  _count: { comments: 2 },
  title: 'Post title',
  content: 'Post content',
  tags: ['Tag 1', 'Prisma', 'Storybook'],
  createdAt: new Date(),
  updatedAt: new Date(),
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
};

export default {
  title: 'Shared/Components/Post',
  component: PostComponent,
  decorators: [
    moduleMetadata({
      imports: [PostComponentModule, TagComponentModule],
    }),
  ],
} as Meta;

const Template: Story<PostComponent> = (args: PostComponent) => ({
  props: args,
});

export const Default: Story<PostComponent> = Template.bind({});
Default.args = {
  post,
};
