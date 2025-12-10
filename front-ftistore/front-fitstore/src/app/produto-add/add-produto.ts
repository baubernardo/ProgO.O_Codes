import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProdutoService } from '../produto-service';
import { CategoriaService } from '../categoria-service';
import { MarcaService } from '../marca-service';
import { Router } from '@angular/router';
import imageCompression from 'browser-image-compression';

@Component({
  selector: 'app-add-produto',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-produto.html',
  styleUrl: './add-produto.css',
})
export class AddProduto implements OnInit {
  private produtoService = inject(ProdutoService);
  private categoriaService = inject(CategoriaService);
  private marcaService = inject(MarcaService);
  private router = inject(Router);

  // Listas e estado
  public categorias: any[] = [];
  public marcas: any[] = [];
  public imagePreview: string | null = null;
  public selectedFile: File | null = null;
  public loading = false;
  public uploadingImage = false;
  public successMessage = '';
  public errorMessage = '';

  // Validadores customizados
  public precoValidator = (control: any) => {
    const val = Number(control.value);
    return val > 0 ? null : { precoInvalido: true };
  };

  public quantidadeValidator = (control: any) => {
    const val = Number(control.value);
    return val >= 0 ? null : { quantidadeInvalida: true };
  };

  // Formulário com validações
  public produtoForm = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    descricao: new FormControl(''),
    categoriaId: new FormControl(null, Validators.required),
    marcaId: new FormControl(null, Validators.required),
    preco: new FormControl(0, [Validators.required, this.precoValidator]),
    quantidadeEstoque: new FormControl(0, [Validators.required, this.quantidadeValidator]),
    ativo: new FormControl(true),
  });

  ngOnInit(): void {
    this.carregarCategorias();
    this.carregarMarcas();
  }

  private carregarCategorias(): void {
    this.categoriaService.listar().subscribe({
      next: (dados) => {
        this.categorias = dados;
      },
      error: (err) => {
        console.error('Erro ao carregar categorias:', err);
        this.errorMessage = 'Erro ao carregar categorias';
      },
    });
  }

  private carregarMarcas(): void {
    this.marcaService.listar().subscribe({
      next: (dados) => {
        this.marcas = dados;
      },
      error: (err) => {
        console.error('Erro ao carregar marcas:', err);
        this.errorMessage = 'Erro ao carregar marcas';
      },
    });
  }

  // Manipular seleção de imagem
  public async onFileSelected(event: any): Promise<void> {
    const file: File = event.target.files[0];
    if (!file) return;

    // Validar tipo
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      this.errorMessage = 'Formato inválido. Use JPEG ou PNG.';
      return;
    }

    // Validar tamanho original (10MB máximo antes de comprimir)
    const maxSizeMB = 10;
    if (file.size > maxSizeMB * 1024 * 1024) {
      this.errorMessage = `Arquivo muito grande. Máximo ${maxSizeMB}MB.`;
      return;
    }

    try {
      this.errorMessage = '';
      

      // Comprimir imagem
      const options = {
        maxSizeMB: 1, // Máximo 1MB após compressão
        maxWidthOrHeight: 1024, // Máximo 1024px de altura/largura
        useWebWorker: true, // Usar worker para não bloquear UI
      };

      const compressedFile = await imageCompression(file, options);
      

      this.selectedFile = compressedFile;

      // Gerar preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(compressedFile);
    } catch (err) {
      console.error('Erro ao comprimir imagem:', err);
      this.errorMessage = 'Erro ao processar imagem.';
    }
  }

  // Remover imagem selecionada
  public removerImagem(): void {
    this.selectedFile = null;
    this.imagePreview = null;
  }

  // Salvar produto
  public salvar(): void {
    // Limpar mensagens anteriores
    this.errorMessage = '';
    this.successMessage = '';

    // Validar formulário
    if (this.produtoForm.invalid) {
      this.errorMessage = 'Preencha todos os campos obrigatórios corretamente.';
      return;
    }

    this.loading = true;

    // Se houver imagem, fazer upload primeiro
    if (this.selectedFile) {
      this.uploadingImage = true;
      this.produtoService.uploadImagem(this.selectedFile).subscribe({
        next: (resp) => {
          this.uploadingImage = false;
          // resp deve ter { uuid: "produtos/xxx" }
          const imagemUuid = resp.uuid;
          this.criarProduto(imagemUuid);
        },
        error: (err) => {
          this.uploadingImage = false;
          this.loading = false;
          console.error('Erro ao fazer upload:', err);
          this.errorMessage = 'Erro ao fazer upload da imagem.';
        },
      });
    } else {
      // Sem imagem, criar direto
      this.criarProduto(null);
    }
  }

  private criarProduto(imagemUuid: string | null): void {
    // Montar payload
    const formValue = this.produtoForm.value;
    const payload: any = {
      nome: formValue.nome,
      descricao: formValue.descricao || '',
      categoria: { id: Number(formValue.categoriaId) },
      marca: { id: Number(formValue.marcaId) },
      preco: Number(formValue.preco),
      quantidadeEstoque: Number(formValue.quantidadeEstoque),
      ativo: formValue.ativo,
    };

    if (imagemUuid) {
      payload.imagem = imagemUuid;
    }

    

    this.produtoService.criar(payload).subscribe({
      next: (resp) => {
        this.loading = false;
        this.successMessage = 'Produto criado com sucesso! Redirecionando...';
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1500);
      },
      error: (err) => {
        this.loading = false;
        console.error('❌ Erro ao criar produto:', err);
        console.error('Status:', err.status);
        console.error('Mensagem:', err.error?.message || err.message);
        console.error('Resposta completa:', err);
        this.errorMessage = `Erro ao criar produto (${err.status}): ${err.error?.message || err.statusText || 'Erro desconhecido'}`;
      },
    });
  }

  // Helpers para template
  public getNomeError(): string {
    const ctrl = this.produtoForm.get('nome');
    if (ctrl?.hasError('required')) return 'Nome é obrigatório';
    if (ctrl?.hasError('maxlength')) return 'Máximo 255 caracteres';
    return '';
  }

  public getPrecoError(): string {
    const ctrl = this.produtoForm.get('preco');
    if (ctrl?.hasError('required')) return 'Preço é obrigatório';
    if (ctrl?.hasError('precoInvalido')) return 'Preço deve ser maior que 0';
    return '';
  }

  public getQuantidadeError(): string {
    const ctrl = this.produtoForm.get('quantidadeEstoque');
    if (ctrl?.hasError('required')) return 'Quantidade é obrigatória';
    if (ctrl?.hasError('quantidadeInvalida')) return 'Quantidade não pode ser negativa';
    return '';
  }
}
