import { TestBed } from "@angular/core/testing";

import { HexidecimalService } from "./hexidecimal.service";

describe("HexidecimalService", () => {
  let service: HexidecimalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HexidecimalService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
