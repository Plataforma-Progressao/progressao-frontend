import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { StepInstitutionComponent } from './step-institution.component';

describe('StepInstitutionComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepInstitutionComponent],
    }).compileComponents();
  });

  it('keeps the supporting cards white', () => {
    const fixture = TestBed.createComponent(StepInstitutionComponent);
    fixture.componentRef.setInput(
      'form',
      new FormGroup({
        university: new FormControl(''),
        center: new FormControl(''),
        department: new FormControl(''),
      }),
    );
    fixture.detectChanges();

    const validationCard = fixture.nativeElement.querySelector('.validation-card');
    const imageCard = fixture.nativeElement.querySelector('.image-card');
    const statsCard = fixture.nativeElement.querySelector('.stats-card');

    expect(getComputedStyle(validationCard as Element).backgroundColor).toBe('rgb(255, 255, 255)');
    expect(getComputedStyle(imageCard as Element).backgroundColor).toBe('rgb(255, 255, 255)');
    expect(getComputedStyle(statsCard as Element).backgroundColor).toBe('rgb(255, 255, 255)');
  });
});
