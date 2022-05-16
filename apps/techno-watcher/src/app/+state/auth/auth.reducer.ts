import { ActionReducer, createReducer, on } from '@ngrx/store';

import * as fromActions from './auth.actions';
import { AuthAction } from './auth.actions';
import { AuthState } from './auth.models';
import { AuthResponseModel } from '@techno-watcher/api-models';
import { DecodedToken, decodeJwt } from '../../shared/utils/decode-jwt';

export const AUTH_FEATURE_KEY: string = 'auth';

export const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  error: null,
  loading: false,
  expireAt: null,
  profile: null,
};

export const authReducer: ActionReducer<AuthState, AuthAction> = createReducer<AuthState, AuthAction>(
  { ...initialState, loading: true },
  //#region SignIn
  on(fromActions.signInStart, () => ({ ...initialState, loading: true })),
  on(fromActions.signInSuccess, (_state, { payload }): AuthState => {
    return handleAuthResponse(payload);
  }),
  // TODO Handle error message from API
  on(fromActions.signInFail, () => ({ ...initialState, loading: false, error: 'Error', token: null })),
  //#endregion
  //#region SignUp
  on(fromActions.signUpStart, () => ({ ...initialState, loading: true })),
  on(fromActions.signUpSuccess, (_state, { payload }): AuthState => {
    return handleAuthResponse(payload);
  }),
  // TODO Handle error message from API
  on(fromActions.signUpFail, () => ({ ...initialState, loading: false, error: 'Error', token: null })),
  //#endregion
  //#region Refresh token
  on(fromActions.refreshTokenStart, (state) => ({ ...state, loading: true })),
  on(fromActions.refreshTokenSuccess, (_state, { payload }): AuthState => {
    return handleAuthResponse(payload);
  }),
  // TODO Handle error message from API
  on(fromActions.refreshTokenFail, () => ({ ...initialState, loading: false, error: 'Error', token: null })),
  //#endregion
  on(fromActions.signOut, () => initialState)
);

function handleAuthResponse(authResponse: AuthResponseModel): AuthState {
  const decoded: DecodedToken = decodeJwt(authResponse.accessToken);
  return {
    ...initialState,
    accessToken: authResponse.accessToken,
    refreshToken: authResponse.refreshToken,
    profile: { username: decoded.username, id: decoded.id },
    expireAt: decoded.exp * 1000,
  };
}
