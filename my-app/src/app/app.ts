import { Component } from '@angular/core';
import { Navbar } from './components/navbar/navbar';
import { Gamaliel } from './components/gamaliel/gamaliel';
import { Jesus } from './components/jesus/jesus';
import { Andres } from './components/andres/andres';

@Component({
  selector: 'app-root',
  imports: [Navbar, Gamaliel, Jesus, Andres],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}