import { Component, ElementRef, HostListener, inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import Hls from 'hls.js';
import { WebSocketService } from '../../../services/web-socket.service';
import { LocalStorageService } from '../../../services/localStorage.service';
import { HlsConfig } from '../../../consts/hls-config.const';

@Component({
  selector: 'app-referee-hls-use-localStorage',
  templateUrl: './referee-hls-use-localStorage.component.html',
  styleUrls: ['./referee-hls-use-localStorage.component.scss'],
  standalone: true,
  imports: []
})
export class RefereeHlsLocalStorageComponent implements OnInit {
  valueParsed: any;
  isPlay = false;
  isShowVideo = true;
  videoElement!: HTMLVideoElement;
  hls: any;
  isDragging = false;
  startX = 0;
  startY = 0;
  maxZoomLevel = 5;
  minZoomLevel = 1;
  initialLeft = 0;
  initialTop = 0;
  deltaY = 0;
  @ViewChild('videoPlayer', { static: true }) videoPlayer!: ElementRef;

  readonly _localStorageService = inject(LocalStorageService);
  readonly _renderer = inject(Renderer2);

  ngOnInit(): void {
    this.hls = new Hls(HlsConfig);
    this.videoElement = this.videoPlayer?.nativeElement;
    this._localStorageService.getStorageObservable().subscribe((valueParsed) => {
      this.isPlay = valueParsed.isPlay;
      if (Hls.isSupported() && valueParsed?.isDbClick) {
        this.hls.detachMedia();
        this.hls.loadSource(valueParsed.source);
        this.hls.attachMedia(this.videoElement);
        this.videoElement.currentTime = valueParsed?.currentTime;

        this.hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          if (this.videoElement) {
            this.videoElement.addEventListener('canplay', () => {
              if (this.isPlay) {
                this.videoElement.muted = true;
                this.videoElement.play();
              } else {
                this.videoElement.pause();
              }
            });
          }
        });
      }
      if (valueParsed?.seekVideoPlayback) {
        this.videoElement.currentTime = valueParsed?.currentTime;
      }
      if (valueParsed.pauseOrPlayFlag) {
        this.videoElement.currentTime = valueParsed?.currentTime;
      }
      if (valueParsed.playBackRate) {
        switch (valueParsed.playBackRate) {
          case 'x0.1':
            this.videoPlayer.nativeElement.playbackRate = 0.1;
            break;
          case 'x0.5':
            this.videoPlayer.nativeElement.playbackRate = 0.5;
            break;
          default:
            this.videoPlayer.nativeElement.playbackRate = 1;
        }
      }
      if (valueParsed.typeOfAction === 'zoom') {
        debugger
        if (valueParsed.deltaY > 0) {
          this.zoomOut(valueParsed?.currentZoom);
        } else if (valueParsed.deltaY < 0) {
          this.zoomIn(valueParsed?.currentZoom);
        }
      }

      if (valueParsed.typeOfAction === 'onMouseDown') {
        this.onMouseDown(valueParsed.startX, valueParsed.startY);
      }
      if (valueParsed.typeOfAction === 'onMouseMove') {
        this.onMouseMove(valueParsed.clientX, valueParsed.clientY, valueParsed.typeOfScreen);
      }
    })
  }

  // //=====================START ZOOM=====================

  zoomIn(zoomVaue?: number): void {
    const currentZoom = this.getZoomLevel();
    const newZoom = Math.min(currentZoom + 0.1, this.maxZoomLevel);
    this.setZoomLevel(newZoom);
  }

  zoomOut(zoomVaue?: number): void {
    const currentZoom = this.getZoomLevel();
    const newZoom = Math.max(currentZoom - 0.1, this.minZoomLevel);

    if (newZoom === this.minZoomLevel) {
      this.resetPosition();
    }

    this.setZoomLevel(newZoom);
  }

  resetPosition(): void {
    this._renderer?.setStyle(this.videoPlayer?.nativeElement, 'left', `${this.initialLeft}px`);
    this._renderer?.setStyle(this.videoPlayer?.nativeElement, 'top', `${this.initialTop}px`);
  }
  private getZoomLevel(): number {
    const transform = getComputedStyle(this.videoPlayer.nativeElement).transform;
    const scaleMatches = transform.match(/matrix\((.+)\)/);
    return scaleMatches ? parseFloat(scaleMatches[1].split(', ')[3]) : 1;
  }

  private setZoomLevel(zoomLevel: number): void {
    this._renderer?.setStyle(this.videoPlayer?.nativeElement, 'transform', `scale(${zoomLevel})`);
  }

  //=====================END ZOOM=======================

  onMouseDown(startX: any, startY: any): void {
    this.startX = startX;
    this.startY = startY;
  }

  onMouseMove(clientX: any, clientY: any, typeOfScreen: number = 2): void {
    const deltaX = (clientX - this.startX) * typeOfScreen;
    const deltaY = (clientY - this.startY) * typeOfScreen;
    this.adjustVideoPosition(deltaX, deltaY);
    this.startX = clientX;
    this.startY = clientY;
  }

  adjustVideoPosition(deltaX: number, deltaY: number): void {
    const currentLeft = parseFloat(getComputedStyle(this.videoPlayer?.nativeElement).left) || 0;
    const currentTop = parseFloat(getComputedStyle(this.videoPlayer?.nativeElement).top) || 0;
    console.log('currentLeft :: ', currentLeft);
    console.log('currentTop :: ', currentTop);
    this._renderer?.setStyle(this.videoPlayer?.nativeElement, 'left', `${currentLeft + deltaX}px`);
    this._renderer?.setStyle(this.videoPlayer?.nativeElement, 'top', `${currentTop + deltaY}px`);
  }
}
