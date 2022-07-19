import { Injectable } from '@angular/core';
import { qrA4 } from '../pages/comprobantesrecibidos/qr';

declare var require: any;

const NumerosALetras = require('numero-a-letras');

@Injectable({
  providedIn: 'root'
})
export class GenertePDFService {
  private readonly pdfFonts: any;
  pdfMake: any;

  
  dataProducts2: any[] = [];
  dataPagos2: any[] = [];
  detallepago2: any[] = [];
  arrayGuias:any[] = [];

  dataCabeceraVentas: any;
  dataDetalleVentas: any;
  dataVentasPagos: any[] = [];
  documentBlob: any;


  constructor() { 
    
    this.pdfMake = require('pdfmake/build/pdfmake.js');
    this.pdfFonts = require('pdfmake/build/vfs_fonts.js');
    this.pdfMake.vfs = this.pdfFonts.pdfMake.vfs;
    // this.pdfMake.html = require('html-to-pdfmake');
  }

  numFormat(n:number) {
    return new Intl.NumberFormat("en-PE", { currency: 'PEN', minimumFractionDigits: 2 }).format(n);
  }

  pdfGenerate(cabeceraVentas:any, detalleVentas:any, pagosList:any) {
    this.dataCabeceraVentas = cabeceraVentas;
    this.dataDetalleVentas = detalleVentas;
    this.dataVentasPagos = pagosList;

    if (!this.dataVentasPagos) {
      this.dataVentasPagos = [];
    }

    console.log(cabeceraVentas, detalleVentas, pagosList);
    
    this.dataPagos2 = [];
    this.detallepago2 = [];
    this.InitDataPagos();
    this.InitInfoCuotas();
    this.dataProducts2 = [];
    this.InitDataA4();

    this.arrayGuias = [];
    var guiasRem = JSON.parse(this.dataCabeceraVentas.guia_remision);
    console.log(guiasRem);
    if (guiasRem) {
      guiasRem.forEach((element:any )=> {
        this.arrayGuias.push(
          { text: ('\n Guia de ' + element.descripcion).toUpperCase() + ': ', alignment: 'left', fontSize: 8, bold: true },
          { text: element.SerieNumero, fontSize: 8, bold: false }
        );
      });
    }

    // return 
    let docDefinition = this.formatA4_();
    const { razon_social, serie, rucdni } = this.dataCabeceraVentas;
    this._generatePdf(docDefinition,  'A4')

  }

  InfoCuotas:any[] = [];
  InitInfoCuotas() {

    const info_cuotas = this.dataCabeceraVentas.cuotas;
    this.InfoCuotas = [];
    if (info_cuotas != '') {
      var splits = info_cuotas.substr(1).split("|");
      let array = [];
      console.log(splits);

      array.push(
        [{ colSpan: 4, text: 'DETALLE DE CUOTAS', bold: true }, '', '', ''],
        [
          { text: 'Cuota', bold: true },
          { text: 'F.Vencimiento', bold: true, alignment: 'center' },
          { text: 'Moneda', bold: true, alignment: 'center' },
          { text: 'Importe', bold: true, alignment: 'center' }
        ]
      )

      splits.forEach((element:any) => {
        console.log(element, element.split(","), element.split(",")[2]);
        let cuotadata = {
          Cuota: element.split(",")[0],
          Importe: element.split(",")[1],
          fecha: element.split(",")[2]
        };
        // array.push(cuotadata);
        array.push([{ text: `${element.split(",")[0]}` }, { text: element.split(",")[2], alignment: 'right' }, { text: this.dataCabeceraVentas.idmoneda == 1 ? 'Soles' : 'Dolares', alignment: 'center' }, { text: `${this.numFormat(Number(element.split(",")[1]))}`, alignment: 'right' }])
      });
      // this.cuotasList =array;
      this.InfoCuotas = array;
    }

    console.log(splits, this.InfoCuotas, this.InfoCuotas.length > 0 ? 'cuotass' : 'No cuotas');
  }

