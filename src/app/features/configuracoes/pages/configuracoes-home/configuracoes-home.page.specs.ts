import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfiguracoesHomePage } from './configuracoes-home.page';
import { describe, it, expect, beforeEach } from 'vitest';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ConfiguracoesHomePage', () => {
  let component: ConfiguracoesHomePage;
  let fixture: ComponentFixture<ConfiguracoesHomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfiguracoesHomePage, BrowserAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfiguracoesHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente com sucesso', () => {
    expect(component).toBeTruthy();
  });
});