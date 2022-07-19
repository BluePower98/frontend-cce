import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
// import { ProductosComponent } from './productos/productos.component';
import { ComprobantesrecibidosComponent } from './comprobantesrecibidos/comprobantesrecibidos.component';
import { ImpuestosComponent } from './impuestos/impuestos.component';
import { HelpComponent } from './help/help.component';

const routes:Routes=[
  {path:'dashboard', component:PagesComponent,
  children:[
    {path:'', component:DashboardComponent, data:{titulo:'Dashboard'}},
    {path:'usuarios', component:UsuariosComponent,data:{titulo:'Usuarios'}},
    {path:'comprobantesrecibidos', component:ComprobantesrecibidosComponent,data:{titulo:'Comprobantes Recibidos'}},
    {path:'impuestos', component:ImpuestosComponent,data:{titulo:'Administración de Impuestos'}},
    {path:'help', component:HelpComponent,data:{titulo:'Ayuda'}}
    // {path:'productos', component:ProductosComponent, data:{titulo:'Productos'}}
  ]
}
]


@NgModule({

  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports:[RouterModule]
})
export class PagesRoutingModule { }
