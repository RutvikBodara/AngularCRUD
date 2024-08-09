import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { contactAuthCHILDGuard } from './contact-auth-child.guard';

describe('contactAuthCHILDGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => contactAuthCHILDGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
