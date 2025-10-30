import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgendaComponent } from './agenda.component';  // o el nombre correcto

describe('AgendaComponent', () => {
  let component: AgendaComponent;
  let fixture: ComponentFixture<AgendaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ AgendaComponent ]
    })
    .compileComponents();  // usualmente se añade para leer los templates :contentReference[oaicite:0]{index=0}

    fixture = TestBed.createComponent(AgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
