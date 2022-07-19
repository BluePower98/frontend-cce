import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ProductosComponent } from './productos/productos.component';
import { PagesComponent } from './pages.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ComprobantesrecibidosComponent } from './comprobantesrecibidos/comprobantesrecibidos.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import { NgxPaginationModule } from 'ngx-pagination';
import { DataTablesModule } from "angular-datatables";
import { MatTableModule } from '@angular/material/table';



@NgModule({
  declarations: [
    DashboardComponent,
    UsuariosComponent,
    ProductosComponent,
    PagesComponent,
    ComprobantesrecibidosComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    NgxPaginationModule,
    DataTablesModule,
    MatTableModule
    
  ],
  exports: [
    DashboardComponent,
    UsuariosComponent,
    ProductosComponent,
    
  ]
})
export class PagesModule { }
