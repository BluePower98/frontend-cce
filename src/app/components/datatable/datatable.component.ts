import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ListaCliente } from 'src/app/types/interface.interface';


// const DATA: ListaCliente[] = [];

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.css']
})
export class DatatableComponent implements OnInit {
  displayedColumns: string[] = ['rucdni', 'Receptor', 'Tipo', 'Serie','numero','total', 'FecEmiCom','Estado'];
  dataSource = new MatTableDataSource<ListaCliente> ([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  constructor() { }

  ngOnInit(): void {
  }

  Buscar(){

  }
}
