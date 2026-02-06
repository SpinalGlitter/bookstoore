import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteNew } from './quote-new';

describe('QuoteNew', () => {
  let component: QuoteNew;
  let fixture: ComponentFixture<QuoteNew>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuoteNew]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuoteNew);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
