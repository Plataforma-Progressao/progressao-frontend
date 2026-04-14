# Blueprint: Angular Material 3 Base Components Refactoring

**Objective:** Refactor the Plataforma Progressão frontend from inline Material customization (via `::ng-deep` CSS) to a reusable, composable base component system following SOLID principles, with centralized design tokens and Tailwind CSS v4 integration.

**Project Context:**

- Angular 21 with standalone components and zoneless change detection
- Material 3 theme with Manrope font and custom design tokens
- Existing login page using inline Material customization via CSS
- Tailwind CSS v4 configured alongside Material
- Global design tokens in `src/styles/tokens.css` and Material theme in `material-theme.scss`
- Vitest for unit testing, ESLint for linting

**Expected Outcomes:**

- 8–12 reusable, typed base components (Button, Input, Checkbox, Card, etc.) with Material-compliant variants
- Centralized style system eliminating `::ng-deep` hacks
- Improved component reusability across all pages
- 80%+ test coverage on all new base components
- Login page refactored to use new base components
- Component documentation and Storybook-style examples

---

## Architecture Overview

### Current State (Anti-pattern)

```
src/app/features/auth/pages/login/
├── login.page.ts          (Material imports + logic)
├── login.page.html        (Material templates + inline bindings)
└── login.page.css         (::ng-deep customization)  ← ❌ Brittle, not reusable
```

### Target State (Desired Pattern)

```
src/app/shared/components/
├── base/                  (Core form & UI primitives)
│   ├── button/
│   │   ├── button.component.ts
│   │   ├── button.component.html
│   │   ├── button.component.scss
│   │   └── button.component.spec.ts
│   ├── input/
│   ├── checkbox/
│   ├── card/
│   └── ...
├── form/                  (Composed form components)
│   ├── form-field/
│   ├── form-group/
│   └── login-form/        (Page-specific composition)
└── styles/
    ├── base.scss          (Base component styles)
    ├── variants.scss      (All component variants)
    └── tokens.scss        (Unified token system)

src/styles/
├── tokens.css             (CSS variables)
├── typography.css         (Font scales)
├── material-theme.scss    (Material M3 setup)
└── global.scss            (Shared utility styles)

src/app/features/auth/pages/login/
└── login.page.ts          (Minimal: imports + composes base components)
```

---

## Dependency Graph

```
LEGEND: Step N → Step M means Step N must complete before Step M can begin

Step 1  (Project structure & index)
  ↓
Step 2  (Design token consolidation) ──────────┐
  ↓                                             ↓
Step 3  (Base Button component) ─────┐        Step 4 (Base Input component)
  ↓                                   ↓        ↓
Step 5  (Base Checkbox)               Step 6 (Base Card - Optional, deferred)
  ↓
Step 7  (Base Form Field wrapper)
  ↓
Step 8  (Composed Form Group)
  ↓
Step 9  (Refactor Login page)
  ↓
Step 10 (Create component library docs)
  ↓
Step 11 (Add comprehensive tests & examples)
  ↓
Step 12 (Audit & cleanup)
```

### Parallel Execution Opportunities

After Step 2 (token consolidation) completes:

- **Parallel Stream A:** Steps 3, 5 (independent base components)
- **Parallel Stream B:** Step 4 (Input component — largest)
- These can run in parallel if two agents are available

After Step 7 (Form Field wrapper):

- Steps 8 & 9 can run in parallel (Form Group and Login refactor)

---

## Detailed Steps

### Step 1: Project Structure & Component Index

**Duration:** 15–30 min (1 PR)  
**Model Tier:** Default  
**Parallelizes With:** None (foundational)

#### Context Brief

Create the scaffolding for all new components and a master `index.ts` barrel export to enable clean imports across the app. Establish naming conventions and folder structure that will be reused for all 8+ base components.

#### Task List

- [ ] Create folder hierarchy:
  - `src/app/shared/` (if not exists)
  - `src/app/shared/components/base/` (Button, Input, Checkbox, Card, etc.)
  - `src/app/shared/components/form/` (composed form components)
  - `src/app/shared/styles/` (component-specific SCSS)
- [ ] Create `src/app/shared/index.ts` barrel export with typed public API
- [ ] Add `.gitkeep` to empty folders to ensure they're committed
- [ ] Update `src/app/app.ts` to import from `src/app/shared` (for future tree-shaking)
- [ ] Document folder structure in `README.md` under "Component Architecture"

#### Affected Files

- Create: `src/app/shared/index.ts`
- Create: `src/app/shared/components/base/.gitkeep`
- Create: `src/app/shared/components/form/.gitkeep`
- Create: `src/app/shared/styles/.gitkeep`
- Modify: `README.md`

#### Exit Criteria

✅ All folders exist  
✅ `src/app/shared/index.ts` is empty but valid TypeScript  
✅ No existing tests break  
✅ Lint passes

---

### Step 2: Design Token Consolidation & Global Styles

**Duration:** 30–45 min (1 PR)  
**Model Tier:** Default  
**Parallelizes With:** None (foundational for all components)  
**Depends On:** Step 1

#### Context Brief

Consolidate Material 3 theme, custom CSS tokens, and Tailwind configuration into a single source of truth. Create SCSS token maps that will be imported by all base components. This step ensures no token duplication and makes future design changes maintainable.

**Design Token Mapping:** Based on project's existing tokens and Material 3 palette:

- Colors: Primary (`#1a237e`), Secondary (`#3f51b5`), Surface (`#f9f9fb`), Error (`#b00020`), Success (`#10b981`)
- Spacing: From `--space-1` (0.25rem) to `--space-12` (3rem)
- Radius: From `--radius-sm` (0.5rem) to `--radius-xl` (1.75rem)
- Typography: Display, Headline, Title, Body, Label scales from `typography.css`

#### Task List

