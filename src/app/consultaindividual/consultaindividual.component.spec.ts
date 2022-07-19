import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaindividualComponent } from './consultaindividual.component';

describe('ConsultaindividualComponent', () => {
  let component: ConsultaindividualComponent;
  let fixture: ComponentFixture<ConsultaindividualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaindividualComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaindividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
