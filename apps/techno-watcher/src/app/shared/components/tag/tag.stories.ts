import { TagComponent } from './tag.component';
import { moduleMetadata, Story } from '@storybook/angular';
import { TagComponentModule } from './tag-component.module';

export default {
  title: 'Shared/Components/Tag',
  component: TagComponent,
  decorator: [
    moduleMetadata({
      imports: [TagComponentModule],
    }),
  ],
};

const Template: Story<TagComponent> = (args: TagComponent) => ({
  props: args,
});

export const Default: Story<TagComponent> = Template.bind({});
Default.args = {
  tag: 'My tag',
};
