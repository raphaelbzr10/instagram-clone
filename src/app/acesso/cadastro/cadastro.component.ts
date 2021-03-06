import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Autenticacao } from '../../autenticacao.service';
import { Usuario } from '../usuario.model';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {

  @Output() public exibirPainel: EventEmitter<string> = new EventEmitter<string>();

  public formulario: FormGroup = new FormGroup({
    'email': new FormControl(null, Validators.required),
    'nome_completo': new FormControl(null, Validators.required),
    'nome_usuario': new FormControl(null, Validators.required),
    'senha': new FormControl(null, Validators.required),
  })

  constructor(private authService: Autenticacao) { }

  ngOnInit() {
  }

  public exibirPainelLogin(): void {
    this.exibirPainel.emit('login');
  }

  public cadastrarUsuario(): void {

    let usuario: Usuario = new Usuario(
      this.formulario.value.email,
      this.formulario.value.nome_completo,
      this.formulario.value.nome_usuario,
      this.formulario.value.senha
    )

    this.authService.cadastrarUsuario(usuario)
      .then(() => {
        this.exibirPainelLogin();
      })
  }

}
