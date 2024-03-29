import { ChangeDetectorRef, Component } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { select, Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';

import { generateCommentList } from '../../../../../../mocks/comment.mock';
import { AuthState } from '../../../../../+state/auth/auth.models';
import { isSignedIn } from '../../../../../+state/auth/auth.selectors';
import { CommentListModule } from '../../comment-list.module';

import { CommentListComponent } from './comment-list.component';

const signedOutState: AuthState = {
  refreshToken: null,
  accessToken: null,
  error: null,
  loading: false,
  expireAt: null,
  profile: null,
};

const signedInState: AuthState = {
  refreshToken: 'refreshToken',
  accessToken: 'token',
  error: null,
  loading: false,
  expireAt: 0,
  profile: {
    id: 1,
    username: 'username',
  },
};

@Component({
  template: `
    <div>
      <button mat-button (click)="setSignedIn()">setSignedIn</button>
      <button mat-button (click)="setSignedOut()">setSignedOut</button>
    </div>
    <ng-content></ng-content>
  `,
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'test-wrapper',
})
class WrapperComponent {
  public constructor(private mockStore: MockStore, private store: Store, private cdr: ChangeDetectorRef) {
    this.store.pipe(select(isSignedIn)).subscribe();
  }

  public setSignedIn(): void {
    this.mockStore.setState({ auth: signedInState });
    this.cdr.markForCheck();
  }

  public setSignedOut(): void {
    this.mockStore.setState({ auth: signedOutState });
    this.cdr.markForCheck();
  }
}

export default {
  title: 'Shared/Components/CommentList',
  component: CommentListComponent,
  decorators: [
    moduleMetadata({
      declarations: [WrapperComponent],
      imports: [CommentListModule, BrowserAnimationsModule],
      providers: [
        provideMockStore({
          initialState: {
            auth: signedInState,
          },
        }),
      ],
    }),
    componentWrapperDecorator((story) => `<test-wrapper>${story}</test-wrapper>`),
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
