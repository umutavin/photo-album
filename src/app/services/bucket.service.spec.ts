import { TestBed } from '@angular/core/testing';

import { BucketService } from './bucket.service';

describe('UploadService', () => {
  let service: BucketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BucketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