- [ ] Review `src/styles/tokens.css` (existing) and `src/styles/material-theme.scss` (Material M3)
- [ ] Create `src/styles/_design-tokens.scss` (SCSS maps for all tokens):

  ```scss
  $colors: (
    'primary': #1a237e,
    'on-primary': #ffffff,
    'secondary': #3f51b5,
    'surface': #f9f9fb,
    'surface-container': #ffffff,
    'error': #b00020,
    'success': #10b981,
    'on-surface': #1a1c1d,
    'on-surface-variant': #6b7280,
  );

  $spacing: (
    'xs': 0.25rem,
    // --space-1
    'sm': 0.5rem,
    // --space-2
    'md': 1rem,
    // --space-4
    'lg': 1.5rem,
    // --space-6
    'xl': 2rem,
    // --space-8
    'xxl': 3rem, // --space-12
  );

  $radius: (
    'sm': 0.5rem,
    'md': 1rem,
    'lg': 1.5rem,
    'xl': 1.75rem,
  );

  $typography: (
    'display-large': (
      font-size: 2.25rem,
      line-height: 1.2,
    ),
    'headline-large': (
      font-size: 1.75rem,
      line-height: 1.3,
    ), // ... etc
  );
  ```

- [ ] Update `src/styles/material-theme.scss` to reference `_design-tokens.scss`
- [ ] Ensure `src/styles/global.scss` (new) imports both `material-theme.scss` and `_design-tokens.scss`
- [ ] Update `angular.json` `styles` array to include `src/styles/global.scss` if not already there
- [ ] Verify Material 3 M3 CSS variables are used in Material components (they should auto-apply via `mat.all-component-themes()`)
- [ ] Create `src/app/shared/styles/_component-tokens.scss` (re-exports for component use):

  ```scss
  @import '../../styles/design-tokens';

  @function color($name) {
    @return map-get($colors, $name);
  }
  @function space($size) {
    @return map-get($spacing, $size);
  }
  @function radius($size) {
    @return map-get($radius, $size);
  }
  ```

#### Affected Files

- Modify: `src/styles/material-theme.scss`
- Modify: `src/styles/tokens.css` (mark as deprecated; keep for backwards compatibility during transition)
- Modify: `src/styles/typography.css` (add SCSS export if not present)
- Create: `src/styles/_design-tokens.scss`
- Create: `src/styles/global.scss`
- Create: `src/app/shared/styles/_component-tokens.scss`
- Modify: `angular.json`

#### Verification Commands

```bash
npm run lint                          # Ensure no SCSS errors
npm run build                         # Verify Material theme still applies
```

#### Exit Criteria

✅ All design tokens are defined in SCSS maps in `_design-tokens.scss`  
✅ Material 3 theme still applies correctly (test by inspecting computed `--mat-sys-*` vars in DevTools)  
✅ No new console warnings or errors  
✅ Linter passes  
✅ Build succeeds

---

### Step 3: Base Button Component (Material + Variants)

**Duration:** 45–60 min (1 PR)  
**Model Tier:** Default  
**Parallelizes With:** Steps 4, 5, 6 (after Step 2 completes)  
**Depends On:** Step 2

#### Context Brief

Create the first base component: a typed, reusable Button that wraps Material's `mat-button` with a clean API. Support all Material button variants (`raised`, `stroked`, `flat`) plus custom variants for primary actions, secondary actions, and danger states. Use inputs/outputs pattern and ensure accessibility.

**Figma Reference:** https://www.figma.com/design/CfSunYMT94hLR3tX3XIjkH/Progresso-Docente-P3?node-id=1-302&m=dev

#### Task List

- [ ] Create `src/app/shared/components/base/button/button.component.ts`:

  ```typescript
  import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
  import { MatButtonModule } from '@angular/material/button';
  import { NgClass } from '@angular/common';

  export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
  export type ButtonSize = 'small' | 'medium' | 'large';

  @Component({
    selector: 'app-button',
    standalone: true,
    imports: [MatButtonModule, NgClass],
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class ButtonComponent {
    @Input() variant: ButtonVariant = 'primary';
    @Input() size: ButtonSize = 'medium';
    @Input() disabled = false;
    @Input() type: 'button' | 'submit' | 'reset' = 'button';
    @Input() icon?: string;
    @Output() clicked = new EventEmitter<void>();

    protected onClickHandler(): void {
      this.clicked.emit();
    }

    protected get matVariant(): string {
      return this.variant === 'primary' ? 'raised' : 'stroked';
    }
  }
  ```

- [ ] Create `src/app/shared/components/base/button/button.component.html`:
  ```html
  <button
    [mat-button]="matVariant === 'raised'"
    [mat-stroked-button]="matVariant === 'stroked'"
    [disabled]="disabled"
    [type]="type"
    [ngClass]="'btn-' + variant + ' btn-' + size"
    (click)="onClickHandler()"
    role="button"
  >
    <ng-content></ng-content>
  </button>
  ```
  OR use `[attr.aria-disabled]` if needed.
- [ ] Create `src/app/shared/components/base/button/button.component.scss`:

  ```scss
  @import '../../styles/component-tokens';

  :host {
    display: inline-block;
  }

  button {
    border-radius: radius('md');
    font-weight: 500;
    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);

    &.btn-primary {
      background-color: color('primary');
      color: color('on-primary');

      &:hover:not(:disabled) {
        background-color: darken(color('primary'), 8%);
      }
    }

    &.btn-secondary {
      background-color: transparent;
      border: 1px solid color('primary');
      color: color('primary');

      &:hover:not(:disabled) {
        background-color: rgba(color('primary'), 0.04);
      }
    }

    &.btn-danger {
      background-color: color('error');
      color: white;

      &:hover:not(:disabled) {
        background-color: darken(color('error'), 8%);
      }
    }

    &.btn-small {
      padding: space('sm') space('md');
      font-size: 0.875rem;
    }

    &.btn-medium {
      padding: space('md') space('lg');
      font-size: 1rem;
    }

    &.btn-large {
      padding: space('lg') space('xl');
      font-size: 1.125rem;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &:focus-visible {
      outline: 2px solid color('primary');
      outline-offset: 2px;
    }
  }
  ```

