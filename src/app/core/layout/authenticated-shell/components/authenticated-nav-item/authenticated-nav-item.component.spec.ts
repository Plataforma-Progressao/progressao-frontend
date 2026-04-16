import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthenticatedNavItemComponent } from './authenticated-nav-item.component';

describe('AuthenticatedNavItemComponent', () => {
  let fixture: ComponentFixture<AuthenticatedNavItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthenticatedNavItemComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthenticatedNavItemComponent);
    fixture.componentRef.setInput('item', {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard',
    });
    fixture.detectChanges();
  });

  it('renders the navigation label and icon', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Dashboard');
    expect(compiled.querySelector('mat-icon')?.textContent?.trim()).toBe('dashboard');
  });
});
