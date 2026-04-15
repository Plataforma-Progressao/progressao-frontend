import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { StepPersonalComponent } from './step-personal.component';

describe('StepPersonalComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepPersonalComponent],
    }).compileComponents();
  });

  it('keeps the tip card surface white', () => {
    const fixture = TestBed.createComponent(StepPersonalComponent);
    fixture.componentRef.setInput(
      'form',
      new FormGroup({
        fullName: new FormControl(''),
        cpf: new FormControl(''),
        phone: new FormControl(''),
        email: new FormControl(''),
      }),
    );
    fixture.detectChanges();

    const tipCard = fixture.nativeElement.querySelector('.tip-card');

    expect(tipCard).toBeTruthy();
    expect(getComputedStyle(tipCard as Element).backgroundColor).toBe('rgb(255, 255, 255)');
  });
});
