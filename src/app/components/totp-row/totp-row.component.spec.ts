import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TotpRowComponent } from "./totp-row.component";

describe("TotpRowComponent", () => {
  let component: TotpRowComponent;
  let fixture: ComponentFixture<TotpRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TotpRowComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotpRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
