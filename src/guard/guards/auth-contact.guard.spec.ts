import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authContactGuard } from './auth-contact.guard';

describe('authContactGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authContactGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
