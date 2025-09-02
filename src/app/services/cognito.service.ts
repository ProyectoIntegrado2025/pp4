import { Injectable } from "@angular/core";
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
} from "amazon-cognito-identity-js";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthenticateService {
  userPool: any;
  cognitoUser: any;
  username: string = "";

  // cognito.service.ts
  private tempCognitoUser: CognitoUser | null = null;

  constructor(private router: Router) {}

  // Login
  login(emailaddress: any, password: any) {
  const authenticationDetails = new AuthenticationDetails({
    Username: emailaddress,
    Password: password,
  });

  const poolData = {
    UserPoolId: environment.cognitoUserPoolId,
    ClientId: environment.cognitoAppClientId,
  };

  this.username = emailaddress;
  this.userPool = new CognitoUserPool(poolData);
  const userData = { Username: emailaddress, Pool: this.userPool };
  this.cognitoUser = new CognitoUser(userData);

    this.cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result: any) => {
        localStorage.setItem('user', emailaddress);
        this.setTempUser(null); // limpiar por seguridad
        this.router.navigate(['/inicio']);
      },

    // First time login attempt
    // PASO: pasamos la referencia del cognitoUser y los atributos del challenge por router.state
      newPasswordRequired: (userAttributes: any, requiredAttributes: any) => {
        console.log('[LOGIN] NEW_PASSWORD_REQUIRED - cognitoUser exists?', !!this.cognitoUser);
        console.log('[LOGIN] userAttributes:', userAttributes, 'required:', requiredAttributes);

        // Guardamos la referencia en el service antes de navegar
        this.setTempUser(this.cognitoUser);
        console.log('[LOGIN] after setTempUser, tempCognitoUser:', this.tempCognitoUser);

        // enviamos solo los atributos por state (no el objeto cognitoUser)
        this.router.navigate(['/newPasswordRequired'], {
          state: { userAttributes: userAttributes || {}, requiredAttributes: requiredAttributes || {} }
        });
      },

    onFailure: (error: any) => {
      console.log("error", error);
    },
  });
}

  // First time login attempt - New password require
  changePassword(
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ) {
    if (newPassword === confirmPassword) {
      this.cognitoUser.completeNewPasswordChallenge(
        newPassword,
        {},
        {
          onSuccess: () => {
            console.log("Reset Success");
            this.router.navigate(["/login"]);
          },
          onFailure: () => {
            console.log("Reset Fail");
          },
        }
      );
    } else {
      console.log("Password didn't Match");
    }
  }

  // Logout 
  logOut() {
    let poolData = {
      UserPoolId: environment.cognitoUserPoolId,
      ClientId: environment.cognitoAppClientId,
    };
    this.userPool = new CognitoUserPool(poolData);
    this.cognitoUser = this.userPool.getCurrentUser();
    if (this.cognitoUser) {
      this.cognitoUser.signOut();
      localStorage.removeItem("user");
      this.router.navigate(["login"]);
    }
  }

  isAuthenticated(){
    let poolData = {
      UserPoolId: environment.cognitoUserPoolId,
      ClientId: environment.cognitoAppClientId,
    };
    this.userPool = new CognitoUserPool(poolData);
    this.cognitoUser = this.userPool.getCurrentUser();
    if (!this.cognitoUser) {
      return false;
    }else{
      return true;
    }
  }



  // métodos para set/get (útiles para debug)
  setTempUser(user: CognitoUser | null) {
    this.tempCognitoUser = user;
    console.log('[SERVICE] setTempUser ->', user);
  }

  getTempUser(): CognitoUser | null {
    console.log('[SERVICE] getTempUser ->', this.tempCognitoUser);
    return this.tempCognitoUser;
  }

}