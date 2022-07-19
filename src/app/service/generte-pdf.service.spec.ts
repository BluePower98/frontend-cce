import { TestBed } from '@angular/core/testing';

import { GenertePDFService } from './generte-pdf.service';

describe('GenertePDFService', () => {
  let service: GenertePDFService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenertePDFService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
