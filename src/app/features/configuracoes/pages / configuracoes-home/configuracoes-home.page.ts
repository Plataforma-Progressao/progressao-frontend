import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-configuracoes-home',
  standalone: true, // Padrão recomendado no Angular moderno
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
    // Inicializa o formulário com os campos que temos no HTML
    this.configForm = this.fb.group({
      nome: [''],
      email: [''],
      senha: [''],
      confirmarSenha: [''],
      lattes: [''],
      orcid: ['']
    });
  }

  salvarAlteracoes(): void {
    // Aqui no futuro você vai conectar com o back-end
    console.log('Tentando salvar as alterações...', this.configForm.value);
  }
}