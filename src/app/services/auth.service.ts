import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SigaaCatAlumno} from '../clases/sigaa_cat_alumno';
import {Usuario} from '../clases/usuario';
import * as sha512 from 'js-sha512';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // tslint:disable-next-line:variable-name
  private _usuario: Usuario;
  // tslint:disable-next-line:variable-name
  private _token: string;
  private urlEndpoint = 'http://localhost:90/oauth/token';
  private credenciales: string = btoa('angularapp' + ':' + '12345');
  private httpHeaders = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: 'Basic ' + this.credenciales
  });

  public get usuario(): Usuario {
    if (this._usuario != null) {
      return this._usuario;
    } else if (this._usuario == null && sessionStorage.getItem('usuario') != null) {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this._usuario;
    }
    return new Usuario();
  }

  public get token(): string {
    if (this._token != null) {
      return this._token;
    } else if (this._token == null && sessionStorage.getItem('token') != null) {
      this._token = sessionStorage.getItem('token');
      return this._token;
    }
    return null;
  }

  constructor(private http: HttpClient) {
  }

  getAlumno(matricula: number): Observable<SigaaCatAlumno []> {
    return this.http.get<SigaaCatAlumno[]>('http://localhost:90/alumno/' + matricula);
  }

  guardarUsuario(accessToken: string): void {
    let payload = this.obtenerDatosToken(accessToken);
    this._usuario = new Usuario();
    this._usuario.usuario = payload.user_name;
    this._usuario.roles = payload.authorities;
    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
  }

  guardarToken(accessToken: string): void {
    this._token = accessToken;
    sessionStorage.setItem('token', accessToken);
  }

  login(usuario: Usuario): Observable<any> {
    const passcrypt: string = sha512.sha512(usuario.password);
    // const httpHeaders: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded',
    //   Authorization: 'Basic'+this.credenciales});
    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', String(usuario.usuario));
    params.set('password', passcrypt);
    console.log(params.toString());
    return this.http.post<any>(this.urlEndpoint, params.toString(), {headers: this.httpHeaders});
  }


  obtenerDatosToken(accessToken: string): any {
    if (accessToken != null) {
      return JSON.parse(atob(accessToken.split('.')[1]));
    }
    return null;
  }

  isAuthenticated(): boolean {
    let payload = this.obtenerDatosToken(this._token);
    return payload != null && payload.user_name && payload.user_name.length > 0;

  }

  hasRole(role: string): boolean {
    if (this.usuario.roles.includes(role)) {
      return true;
    }
    return false;
  }

}
