import { TestBed } from "@angular/core/testing";

import { TimeoutService } from "./timeout.service";

describe("TimeoutService", () => {
  let service: TimeoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeoutService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
