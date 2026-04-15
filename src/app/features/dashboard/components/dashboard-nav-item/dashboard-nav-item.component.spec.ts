import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DashboardNavItemComponent } from './dashboard-nav-item.component';

describe('DashboardNavItemComponent', () => {
  let fixture: ComponentFixture<DashboardNavItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardNavItemComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardNavItemComponent);
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
