import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import Hls from 'hls.js';
import { WebSocketService } from '../../../services/web-socket.service';

@Component({
  selector: 'app-referee-hls',
  templateUrl: './referee-hls.component.html',
  styleUrls: ['./referee-hls.component.scss'],
  standalone: true,
  imports: []
})
export class RefereeHlsComponent implements OnInit {
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


  constructor(private webSocketService: WebSocketService, private renderer?: Renderer2) { }

  ngOnInit(): void {
    const config = {
      autoStartLoad: true,
      initialLiveManifestSize: 1,
      maxBufferLength: 60,
      maxBufferSize: 60 * 1000 * 1000 * 2,
      nudgeOffset: 0.1,
      liveSyncDurationCount: 3,
      enableWorker: true,
      manifestLoadingTimeOut: 10000,
      manifestLoadingMaxRetry: 1,
      manifestLoadingRetryDelay: 500,
      manifestLoadingMaxRetryTimeout: 64000,
      levelLoadingMaxRetry: 4,
      levelLoadingRetryDelay: 500,
      levelLoadingMaxRetryTimeout: 64000,
      fragLoadingTimeOut: 20000,
      fragLoadingMaxRetry: 6,
      fragLoadingRetryDelay: 500,
      fragLoadingMaxRetryTimeout: 64000,
      startFragPrefetch: true,
      appendErrorMaxRetry: 3,
      abrEwmaFastLive: 5.0,
      abrEwmaSlowLive: 9.0,
      abrEwmaDefaultEstimate: 500000,
      abrBandWidthFactor: 0.95,
      abrBandWidthUpFactor: 0.7,
      minAutoBitrate: 0,
    };
    this.hls = new Hls(config);
    this.webSocketService.messages.subscribe((dataVideo: string) => {
      this.videoElement = this.videoPlayer?.nativeElement;
      this.valueParsed = JSON.parse(dataVideo);
      this.isPlay = this.valueParsed.isPlay;
      if (Hls.isSupported() && this.valueParsed?.isDbClick) {
        this.hls.detachMedia();
        this.hls.loadSource(this.valueParsed.source);
        this.hls.attachMedia(this.videoElement);
        this.videoElement.currentTime = this.valueParsed?.currentTime;

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
      if (this.valueParsed?.seekVideoPlayback) {
        this.videoElement.currentTime = this.valueParsed?.currentTime;
      }
      if (this.valueParsed.pauseOrPlayFlag) {
        this.videoElement.currentTime = this.valueParsed?.currentTime;
      }
      if (this.valueParsed.playBackRate) {
        switch (this.valueParsed.playBackRate) {
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
      if (this.valueParsed.typeOfAction === 'zoom') {
        // this.mediaRtxPlayerComponent?.onMouseScroll(this.valueParsed); 
        if (this.valueParsed.deltaY > 0) {
          this.zoomOut(this.valueParsed?.currentZoom);
        } else if (this.valueParsed.deltaY < 0) {
          this.zoomIn(this.valueParsed?.currentZoom);
        }
      }

      if (this.valueParsed.typeOfAction === 'onMouseDown') {
        this.onMouseDown(this.valueParsed.startX, this.valueParsed.startY);
      }
      if (this.valueParsed.typeOfAction === 'onMouseMove') {
        this.onMouseMove(this.valueParsed.clientX, this.valueParsed.clientY, this.valueParsed.typeOfScreen);
      }
    });
  }

  // //=====================START ZOOM=====================

  zoomIn(zoomVaue?: number): void {
    const currentZoom = !zoomVaue ? this.getZoomLevel() : zoomVaue;
    const newZoom = Math.min(currentZoom + 0.1, this.maxZoomLevel);
    this.setZoomLevel(newZoom);
  }

  zoomOut(zoomVaue?: number): void {
    const currentZoom = !zoomVaue ? this.getZoomLevel() : zoomVaue;
    const newZoom = Math.max(currentZoom - 0.1, this.minZoomLevel);

    if (newZoom === this.minZoomLevel) {
      this.resetPosition();
    }

    this.setZoomLevel(newZoom);
  }

  resetPosition(): void {
    this.renderer?.setStyle(this.videoPlayer?.nativeElement, 'left', `${this.initialLeft}px`);
    this.renderer?.setStyle(this.videoPlayer?.nativeElement, 'top', `${this.initialTop}px`);
  }
  private getZoomLevel(): number {
    const transform = getComputedStyle(this.videoPlayer.nativeElement).transform;
    const scaleMatches = transform.match(/matrix\((.+)\)/);
    return scaleMatches ? parseFloat(scaleMatches[1].split(', ')[3]) : 1;
  }

  private setZoomLevel(zoomLevel: number): void {
    this.renderer?.setStyle(this.videoPlayer?.nativeElement, 'transform', `scale(${zoomLevel})`);
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
    this.renderer?.setStyle(this.videoPlayer?.nativeElement, 'left', `${currentLeft + deltaX}px`);
    this.renderer?.setStyle(this.videoPlayer?.nativeElement, 'top', `${currentTop + deltaY}px`);
  }
}
