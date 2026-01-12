import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderAdmin } from './order-admin';

describe('OrderAdmin', () => {
  let component: OrderAdmin;
  let fixture: ComponentFixture<OrderAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
