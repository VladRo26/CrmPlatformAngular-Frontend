import { Component } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { HomeimgaesComponent } from '../homeimgaes/homeimages.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatGridListModule,HomeimgaesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  registerMode = false;

  registerToggle() {
    this.registerMode = !this.registerMode;
  }

}
