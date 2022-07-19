import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NopageFoundComponent } from './nopage-found/nopage-found.component';
import { AuthRoutingModule } from './auth/auth-routing.module';
import { PagesRoutingModule } from './pages/pages-routing.module';
import { ConsultaindividualComponent } from './consultaindividual/consultaindividual.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DatatableComponent } from './components/datatable/datatable.component';




const routes:Routes=[

  {path:'', redirectTo:'/login', pathMatch:'full'},
  // {path:'**', component:NopageFoundComponent},
  {path:'consultaindividual', component:ConsultaindividualComponent},
  {path:'dashboard', component:DashboardComponent},
  {path:'datatable', component:DatatableComponent}

]

@NgModule({

  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    PagesRoutingModule,
    AuthRoutingModule
  ],
  exports:[RouterModule]
})
export class AppRoutingModule { }
