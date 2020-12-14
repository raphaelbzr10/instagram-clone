import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Bd } from '../../bd.service';

import * as firebase from 'firebase';
import { Progresso } from '../../progresso.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { Subject } from 'rxjs/Rx';

@Component({
  selector: 'app-incluir-publicacao',
  templateUrl: './incluir-publicacao.component.html',
  styleUrls: ['./incluir-publicacao.component.css']
})
export class IncluirPublicacaoComponent implements OnInit {

  public formulario: FormGroup = new FormGroup({
    'titulo': new FormControl(null)
  });

  public email: string;
  private imagem: any;

  public progressoPublicacao: string = 'pendente';
  public porcentagemUpload: number;

  constructor(private bdService: Bd, private progressoService: Progresso) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => {
      this.email = user.email;
    });
  }

  public publicar(): void {
    this.bdService.publicar({
      email: this.email,
      titulo: this.formulario.value.titulo,
      imagem: this.imagem[0]
    });

    let acompanhamentoUpload = Observable.interval(1500);
    let continua = new Subject();

    continua.next(true);

    acompanhamentoUpload
      .takeUntil(continua)
      .subscribe(() => {
        this.progressoPublicacao = 'andamento';

        this.porcentagemUpload = Math.round((this.progressoService.estado.bytesTransferred / this.progressoService.estado.totalBytes) * 100);

        if (this.progressoService.status === 'concluido') {
          this.progressoPublicacao = 'concluido';
          continua.next(false);
        }
      });
  }

  public preparaImagemUpload(event: Event): void {
    this.imagem = (<HTMLInputElement>event.target).files;
  }

}
