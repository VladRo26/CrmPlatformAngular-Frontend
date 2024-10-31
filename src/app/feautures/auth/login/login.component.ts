import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../_services/account.service';
import { inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { MoveDirection, OutMode, Container} from "@tsparticles/engine";
//import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from "@tsparticles/slim"; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.
import { NgParticlesService } from "@tsparticles/angular";
import { ParticlesService } from '../../../_services/particles.services';
import { NgxParticlesModule } from "@tsparticles/angular";
import { provideToastr } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, RouterLinkActive,NgxParticlesModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private toastr = inject(ToastrService);
  model: any = {};
  accountService = inject(AccountService);
  private router = inject(Router);
  id = "tsparticles";
  particlesService = inject(ParticlesService);
  particlesOptions = this.particlesService.particlesOptions;


  login(){
    this.accountService.login(this.model).subscribe({
      next: response => {
        console.log(response);
        this.router.navigateByUrl('/home');

      },
      error: error => {
        this.toastr.error(error.error); 
      }
    })
 }
 logout() {
    this.accountService.logout();
  }

  ngOnInit(): void {
    this.particlesService.initParticles();
  }
}
