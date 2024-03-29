/* eslint-disable @typescript-eslint/typedef */
import { createAction, props } from "@ngrx/store";

import { AuthResponseModel, SignInDTO, SignUpDTO } from "@techno-watcher/api-models";

export const signInStart = createAction('[Auth] Sign in start', props<{ payload: SignInDTO }>());
export const signInSuccess = createAction('[Auth] Sign in success', props<{ payload: AuthResponseModel }>());
// TODO Add error type
export const signInFail = createAction('[Auth] Sign in fail', props<{ payload: unknown }>());

export const signUpStart = createAction('[Auth] Sign up start', props<{ payload: SignUpDTO }>());
export const signUpSuccess = createAction('[Auth] Sign up success', props<{ payload: AuthResponseModel }>());
// TODO Add error type
export const signUpFail = createAction('[Auth] Sign up fail', props<{ payload: unknown }>());

export const refreshTokenStart = createAction('[Auth] Refresh token start', props<{ payload: Pick<AuthResponseModel, 'refreshToken'> }>());
export const refreshTokenSuccess = createAction('[Auth] Refresh token success', props<{ payload: AuthResponseModel }>());
// TODO Add error type
export const refreshTokenFail = createAction('[Auth] Refresh token fail', props<{ payload: unknown }>());

export const signOut = createAction('[Auth] Sign out');

export type AuthAction =
  | ReturnType<typeof signInStart>
  | ReturnType<typeof signInSuccess>
  | ReturnType<typeof signInFail>
  | ReturnType<typeof signUpStart>
  | ReturnType<typeof signUpSuccess>
  | ReturnType<typeof signUpFail>
  | ReturnType<typeof refreshTokenStart>
  | ReturnType<typeof refreshTokenSuccess>
  | ReturnType<typeof refreshTokenFail>
  | ReturnType<typeof signOut>;
