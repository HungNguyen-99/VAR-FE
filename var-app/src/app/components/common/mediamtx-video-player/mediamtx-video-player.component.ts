import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, inject, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { ObjDbClickSentToReferee } from '../../../interfaces';
import { LocService } from '../../../services/loc-service.service';
import { WebSocketService } from '../../../services/web-socket.service';
import { MediamtxVideoPlayerFacade } from './mediamtx.facade';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { HandleCurrentDurationTimeService } from '../../../services/handle-current-duration-time.service';
@Component({
  selector: 'app-mediamtx-video-player',
  templateUrl: './mediamtx-video-player.component.html',
  styleUrls: ['./mediamtx-video-player.component.scss'],
  standalone: true,
  imports: [AsyncPipe, JsonPipe],
  providers: [MediamtxVideoPlayerFacade]
})
export class MediamtxVideoPlayerComponent implements OnInit, AfterViewInit {
  @Input() videoUrl!: string;
  @Input() isReferee!: boolean;
  @Input() typeOfScreen!: string;
  @Input() currentTimeX1!: number;

  @ViewChild('videoPlayer', { static: true }) videoPlayer!: ElementRef;

  readonly _mediamtxVideoPlayerFacade = inject(MediamtxVideoPlayerFacade);
  private readonly _handleCurrentDurationTimeService = inject(HandleCurrentDurationTimeService);
  readonly _webSocketService = inject(WebSocketService);
  readonly _renderer = inject(Renderer2);
  readonly _locService = inject(LocService);

  isDragging = false;
  dragEnabled = false;
  startX = 0;
  startY = 0;
  maxZoomLevel = 5;
  minZoomLevel = 1;
  initialLeft = 0;
  initialTop = 0;
  deltaY = 0;

  ngOnInit(): void {
    this._mediamtxVideoPlayerFacade.handleSubjectGetEmitData(this.videoPlayer);
    this._locService?.layout$.subscribe((rs) => {
      if (rs) {
        this.dragEnabled = rs?.status;
      }
    });
  }
 
  ngAfterViewInit() {
    this._mediamtxVideoPlayerFacade.createVideoElement(this.videoPlayer, this.videoUrl, this.currentTimeX1);
  }

  ngOnDestroy(): void {
    if (this._mediamtxVideoPlayerFacade.hls) {
      this._mediamtxVideoPlayerFacade.hls.destroy();
    }
  }

  dbClick(): void {
    let objSentToReferee: ObjDbClickSentToReferee = {
      source: this.videoUrl,
      isDbClick: true,
      isPlay: !this.videoPlayer.nativeElement.paused,
      currentTime: this._handleCurrentDurationTimeService.currentTime,
      currentZoom: this.getZoomLevel(),
      deltaY: this.deltaY,
      rateValue: this._handleCurrentDurationTimeService.currentRate,
    };
    this._mediamtxVideoPlayerFacade.dbClick(objSentToReferee);
  }

  //=====================START ZOOM=====================
  @HostListener('wheel', ['$event'])
  onMouseScroll(event: WheelEvent | any) {
    const delta = Math.sign(event.deltaY);
    if (delta > 0) {
      this.zoomOut(event?.currentZoom);
    } else if (delta < 0) {
      this.zoomIn(event?.currentZoom);
    }

    if (!this.isReferee) {
      this.deltaY = event.deltaY;
      let objSentToReferee = {
        isCurrentSource: true,
        typeOfAction: 'zoom',
        deltaY: event.deltaY,
        currentZoom: event?.currentZoom
      };
      this._webSocketService!.sendMessage(objSentToReferee);
    }
  }

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

  private getZoomLevel(): number {
    const transform = getComputedStyle(this.videoPlayer.nativeElement).transform;
    const scaleMatches = transform.match(/matrix\((.+)\)/);
    return scaleMatches ? parseFloat(scaleMatches[1].split(', ')[3]) : 1;
  }

  private setZoomLevel(zoomLevel: number): void {
    this._renderer?.setStyle(this.videoPlayer?.nativeElement, 'transform', `scale(${zoomLevel})`);
  }

  resetPosition(): void {
    this._renderer?.setStyle(this.videoPlayer?.nativeElement, 'left', `${this.initialLeft}px`);
    this._renderer?.setStyle(this.videoPlayer?.nativeElement, 'top', `${this.initialTop}px`);
  }

  //=====================START DRAG=====================
  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    if(!this.dragEnabled){
       return;
    }
    this.isDragging = true;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.videoPlayer.nativeElement.style.cursor = 'grabbing'; // Change cursor to grabbing
    event.preventDefault(); // Prevent default to stop text selection

    this._webSocketService?.sendMessage(
      {
        isPlay: false,
        typeOfAction: 'onMouseDown',
        startX: this.startX,
        startY: this.startY
      }
    )
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    if(!this.dragEnabled){
      return;
   }
    this.isDragging = false;
    this.videoPlayer.nativeElement.style.cursor = 'grab'; // Change cursor back to grab
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if(!this.dragEnabled){
      return;
   }
    if (this.isDragging) {
      this._webSocketService?.sendMessage(
        {
          isPlay: false,
          typeOfAction: 'onMouseMove',
          clientX: event.clientX,
          clientY: event.clientY,
          typeOfScreen: this._mediamtxVideoPlayerFacade.checkTypeOfScreen(this.typeOfScreen) 
        }
      )

      const deltaX = event.clientX - this.startX;
      const deltaY = event.clientY - this.startY;
      this.adjustVideoPosition(deltaX, deltaY);
      this.startX = event.clientX;
      this.startY = event.clientY;
    }
  }

  public adjustVideoPosition(deltaX: number, deltaY: number): void {
    const currentLeft = parseFloat(getComputedStyle(this.videoPlayer?.nativeElement).left) || 0;
    const currentTop = parseFloat(getComputedStyle(this.videoPlayer?.nativeElement).top) || 0;
    this._renderer?.setStyle(this.videoPlayer?.nativeElement, 'left', `${currentLeft + deltaX}px`);
    this._renderer?.setStyle(this.videoPlayer?.nativeElement, 'top', `${currentTop + deltaY}px`);
  }

}