- [ ] Create `src/app/shared/components/base/button/button.component.spec.ts`:

  ```typescript
  import { ComponentFixture, TestBed } from '@angular/core/testing';
  import { ButtonComponent } from './button.component';

  describe('ButtonComponent', () => {
    let component: ButtonComponent;
    let fixture: ComponentFixture<ButtonComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ButtonComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(ButtonComponent);
      component = fixture.componentInstance;
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should emit clicked event on button click', () => {
      spyOn(component.clicked, 'emit');
      const button = fixture.nativeElement.querySelector('button');
      button.click();
      expect(component.clicked.emit).toHaveBeenCalled();
    });

    it('should apply correct CSS class for variant', () => {
      component.variant = 'secondary';
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('button');
      expect(button.classList.contains('btn-secondary')).toBe(true);
    });

    it('should apply correct CSS class for size', () => {
      component.size = 'large';
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('button');
      expect(button.classList.contains('btn-large')).toBe(true);
    });

    it('should be disabled when disabled=true', () => {
      component.disabled = true;
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('button');
      expect(button.disabled).toBe(true);
    });
  });
  ```

- [ ] Update `src/app/shared/index.ts`:
  ```typescript
  export * from './components/base/button/button.component';
  ```

#### Affected Files

- Create: `src/app/shared/components/base/button/button.component.ts`
- Create: `src/app/shared/components/base/button/button.component.html`
- Create: `src/app/shared/components/base/button/button.component.scss`
- Create: `src/app/shared/components/base/button/button.component.spec.ts`
- Modify: `src/app/shared/index.ts`

#### Verification Commands

```bash
npm run test -- button.component              # Tests pass
npm run lint                                   # No lint errors
npm run build                                  # Build succeeds
```

#### Exit Criteria

✅ ButtonComponent creates without errors  
✅ All unit tests pass (4 test cases minimum)  
✅ Component renders `<button>` with correct variant & size classes  
✅ `clicked` event emits on click  
✅ Accessibility attributes present (role, aria-disabled if needed)  
✅ Linter passes  
✅ No Material warnings or errors

---

### Step 4: Base Input Component (Material Form Field)

**Duration:** 60–90 min (1 PR)  
**Model Tier:** Default  
**Parallelizes With:** Steps 3, 5, 6 (after Step 2 completes)  
**Depends On:** Step 2

#### Context Brief

Create a reusable Input wrapper around Material's `mat-form-field` and `matInput` directive. Support multiple input types (`text`, `email`, `password`, `number`), icons (prefix/suffix), error states, and label positioning. This is a larger component that will be heavily reused, so invest in comprehensive slots and composition.

**Figma Reference:** https://www.figma.com/design/CfSunYMT94hLR3tX3XIjkH/Progresso-Docente-P3?node-id=1-1537&m=dev

#### Task List

- [ ] Create `src/app/shared/components/base/input/input.component.ts`:

  ```typescript
  import {
    Component,
    Input,
    Output,
    EventEmitter,
    ChangeDetectionStrategy,
    forwardRef,
  } from '@angular/core';
  import {
    ReactiveFormsModule,
    ControlValueAccessor,
    NG_VALUE_ACCESSOR,
    FormControl,
  } from '@angular/forms';
  import { MatFormFieldModule } from '@angular/material/form-field';
  import { MatInputModule } from '@angular/material/input';
  import { MatIconModule } from '@angular/material/icon';
  import { CommonModule } from '@angular/common';

  @Component({
    selector: 'app-input',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule],
    templateUrl: './input.component.html',
    styleUrl: './input.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => InputComponent),
        multi: true,
      },
    ],
  })
  export class InputComponent implements ControlValueAccessor {
    @Input() label: string = '';
    @Input() type: 'text' | 'email' | 'password' | 'number' | 'tel' = 'text';
    @Input() placeholder: string = '';
    @Input() disabled = false;
    @Input() readonly = false;
    @Input() prefixIcon?: string;
    @Input() suffixIcon?: string;
    @Input() errorMessage?: string;
    @Input() hint?: string;
    @Input() appearance: 'outline' | 'fill' = 'outline';
    @Input() control?: FormControl;
    @Output() valueChange = new EventEmitter<string>();
    @Output() blur = new EventEmitter<FocusEvent>();

    protected value: string = '';
    protected onChange: (value: any) => void = () => {};
    protected onTouched: () => void = () => {};

    writeValue(obj: any): void {
      this.value = obj || '';
    }

    registerOnChange(fn: any): void {
      this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
      this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
      this.disabled = isDisabled;
    }

    protected onInputChange(event: Event): void {
      const value = (event.target as HTMLInputElement).value;
      this.value = value;
      this.onChange(value);
      this.valueChange.emit(value);
    }

    protected onInputBlur(event: FocusEvent): void {
      this.onTouched();
      this.blur.emit(event);
    }
  }
  ```

- [ ] Create `src/app/shared/components/base/input/input.component.html`:
  ```html
  <mat-form-field [appearance]="appearance" class="input-field">
    <mat-label *ngIf="label">{{ label }}</mat-label>

    <mat-icon matPrefix *ngIf="prefixIcon">{{ prefixIcon }}</mat-icon>

    <input
      matInput
      [type]="type"
      [placeholder]="placeholder"
      [disabled]="disabled"
      [readonly]="readonly"
      [value]="value"
      (input)="onInputChange($event)"
      (blur)="onInputBlur($event)"
      [attr.aria-label]="label || placeholder"
      [attr.aria-invalid]="control?.invalid && control?.touched"
    />

    <mat-icon matSuffix *ngIf="suffixIcon && !control?.invalid"> {{ suffixIcon }} </mat-icon>

    <mat-error *ngIf="control?.invalid && control?.touched">
      {{ errorMessage || 'Invalid input' }}
    </mat-error>

    <mat-hint *ngIf="hint">{{ hint }}</mat-hint>
  </mat-form-field>
  ```
