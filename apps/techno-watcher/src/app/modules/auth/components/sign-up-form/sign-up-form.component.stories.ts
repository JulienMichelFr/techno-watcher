import { SignUpFormComponent } from './sign-up-form.component';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export default {
  title: 'Auth/Components/SignUpForm',
  component: SignUpFormComponent,
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, BrowserAnimationsModule],
    }),
  ],
} as Meta;

const Template: Story<SignUpFormComponent> = (args: SignUpFormComponent) => ({
  props: args,
});

export const Default: Story<SignUpFormComponent> = Template.bind({});
Default.args = {};
