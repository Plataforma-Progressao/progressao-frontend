import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthenticatedSidenavComponent } from './authenticated-sidenav.component';

describe('AuthenticatedSidenavComponent', () => {
  let fixture: ComponentFixture<AuthenticatedSidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthenticatedSidenavComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthenticatedSidenavComponent);
    fixture.detectChanges();
  });

  it('renders the navigation menu and logout action', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelectorAll('app-authenticated-nav-item').length).toBeGreaterThan(0);
    expect(compiled.textContent).toContain('Sair');
  });
});
