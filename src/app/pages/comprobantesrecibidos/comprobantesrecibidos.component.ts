import { Component, OnInit, VERSION } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListaCliente } from 'src/app/types/interface.interface';
import { ConexioneshttpService } from '../../service/conexioneshttp.service';
import Swal from 'sweetalert2';
import { firstValueFrom, Subject } from 'rxjs';
import * as XLSX from 'xlsx';
import { GenertePDFService } from '../../service/generte-pdf.service';
import * as JSZip from 'jszip';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-comprobantesrecibidos',
  templateUrl: './comprobantesrecibidos.component.html',
  styleUrls: ['./comprobantesrecibidos.component.css']
})
export class ComprobantesrecibidosComponent implements OnInit {
  
  // title = 'angular-app';
  idempresalogueada: string = "";
  fileName= 'Comprobantes Electronicos.xlsx';
  dtOptions:  DataTables.Settings = {};
  data: any = [];
  dtTrigger: Subject<any> = new Subject<any>();
  listacliente:ListaCliente[]=[];
  title:any;
  uploadFiles:any;
  handleFileInput(files:any) {
    this.uploadFiles = files;
  }
  
  constructor(private conexioneshtt: ConexioneshttpService, private pdfService: GenertePDFService, private fb:FormBuilder ) { }


  ngOnInit(): void {
    this.idempresalogueada = localStorage.getItem('idempresa')!;
    this.FormCheck.get('seleccionarTodo')?.valueChanges.subscribe(Response => {console.log(Response)})
    // this.dtOptions = {
    //   language: {
    //     url: '//cdn.datatables.net/plug-ins/1.12.1/i18n/es-ES.json'
    //   },
    //   pagingType: 'full_numbers'
    // };

    //       this.conexioneshtt.listaCliente('103-10710173198',
    //       this.formularioFilter.get('fecha_inicial')?.value,
    //       this.formularioFilter.get('fecha_final')?.value,
    //       this.formularioFilter.get('tipocomprobante')?.value,
    //       this.formularioFilter.get('serie')?.value,
    //       this.formularioFilter.get('numero')?.value,
    //       this.formularioFilter.get('razon_social')?.value, 
    //       this.formularioFilter.get('estado')?.value, )
    //     .subscribe((data) =>{
    //       this.data = data;
    //       this.dtTrigger.next(data);
    // })
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }



  formularioFilter:FormGroup=this.fb.group({
    fecha_inicial:['', [Validators.required]],
    fecha_final:['', [Validators.required]],
    tipocomprobante:['00', [Validators.required]],
    serie:[null],
    numero:[null],
    razon_social:[null],
    estado:[null]
  });

  FormCheck:FormGroup=this.fb.group({
    seleccionarTodo: {

    }
  })

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
      pagingType: 'full_numbers',
      lengthMenu: [
        [10, 25, 50, -1],
        [10, 25, 50, 'All'],
    ],
    };
    this.conexioneshtt.listaCliente(this.idempresalogueada,
    this.formularioFilter.get('fecha_inicial')?.value,
    this.formularioFilter.get('fecha_final')?.value,
    this.formularioFilter.get('tipocomprobante')?.value,
    this.formularioFilter.get('serie')?.value,
    this.formularioFilter.get('numero')?.value,
    this.formularioFilter.get('razon_social')?.value, 
    this.formularioFilter.get('estado')?.value, 
    ).subscribe(res=>{
      if(res.length > 0) {

        this.listacliente=res
        this.dtTrigger.next(res);
      }else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Comprobantes no encontrado'
         
        })
      }
    })
  }

    reset(){
    this.formularioFilter.setValue({
    fecha_inicial:'',
    fecha_final:'',
    tipocomprobante:'00',
    serie:'',
    numero:'',
    razon_social:'',
    estado:''
    })
  }

    DescargarMasiva(){
    let element = document.getElementById('tabla-excel');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 
    XLSX.writeFile(wb, this.fileName);

  }
  async DescargarPDF(item:any){
    const { idempresa, idtipodocumento, Serie, numero, idsucursal } = item;
   
    const sales: any = await (this.conexioneshtt.getSalesEncIdProof(idempresa, idtipodocumento, Serie, numero, 1));
    const salesDetail: any = await this.conexioneshtt.getSalesDetailIdProof(idempresa, idtipodocumento, Serie, numero);
    const PaymentsDetail: any = await this.conexioneshtt.getPaymentsSales(idempresa, idtipodocumento, Serie, numero)
    console.log(sales)
    const blob = this.pdfService.pdfGenerate(sales[0], salesDetail, PaymentsDetail)

  }

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
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 
    XLSX.writeFile(wb, this.fileName);
  }
  downloadFileMasivaXML(item:any) {
    const filename= item.ruc+'-'+ item.codigo_sunat+'-'+item.Serie+'-'+item.numFact+'.xml'  // "20601121558-01-FFF1-00000303.xml"
    const url = `${'http://127.0.0.1:8000/api/downloadXML'}?ruc=${item.ruc}&date=${item.FecEmiCom}&filename=${filename}`;
    var zip = new JSZip();
    zip.file(filename, this.title);
    
    var imgFolder:any = zip.folder(filename);
    for (let i = 0; i < this.uploadFiles?.length; i++) {
      imgFolder.file(this.uploadFiles[i].name, this.uploadFiles[i], { base64: true });
    }
    zip.generateAsync({ type: "blob" })
      .then(function (content) {
        FileSaver.saveAs(content, "Comprobantes Electronicos.zip");
      });
  }
  }



