
import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common'; // Necessário para o *ngFor e [ngClass]
import { MatIconModule } from '@angular/material/icon';

import { MatMenuModule } from '@angular/material/menu';

export interface DocumentoChecklist {
  id: number;
  titulo: string;
  descricao?: string;
  status: 'Concluído' | 'Atenção' | 'Pendente';
  dataEnvio?: string;
  infoAdicional?: string;
}

@Component({
  selector: 'app-checklist-home',
  templateUrl: './checklist-home.page.html',
  styleUrls: ['./checklist-home.page.scss'],
  
  imports: [CommonModule, MatIconModule, MatMenuModule],
})
export class ChecklistHomePage implements OnInit {
  progressoTotal = 60;
  docsValidados = 6;
  docsTotais = 10;

  documentos: DocumentoChecklist[] = [
    {
      id: 1,
      titulo: 'Portaria de Nomeação',
      descricao: 'DOCUMENTO VALIDADO',
      status: 'Concluído',
      dataEnvio: '12/10/23'
    },
    {
      id: 2,
      titulo: 'Relatório Anual de Atividades (RAD)',
      descricao: 'ATENÇÃO: PRAZO EXPIRA EM 3 DIAS',
      status: 'Atenção'
    },
    {
      id: 3,
      titulo: 'Comprovante de Publicação (A1/A2)',
      descricao: 'ATENÇÃO: Requisito mínimo de 2 artigos no período',
      status: 'Pendente'
    },
    {
      id: 4,
      titulo: 'Certificados de Orientação de Mestrado',
      descricao: '3 DOCUMENTOS VALIDADOS',
      status: 'Concluído',

      dataEnvio: '12/10/23',
    },
    {
      id: 5,
      titulo: 'Cópia do Currículo Lattes (PDF)',
      descricao: 'ATENÇÃO: VERSÃO DESATUALIZADA (REF. 2022)',
      status: 'Atenção'
    }
  ];

  documentosOriginais: any[] = [];

  constructor() {}
  ngOnInit() {

    this.documentosOriginais = [...this.documentos];

  }

    filtrarDocumentos(filtro: string) {
        // Se for para limpar o filtro (mostrar todos)
        if (filtro === 'Todos') {
            this.documentos = [...this.documentosOriginais];
            return;
        }

        // Fazemos um "de -> para" porque o menu diz "Enviados", mas o status no código é "Concluído"
        let statusBuscado = filtro;
        if (filtro === 'Enviados') {
            statusBuscado = 'Concluído';
        }

        // Filtra a lista original e atualiza a lista que aparece na tela
        this.documentos = this.documentosOriginais.filter(doc => doc.status === statusBuscado);
    }
}