- [ ] Create `src/app/shared/components/base/input/input.component.scss`:

  ```scss
  @import '../../styles/component-tokens';

  :host {
    display: block;
    width: 100%;
  }

  .input-field {
    width: 100%;

    ::ng-deep {
      .mat-mdc-form-field-focus-overlay {
        background-color: rgba(color('primary'), 0.04);
      }

      .mdc-text-field--outlined {
        border-radius: radius('md');

        &.mdc-text-field--focused {
          border-color: color('primary');
        }
      }
    }
  }

  input {
    font-family: var(--font-family-base);
  }
  ```

- [ ] Create `src/app/shared/components/base/input/input.component.spec.ts`:

  ```typescript
  import { ComponentFixture, TestBed } from '@angular/core/testing';
  import { InputComponent } from './input.component';
  import { FormControl } from '@angular/forms';

  describe('InputComponent', () => {
    let component: InputComponent;
    let fixture: ComponentFixture<InputComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [InputComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(InputComponent);
      component = fixture.componentInstance;
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should emit valueChange on input', () => {
      spyOn(component.valueChange, 'emit');
      const input = fixture.nativeElement.querySelector('input');
      input.value = 'test';
      input.dispatchEvent(new Event('input'));
      expect(component.valueChange.emit).toHaveBeenCalledWith('test');
    });

    it('should emit blur on blur', () => {
      spyOn(component.blur, 'emit');
      const input = fixture.nativeElement.querySelector('input');
      input.dispatchEvent(new FocusEvent('blur'));
      expect(component.blur.emit).toHaveBeenCalled();
    });

    it('should set type attribute correctly', () => {
      component.type = 'email';
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector('input');
      expect(input.type).toBe('email');
    });

    it('should show error message if control is invalid and touched', () => {
      component.control = new FormControl();
      component.control.setErrors({ required: true });
      component.control.markAsTouched();
      component.errorMessage = 'This field is required';
      fixture.detectChanges();
      const error = fixture.nativeElement.querySelector('mat-error');
      expect(error).toBeTruthy();
    });
  });
  ```

- [ ] Update `src/app/shared/index.ts` to export InputComponent

#### Affected Files

- Create: `src/app/shared/components/base/input/input.component.ts`
- Create: `src/app/shared/components/base/input/input.component.html`
- Create: `src/app/shared/components/base/input/input.component.scss`
- Create: `src/app/shared/components/base/input/input.component.spec.ts`
- Modify: `src/app/shared/index.ts`

#### Verification Commands

```bash
npm run test -- input.component                # Tests pass
npm run lint                                    # No lint errors
npm run build                                   # Build succeeds
```

#### Exit Criteria

✅ InputComponent creates and renders input field  
✅ Implements ControlValueAccessor correctly  
✅ All unit tests pass (5 test cases minimum)  
✅ FormControl integration works (error states, touched, etc.)  
✅ Accessibility: aria-label, aria-invalid present  
✅ Linter passes  
✅ Material `mat-form-field` and `mat-icon` integrate cleanly

---

### Step 5: Base Checkbox Component

**Duration:** 30–45 min (1 PR)  
**Model Tier:** Default  
**Parallelizes With:** Steps 3, 4, 6 (after Step 2 completes)  
**Depends On:** Step 2

#### Context Brief

Create a lightweight Checkbox wrapper around Material's `mat-checkbox`. Support label, disabled state, and checked/unchecked signals. This is a simple component, so keep it minimal but ensure it integrates with Reactive Forms.

**Figma Reference:** https://www.figma.com/design/CfSunYMT94hLR3tX3XIjkH/Progresso-Docente-P3?node-id=1-1716&m=dev

#### Task List

- [ ] Create `src/app/shared/components/base/checkbox/checkbox.component.ts`:

  ```typescript
  import {
    Component,
    Input,
    Output,
    EventEmitter,
    ChangeDetectionStrategy,
    forwardRef,
  } from '@angular/core';
  import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
  import { MatCheckboxModule } from '@angular/material/checkbox';

  @Component({
    selector: 'app-checkbox',
    standalone: true,
    imports: [MatCheckboxModule, ReactiveFormsModule],
    templateUrl: './checkbox.component.html',
    styleUrl: './checkbox.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => CheckboxComponent),
        multi: true,
      },
    ],
  })
  export class CheckboxComponent implements ControlValueAccessor {
    @Input() label: string = '';
    @Input() disabled = false;
    @Input() indeterminate = false;
    @Output() change = new EventEmitter<boolean>();

    protected isChecked = false;
    protected onChange: (value: any) => void = () => {};
    protected onTouched: () => void = () => {};

    writeValue(obj: any): void {
      this.isChecked = !!obj;
    }

    registerOnChange(fn: any): void {
      this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
      this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
      this.disabled = isDisabled;
    }

    protected onCheckboxChange(event: any): void {
      this.isChecked = event.checked;
      this.onChange(this.isChecked);
      this.change.emit(this.isChecked);
    }
  }
  ```

- [ ] Create `src/app/shared/components/base/checkbox/checkbox.component.html`:
  ```html
  <mat-checkbox
    [checked]="isChecked"
    [disabled]="disabled"
    [indeterminate]="indeterminate"
    (change)="onCheckboxChange($event)"
    [attr.aria-label]="label"
  >
    {{ label }}
  </mat-checkbox>
  ```
- [ ] Create `src/app/shared/components/base/checkbox/checkbox.component.scss`:

  ```scss
  @import '../../styles/component-tokens';

  :host {
    display: block;
  }

  mat-checkbox {
    ::ng-deep {
      .mdc-checkbox__native-control {
        accent-color: color('primary');
      }
    }
  }
  ```

- [ ] Create `src/app/shared/components/base/checkbox/checkbox.component.spec.ts`:

  ```typescript
  import { ComponentFixture, TestBed } from '@angular/core/testing';
  import { CheckboxComponent } from './checkbox.component';

  describe('CheckboxComponent', () => {
    let component: CheckboxComponent;
    let fixture: ComponentFixture<CheckboxComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CheckboxComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(CheckboxComponent);
      component = fixture.componentInstance;
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should emit change event when toggled', () => {
      spyOn(component.change, 'emit');
      const checkbox = fixture.nativeElement.querySelector('mat-checkbox');
      checkbox.click();
      expect(component.change.emit).toHaveBeenCalled();
    });

    it('should be disabled when disabled=true', () => {
      component.disabled = true;
      fixture.detectChanges();
      const checkbox = fixture.nativeElement.querySelector('mat-checkbox');
      expect(checkbox.getAttribute('aria-disabled')).toBe('true');
    });
  });
  ```

