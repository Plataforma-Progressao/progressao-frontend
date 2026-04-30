import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-configuracoes-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './configuracoes-home.page.html',
  styleUrls: ['./configuracoes-home.page.scss']
})
export class ConfiguracoesHomePage implements OnInit {
  configForm!: FormGroup;
  hideSenha = true;
  hideConfirmarSenha = true;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.configForm = this.fb.group({
      nome: ['Dra. Ana Souza'],
      email: ['ana.souza@universidade.br'],
      senha: ['123456'],
      confirmarSenha: [''],
      lattes: ['lattes.cnpq.br/1234567890123456'],
      orcid: ['0000-0002-1825-0097']
    });
    
  }

  salvarAlteracoes(): void {
    console.log('Tentando salvar as alterações...', this.configForm.value);
  }
}