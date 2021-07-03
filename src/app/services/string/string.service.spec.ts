import { TestBed } from "@angular/core/testing";

import { StringService } from "./string.service";

describe("StringService", () => {
  let service: StringService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StringService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
