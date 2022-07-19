import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ConsultaindividualComponent } from './consultaindividual/consultaindividual.component';

const routes:Routes =[
  {path:'login', component: LoginComponent},
  {path:'register', component: RegisterComponent},
  {path:'consultaindividual', component: ConsultaindividualComponent}
]


@NgModule({

  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports:[RouterModule]
})
export class AuthRoutingModule { }