  InitDataA4() {

    // Detalle ventas - tabla productos y totales
    const {
      comprobante, razon_social, rucdni, idtipodocumento, codigo_sunat, direccion, serie, numero: numero_serie, fecha_emision, fecha_vencimiento,
      idmoneda, con_credito, total_descuento, total_gravado: total_gravado, total_gratuitas, total_inafecto, total_exonerado,
      total_igv, total_icbper, total, image, observaciones } = this.dataCabeceraVentas;

    const countSalesDetail: number = this.dataDetalleVentas.length;


    this.dataProducts2.push([
      { text: `Nro`, bold: true, fillColor: '#dddddd', fontSize: 11 },
      { text: `CODIGO`, alignment: 'center', bold: true, fillColor: '#dddddd', fontSize: 11 },
      { text: `DESCRIPCION`, bold: true, fillColor: '#dddddd', fontSize: 11 },
      { text: 'UNIDAD', alignment: 'center', bold: true, fillColor: '#dddddd', fontSize: 11 },
      { text: `CANT.`, alignment: 'center', bold: true, fillColor: '#dddddd', fontSize: 11 },
      { text: 'P.UNIT.', alignment: 'center', bold: true, fillColor: '#dddddd', fontSize: 11 },
      { text: 'DSCTO.', alignment: 'center', bold: true, fillColor: '#dddddd', fontSize: 11 },
      { text: 'TOTAL', alignment: 'center', bold: true, fillColor: '#dddddd', fontSize: 11 }
    ]);
    for (let i = 0, n = countSalesDetail; i < n; i++) {
      const { cantidad, codigo, descripcion, medida, precio_unitario, descuento, total_linea } = this.dataDetalleVentas[i];

      this.dataProducts2.push([
        { text: `${i + 1}`, fontSize: 9, border: [true, false, true, false] },
        { text: `${codigo}`, fontSize: 9, border: [true, false, true, false] },
        { text: `${descripcion}`, fontSize: 9, border: [true, false, true, false] },
        { text: `${medida}`, alignment: 'cenetr', fontSize: 9, border: [true, false, true, false] },
        { text: `${Number(cantidad).toFixed(2)}`, fontSize: 9, border: [true, false, true, false] },
        {
          text: `${this.numFormat(Number(precio_unitario))}`, //Number(precio_unitario).toFixed(2)
          alignment: 'right', fontSize: 9, border: [true, false, true, false]
        },
        {
          text: `${this.numFormat(Number(descuento))}`, //Number(precio_unitario).toFixed(2)
          alignment: 'right', fontSize: 9, border: [true, false, true, false]
        },
        {
          text: `${this.numFormat(Number(total_linea))}`, // Number(total_linea).toFixed(2)
          alignment: 'right', fontSize: 9, border: [true, false, true, false]
        }
      ]);
    }
    this.dataProducts2.push([
      {
        text: (NumerosALetras(Number(total)) + (idmoneda == 1 ? ' SOLES' : (idmoneda == 2 ? ' DOLARES AMERICANOS' : '')) + '\n\n')
          + 'Obs: ' + this.dataCabeceraVentas.observaciones, colSpan: 4, fontSize: 9
      }, '', '', '',
      {
        text: (Number(total_descuento) > 0 ? 'DESCUENTO\n' : '')
          + (Number(total_exonerado) > 0 ? 'EXONERADO \n' : '')
          + (Number(total_inafecto) > 0 ? 'INAFECTO \n' : '')
          + (Number(total_icbper) > 0 ? 'ICBPER \n' : '')
          + (Number(total_gravado) > 0 && (['01', '03', '07', '08'].includes(codigo_sunat)) ? 'GRAVADO \n' : '')
          + (Number(total_igv) > 0 && (['01', '03', '07', '08'].includes(codigo_sunat)) ? 'I.G.V \n' : '')
          + (Number(total) > 0 ? 'TOTAL \n' : '')
        , alignment: 'right', bold: true, colSpan: 2, fontSize: 9, border: [true, true, false, true]
      }, '',
      {
        text: (Number(total_descuento) > 0 ? (idmoneda == 1 ? 'S/' : '$') + ' \n' : '')
          + (Number(total_exonerado) > 0 ? (idmoneda == 1 ? 'S/' : '$') + ' \n' : '')
          + (Number(total_inafecto) > 0 ? (idmoneda == 1 ? 'S/' : '$') + ' \n' : '')
          + (Number(total_icbper) > 0 ? (idmoneda == 1 ? 'S/' : '$') + ' \n' : '')
          + (Number(total_gravado) > 0 && (['01', '03', '07', '08'].includes(codigo_sunat)) ? (idmoneda == 1 ? 'S/' : '$') + ' \n' : '')
          + (Number(total_igv) > 0 && (['01', '03', '07', '08'].includes(codigo_sunat)) ? (idmoneda == 1 ? 'S/' : '$') + ' \n' : '')
          + (Number(total) > 0 ? (idmoneda == 1 ? 'S/' : '$') + ' \n' : '')
        , alignment: 'right', bold: true, fontSize: 9, border: [false, true, false, true]
      },
      {
        text: (Number(total_descuento) > 0 ? this.numFormat(Number(total_descuento)) + ' \n' : '')
          + (Number(total_exonerado) > 0 ? this.numFormat(Number(total_exonerado)) + ' \n' : '')
          + (Number(total_inafecto) > 0 ? this.numFormat(Number(total_inafecto)) + ' \n' : '')
          + (Number(total_icbper) > 0 ? this.numFormat(Number(total_icbper)) + ' \n' : '')
          + (Number(total_gravado) > 0 && (['01', '03', '07', '08'].includes(codigo_sunat)) ? this.numFormat(Number(total_gravado)) + ' \n' : '')
          + (Number(total_igv) > 0 && (['01', '03', '07', '08'].includes(codigo_sunat)) ? this.numFormat(Number(total_igv)) + ' \n' : '')
          + (Number(total) > 0 ? this.numFormat(Number(total)) + ' \n' : '')
        , alignment: 'right', bold: true, fontSize: 9, border: [false, true, true, true]
      }
    ]
    );

  }

