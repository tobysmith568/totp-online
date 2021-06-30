import { TestBed } from "@angular/core/testing";

import { TotpStoreService } from "./totp-store.service";

describe("TotpStoreService", () => {
  let service: TotpStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TotpStoreService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
