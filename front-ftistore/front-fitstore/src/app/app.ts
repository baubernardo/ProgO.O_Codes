import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './leiaute/header/header';
import { Footer } from './leiaute/footer/footer';
import { Menu } from "./leiaute/menu/menu";
import { Principal } from './principal/principal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, Menu,Principal],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('front-fitstore');
}
