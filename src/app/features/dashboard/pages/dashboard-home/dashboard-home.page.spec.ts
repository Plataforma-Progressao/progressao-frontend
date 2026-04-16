import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { DashboardHomePage } from './dashboard-home.page';

describe('DashboardHomePage', () => {
  let fixture: ComponentFixture<DashboardHomePage>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardHomePage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(DashboardHomePage);
    fixture.detectChanges();

    const request = httpTestingController.expectOne('http://localhost:3000/api/dashboard/home');
    request.flush({
      success: true,
      data: {
        displayName: 'Dr. Manuel Rocha',
        roleLabel: 'Associado IV',
        summary: 'Boas-vindas, Dr. Manuel Rocha. Suas métricas de progressão estão atualizadas.',
        score: { current: 1420, target: 2000 },
        career: {
          currentLevelLabel: 'Associado IV',
          nextLevelLabel: 'Titular I',
          progressPercentage: 73,
          yearsInLevel: 3,
          yearsRequired: 4,
          qualisPublications: 12,
          qualisTarget: 15,
          supervisions: 5,
          supervisionsTarget: 4,
        },
        pillars: [{ label: 'Ensino', score: 420, total: 420, percentage: 30, accent: '#5a54ea' }],
        biennium: {
          cycleLabel: '2023 - 2024',
          completionPercentage: 84,
          departmentComparison: 'Você está 12% à frente da média do departamento.',
        },
        notifications: [
          {
            title: 'Artigo Validado',
            description: 'Publicação validada.',
            timestamp: 'Ontem',
            icon: 'verified',
            tone: 'success',
          },
        ],
      },
    });
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('renders the main dashboard sections from the design', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('app-dashboard-score-card .dashboard-card--score')).toBeTruthy();
    expect(
      compiled.querySelector('app-dashboard-career-card .dashboard-card--career'),
    ).toBeTruthy();
    expect(
      compiled.querySelector('app-dashboard-pillars-card .dashboard-card--pillars'),
    ).toBeTruthy();
    expect(
      compiled.querySelector('app-dashboard-biennium-card .dashboard-card--completion'),
    ).toBeTruthy();
    expect(
      compiled.querySelector('app-dashboard-notifications-card .dashboard-card--notifications'),
    ).toBeTruthy();
  });

  it('keeps the last loaded data visible while reloading', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    (
      fixture.componentInstance as unknown as { homeResource: { reload: () => void } }
    ).homeResource.reload();
    fixture.detectChanges();

    httpTestingController.expectOne('http://localhost:3000/api/dashboard/home');

    expect(compiled.textContent).toContain(
      'Boas-vindas, Dr. Manuel Rocha. Suas métricas de progressão estão atualizadas.',
    );
  });

  it('renders error state and retries dashboard request', async () => {
    const secondFixture = TestBed.createComponent(DashboardHomePage);
    secondFixture.detectChanges();

    const initialRequest = httpTestingController.expectOne(
      'http://localhost:3000/api/dashboard/home',
    );
    initialRequest.flush({}, { status: 500, statusText: 'Server Error' });
    await secondFixture.whenStable();
    secondFixture.detectChanges();

    const errorState = secondFixture.nativeElement.querySelector(
      '.dashboard-home__status--error',
    ) as HTMLElement;
    expect(errorState).toBeTruthy();

    const retryButton = errorState.querySelector('button') as HTMLButtonElement;
    retryButton.click();
    secondFixture.detectChanges();

    const retryRequest = httpTestingController.expectOne(
      'http://localhost:3000/api/dashboard/home',
    );
    retryRequest.flush({
      success: true,
      data: {
        displayName: 'Dr. Manuel Rocha',
        roleLabel: 'Associado IV',
        summary: 'Dados recarregados com sucesso.',
        score: { current: 1000, target: 2000 },
        career: {
          currentLevelLabel: 'Associado IV',
          nextLevelLabel: 'Titular I',
          progressPercentage: 50,
          yearsInLevel: 2,
          yearsRequired: 4,
          qualisPublications: 8,
          qualisTarget: 15,
          supervisions: 3,
          supervisionsTarget: 4,
        },
        pillars: [],
        biennium: {
          cycleLabel: '2023 - 2024',
          completionPercentage: 50,
          departmentComparison: 'Sem comparação disponível.',
        },
        notifications: [],
      },
    });
    await secondFixture.whenStable();
    secondFixture.detectChanges();

    expect(secondFixture.nativeElement.querySelector('.dashboard-home__status--error')).toBeNull();
    expect(secondFixture.nativeElement.textContent).toContain('Dados recarregados com sucesso.');
  });
});
