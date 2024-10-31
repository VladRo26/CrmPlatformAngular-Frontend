import { Component } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { HomeimgaesComponent } from '../homeimgaes/homeimages.component';
import { RegisterComponent } from "../auth/register/register.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatGridListModule, HomeimgaesComponent, RegisterComponent,RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
routerLink: any;

}