- [ ] Update `src/app/shared/index.ts` to export CheckboxComponent

#### Affected Files

- Create: `src/app/shared/components/base/checkbox/checkbox.component.ts`
- Create: `src/app/shared/components/base/checkbox/checkbox.component.html`
- Create: `src/app/shared/components/base/checkbox/checkbox.component.scss`
- Create: `src/app/shared/components/base/checkbox/checkbox.component.spec.ts`
- Modify: `src/app/shared/index.ts`

#### Exit Criteria

✅ CheckboxComponent creates and renders checkbox  
✅ Implements ControlValueAccessor  
✅ Unit tests pass (3+ test cases)  
✅ Linter passes

---

### Step 6: Base Card Component (Optional - Dashboard-first)

**Duration:** 30–45 min (1 PR)  
**Model Tier:** Default  
**Parallelizes With:** Steps 3, 4, 5 (after Step 2 completes)  
**Depends On:** Step 2

> Escopo atual: **adiado** neste primeiro ciclo para acelerar entrega de login e formularios base.
> O login atual pode continuar com `mat-card` nativo do Angular Material sem prejuizo arquitetural.

#### Context Brief

Create a Card wrapper around Material's `mat-card` with a clean content projection pattern. Support optional header, footer, and shadow variants. This is a layout component used for all panels, creating a consistent visual language.

**Figma Reference:** https://www.figma.com/design/CfSunYMT94hLR3tX3XIjkH/Progresso-Docente-P3?node-id=1-438&m=dev

#### Task List

- [ ] Create `src/app/shared/components/base/card/card.component.ts`:

  ```typescript
  import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
  import { MatCardModule } from '@angular/material/card';
  import { NgClass } from '@angular/common';

  export type CardVariant = 'elevated' | 'outlined' | 'filled';

  @Component({
    selector: 'app-card',
    standalone: true,
    imports: [MatCardModule, NgClass],
    templateUrl: './card.component.html',
    styleUrl: './card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class CardComponent {
    @Input() variant: CardVariant = 'outlined';
    @Input() padding: 'sm' | 'md' | 'lg' = 'md';
  }
  ```

- [ ] Create `src/app/shared/components/base/card/card.component.html`:
  ```html
  <mat-card
    [appearance]="variant === 'outlined' ? 'outlined' : 'raised'"
    [ngClass]="'card-' + variant + ' card-padding-' + padding"
  >
    <ng-content></ng-content>
  </mat-card>
  ```
- [ ] Create `src/app/shared/components/base/card/card.component.scss`:

  ```scss
  @import '../../styles/component-tokens';

  :host {
    display: block;
  }

  mat-card {
    border-radius: radius('lg');
    transition: box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1);

    &.card-elevated {
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    }

    &.card-outlined {
      border: 1px solid color('outline');
    }

    &.card-padding-sm {
      padding: space('md');
    }

    &.card-padding-md {
      padding: space('lg');
    }

    &.card-padding-lg {
      padding: space('xl');
    }
  }
  ```

- [ ] Create `src/app/shared/components/base/card/card.component.spec.ts`:

  ```typescript
  import { ComponentFixture, TestBed } from '@angular/core/testing';
  import { CardComponent } from './card.component';

  describe('CardComponent', () => {
    let component: CardComponent;
    let fixture: ComponentFixture<CardComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CardComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(CardComponent);
      component = fixture.componentInstance;
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should apply correct variant class', () => {
      component.variant = 'elevated';
      fixture.detectChanges();
      const card = fixture.nativeElement.querySelector('mat-card');
      expect(card.classList.contains('card-elevated')).toBe(true);
    });
  });
  ```

- [ ] Update `src/app/shared/index.ts` to export CardComponent

#### Affected Files

- Create: `src/app/shared/components/base/card/card.component.ts`
- Create: `src/app/shared/components/base/card/card.component.html`
- Create: `src/app/shared/components/base/card/card.component.scss`
- Create: `src/app/shared/components/base/card/card.component.spec.ts`
- Modify: `src/app/shared/index.ts`

#### Exit Criteria

✅ CardComponent creates and renders card  
✅ Variants apply correctly  
✅ Unit tests pass  
✅ Linter passes

---

### Step 7: Base Form Field Wrapper (Label + Hint + Error)

**Duration:** 30–45 min (1 PR)  
**Model Tier:** Default  
**Parallelizes With:** None  
**Depends On:** Steps 3, 4, 5 (Step 6 opcional)

#### Context Brief

Create a reusable wrapper component that combines label, input/control, hint, and error messaging into a single unit. This eliminates boilerplate in forms and ensures consistent error UX across all pages.

#### Task List

- [ ] Create `src/app/shared/components/form/form-field/form-field.component.ts`:

  ```typescript
  import { Component, Input, ContentChild, ChangeDetectionStrategy } from '@angular/core';
  import { FormControl, ReactiveFormsModule } from '@angular/forms';
  import { CommonModule } from '@angular/common';

  @Component({
    selector: 'app-form-field',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './form-field.component.html',
    styleUrl: './form-field.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class FormFieldComponent {
    @Input() label?: string;
    @Input() hint?: string;
    @Input() errorMessage?: string;
    @Input() control?: FormControl;
    @Input() required = false;

    protected get showError(): boolean {
      return !!(this.control?.invalid && (this.control?.touched || this.control?.dirty));
    }
  }
  ```

