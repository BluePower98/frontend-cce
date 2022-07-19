import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConexioneshttpService } from '../../service/conexioneshttp.service';
import { Login } from '../../types/interface.interface';
import { ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private login:ConexioneshttpService, private fb:FormBuilder, private router:Router) { }
  dato?:Login;
  ngOnInit(): void {
  }

  formularioFilter:FormGroup=this.fb.group({
    ruc:['', [Validators.required, Validators.minLength(11)]],
    dniruc:['', [Validators.required, Validators.minLength(11)]],
    clave:['', [Validators.required]],

  });

  loginIniciarSession(){
    if(this.formularioFilter.invalid){
      Swal.fire(
        '',
        '¡Imgrese los campos Requeridos!',
        'question'
      )
      return
    }
    this.login.login(this.formularioFilter.get('ruc')?.value,this.formularioFilter.get('dniruc')?.value,this.formularioFilter.get('clave')?.value).subscribe(res=>{
      this.dato = res[0];
      if(this.dato){
        this.router.navigate(['./dashboard/comprobantesrecibidos']);
      }
    })
  }
  campoNoValido(campo:string){
    return this.formularioFilter.get(campo)?.invalid && this.formularioFilter.get(campo)?.touched
  }

  comprobanteIndividual(){
    localStorage.setItem('idempresa', '1-20539782232');
    // this.router.navigate(['/consultaindividual' ]);
    window.open('/consultaindividual', '_blank');
  }


}
