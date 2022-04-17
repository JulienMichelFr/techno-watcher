/* eslint-disable @typescript-eslint/typedef */
import { createAction, props } from '@ngrx/store';
import { AuthResponseModel, SignInDTO } from '@techno-watcher/api-models';

export const init = createAction('[Auth] Init', props<{ token: string }>());
export const signInStart = createAction('[Auth] Sign in start', props<{ payload: SignInDTO }>());
export const signInSuccess = createAction('[Auth] Sign in success', props<{ payload: AuthResponseModel }>());
// TODO Add error type
export const signInFail = createAction('[Auth] Sign in fail', props<{ payload: unknown }>());

export type AuthAction = ReturnType<typeof init> | ReturnType<typeof signInStart> | ReturnType<typeof signInSuccess> | ReturnType<typeof signInFail>;