- [ ] Create `src/app/shared/components/form/form-field/form-field.component.html`:

  ```html
  <fieldset class="form-field">
    <label *ngIf="label" class="form-label">
      {{ label }}
      <span *ngIf="required" class="required" aria-label="required">*</span>
    </label>

    <div class="form-control">
      <ng-content></ng-content>
    </div>

    <div class="form-messages">
      <p *ngIf="showError" class="error-message">{{ errorMessage }}</p>
      <p *ngIf="hint && !showError" class="hint-message">{{ hint }}</p>
    </div>
  </fieldset>
  ```

- [ ] Create `src/app/shared/components/form/form-field/form-field.component.scss`:

  ```scss
  @import '../../styles/component-tokens';

  .form-field {
    border: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: space('sm');
    width: 100%;
  }

  .form-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: color('text-primary');

    .required {
      color: color('error');
    }
  }

  .form-control {
    display: flex;
    flex-direction: column;
  }

  .form-messages {
    min-height: 1rem;
    font-size: 0.75rem;

    .error-message {
      color: color('error');
      margin: 0;
    }

    .hint-message {
      color: color('text-muted');
      margin: 0;
    }
  }
  ```

- [ ] Create `src/app/shared/components/form/form-field/form-field.component.spec.ts`
- [ ] Update `src/app/shared/index.ts`

#### Affected Files

- Create: `src/app/shared/components/form/form-field/form-field.component.*`
- Modify: `src/app/shared/index.ts`

#### Exit Criteria

✅ FormFieldComponent creates and displays label/hint/error  
✅ Unit tests pass  
✅ Content projection works for form controls  
✅ Linter passes

---

### Step 8: Composed Form Group Component (Login Specific)

**Duration:** 45–60 min (1 PR)  
**Model Tier:** Default  
**Parallelizes With:** Step 9 (Login page refactor can start here)  
**Depends On:** Step 7

#### Context Brief

Create a `LoginFormComponent` that composes the base components (Input, Checkbox, Button) into a reusable login form. This replaces the inline form in `login.page.ts` and demonstrates how to compose base components into domain-specific forms.

#### Task List

- [ ] Create `src/app/shared/components/form/login-form/login-form.component.ts`:

  ```typescript
  import { Component, Output, EventEmitter, ChangeDetectionStrategy, inject } from '@angular/core';
  import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
  import { InputComponent, CheckboxComponent, ButtonComponent, CardComponent } from '../../..';

  export interface LoginFormData {
    email: string;
    password: string;
    rememberMe: boolean;
  }

  @Component({
    selector: 'app-login-form',
    standalone: true,
    imports: [
      ReactiveFormsModule,
      InputComponent,
      CheckboxComponent,
      ButtonComponent,
      CardComponent,
    ],
    templateUrl: './login-form.component.html',
    styleUrl: './login-form.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class LoginFormComponent {
    private readonly fb = inject(FormBuilder);

    @Output() submitted = new EventEmitter<LoginFormData>();

    protected readonly loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false],
    });

    protected onSubmit(): void {
      if (this.loginForm.invalid) {
        this.loginForm.markAllAsTouched();
        return;
      }

      const data: LoginFormData = this.loginForm.getRawValue();
      this.submitted.emit(data);
    }
  }
  ```

- [ ] Create `src/app/shared/components/form/login-form/login-form.component.html`:

  ```html
  <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" novalidate>
    <app-form-field
      label="E-mail institucional"
      [control]="loginForm.get('email')"
      required
      errorMessage="Informe um e-mail valido"
    >
      <app-input
        type="email"
        placeholder="nome.sobrenome@universidade.br"
        prefixIcon="mail_outline"
        [control]="loginForm.get('email')"
      />
    </app-form-field>

    <app-form-field
      label="Senha"
      [control]="loginForm.get('password')"
      required
      errorMessage="Senha deve ter no mínimo 8 caracteres"
    >
      <app-input
        type="password"
        placeholder="••••••••"
        prefixIcon="lock_outline"
        [control]="loginForm.get('password')"
      />
    </app-form-field>

    <app-checkbox label="Lembrar-me" [formControl]="loginForm.get('rememberMe')" />

    <app-button
      variant="primary"
      size="large"
      type="submit"
      [disabled]="loginForm.invalid && loginForm.touched"
    >
      Acessar Portal
    </app-button>
  </form>
  ```

- [ ] Create `src/app/shared/components/form/login-form/login-form.component.scss`:

  ```scss
  @import '../../styles/component-tokens';

  form {
    display: grid;
    gap: space('lg');
  }

  app-button {
    width: 100%;
  }
  ```

- [ ] Create unit tests

#### Affected Files

- Create: `src/app/shared/components/form/login-form/login-form.component.*`
- Modify: `src/app/shared/index.ts`

#### Exit Criteria

✅ LoginFormComponent composes base components correctly  
✅ Form validation works  
✅ Emits `submitted` event with form data  
✅ Unit tests pass

---

### Step 9: Refactor Login Page to Use Base Components

**Duration:** 30–45 min (1 PR)  
**Model Tier:** Default  
**Parallelizes With:** Step 8 (can start together)  
**Depends On:** Steps 3, 4, 5, 7, 8 (Step 6 opcional)

#### Context Brief

Replace inline Material customization and CSS hacks in the login page with clean composition of the new base components. Remove `::ng-deep` from `login.page.css`, simplify `login.page.ts` logic, and ensure the page still matches the Figma design.

#### Task List

- [ ] Refactor `src/app/features/auth/pages/login/login.page.ts`:
  - Remove inline `MatButton`, `MatInput`, etc. imports (move to `LoginFormComponent`)
  - Import `LoginFormComponent` and `CardComponent`
  - Remove `Form Builder`, validators (now in `LoginFormComponent`)
  - Keep layout logic only (brand panel, card layout, etc.)
  - Handle form submission via `LoginFormComponent.submitted` event
- [ ] Refactor `src/app/features/auth/pages/login/login.page.html`:
  - Replace inline form with `<app-login-form (submitted)="onSubmit($event)">`
  - Keep brand panel and decorative shells as-is
  - Remove inline error messages, focus management
