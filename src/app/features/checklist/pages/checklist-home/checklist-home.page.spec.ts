import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChecklistHomePage } from './checklist-home.page';
import { MatIconModule } from '@angular/material/icon';

describe('ChecklistHomePage', () => {
  let component: ChecklistHomePage;
  let fixture: ComponentFixture<ChecklistHomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChecklistHomePage ],
      imports: [ MatIconModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChecklistHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});