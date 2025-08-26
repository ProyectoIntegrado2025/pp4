import { Component } from '@angular/core';
import { AuthenticateService  } from '../../services/cognito.service';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css']
})
export class NewPasswordComponent{
  currentpassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  cargando: boolean = false;

  constructor(private authService: AuthenticateService) {}

  confirmPasswordReset() {
    this.authService.changePassword(this.currentpassword, this.newPassword, this.confirmPassword)
  }
}
