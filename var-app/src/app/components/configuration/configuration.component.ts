import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddNewCameraComponent } from '../add-new-camera/add-new-camera.component';
import { LocService } from '../../services/loc-service.service';
import { MATERIAL_MODULE } from '../../consts/material.const';

export interface Cameras {
  name: string;
  position: number; 
}

const ELEMENT_DATA: Cameras[] = [ ];
@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
  standalone: true,
  imports: [MATERIAL_MODULE]
})
export class ConfigurationComponent implements OnInit {
  showFiller = true;
  constructor(private locService : LocService, public dialog: MatDialog) { }

  displayedColumns: string[] = ['position', 'name', 'action'];
  dataSource = ELEMENT_DATA;
  ngOnInit(): void {
    this.getAllCameras();
  }
  openAddNewDialog(){ 
    const dialog = this.dialog.open(AddNewCameraComponent, {
      width: '30rem', 
      height: '34rem'
    });
    dialog.afterClosed().subscribe(rs => {
      console.log(rs)
      if(rs){
        this.locService.camera.next({isRefreshCamera : true});
        this.getAllCameras();
      }
    })
  }

  getAllCameras(){ 
    this.locService.getAllCameras().subscribe(rs => {  
      this.dataSource = rs.items
    })
  }
}
