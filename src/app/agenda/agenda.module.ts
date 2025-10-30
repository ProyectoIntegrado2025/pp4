import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';       // ➜ agregar FormsModule
import { HttpClientModule } from '@angular/common/http';

import { AgendaRoutingModule } from './agenda-routing.module';
import { AgendaComponent } from './agenda.component';

@NgModule({
  declarations: [
    AgendaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,           
    HttpClientModule,
    AgendaRoutingModule
  ]
})
export class AgendaModule { }


