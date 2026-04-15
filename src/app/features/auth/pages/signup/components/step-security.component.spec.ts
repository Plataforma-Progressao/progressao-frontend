import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { StepSecurityComponent } from './step-security.component';

describe('StepSecurityComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepSecurityComponent],
    }).compileComponents();
  });

  it('keeps the security cards white', () => {
    const fixture = TestBed.createComponent(StepSecurityComponent);
    fixture.componentRef.setInput(
      'form',
      new FormGroup({
        password: new FormControl(''),
        confirmPassword: new FormControl(''),
        acceptTerms: new FormControl(false),
        acceptLgpd: new FormControl(false),
      }),
    );
    fixture.detectChanges();

    const formWrapper = fixture.nativeElement.querySelector('.form-wrapper');
    const successCard = fixture.nativeElement.querySelector('.success-card');

    expect(getComputedStyle(formWrapper as Element).backgroundColor).toBe('rgb(255, 255, 255)');
    expect(getComputedStyle(successCard as Element).backgroundColor).toBe('rgb(255, 255, 255)');
  });
});
