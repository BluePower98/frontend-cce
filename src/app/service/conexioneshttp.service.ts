import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ClienteIndividual, ListaCliente, Login } from '../types/interface.interface';
import { tap, map, of, catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConexioneshttpService {


  public apiUrl :any ='http://127.0.0.1:8000';
  constructor(private http: HttpClient) { }

  listaProveedores(body:any){
    const url = 'http://127.0.0.1:8000/api/listaProveedores';
    return this.http.get(`${url}`,body)
  }

  listaClienteIndividual(idempresa:string, rucdni:string, fechaem:string, tipocompprobnate:string, serie:string, numero:number, total:number):Observable<ClienteIndividual[]>{

    const url = `http://127.0.0.1:8000/api/listaClienteIndiv/${idempresa}/${total}/${numero}/${serie}/${tipocompprobnate}/${fechaem}/${rucdni}`;
    return this.http.get<ClienteIndividual[]>(`${url}`)
  }

  listaCliente(idempresa:string, fechainicial:string, fechafinal:string, tipoComprobante:string, Serie:string, numero:string, razonsocial:string, estado:string):Observable<ListaCliente[]>{

    const url:string = `http://127.0.0.1:8000/api/listaClientes/${idempresa}/${fechainicial}/${fechafinal}/${tipoComprobante}/${Serie}/${numero}/${razonsocial}/${estado}`;
    // console.log(url);
    return this.http.get<ListaCliente[]>(`${url}`)
  }
  listar(){
    const body = {
  }
    const url = 'http://127.0.0.1:8000/api/usuarios';
    return this.http.get(`${url}`)
  }

  login(ruc:string, dniruc:string, clave:string):Observable<Login[]>{
    const url = `http://127.0.0.1:8000/api/login/${ruc}/${dniruc}/${clave}`;
    return this.http.get<Login[]>(`${url}`)
    .pipe(
      tap(resp=>{
        console.log(resp);
      
        localStorage.setItem('idempresa',resp[0].idempresa);
      })
    )
    
  }

  
  /// Para imprimir un comprobante     INICIO
  async getSalesEncIdProof(companyId: string, documentTypeId: any, serie: any, number: number, idsucursal: number): Promise<any> {
    const url: string = `${this.apiUrl}/api/getComprobante/${companyId}/${documentTypeId}/${serie}/${number}/${idsucursal}`;
    console.log(url);    
    return this.http.get(url);
  }
  async getSalesDetailIdProof(companyId: string, documentTypeId: any, serie: any, number: any) {
    const url: string = `${this.apiUrl}/api/GetVentasDetalleId_Comprobante/${companyId}/${documentTypeId}/${serie}/${number}`;
    return this.http.get(url)
  }
  async getPaymentsSales(companyId: string, documentTypeId: any, serie: any, number: any) {
    const url: string = `${this.apiUrl}/api/GetListVentasPagos/${companyId}/${documentTypeId}/${serie}/${number}`;
    return this.http.get(url);
  }
  /// Para imprimir un comprobante     FIN


}