- [ ] Refactor `src/app/features/auth/pages/login/login.page.css`:
  - Remove all `::ng-deep` hacks for Material override
  - Keep only layout styles: `.login-screen`, `.login-card`, `.brand-panel`, `.form-panel`
  - Remove input/button/checkbox styling (now in base components)
  - Ensure brand panel still looks correct
- [ ] Run tests to verify nothing breaks
- [ ] Validate design visually against Figma

#### Affected Files

- Modify: `src/app/features/auth/pages/login/login.page.ts`
- Modify: `src/app/features/auth/pages/login/login.page.html`
- Modify: `src/app/features/auth/pages/login/login.page.css`
- Modify: `src/app/features/auth/pages/login/login.page.spec.ts` (update tests)

#### Verification Commands

```bash
npm run test -- login.page                     # Tests pass
npm run lint                                    # No lint errors
npm run build                                   # Build succeeds
npm run start                                   # Visually inspect /login route
```

#### Exit Criteria

✅ Login page renders without `::ng-deep` hacks  
✅ Form validation works as before  
✅ Responsive layout matches Figma  
✅ All tests pass  
✅ No Material warnings in console  
✅ Linter passes  
✅ Visual comparison with Figma ✓

---

### Step 10: Create Component Library Documentation

**Duration:** 45–60 min (1 PR)  
**Model Tier:** Default  
**Parallelizes With:** None  
**Depends On:** Steps 3–9

#### Context Brief

Write comprehensive documentation for the new component library. Include component APIs, usage examples, design token reference, and a visual component showcase (via Storybook, Markdown examples, or interactive HTML).

#### Task List

- [ ] Create `src/app/shared/COMPONENT_LIBRARY.md` with sections for each component:

  ````markdown
  # Component Library

  ## ButtonComponent

  **Variants:** primary, secondary, tertiary, danger  
  **Sizes:** small, medium, large

  ### Usage

  ```typescript
  import { ButtonComponent } from '@app/shared';

  @Component({
    imports: [ButtonComponent],
    template: `<app-button variant="primary" size="large" (clicked)="handleClick()"
      >Click me</app-button
    >`,
  })
  export class MyComponent {}
  ```
  ````

  ### Props
  - `variant: ButtonVariant` — Button style variant
  - `size: ButtonSize` — Button size
  - `disabled: boolean` — Disable button
  - `type: 'button' | 'submit' | 'reset'` — HTML button type
  - `(clicked): EventEmitter<void>` — Click event

  ### Accessible?

  ✅ ARIA role="button", focus visible, keyboard support

  ```

  ```

- [ ] Create `src/app/shared/DESIGN_TOKENS.md` documenting all tokens, their values, and usage recommendations
- [ ] Create `src/app/shared/components/base/SHOWCASE.html` (optional) with interactive examples of all components
- [ ] Add component import examples to `README.md` root: "Using Base Components" section
- [ ] Create `MIGRATION_GUIDE.md` showing how to migrate existing pages to use the new components

#### Affected Files

- Create: `src/app/shared/COMPONENT_LIBRARY.md`
- Create: `src/app/shared/DESIGN_TOKENS.md`
- Create: `src/styles/TOKENS_REFERENCE.md`
- Modify: `README.md` (Component Library section)

#### Exit Criteria

✅ All 5+ base components documented with examples  
✅ Design tokens clearly listed  
✅ Migration guide from old pattern to new pattern  
✅ No broken links in docs  
✅ README updated

---

### Step 11: Add Comprehensive Tests & Examples

**Duration:** 60–90 min (1 PR)  
**Model Tier:** Default  
**Parallelizes With:** None  
**Depends On:** Step 9

#### Context Brief

Increase test coverage to 80%+ across all base components and add integration tests for composed form components. Verify that base components work correctly with Material 3 theme and Tailwind utilities.

#### Task List

- [ ] Review existing test files (Steps 3–9) for gaps; add missing cases:
  - All component variants tested
  - Form control integration tested
  - Disabled states tested
  - Focus/blur events tested
  - Keyboard navigation (buttons, inputs) tested
  - Accessibility attributes present (`aria-*`)
- [ ] Create integration test: `src/app/shared/components/form/login-form/login-form.integration.spec.ts`
  - Full form submission flow
  - Error display
  - Material theme applies correctly
- [ ] Run coverage report:
  ```bash
  npm run test -- --coverage
  ```
- [ ] Ensure coverage > 80% for all files in `src/app/shared/components/`
- [ ] Update `angular.json` test config to enforce coverage thresholds

#### Affected Files

- Modify: All `*.component.spec.ts` files to increase coverage
- Create: `login-form.integration.spec.ts`
- Modify: `angular.json` (coverage thresholds)

#### Verification Commands

```bash
npm run test -- --coverage src/app/shared/components/
```

#### Exit Criteria

✅ Coverage ≥ 80% for all base components  
✅ All `ng lint` rules pass  
✅ All tests pass (`npm run test`)  
✅ Snapshot tests (if used) all reviewed and approved

---

### Step 12: Project Audit & Cleanup

**Duration:** 45–60 min (1 PR)  
**Model Tier:** Strongest (Opus)  
**Parallelizes With:** None  
**Depends On:** All prior steps (11)

#### Context Brief

A final adversarial review to ensure the entire refactoring meets SOLID principles, follows Angular best practices, and is ready for production. Verify no Material customizations remain, no `::ng-deep`, and all anti-patterns are eliminated.

#### Task List

- [ ] Remove deprecated code:
  - Old Material imports from feature pages (only login refactored; others next)
  - Any remaining `::ng-deep` in CSS
  - Unused CSS variables from `src/styles/tokens.css`
- [ ] Verify:
  - [ ] No `::ng-deep` in any component or feature CSS
  - [ ] All Material imports use top-level Material modules (not direct paths)
  - [ ] All form controls use Reactive Forms
  - [ ] Tree-shaking works: unused Material modules are not bundled
  - [ ] Bundle size did not increase significantly
  - [ ] No console errors/warnings on any page
- [ ] Perform security audit:
  - [ ] Form inputs sanitize user input
  - [ ] No hardcoded secrets or tokens
  - [ ] CSRF tokens (if needed) are configured
