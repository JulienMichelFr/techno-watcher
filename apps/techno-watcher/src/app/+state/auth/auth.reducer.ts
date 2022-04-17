import { ActionReducer, createReducer, on } from '@ngrx/store';

import * as fromActions from './auth.actions';
import { AuthAction } from './auth.actions';
import { AuthState } from './auth.models';

type DecodedToken = {
  exp: number;
  id: number;
  username: string;
};

export const AUTH_FEATURE_KEY: string = 'auth';

export const initialState: AuthState = {
  token: null,
  error: null,
  loading: false,
  expireAt: null,
  profile: null,
};

export const authReducer: ActionReducer<AuthState, AuthAction> = createReducer<AuthState, AuthAction>(
  initialState,
  on(fromActions.init, () => initialState),
  //#region SignIn
  on(fromActions.signInStart, () => ({ ...initialState, loading: true })),
  on(fromActions.signInSuccess, (_state, { payload }): AuthState => {
    return handleAuthResponse(payload.accessToken);
  }),
  // TODO Handle error message from API
  on(fromActions.signInFail, () => ({ ...initialState, loading: false, error: 'Error', token: null })),
  //#endregion
  //#region SignUp
  on(fromActions.signUpStart, () => ({ ...initialState, loading: true })),
  on(fromActions.signUpSuccess, (_state, { payload }): AuthState => {
    return handleAuthResponse(payload.accessToken);
  }),
  // TODO Handle error message from API
  on(fromActions.signUpFail, () => ({ ...initialState, loading: false, error: 'Error', token: null }))
  //#endregion
);

function handleAuthResponse(accessToken: string): AuthState {
  const decoded: DecodedToken = decodeJwt(accessToken);
  return {
    ...initialState,
    token: accessToken,
    profile: { username: decoded.username, id: decoded.id },
    expireAt: decoded.exp,
  };
}

function decodeJwt(jwt: string): DecodedToken {
  const base64Url: string = jwt.split('.')[1];
  const base64: string = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
}
