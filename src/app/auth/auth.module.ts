import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ConsultaindividualComponent } from './consultaindividual/consultaindividual.component';
import { ReactiveFormsModule } from '@angular/forms';
import {MatPaginatorModule} from '@angular/material/paginator';
import { NgxPaginationModule } from 'ngx-pagination';
import { DataTablesModule } from "angular-datatables";
import { MatTableModule } from '@angular/material/table';
import {MatDatepickerModule} from '@angular/material/datepicker';


@NgModule({
  declarations: [LoginComponent, RegisterComponent,ConsultaindividualComponent],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MatPaginatorModule,
    DataTablesModule,
    MatTableModule,
    MatDatepickerModule
  ],
  exports: [LoginComponent, RegisterComponent],
})
export class AuthModule { }