  InitDataPagos() {
    // formas de pago
    if (this.dataVentasPagos.length>0) {
      for (let item of this.dataVentasPagos) {
        const { descripcion, importe } = item;
        this.detallepago2.push({ text: `${descripcion}` + '        S/   \n', fontSize: 9 });
        this.dataPagos2.push({ text: ` ${Number(importe).toFixed(2)} \n`, fontSize: 9, alignment: 'right' });
        if (item.pago_con) {
          item.idmediopago == 1 ? this.dataPagos2.push({ text: this.numFormat(Number(item.pago_con)) + '\n', fontSize: 9, alignment: 'right' }) : '';
          item.idmediopago == 1 ? this.dataPagos2.push({ text: this.numFormat(Number(item.vuelto)) + '\n', fontSize: 9, alignment: 'right' }) : '';
          item.idmediopago == 1 ? this.detallepago2.push({ text: 'Pago con          ' + (this.dataCabeceraVentas.idmoneda == 1 ? 'S/' : '$') + '   \n ', fontSize: 9 }) : '';
          item.idmediopago == 1 ? this.detallepago2.push({ text: 'Vuelto               ' + (this.dataCabeceraVentas.idmoneda == 1 ? 'S/' : '$') + '   \n ', fontSize: 9 }) : '';

        }
      }
    }
  }

