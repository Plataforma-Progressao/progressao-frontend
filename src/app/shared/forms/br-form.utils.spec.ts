import { FormControl, FormGroup } from '@angular/forms';
import {
  cpfValidator,
  formatCpfValue,
  formatPhoneValue,
  isValidCpf,
  passwordMatchValidator,
  phoneValidator,
} from './br-form.utils';

describe('br-form.utils', () => {
  it('formats CPF values progressively', () => {
    expect(formatCpfValue('1')).toBe('1');
    expect(formatCpfValue('1234')).toBe('123.4');
    expect(formatCpfValue('123456')).toBe('123.456');
    expect(formatCpfValue('12345678901')).toBe('123.456.789-01');
  });

  it('formats phone values progressively', () => {
    expect(formatPhoneValue('1')).toBe('(1');
    expect(formatPhoneValue('11987654321')).toBe('(11) 98765-4321');
    expect(formatPhoneValue('3132657788')).toBe('(31) 3265-7788');
  });

  it('validates CPF checksum', () => {
    expect(isValidCpf('529.982.247-25')).toBe(true);
    expect(isValidCpf('123.456.789-00')).toBe(false);
  });

  it('returns errors for invalid CPF and phone values', () => {
    expect(cpfValidator()(new FormControl('123.456.789-00'))).toEqual({ cpfInvalid: true });
    expect(phoneValidator()(new FormControl('119876543'))).toEqual({ phoneInvalid: true });
  });

  it('validates matching passwords at the group level', () => {
    const formGroup = new FormGroup({
      password: new FormControl('password123'),
      confirmPassword: new FormControl('password321'),
    });

    expect(passwordMatchValidator()(formGroup)).toEqual({ passwordMismatch: true });
  });
});
