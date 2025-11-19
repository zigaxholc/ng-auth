import { HttpErrorResponse, HttpInterceptorFn, HttpEvent, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from './auth.store';
import { AuthService } from './auth.service';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take, Observable } from 'rxjs';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authStore = inject(AuthStore);
    const authService = inject(AuthService);
    const accessToken = authStore.accessToken();

    let authReq = req;
    if (accessToken) {
        authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    }

    return next(authReq).pipe(
        catchError((error) => {
            if (error instanceof HttpErrorResponse && error.status === 401 && !req.url.includes('auth/login') && !req.url.includes('auth/refresh')) {
                return handle401Error(authReq, next, authStore, authService);
            }
            return throwError(() => error);
        })
    );
};

function handle401Error(req: HttpRequest<unknown>, next: HttpHandlerFn, authStore: any, authService: AuthService): Observable<HttpEvent<any>> {
    if (!isRefreshing) {
        isRefreshing = true;
        refreshTokenSubject.next(null);

        return authService.refreshToken().pipe(
            switchMap((response) => {
                isRefreshing = false;
                authStore.setAccessToken(response.accessToken);
                refreshTokenSubject.next(response.accessToken);

                return next(req.clone({
                    setHeaders: {
                        Authorization: `Bearer ${response.accessToken}`,
                    },
                }));
            }),
            catchError((err) => {
                isRefreshing = false;
                authStore.clearAuth();
                return throwError(() => err);
            })
        );
    } else {
        return refreshTokenSubject.pipe(
            filter((token) => token != null),
            take(1),
            switchMap((jwt) => {
                return next(req.clone({
                    setHeaders: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }));
            })
        );
    }
}
