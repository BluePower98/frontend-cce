import { TestBed } from '@angular/core/testing';

import { ConexioneshttpService } from './conexioneshttp.service';

describe('ConexioneshttpService', () => {
  let service: ConexioneshttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConexioneshttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
