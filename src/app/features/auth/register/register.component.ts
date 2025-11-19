import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthStore } from '../../../core/auth/auth.store';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink],
    template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 class="text-2xl font-bold text-center mb-6 text-gray-800">Register</h2>
        
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              formControlName="name"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              formControlName="email"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              formControlName="password"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
            />
          </div>

          @if (authStore.error()) {
            <div class="text-red-500 text-sm text-center">
              {{ authStore.error() }}
            </div>
          }

          <button
            type="submit"
            [disabled]="registerForm.invalid || authStore.isLoading()"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            @if (authStore.isLoading()) {
              Loading...
            } @else {
              Sign Up
            }
          </button>
        </form>

        <div class="mt-4 text-center">
          <p class="text-sm text-gray-600">
            Already have an account?
            <a routerLink="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent {
    private fb = inject(FormBuilder);
    readonly authStore = inject(AuthStore);

    registerForm = this.fb.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
    });

    onSubmit() {
        if (this.registerForm.valid) {
            const { name, email, password } = this.registerForm.value;
            this.authStore.register({ name: name!, email: email!, password: password! });
        }
    }
}
