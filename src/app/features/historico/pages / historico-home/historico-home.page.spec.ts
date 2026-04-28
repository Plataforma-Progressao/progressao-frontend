import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoricoHomePage } from './historico-home.page';
import { MatIconModule } from '@angular/material/icon';

describe('HistoricoHomePage', () => {
  let component: HistoricoHomePage;
  let fixture: ComponentFixture<HistoricoHomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoricoHomePage ],
      imports: [ MatIconModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricoHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});