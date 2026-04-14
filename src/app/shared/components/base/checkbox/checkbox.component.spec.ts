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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit changed event', () => {
    let emitted: boolean | null = null;
    component.changed.subscribe((value) => {
      emitted = value;
    });
    component['onCheckboxChange']({ checked: true } as never);
    expect(emitted).toBe(true);
  });
});