- [ ] Generate bundle analysis:
  ```bash
  npm run build -- --configuration production --stats-json
  ```
- [ ] Document architecture decisions in `ARCHITECTURE.md` (new file)
- [ ] Create migration checklist for other feature pages (signup, forgot-password, etc.)

#### Affected Files

- Create: `ARCHITECTURE.md` (project-root)
- Create: `MIGRATION_CHECKLIST.md` (project-root)
- Modify: `.eslintrc.json` (if needed—enforce no `::ng-deep`)

#### Verification Commands

```bash
npm run build -- --configuration production
npm run lint
npm run test
# Bundle analysis in dist/
```

#### Exit Criteria

✅ No `::ng-deep` in codebase  
✅ Bundle size within acceptable threshold  
✅ 80%+ test coverage across base components  
✅ All linting rules pass  
✅ No console errors  
✅ Login page visually matches Figma  
✅ Architecture document updated  
✅ Lint enforces anti-patterns (e.g., no `::ng-deep`)

---

## Dependency and Sequencing Summary

| Step | Title                     | Duration | Blocker     | Parallelizes With |
| ---- | ------------------------- | -------- | ----------- | ----------------- |
| 1    | Project Structure         | 15–30m   | —           | —                 |
| 2    | Design Tokens             | 30–45m   | Step 1      | —                 |
| 3    | Button Component          | 45–60m   | Step 2      | 4, 5, 6           |
| 4    | Input Component           | 60–90m   | Step 2      | 3, 5, 6           |
| 5    | Checkbox Component        | 30–45m   | Step 2      | 3, 4, 6           |
| 6    | Card Component (optional) | 30–45m   | Step 2      | 3, 4, 5           |
| 7    | Form Field Wrapper        | 30–45m   | 3,4,5       | —                 |
| 8    | Login Form Composed       | 45–60m   | Step 7      | 9                 |
| 9    | Refactor Login Page       | 30–45m   | 3,4,5,6,7,8 | 8                 |
| 10   | Documentation             | 45–60m   | Step 9      | —                 |
| 11   | Tests & Coverage          | 60–90m   | Step 9      | —                 |
| 12   | Audit & Cleanup           | 45–60m   | Step 11     | —                 |

**Critical Path:** 1 → 2 → (3,4,5 in parallel) → 7 → (8,9 in parallel) → 10 → 11 → 12  
**Parallel Streams:**

- Stream A: After Step 2: Steps 3, 5 (independent components)
- Stream B: After Step 2: Step 4 (Input component)
- Stream C: After Step 7: Steps 8, 9 (Form composition and page refactor)

**Minimum Single-Agent Timeline:** ~14–17 hours (sequential)  
**Parallel Timeline (2 agents):** ~9–11 hours (best case)

---

## Anti-Pattern Catalog

**Violations to Catch:**

1. ❌ **`::ng-deep` CSS hacks** → Use component-scoped styles + base components instead
2. ❌ **Hardcoded colors/spacing** → Use design token SCSS maps
3. ❌ **Material imports in feature pages** → Import from base components only
4. ❌ **Duplicate form logic** → Compose with `LoginFormComponent` or similar
5. ❌ **No error handling in forms** → Always show error messages + hints
6. ❌ **Inline validators** → Create reusable validator functions
7. ❌ **Components >800 lines** → Split into smaller, focused components
8. ❌ **No accessibility attributes** → All interactive elements need `aria-*`
9. ❌ **Untyped inputs/outputs** → All `@Input()` and `@Output()` must be typed
10. ❌ **No unit tests** → All components must have ≥3 test cases

---

## Plan Mutation Protocol

### Scenario 1: Adding a New Component (e.g., "Radio Button")

1. Insert new step between Steps 5 and 6
2. Same dependencies as Checkbox (Step 2)
3. Update dependency graph
4. Timeline increases by ~30–45 min

### Scenario 2: Skipping Step 8 (No Composed Form Component)

1. Proceed directly from Step 7 → Step 9 (Login refactor)
2. Login page must manually compose base components
3. More boilerplate in login page; less reusable

### Scenario 3: Refactoring Other Pages (Signup, Forgot-Password)

1. Create Step 13–15 after Step 12 (post-audit)
2. Each page follows same pattern as login (Step 9)
3. Can run in parallel once base components are stable

---

## Success Metrics

After Plan Completion:

- ✅ All 5+ base components created with Material 3 compliance
- ✅ Login page refactored with 0 `::ng-deep` CSS
- ✅ 80%+ test coverage on base components
- ✅ Design tokens centralized and documented
- ✅ No Material customization hacks
- ✅ FCP (First Contentful Paint) ≤ 2s
- ✅ Bundle size (gzipped) ≤ baseline + 5%
- ✅ 100% Lighthouse Accessibility score on login page
- ✅ Component library documentation complete
- ✅ All feature pages can adopt new components with minimal effort

---

## Quick Reference: File Count Summary

**New Files to Create:** ~50  
**Files to Modify:** ~15  
**Total Impact:** ~65 files

**New TypeScript Components:** 9  
**New SCSS Files:** 8  
**New Spec Files:** 9  
**New Documentation:** 4

---

## Notes for Agents Executing This Plan

1. **Each step is self-contained.** A fresh agent can pick up Step 5 without reading Steps 1–4 if context is provided.
2. **Use `src/app/shared/index.ts` as the contract.** Export all base components here so consumers don't need to know folder structure.
3. **SCSS token functions** (`color()`, `space()`, etc.) are critical. Test them early in Step 2.
4. **Material M3 tokens** are already configured via `mat.all-component-themes()`. Do not override them in component CSS; layer custom styles on top.
5. **Accessibility is non-negotiable.** Every component needs `aria-*` attributes tested.
6. **Test against the Figma designs** provided in the user request. Visual consistency is key to success.

---

**Blueprint Generated:** April 14, 2026  
**Objective:** Refactor Angular Material 3 project to use reusable base components  
**Expected Completion:** 14–17 hours (sequential) / 9–11 hours (parallel with 2 agents)
