import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ConfiguracoesHomePage } from './configuracoes-home.page';
import { AuthApiService } from '../../../../core/auth/auth-api.service';
import { AuthStateService } from '../../../../core/auth/auth-state.service';
import { AuthResponseUser } from '../../../../core/auth/auth.models';

describe('ConfiguracoesHomePage', () => {
  let component: ConfiguracoesHomePage;
  let fixture: ComponentFixture<ConfiguracoesHomePage>;

  const mockUser: AuthResponseUser = {
    id: 'u1',
    email: 'docente@uf.br',
    name: 'Docente Teste',
    role: 'USER',
    lattesUrl: null,
    orcid: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfiguracoesHomePage, BrowserAnimationsModule],
      providers: [
        {
          provide: AuthApiService,
          useValue: {
            me: () => of(mockUser),
            updateProfile: () => of(mockUser),
          },
        },
        {
          provide: AuthStateService,
          useValue: {
            applyAuthUser: () => undefined,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfiguracoesHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente com sucesso', () => {
    expect(component).toBeTruthy();
  });
});
