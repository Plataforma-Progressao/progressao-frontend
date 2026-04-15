import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DashboardSidenavComponent } from './dashboard-sidenav.component';

describe('DashboardSidenavComponent', () => {
  let fixture: ComponentFixture<DashboardSidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardSidenavComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardSidenavComponent);
    fixture.detectChanges();
  });

  it('renders the navigation menu and logout action', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelectorAll('app-dashboard-nav-item').length).toBeGreaterThan(0);
    expect(compiled.textContent).toContain('Sair');
  });
});
