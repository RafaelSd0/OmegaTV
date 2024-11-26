import { Component, Inject} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '@auth0/auth0-angular';
import { RouterLinkActive } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ ButtonModule ,ToolbarModule, InputTextModule, CommonModule, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  menuAberto: boolean = false;
  profile!: User | null | undefined;

  constructor(public auth: AuthService, @Inject(DOCUMENT) private document: Document) {}

  ngOnInit(): void {

    this.auth.user$.subscribe((profile) => {

    this.profile = profile;

    });
  }

  login() {
    this.auth.loginWithRedirect();
  }

  logout() {
    this.auth.logout({
      logoutParams: {
        returnTo: this.document.location.origin
      }
    });
  }

  //Mostrar menu para usuarios do Mobile
  mostrarMenu(): void {
    const menu = this.document.querySelector('#menu') as HTMLDivElement | null;
    if (!menu) return;

    this.menuAberto = !this.menuAberto;
    menu.classList.toggle('hidden', !this.menuAberto);
    menu.classList.toggle('flex', this.menuAberto);
  }
}
