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

  it('should apply CPF mask while typing', () => {
    fixture.componentRef.setInput('mask', 'cpf');
    fixture.detectChanges();

    let emitted = '';
    component.registerOnChange((value: string) => {
      emitted = value;
    });

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = '1234567890123';
    input.dispatchEvent(new Event('input'));

    expect(input.value).toBe('123.456.789-01');
    expect(emitted).toBe('123.456.789-01');
  });

  it('should apply phone mask while typing', () => {
    fixture.componentRef.setInput('mask', 'phone');
    fixture.detectChanges();

    let emitted = '';
    component.registerOnChange((value: string) => {
      emitted = value;
    });

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = '1198765432100';
    input.dispatchEvent(new Event('input'));

    expect(input.value).toBe('(11) 98765-4321');
    expect(emitted).toBe('(11) 98765-4321');
  });

  it('should set maxlength based on mask', () => {
    fixture.componentRef.setInput('mask', 'cpf');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('maxlength')).toBe('14');

    fixture.componentRef.setInput('mask', 'phone');
    fixture.detectChanges();
    expect(input.getAttribute('maxlength')).toBe('15');
  });

  it('should mask value on writeValue for CPF', () => {
    fixture.componentRef.setInput('mask', 'cpf');
    component.writeValue('12345678901');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('123.456.789-01');
  });

  it('should mask value on writeValue for phone', () => {
    fixture.componentRef.setInput('mask', 'phone');
    component.writeValue('11987654321');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('(11) 98765-4321');
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
      'button[matSuffix]',
    ) as HTMLButtonElement;

    suffixButton.click();

    expect(emitted).toBe(true);
  });
});
