import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface AtividadeHistorico {
  id: number;
  titulo: string;
  subtitulo: string;
  categoria: string;
  pontuacao: number;
  status: 'Validado'  | 'Erro';
}

@Component({
  selector: 'app-historico-home',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './historico-home.page.html',
  styleUrls: ['./historico-home.page.scss'],
})

export class HistoricoHomePage implements OnInit {
  abas: string[] = ['Todas Atividades', 'Ensino', 'Pesquisa', 'Extensão', 'Gestão'];
  abaAtiva: string = 'Todas Atividades';

  atividades: AtividadeHistorico[] = [
    {
      id: 1,
      titulo: 'Artigo: Deep Learning in Academic Workflows',
      subtitulo: 'Periódico Q1 • ISSN 1234-5678',
      categoria: 'Pesquisa',
      pontuacao: 45.0,
      status: 'Validado'
    },
    {
      id: 2,
      titulo: 'Cálculo Diferencial e Integral I (60h)',
      subtitulo: 'Graduação • Turma A',
      categoria: 'Ensino',
      pontuacao: 20.0,
      status: 'Erro'
    },
    {
      id: 3,
      titulo: 'Workshop: Curadoria de Dados Públicos',
      subtitulo: 'Evento Comunitário',
      categoria: 'Extensão',
      pontuacao: 15.0,
      status: 'Erro'
    }
  ];

  constructor() {}

  ngOnInit(): void {}

  selecionarAba(aba: string): void {
    this.abaAtiva = aba;
  }
}