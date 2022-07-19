import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprobantesrecibidosComponent } from './comprobantesrecibidos.component';

describe('ComprobantesrecibidosComponent', () => {
  let component: ComprobantesrecibidosComponent;
  let fixture: ComponentFixture<ComprobantesrecibidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComprobantesrecibidosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComprobantesrecibidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
