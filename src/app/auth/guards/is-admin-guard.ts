import { inject } from '@angular/core';
import type { CanMatchFn } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { firstValueFrom } from 'rxjs';

export const isAdminGuard: CanMatchFn = async (route, segments) => {
  const authService = inject(AuthService);

  const isAuthenticated = await firstValueFrom(authService.checkStatus());
  if (!isAuthenticated) return false;
  return authService.isAdmin();
};
