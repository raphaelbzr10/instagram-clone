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

    public consultaPublicacoes(emailUsuario: string): Promise<any> {
        return new Promise((resolve, reject) => {
            firebase.database().ref(`publicacoes/${btoa(emailUsuario)}`)
            .orderByKey()
            .once('value')
            .then((snapshot: any) => {
                let publicacoes: any[] = [];

                snapshot.forEach((childSnapshot: any) => {

                    let publicacao = childSnapshot.val();
                    publicacao.key = childSnapshot.key;

                    publicacoes.push(publicacao);
                })

                return publicacoes.reverse();
            })
            .then((publicacoes: any) => {

                publicacoes.forEach((publicacao: any) => {

                    firebase.storage().ref(`imagens/${publicacao.key}`)
                        .getDownloadURL()
                        .then((url: string) => {
                            publicacao.url_imagem = url;

                            firebase.database().ref(`usuario_detalhe/${btoa(emailUsuario)}`)
                                .once('value')
                                .then((snapshot: any) => {
                                    publicacao.nome_usuario = snapshot.val().nome_usuario;
                                    let publicacaoEncontrada = publicacoes.find((item) => item === publicacao);

                                    if (!publicacaoEncontrada) {
                                        publicacoes.push(publicacao);
                                    }
                                });
                        })

                });
                resolve(publicacoes);
            });
        });
    }
}