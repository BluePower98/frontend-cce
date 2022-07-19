import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { NopageFoundComponent } from './nopage-found/nopage-found.component';
import { PagesModule } from './pages/pages.module';
import { ConsultaindividualComponent } from './consultaindividual/consultaindividual.component';
import { HttpClientModule } from '@angular/common/http';
import { DatatableComponent } from './components/datatable/datatable.component';
import { DataTablesModule } from "angular-datatables";
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatTableExporterModule } from 'mat-table-exporter';
import {MatCardModule} from '@angular/material/card';


@NgModule({
  declarations: [
    AppComponent,
    NopageFoundComponent,
    ConsultaindividualComponent,
    DatatableComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    PagesModule,
    HttpClientModule,
    DataTablesModule,
    MatPaginatorModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatDatepickerModule,
    MatButtonModule,
    MatTableExporterModule,
    MatCardModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
