import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { CarrinhoService } from '../../carrinho-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  private carrinhoService = inject(CarrinhoService);

  isDark = false;
  cartCount = 0;

  ngOnInit(): void {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored || (prefersDark ? 'dark' : 'light');
    this.isDark = theme === 'dark';
    this.applyTheme();

    this.carrinhoService.cart$.subscribe(() => {
      this.cartCount = this.carrinhoService.obterQuantidadeItens();
    });
  }

  toggleTheme(): void {
    this.isDark = !this.isDark;
    localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme(): void {
    if (this.isDark) document.documentElement.classList.add('dark-theme');
    else document.documentElement.classList.remove('dark-theme');
  }

}
