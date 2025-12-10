import { Routes } from '@angular/router';
import { Principal } from './principal/principal';
import { Cadastro } from './cadastro/cadastro';
import { AddProduto } from './produto-add/add-produto';
import { Carrinho } from './carrinho/carrinho';
import { Checkout } from './checkout/checkout';

export const routes: Routes = [
    {
        path: '',
        component: Principal
    },
    {
        path: 'cadastro',
        component: Cadastro
    },
    {
        path: 'produto/novo',
        component: AddProduto
    },
    {
        path: 'carrinho',
        component: Carrinho
    },
    {
        path: 'checkout',
        component: Checkout
    }
];
