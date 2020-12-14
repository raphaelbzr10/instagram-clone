import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Progresso } from './progresso.service';

@Injectable()
export class Bd {

    constructor(private progressoService: Progresso) {}

    public publicar(publicacao: any): void {

        firebase.database().ref(`publicacoes/${btoa(publicacao.email)}`)
            .push({titulo: publicacao.titulo})
            .then((resposta: any) => {

                let nomeImagem = resposta.key;

                firebase.storage().ref()
                    .child(`imagens/${nomeImagem}`)
                    .put(publicacao.imagem)
                    .on(firebase.storage.TaskEvent.STATE_CHANGED,
                        (snapshot: any) => {
                            this.progressoService.status = 'andamento';
                            this.progressoService.estado = snapshot;
                        },
                        (error) => {
                            this.progressoService.status = 'erro';
                        },
                        () => {
                            this.progressoService.status = 'concluido';
                        }
                    )
            }); 
    }
}