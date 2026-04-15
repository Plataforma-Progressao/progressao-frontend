import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DashboardHomePage } from './dashboard-home.page';

describe('DashboardHomePage', () => {
  let fixture: ComponentFixture<DashboardHomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardHomePage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardHomePage);
    fixture.detectChanges();
  });

  it('renders the main dashboard sections from the design', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.dashboard-card--score')).toBeTruthy();
    expect(compiled.querySelector('.dashboard-card--career')).toBeTruthy();
    expect(compiled.querySelector('.dashboard-card--pillars')).toBeTruthy();
    expect(compiled.querySelector('.dashboard-card--completion')).toBeTruthy();
    expect(compiled.querySelector('.dashboard-card--notifications')).toBeTruthy();
  });
});
