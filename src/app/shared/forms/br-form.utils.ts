import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

export function formatCpfValue(value: string): string {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 6) {
    return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  }

  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  }

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

export function formatPhoneValue(value: string): string {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 2) {
    return digits.length > 0 ? `(${digits}` : '';
  }

  const areaCode = digits.slice(0, 2);
  const subscriber = digits.slice(2);

  if (digits.length <= 6) {
    return `(${areaCode}) ${subscriber}`;
  }

  const prefixLength = digits.length === 11 ? 5 : 4;

  return `(${areaCode}) ${subscriber.slice(0, prefixLength)}-${subscriber.slice(prefixLength)}`;
}

export function isValidCpf(value: string): boolean {
  const digits = onlyDigits(value);

  if (digits.length !== 11 || /^([0-9])\1+$/.test(digits)) {
    return false;
  }

  const calculateDigit = (limit: number): number => {
    const sum = digits
      .slice(0, limit)
      .split('')
      .reduce((accumulator, digit, index) => accumulator + Number(digit) * (limit + 1 - index), 0);

    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  const firstDigit = calculateDigit(9);
  const secondDigit = calculateDigit(10);

  return firstDigit === Number(digits[9]) && secondDigit === Number(digits[10]);
}

export function cpfValidator(): ValidatorFn {
  return (control: AbstractControl<string | null>): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    return isValidCpf(value) ? null : { cpfInvalid: true };
  };
}

export function phoneValidator(): ValidatorFn {
  return (control: AbstractControl<string | null>): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const digits = onlyDigits(value);
    const isValidLength = digits.length === 10 || digits.length === 11;
    const isValidAreaCode = digits.length > 1 && digits[0] !== '0' && digits[1] !== '0';

    return isValidLength && isValidAreaCode ? null : { phoneInvalid: true };
  };
}

export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword ? null : { passwordMismatch: true };
  };
}
