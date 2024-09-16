import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CAMERA_INFOR, SCREENS } from '../../consts/system-contant';
import { LocService } from '../../services/loc-service.service';
import { FloatingMenuComponent } from '../floating-menu/floating-menu.component';
import { NgFor, NgIf, NgStyle } from '@angular/common';
@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.scss'],
  standalone: true,
  imports: [FloatingMenuComponent, NgStyle, NgIf, NgFor]
})
export class LiveComponent implements OnInit {
  cameraInfo = CAMERA_INFOR;
  videos: SafeResourceUrl[] = [];
  screenType = SCREENS.FOUR_SCREENS;
  indexOfVideoSelected = 0;

  videosForOneView: string[] = ['', '', '', '', '', '', '', '', ''];

  @ViewChild('iframeElem') iframeElem!: ElementRef;

  constructor(private sanitizer: DomSanitizer, private locService: LocService) { }
  cameraResponse = [];
  cameraResponseBk = [];
  ngOnInit(): void {
    this.locService.getListCamera().subscribe(
      (rs) => {
        if (rs) {
          const listCamera = rs.items.map((camera: any) => camera.name);
          this.cameraResponse = listCamera;
          this.cameraResponseBk = listCamera;
          this.switchScreen(SCREENS.FOUR_SCREENS, this.cameraResponse);
        }
      },
      (err) => {
        this.switchScreen(SCREENS.FOUR_SCREENS);
      }
    );
  }

  switchScreen(screenType: string, camArr: any[] = []) {
    console.log(camArr);
    this.videos = [];
    switch (screenType) {
      case SCREENS.FOUR_SCREENS:
        this.screenType = screenType;
        camArr.forEach((ele: any) => {
          this.videos.push(
            this.sanitizer.bypassSecurityTrustResourceUrl(`http://localhost:8889/${ele}`)
          );
        });

        while (this.videos.length < 4) {
          this.videos.push('');
        }
        break;

      case SCREENS.NINE_SCREENS:
        this.screenType = screenType;
        camArr.forEach((ele: any) => {
          this.videos.push(
            this.sanitizer.bypassSecurityTrustResourceUrl(`http://localhost:8889/${ele}`)
          );
        });
        while (this.videos.length < 9) {
          this.videos.push('');
        }
        break;

      case SCREENS.ONE_SCREENS:
        this.screenType = screenType;
        camArr.forEach((ele: any) => {
          this.videos.push(
            this.sanitizer.bypassSecurityTrustResourceUrl(`http://localhost:8889/${ele}`)
          );
        });
        break;
    }
    localStorage.setItem('screenTypeLive', this.screenType);
  }

  selectVideoFromOneView(index: number) {
    this.indexOfVideoSelected = -1;
    console.log('22');
    setTimeout(() => {
      this.indexOfVideoSelected = index;
    }, 100);
  }
}
