import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthenticatedHeaderComponent } from './authenticated-header.component';

describe('AuthenticatedHeaderComponent', () => {
  let fixture: ComponentFixture<AuthenticatedHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthenticatedHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthenticatedHeaderComponent);
    fixture.detectChanges();
  });

  it('renders the search field and does not render add activity action', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('input[type="search"]')).toBeTruthy();
    expect(compiled.textContent).not.toContain('Adicionar Atividade');
  });
});
