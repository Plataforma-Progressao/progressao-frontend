import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ButtonComponent } from './button.component';

@Component({
  imports: [ButtonComponent],
  template: `
    <app-button
      icon="arrow_forward"
      label="ENTRAR NA PLATAFORMA"
      variant="primary"
      size="large"
      [fullWidth]="true"
    />
  `,
})
class ButtonHostComponent {}

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent, ButtonHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit clicked event on click', () => {
    let emitted = false;
    component.clicked.subscribe(() => {
      emitted = true;
    });
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();
    expect(emitted).toBe(true);
  });

  it('should apply variant class', () => {
    fixture.componentRef.setInput('variant', 'secondary');
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.classList.contains('app-btn--secondary')).toBe(true);
  });

  it('should project button label and icon name', () => {
    const hostFixture = TestBed.createComponent(ButtonHostComponent);

    hostFixture.detectChanges();

    const button = hostFixture.nativeElement.querySelector('button') as HTMLButtonElement;
    const icon = hostFixture.nativeElement.querySelector('mat-icon') as HTMLElement;

    expect(button.textContent).toContain('ENTRAR NA PLATAFORMA');
    expect(icon.textContent?.trim()).toBe('arrow_forward');
  });
});
