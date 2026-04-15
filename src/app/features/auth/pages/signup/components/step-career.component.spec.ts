import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { StepCareerComponent } from './step-career.component';

describe('StepCareerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepCareerComponent],
    }).compileComponents();
  });

  it('keeps the career cards white', () => {
    const fixture = TestBed.createComponent(StepCareerComponent);
    fixture.componentRef.setInput(
      'form',
      new FormGroup({
        practiceAreas: new FormControl([]),
        careerClass: new FormControl(''),
        currentLevel: new FormControl(''),
        lastProgressionDate: new FormControl(''),
      }),
    );
    fixture.detectChanges();

    const formWrapper = fixture.nativeElement.querySelector('.form-wrapper');
    const chartCard = fixture.nativeElement.querySelector('.chart-card');
    const curationCard = fixture.nativeElement.querySelector('.curation-card');

    expect(getComputedStyle(formWrapper as Element).backgroundColor).toBe('rgb(255, 255, 255)');
    expect(getComputedStyle(chartCard as Element).backgroundColor).toBe('rgb(255, 255, 255)');
    expect(getComputedStyle(curationCard as Element).backgroundColor).toBe('rgb(255, 255, 255)');
  });
});
