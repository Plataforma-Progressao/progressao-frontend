import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { InputComponent } from './input.component';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should propagate value changes via ControlValueAccessor', () => {
    let emitted = '';
    component.registerOnChange((value: string) => {
      emitted = value;
    });

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = 'abc@teste.com';
    input.dispatchEvent(new Event('input'));

    expect(emitted).toBe('abc@teste.com');
  });

  it('should render error when control is invalid and touched', () => {
    const control = new FormControl('');
    control.setErrors({ required: true });
    control.markAsTouched();
    control.markAsDirty();
    fixture.componentRef.setInput('control', control);
    fixture.componentRef.setInput('errorMessage', 'Campo obrigatorio');
    fixture.detectChanges();

    expect(component['hasError']).toBe(true);
  });

  it('should render prefix and suffix icons as ligature text', () => {
    fixture.componentRef.setInput('prefixIcon', 'mail_outline');
    fixture.componentRef.setInput('suffixIcon', 'visibility');
    fixture.detectChanges();

    const icons = Array.from(fixture.nativeElement.querySelectorAll('mat-icon')) as HTMLElement[];
    const iconText = icons.map((icon) => icon.textContent?.trim());

    expect(iconText).toContain('mail_outline');
    expect(iconText).toContain('visibility');
  });

  it('should emit suffixClicked when suffix action button is clicked', () => {
    fixture.componentRef.setInput('suffixIcon', 'visibility');
    fixture.componentRef.setInput('suffixAction', true);
    fixture.detectChanges();

    let emitted = false;
    component.suffixClicked.subscribe(() => {
      emitted = true;
    });

    const suffixButton = fixture.nativeElement.querySelector(
      'button[mat-icon-button][matSuffix]',
    ) as HTMLButtonElement;

    suffixButton.click();

    expect(emitted).toBe(true);
  });
});
