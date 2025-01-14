import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../_services/account.service';
import { inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
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
import { ReactiveFormsModule } from '@angular/forms';
import {NgIf, NgFor} from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, RouterLinkActive,NgxParticlesModule,NgIf,NgFor,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private toastr = inject(ToastrService);
  accountService = inject(AccountService);
  loginForm: FormGroup = new FormGroup({});
  private router = inject(Router);
  id = "tsparticles";
  particlesService = inject(ParticlesService);
  particlesOptions = this.particlesService.particlesOptions;


  login(): void {
    if (this.loginForm.invalid) {
      this.toastr.error('Please fill in all required fields correctly!');
      return;
    }

    this.accountService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigateByUrl('/home');
      },
      error: error => {
        this.toastr.error(error.error || 'Login failed!');
      }
    });
  }

 logout() {
    this.accountService.logout();
  }

  ngOnInit(): void {
    this.particlesService.initParticles();

    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(12)])
    });
  }
}
