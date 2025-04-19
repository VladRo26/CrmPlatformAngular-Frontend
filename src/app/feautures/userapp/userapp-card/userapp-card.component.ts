import { Component, computed, inject, Input, input, OnInit } from '@angular/core';
import { userApp } from '../../../_models/userapp';
import {ChangeDetectionStrategy} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { CompanyphotoService } from '../../../_services/companyphoto.service';
import { catchError, of } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { RouterLinkActive } from '@angular/router'
import { TimeagoModule } from 'ngx-timeago';
import { PresenceService } from '../../../_services/presence.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-userapp-card',
  standalone: true,
  imports: [MatButtonModule,MatCardModule,RouterLink,RouterLinkActive,TimeagoModule,NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './userapp-card.component.html',
  styleUrl: './userapp-card.component.css'
})
export class UserappCardComponent {
  private router = inject(Router);
  private presenceService = inject(PresenceService);
  userapp= input.required<userApp>(); // Correctly declare `userapp` as an input property
  isOnline = computed(() => this.presenceService.onlineUsers().includes(this.userapp().userName));

   getUserPhoto(): string {
    return this.userapp().photoUrl || '/user.png';
  }
}