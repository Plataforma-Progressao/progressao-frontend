import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LoginPage } from './login.page';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render login CTA label text and trailing icon', () => {
    const submitButton = fixture.nativeElement.querySelector(
      'app-button button[type="submit"]',
    ) as HTMLButtonElement;
    const submitIcon = submitButton.querySelector('mat-icon') as HTMLElement;

    expect(submitButton.textContent).toContain('ENTRAR NA PLATAFORMA');
    expect(submitIcon.textContent?.trim()).toBe('arrow_forward');
  });

  it('should toggle password visibility icon on suffix click', () => {
    const getPasswordToggleIcon = (): HTMLElement =>
      fixture.nativeElement.querySelectorAll('app-input')[1].querySelector('button mat-icon');

    expect(getPasswordToggleIcon().textContent?.trim()).toBe('visibility');

    const toggleButton = fixture.nativeElement
      .querySelectorAll('app-input')[1]
      .querySelector('button[mat-icon-button][matSuffix]') as HTMLButtonElement;
    toggleButton.click();
    fixture.detectChanges();

    expect(getPasswordToggleIcon().textContent?.trim()).toBe('visibility_off');
  });

  it('should keep submit enabled while form is invalid to allow validation feedback', () => {
    const submitButton = fixture.nativeElement.querySelector(
      'app-button button[type="submit"]',
    ) as HTMLButtonElement;

    expect(component['loginForm'].invalid).toBe(true);
    expect(submitButton.disabled).toBe(false);
  });
});
