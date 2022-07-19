import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu:any[]=[{
    titulo:'Dashboard',
    icono:'nav-icon fas fa-tachometer-alt',
    submenu:[
      // {titulo:'Usuarios', url:'usuarios', icono:'fa fa-users'},
      {titulo:'Comprobantes Recibidos', url:'comprobantesrecibidos', icono:'fa fa-file'},
      // {titulo:'Admin. de Impuestos', url:'impuestos', icono:'fa fa-file'},
      {titulo:'Ayuda', url:'help', icono:'fa fa-info'},
    ]
  }]

}
