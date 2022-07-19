import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/services/sidebar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  menuItems?:any[];
  constructor(private sideBarServices: SidebarService, private router:Router) {
    this.menuItems= this.sideBarServices.menu;

   }


  ngOnInit(): void {
  }

}
