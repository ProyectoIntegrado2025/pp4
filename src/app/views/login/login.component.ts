import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthenticateService  } from '../../services/cognito.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  emailaddress: string = '';
  password: string = '';
  cargando: Boolean = false;
  error: Boolean = false;

  constructor(private authservice: AuthenticateService, private router: Router) {}

  ngOnInit(){
    if(this.authservice.isAuthenticated()){
      this.router.navigate(["/inicio"]);
    }
  }

  onSignIn(form: NgForm) {
    if (form.valid) {
      this.authservice.login(this.emailaddress, this.password)
    }
  }
}