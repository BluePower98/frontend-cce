import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarService } from 'src/app/services/sidebar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  menuItems?:any[];
  constructor(private sideBarServices: SidebarService, private router:Router) {
    this.menuItems= this.sideBarServices.menu;

   } 

  ngOnInit(): void {
  }

  logout(){
  this.router.navigateByUrl('/login');
  localStorage.removeItem('idempresa');
  }

}
