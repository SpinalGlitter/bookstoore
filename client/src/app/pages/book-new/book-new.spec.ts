import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookNew } from './book-new';

describe('BookNew', () => {
  let component: BookNew;
  let fixture: ComponentFixture<BookNew>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookNew]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookNew);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
