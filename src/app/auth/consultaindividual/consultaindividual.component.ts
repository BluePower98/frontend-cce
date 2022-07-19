import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteIndividual } from 'src/app/types/interface.interface';
import { ConexioneshttpService } from '../../service/conexioneshttp.service';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-consultaindividual',
  templateUrl: './consultaindividual.component.html',
  styleUrls: ['./consultaindividual.component.css']
})
export class ConsultaindividualComponent implements OnInit {
  title = 'angular-app';
  fileName= 'Comprobantes Electronicos.xlsx';
  idempresalogueada: string = "";
  dtOptions:  DataTables.Settings = {};
  data: any = [];
  dtTrigger: Subject<any> = new Subject<any>();
  listaclienteInd:ClienteIndividual[]=[];
  constructor(private listarClienteInd:ConexioneshttpService, private fb:FormBuilder) { }

  ngOnInit(): void {
    this.idempresalogueada = localStorage.getItem('idempresa')!;
    
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }


  formularioFilter:FormGroup=this.fb.group({
    nombreruc:['', [Validators.required]],
    fechaemision:['', [Validators.required]],
    tipocomprobante:['00', [Validators.required]],
    serie:['', [Validators.required]],
    correlativo:['', [Validators.required]],
    total:['', [Validators.required]]
  });

  buscar(){
    if(this.formularioFilter.invalid){
      Swal.fire(
        '',
        '¡Imgrese los campos Requeridos!',
        'question'
      )
      return 
    }
    this.dtOptions = {
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json'
      },
      pageLength: 2,
      pagingType: 'full_numbers'
    };
      this.listarClienteInd.listaClienteIndividual(this.idempresalogueada,

      this.formularioFilter.get('nombreruc')?.value,
      this.formularioFilter.get('fechaemision')?.value,
      this.formularioFilter.get('tipocomprobante')?.value,
      this.formularioFilter.get('serie')?.value,
      this.formularioFilter.get('correlativo')?.value,
      this.formularioFilter.get('total')?.value,

    ).subscribe(res=>{
      // console.log(res);
      if(res.length > 0){

        this.listaclienteInd=res
        console.log(res);
        this.dtTrigger.next(res);
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Comprobante no encontrado'
         
        })
      }
    })
  }
  reset(){
    this.formularioFilter.setValue({
    nombreruc:'',
    fechaemision:'',
    tipocomprobante:'00',
    serie:'',
    correlativo:'',
    total:''
    })
  }

  DescargarPDF(item:any){}

  DescargarXML(item:any){
    // filename: "20601121558-01-FFF1-00000303.xml"  --- FileName XML
    const filename= item.ruc+'-'+ item.codigo_sunat+'-'+item.Serie+'-'+item.numFact+'.xml'  // "20601121558-01-FFF1-00000303.xml"
    const url = `${'http://127.0.0.1:8000/api/downloadXML'}?ruc=${item.ruc}&date=${item.FecEmiCom}&filename=${filename}`;
    console.log(url);
    window.open(url);
  }

  DescargarCRD(item:any){
    // filename: "R-20601121558-01-FFF1-00000303.xml" -- Filename CDR
    const filename = 'R-'+ item.ruc+'-'+ item.codigo_sunat+'-'+item.Serie+'-'+item.numFact+'.xml'
    const url = `${'http://127.0.0.1:8000/api/downloadXML'}?ruc=${item.ruc}&date=${item.FecEmiCom}&filename=${filename}`;
    console.log(url);
    window.open(url);
  }

  exportarExcel(): void{
    let element = document.getElementById('tabla-excel');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb,  this.fileName);
  }

}
