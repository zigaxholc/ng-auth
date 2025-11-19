import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthStore } from './core/auth/auth.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50">
      <nav class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex">
              <div class="flex-shrink-0 flex items-center">
                <a routerLink="/" class="text-xl font-bold text-indigo-600">ng-auth</a>
              </div>
            </div>
            <div class="flex items-center">
              @if (authStore.isAuthenticated()) {
                <span class="text-gray-700 mr-4">Welcome, {{ authStore.user()?.name }}</span>
                <button
                  (click)="authStore.logout()"
                  class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              } @else {
                <a
                  routerLink="/login"
                  class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </a>
                <a
                  routerLink="/register"
                  class="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Register
                </a>
              }
            </div>
          </div>
        </div>
      </nav>

      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
})
export class App {
  readonly authStore = inject(AuthStore);
}
