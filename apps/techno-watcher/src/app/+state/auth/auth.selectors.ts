/* eslint-disable @typescript-eslint/typedef */
import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AUTH_FEATURE_KEY } from "./auth.reducer";
import { AuthState } from "./auth.models";

export const getAuthState = createFeatureSelector<AuthState>(AUTH_FEATURE_KEY);
export const authStateIsLoading = createSelector(getAuthState, (state: AuthState) => state.loading);
export const getProfile = createSelector(getAuthState, (state: AuthState) => state.profile);
export const getTokenExpirationDate = createSelector(getAuthState, (state: AuthState) => state.expireAt);
export const getAccessToken = createSelector(getAuthState, (state: AuthState) => state.accessToken);
export const isSignedIn = createSelector(getAuthState, (state: AuthState) => {
  return !!(!state.loading && state.accessToken && state.profile?.id && state.profile?.username);
});
