import { TestBed } from "@angular/core/testing";

import { Base32Service } from "./base32.service";

describe("Base32Service", () => {
  let service: Base32Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Base32Service);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