   /*   ----------------------------------------------------------------------       format A4      -----------------------------------------------------------------------  */
   formatA4_() {
    if (this.dataCabeceraVentas.nro_cuentas) {
      let enteredText = (this.dataCabeceraVentas.nro_cuentas.match('↵') || []).length;
      let ctas = [];
      ctas.push(this.dataCabeceraVentas.nro_cuentas);
    }

    // cabecera ventas
    const {
      nombrerazon, nombrecomercial, ruc, direccionSuc, telefonoSuc, correoSuc,
      comprobante, razon_social, rucdni, idtipodocumento, direccion,
      serie, numero: numero_serie, fecha_emision, hora, fecha_vencimiento, codigo_sunat, idmoneda, con_credito,
      total_descuento, total_gravado: total_gravado, total_gratuitas, total_inafecto, total_exonerado,
      total_igv, total_icbper, total, detraccion_id, detraccion_desc, detraccion_porcent, detraccion_total,
      afecto_retencion, retencion_total, retencion_porcent,ver_data_empresa,
      image, anulado, observaciones, guia_remision, placa_vehiculo, orden_compra
    } = this.dataCabeceraVentas;

    // comprobante vista A4
    let docDefinition = {
      footer: function (page:any, pages:any) {
        return {
          margin: [10, 0, 10, 0],
          columns: ['', '', '', { text: `${page} de ${pages}`, alignment: 'right' }
          ]
        };
      },
      // Here you can enter the page size and orientation (string or {width: x, height: y}):

      watermark: { text: anulado == 'A' ? 'Anulado' : '', color: 'red', opacity: 0.2, bold: true, italics: false, fontSize: 80, angle: -45 },
      pageSize: 'A4',      //  ***************************************  format A4  ***********************************
      // in pageOrientation you can put "Portrait" or "landscape"
      pageOrientation: 'portrait',
      pageMargins: [10, 10, 10, 30],
      content: [
        {
          table: {
            // heights: [80, 50, 70],
            body: [
              [            //  ****************   prueba
                [
                  {
                  table: {
                    headerRows: 0,
                    widths: ['*', 170],
                    body: [
                      [
                        ver_data_empresa ?
                          {
                            table: {
                              widths: ['*', '*'],
                              body: [
                                [
                                  [
                                    {
                                      image: image,
                                      alignment: 'center',
                                      width: 160,
                                      height: 80,
                                      margin: [4, 1, 2, 1],
                                    }

                                  ],
                                  [
                                    '\n',
                                    {
                                      border: [true, false, false, false],
                                      fillColor: '#dddddd',
                                      text: [
                                        { text: ['01', '03', '07', '08'].includes(codigo_sunat) ? (Number(ruc.substring(0, 2)) == 10 && nombrecomercial != '' ? nombrecomercial.toUpperCase() + '\n' : '') : '', fontSize: 10.5, alignment: 'center', style: ['Helvetica'] },
                                        { text: ['01', '03', '07', '08'].includes(codigo_sunat) ? ((Number(ruc.substring(0, 2)) == 10 && nombrecomercial != '' ? 'De: ' : '') + nombrerazon.toUpperCase() + '\n') : '', fontSize: 11.5, alignment: 'center', style: ['Helvetica'] },
                                        { text: ['01', '03', '07', '08'].includes(codigo_sunat) ? (direccionSuc ? 'Dir: ' + direccionSuc + '\n' : '') : '', fontSize: 9, alignment: 'center' },
                                        { text: ['01', '03', '07', '08'].includes(codigo_sunat) ? (telefonoSuc ? 'Telf/Cel: ' + telefonoSuc + '\n' : '') : '', fontSize: 9, alignment: 'center' },
                                        { text: ['01', '03', '07', '08'].includes(codigo_sunat) ? (correoSuc ? 'Email: ' + correoSuc : '') : '', fontSize: 9, alignment: 'center' }
                                      ],

                                    }
                                  ]
                                ]
                              ]
                            }
                            , layout: 'noBorders'
                          } :
                          {
                            table: {
                              widths: ['*'],
                              body: [
                                [
                                  [
                                    {
                                      image: image,
                                      alignment: 'center',
                                      width: 320,
                                      height: 80,
                                      margin: [4, 1, 2, 1],
                                    }
                                  ]
                                ]
                              ]
                            },
                            layout: 'noBorders'
                          },
                        {
                          alignment: 'center',
                          margin: [10, 0, 0, 0],
                          table: {
                            heights: [15, 20, 15],
                            widths: [150],
                            body: [
                              [{ text: 'RUC ' + ruc, alignment: 'center' }],
                              [{ text: comprobante, alignment: 'center', fillColor: '#eeeeee', margin: [5, 8] }],
                              [{ text: serie + '-' + numero_serie, alignment: 'center' }]   // comprobante, ruc, serie, numero_serie
                            ]
                          }
                        }

                      ],
                      [
                        {
                          text://'1 y 2' 
                            [
                              { text: 'RUC/DNI:   ', alignment: 'left', fontSize: 9, bold: true },
                              { text: rucdni + '\n', fontSize: 9, bold: false },
                              { text: 'CLIENTE:   ', alignment: 'left', fontSize: 9, bold: true },
                              { text: razon_social + '\n', fontSize: 9, bold: false },
                              { text: 'DIRECCIÓN: ', alignment: 'left', fontSize: 9, bold: true },
                              { text: direccion ? direccion + '\n' : '- \n', fontSize: 9, bold: false }
                            ]
                        }
                        , {
                          text: [
                            { text: ['01', '03'].includes(codigo_sunat) ? 'CONDICIÓN DE PAGO: ' : '', alignment: 'left', fontSize: 9, bold: true },
                            { text: ['01', '03'].includes(codigo_sunat) ? (fecha_emision == fecha_vencimiento ? con_credito.toUpperCase() : ('Credito ' + con_credito).toUpperCase()) + '\n' : '', fontSize: 9, bold: false },

                            { text: 'FECHA EMISION:     ', alignment: 'left', fontSize: 9, bold: true },
                            { text: fecha_emision + '  ' + hora + '\n', fontSize: 9, bold: false },
                            { text: 'FECHA VENCIMIENTO: ', alignment: 'left', fontSize: 9, bold: true },
                            { text: fecha_vencimiento + '\n', fontSize: 9, bold: false }
                          ]
                        }
                      ]
                    ]
                  }
                  ,layout: 'noBorders'
                  }
                ]      //  ****************   prueba
              ],
              [
                {
                  columns: [
                    {
                      width: 120,
                      fontSize: 9,
                      text: [
                        { text: this.dataCabeceraVentas.placa_vehiculo ? 'PLACA: ' : '', fontSize: 9, bold: true },
                        { text: this.dataCabeceraVentas.placa_vehiculo ? this.dataCabeceraVentas.placa_vehiculo : '', fontSize: 9 }
                      ]
                    },
                    {
                      width: '*',
                      fontSize: 9,
                      text: [
                        { text: this.dataCabeceraVentas.orden_compra ? 'ORDEN: ' : '', fontSize: 9, bold: true },
                        { text: this.dataCabeceraVentas.orden_compra ? this.dataCabeceraVentas.orden_compra : '', fontSize: 9 }
                      ]
                    }
                  ]
                }

              ],
              [
                {
                  margin: [0, 0, 0, 0],
                  table: {
                    widths: [20, 52, 200, 50, 35, 48, 45, '*'],
                    body: this.dataProducts2
                  }
                }
              ],
              [
                {
                  columns: [
                    {
                      text: this.arrayGuias
                    }
                  ]
                }
              ],
              [
                {
                  columns: [
                    {
                      width: 360,
                      fontSize: 9,
                      text: ''
                    },
                    {
                      width: 70, text: this.detallepago2
                    },
                    {
                      width: '*', text: this.dataPagos2
                    },
                    // dataPagos
                  ]
                }
              ],
              [                                         ///     A4
                this.InfoCuotas.length > 0 ?
                  {
                    border: [true, true, true, true],
                    table: {
                      // heights: [80, 50, 70],
                      widths: ['*'],
                      body: [
                        [
                          [
                            { text: 'CUOTAS:', fontSize: 7.5, bold: true },
                            {
                              alignment: 'center',
                              width: "auto",
                              fontSize: 8,
                              border: [true, false, true, true],
                              margin: [170, 1, 0, 2],
                              table: {
                                // headerRows: 1,
                                widths: [22, 52, 40, 55],
                                headerRows: 2,
                                body: this.InfoCuotas
                              }
                            }
                          ],

                        ]
                      ]
                    }
                  } : ''
              ],
              [detraccion_id ?
                {
                  table: {
                    widths: ['*', '*', '*'],
                    body: [
                      [
                        {
                          colSpan: 3, text: 'Operación sujeta a detracción ', alignment: 'left', fontSize: 8, bold: true

                        }, {}, {}
                      ],
                      [
                        {
                          // border: [false, false, false, false],
                          text: [
                            { text: '% Detracción: ', alignment: 'left', fontSize: 8, bold: true },
                            { text: detraccion_porcent, fontSize: 8, bold: false }
                          ]
                        },
                        {
                          text: [
                            { text: 'Monto Detracción: ', alignment: 'left', fontSize: 8, bold: true },
                            { text: this.numFormat(Number(detraccion_total)), fontSize: 8, bold: false }
                          ]
                        },
                        {
                          text: [
                            { text: 'Moneda: ', alignment: 'left', fontSize: 8, bold: true },
                            { text: (idmoneda == 1 ? 'Soles' : (idmoneda == 2 ? 'Dolares Americanos' : '')), fontSize: 8, bold: false }
                          ]
                        }
                      ],
                      [
                        {
                          colSpan: 3,
                          text: [
                            { text: 'Bienes y/o Servicios sujetos a detracción: ', alignment: 'left', fontSize: 8, bold: true },
                            { text: detraccion_desc, fontSize: 8, bold: false }
                          ]
                        }, {}, {}
                      ]
                    ]
                  }
                }
                : ''
              ],
              [afecto_retencion ?
                {
                  table: {
                    widths: ['*', '*', '*'],
                    margin: [0, 0, 8, 10],
                    body: [
                      [
                        {
                          colSpan: 3, text: 'Informacion de la retención ', alignment: 'left', fontSize: 8, bold: true
                        }, {}, {}
                      ],
                      [
                        {
                          text: [
                            { text: 'Base inponible de la Retención: ', alignment: 'left', fontSize: 8, bold: true },
                            { text: this.numFormat(Number(total)), alignment: 'right', fontSize: 8, bold: false }
                          ]
                        },
                        {
                          text: [
                            { text: '% de la Retención: ', alignment: 'left', fontSize: 8, bold: true },
                            { text: this.numFormat(Number(retencion_porcent)), alignment: 'right', fontSize: 8, bold: false }
                          ]
                        },
                        {
                          text: [
                            { text: 'Monto de la retención: ', alignment: 'left', fontSize: 8, bold: true },
                            { text: this.numFormat(Number(retencion_total)), fontSize: 8, bold: false }
                          ]
                        }
                      ]
                    ]
                  }
                }
                : ''
              ],
              [
                detraccion_id || afecto_retencion ?
                  {
                    table: {
                      widths: ['*', '*'],
                      margin: [0, 0, 8, 10],
                      body: [
                        [
                          {
                            text: [
                              { text: 'Neto a pagar: ', alignment: 'left', fontSize: 8, bold: true },
                              { text: this.numFormat(Number(total - (Number(detraccion_total) + Number(retencion_total)))), alignment: 'right', fontSize: 8, bold: false }
                            ]
                          },
                          {
                            text: [
                              { text: 'Moneda: ', alignment: 'left', fontSize: 8, bold: true },
                              { text: (idmoneda == 1 ? 'Soles' : (idmoneda == 2 ? 'Dolares Americanos' : '')), fontSize: 8, bold: false }
                            ]
                          }
                        ]
                      ]
                    }
                  } : ''
              ],
              [
                ['01', '03', '07', '08'].includes(this.dataCabeceraVentas.codigo_sunat) ?
                  {

                    table: {
                      widths: ['*'],
                      body: [
                        [
                          {
                            text: [
                              { text: 'Observaciones de Sunat:' + ' \n', fontSize: 8, bold: true },
                              { text: 'El comprobante ' + serie + '-' + numero_serie + ', ' + (this.dataCabeceraVentas.enviado_estado) + '\n', fontSize: 8 }
                            ]
                          }
                        ]
                      ]
                    }
                  } : ''
              ],
              [this.dataCabeceraVentas.nro_cuentas ?
                {
                  table: {
                    widths: ['*'],
                    body: [
                      [
                        {
                          text: [
                            { text: 'Cuentas Bancarias: \n', fontSize: 8, bold: true },
                            { text: this.dataCabeceraVentas.nro_cuentas, fontSize: 8 }
                          ]
                        }
                      ]
                    ]
                  }
                } : ''
              ],
              [this.dataCabeceraVentas.documentoRef ?
                {
                  table: {
                    widths: ['*'],
                    body: [
                      [
                        {
                          text: [
                            { text: 'DOCUMENTO AFECTAR ' + this.dataCabeceraVentas.notacreditodebito + ' \n', fontSize: 7.5, bold: true },
                            {
                              text: this.dataCabeceraVentas.documentoRef + ' \n'
                                + 'POR ' + (this.dataCabeceraVentas.codigo_sunat == '07' ? this.dataCabeceraVentas.motnotacredito : this.dataCabeceraVentas.motnotadebito), fontSize: 7.5
                            }
                          ]
                        }
                      ]
                    ]
                  }
                } : ''
              ],
              [
                ['01', '03', '07', '08'].includes(codigo_sunat) && this.dataCabeceraVentas.msj_comprobante ?
                  {
                    bold: true,
                    fontSize: 8,
                    text: this.dataCabeceraVentas.msj_comprobante + '\n\n',
                    alignment: 'center',
                    // colSpan: 3,
                    // rowSpan: 1
                  } : this.dataCabeceraVentas.msj_otros ?
                    {
                      bold: true,
                      fontSize: 8,
                      text: this.dataCabeceraVentas.msj_otros + '\n\n',
                      alignment: 'center',
                      // colSpan: 3,
                      // rowSpan: 1
                    } : ''
              ],
              [
                {
                  fontSize: 7,
                  text: 'Vendedor: ' + this.dataCabeceraVentas.vendedor + (this.dataCabeceraVentas.vendedor != '-' ? '\n' : ''),
                  alignment: 'right'
                }
              ],
              [
                {
                  table: {
                    widths: [400, 165],
                    body: [
                      [{ text: ['01', '03', '07', '08'].includes(this.dataCabeceraVentas.codigo_sunat) ? this.dataCabeceraVentas.pie_comprobante + '\n' : '', fontSize: 9 },
                      ['01', '03', '07', '08'].includes(this.dataCabeceraVentas.codigo_sunat) ? qrA4(`${razon_social}|OrdenSunat: ${idtipodocumento}|Serie: ${this.dataCabeceraVentas.serie}|Numero: ${this.dataCabeceraVentas.numero}
                        |Igv: ${total_igv}|Total: ${total}|FechaEmision: ${fecha_emision && new Date(`${fecha_emision}T00:00`).toLocaleDateString()}
                         |Tipodocumentodelcliente: ${this.dataCabeceraVentas.idtipodocidentidad}|Documentodelcliente: ${rucdni}`) : '']
                    ]
                  },
                  layout: 'noBorders'
                }
              ],
              [
                { text: 'Powered by www.codeplex.pe', fontSize: 8 }
              ]
              ///  fin de row

            ]
          },
          layout: 'noBorders'
        }
        // fin de la tabla        
      ],
      styles: {
        heightColTable: {
          fontSize: 22,
          bold: true,
          marginBottom: 5
        }
      }

    }; // docDefinition

    return docDefinition;

  } // formata4


  private _generatePdf(docDefinition: Object, typeDoc?: string) {
    const pdfDocGenerator = this.pdfMake.createPdf(docDefinition);

    pdfDocGenerator.getBlob((data: any) => {
      this.documentBlob = data;

      const url = window.URL.createObjectURL(this.documentBlob);
      window.open(url, '_blank');
      // return  this.documentBlob;
    });
  }

}
