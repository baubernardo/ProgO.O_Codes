import { Component, inject, Inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from '../usuario-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css',
})
export class Cadastro {
  public service = inject(UsuarioService);
  public router = inject(Router);
  public usuario: any = {};

  cadastrar(): void {
    this.usuario = this.usuarioForm.value;
    this.service.criarUsuario(this.usuario).subscribe({
      next: (response) => {
        console.log('Usuário cadastrado com sucesso:', response);
        this.usuarioForm.reset();
        this.router.navigate(['/']);
      },
      error: (error) => {
        alert('Erro ao cadastrar usuário. Por favor, tente novamente.');
        console.error('Erro ao cadastrar usuário:', error);
      }
    });
  }

  public usuarioForm = new FormGroup({
    nomeCompleto: new FormControl(''),
    email: new FormControl(''),
    senha: new FormControl(''),
    endereco: new FormControl(''),
    cep: new FormControl(''),
    cidade: new FormControl(''),
    uf: new FormControl('')
  });
}
