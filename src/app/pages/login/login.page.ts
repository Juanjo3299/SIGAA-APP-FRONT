import {Component, OnInit} from '@angular/core';
import {Usuario} from '../../clases/usuario';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  usuario: Usuario;

  constructor(private authService: AuthService) {
    this.usuario = new Usuario();
  }

  ngOnInit() {
  }

  login(): void {
    setTimeout(() => {
      this.authService.login(this.usuario).subscribe(response => {
        console.log(response.access_token.split('.')[1]);
        this.authService.guardarUsuario(response.access_token);
        this.authService.guardarToken(response.access_token);
        const usuario = this.authService.usuario;
        console.log('Se obtuve el token');
      }, err => {
        if (err.status == 400) {
          console.log('Usuario o contraseñas incorrectas');
        }
      });
    }, 2000);
  }
}
