import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { patchState, signalStore, withMethods, withState, withComputed } from '@ngrx/signals';
import { computed } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { AuthService } from './auth.service';
import { User, LoginRequest, RegisterRequest, AuthResponse } from './auth.models';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    accessToken: null,
    isLoading: false,
    error: null,
};

export const AuthStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withComputed(({ user, accessToken }) => ({
        isAuthenticated: computed(() => !!user && !!accessToken),
    })),
    withMethods((store, authService = inject(AuthService), router = inject(Router)) => ({
        setAccessToken(accessToken: string) {
            patchState(store, { accessToken });
        },
        setUser(user: User) {
            patchState(store, { user });
        },
        clearAuth() {
            patchState(store, initialState);
            router.navigate(['/login']);
        },
        login: rxMethod<LoginRequest>(
            pipe(
                tap(() => patchState(store, { isLoading: true, error: null })),
                switchMap((credentials) =>
                    authService.login(credentials).pipe(
                        tapResponse({
                            next: (response: AuthResponse) => {
                                patchState(store, {
                                    user: response.user,
                                    accessToken: response.accessToken,
                                    isLoading: false,
                                });
                                router.navigate(['/']);
                            },
                            error: (err: any) => {
                                patchState(store, {
                                    isLoading: false,
                                    error: err.message || 'Login failed',
                                });
                            },
                        })
                    )
                )
            )
        ),
        register: rxMethod<RegisterRequest>(
            pipe(
                tap(() => patchState(store, { isLoading: true, error: null })),
                switchMap((data) =>
                    authService.register(data).pipe(
                        tapResponse({
                            next: (response: AuthResponse) => {
                                patchState(store, {
                                    user: response.user,
                                    accessToken: response.accessToken,
                                    isLoading: false,
                                });
                                router.navigate(['/']);
                            },
                            error: (err: any) => {
                                patchState(store, {
                                    isLoading: false,
                                    error: err.message || 'Registration failed',
                                });
                            },
                        })
                    )
                )
            )
        ),
        logout: rxMethod<void>(
            pipe(
                switchMap(() => authService.logout().pipe(
                    tapResponse({
                        next: () => {
                            patchState(store, initialState);
                            router.navigate(['/login']);
                        },
                        error: () => {
                            // Even if server logout fails, clear local state
                            patchState(store, initialState);
                            router.navigate(['/login']);
                        }
                    })
                ))
            )
        )
    }))
);
