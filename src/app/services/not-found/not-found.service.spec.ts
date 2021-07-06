import { TestBed } from "@angular/core/testing";

import { NotFoundService } from "./not-found.service";

describe("NotFoundService", () => {
  let service: NotFoundService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotFoundService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
