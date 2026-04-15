import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardHeaderComponent } from './dashboard-header.component';

describe('DashboardHeaderComponent', () => {
  let fixture: ComponentFixture<DashboardHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardHeaderComponent);
    fixture.detectChanges();
  });

  it('renders the search field and primary action', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('input[type="search"]')).toBeTruthy();
    expect(compiled.textContent).toContain('Adicionar Atividade');
  });
});
