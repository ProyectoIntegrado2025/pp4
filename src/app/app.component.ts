import { Component } from '@angular/core';
import { AuthenticateService  } from './services/cognito.service';
// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';
// register Swiper custom elements
register();

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tp_final_frontend';

  constructor(private authservice: AuthenticateService) {}

  logOut() {
    this.authservice.logOut();
  }

  isLogedIn(){
    return this.authservice.isAuthenticated();
  }
}
