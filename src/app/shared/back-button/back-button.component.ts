import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss'],
  standalone: true
})
export class BackButtonComponent {

  router = inject(Router);
  location = inject(Location);

  url = input();

  public navigateBack() {
    this.url() !== '' ? this.router.navigate([this.url()]) : this.location.back();
  }

}
