import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, inject, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import Hls, { Fragment } from 'hls.js';
import { Subject, takeUntil, tap } from 'rxjs';
import { HlsConfig } from '../../../consts/hls-config.const';
import { SCREENS } from '../../../consts/system-contant';
import { ObjDbClickSentToReferee } from '../../../interfaces';
import { HandleCurrentDurationTimeService } from '../../../services/handle-current-duration-time.service';
import { HandleSyncAllVideoService } from '../../../services/handle-sync-all-video.service';
import { LocService } from '../../../services/loc-service.service';
import { WebSocketService } from '../../../services/web-socket.service';
import { MediamtxVideoPlayerFacade } from './mediamtx.facade';
@Component({
  selector: 'app-mediamtx-video-player',
  templateUrl: './mediamtx-video-player.component.html',
  styleUrls: ['./mediamtx-video-player.component.scss'],
  standalone: true,
  imports: [],
  providers: [MediamtxVideoPlayerFacade]
})
export class MediamtxVideoPlayerComponent implements OnInit, AfterViewInit {
  @Input() videoUrl!: string;
  @Input() id!: number;
  @Input() isReferee!: boolean;
  @Input() typeOfScreen!: string;
  @Input() isRefresh!: boolean;
  @Output() isDoneInitial: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('videoPlayer', { static: true }) videoPlayer!: ElementRef;

  private readonly _MediamtxVideoPlayerFacade = inject(MediamtxVideoPlayerFacade);

  private destroy$: Subject<void> = new Subject<void>();

  videoId!: string;

  hls = new Hls(HlsConfig);
  isPlay = true;
  public currentTime = 0;
  currentRate = 'x1';
  duration = 0;
  isDragging = false;
  startX = 0;
  startY = 0;
  maxZoomLevel = 5;
  minZoomLevel = 1;
  initialLeft = 0;
  initialTop = 0;
  deltaY = 0;
  frags: Fragment[] = [];
  dragEnabled: boolean = false;
  constructor(
    private _handleSyncAllVideoService?: HandleSyncAllVideoService,
    private webSocketService?: WebSocketService,
    private renderer?: Renderer2,
    private locService?: LocService,
    private handleCurrentDurationTimeService?: HandleCurrentDurationTimeService
  ) {
  }

  ngOnInit(): void {
    this.videoId = `video-container${this.id}`;
    this.handleSubjectGetEmitData();
    this.locService?.layout$.subscribe((rs) => {
      if (rs) {
        this.dragEnabled = rs.status;
      }
    });
  }
 
  ngAfterViewInit() {
    this.createVideoElement();
  }

  dbClick(): void {
    let objSentToReferee: ObjDbClickSentToReferee = {
      source: this.videoUrl,
      isDbClick: true,
      isPlay: !this.videoPlayer.nativeElement.paused,
      currentTime: this.currentTime,
      currentZoom: this.getZoomLevel(),
      deltaY: this.deltaY,
      rateValue: this.currentRate,
    };
    this._MediamtxVideoPlayerFacade.dbClick(objSentToReferee);
  }

  createVideoElement(): void {
    if (this.videoPlayer && Hls.isSupported()) {
      let video = this.videoPlayer!.nativeElement;
      this.hls.loadSource(this.videoUrl);
      this.hls.attachMedia(this.videoPlayer?.nativeElement);
      this.hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        console.log('video and hls.js are now bound together !');
        if (this.videoPlayer) {

          console.log('onPlayerReady', this);
          video.addEventListener('timeupdate', () => {
            this.currentTime = video.currentTime;
            this.duration = video.duration;
            if(this.handleCurrentDurationTimeService){
              this.handleCurrentDurationTimeService.currentTime = this.currentTime;
              this.handleCurrentDurationTimeService.duration = this.duration;
            }
            this._handleSyncAllVideoService?.sendDoneUpdateTime(true);
          });
          video.addEventListener('canplay', () => {
            if (this.isPlay) {
              video.muted = true;
              setTimeout(() => {
                this.isDoneInitial.emit(true);
                video.play();
              }, 100);
              this.isPlay = false;
            } else {
              // video.pause();
            }
          });
        }
      });
      this.hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        var lowestQualityLevel = 0; // Assuming the lowest quality level corresponds to 144p
        this.hls.levels.forEach(function (level, levelIndex) {
          if (level.height <= 144) {
            lowestQualityLevel = levelIndex;
          }
        });
        this.hls.currentLevel = lowestQualityLevel;
        video.play();
      });
      this.hls.on(Hls.Events.FRAG_LOADED, () => { });
    }
  }

  handleSubjectGetEmitData() {
    this._handleSyncAllVideoService
      ?.getTime()
      .pipe(
        takeUntil(this.destroy$),
        tap((res) => {
          this.setTime(res);
        })
      )
      .subscribe();

    this._handleSyncAllVideoService
      ?.getPauseOrPlay()
      .pipe(
        takeUntil(this.destroy$),
        tap((res) => {
          this.handlePauseOrPlay();
        })
      )
      .subscribe();

    this._handleSyncAllVideoService
      ?.getSeekToLive()
      .pipe(
        takeUntil(this.destroy$),
        tap((res) => {
          this.handleSeekToLive();
        })
      )
      .subscribe();

    this._handleSyncAllVideoService
      ?.getPlayBackRate()
      .pipe(
        takeUntil(this.destroy$),
        tap((res) => {
          this.playbackRate(res);
        })
      )
      .subscribe();
  }

  handleSeekToLive() {
    this.isPlay = true;
    this.videoPlayer.nativeElement.currentTime = this.videoPlayer.nativeElement.duration - 2;
    let objSentToReferee = {
      isPlay: true,
      currentTime: this.videoPlayer.nativeElement.currentTime,
      seekVideoPlayback: true,
    };
    this.webSocketService!.sendMessage(objSentToReferee);
  }

  handlePauseOrPlay() {
    const video = this.videoPlayer.nativeElement;
    if (!video.paused) {
      const thePromise = video.play();
      if (thePromise !== undefined) {
        thePromise.then(() => {
          video.pause();
          let objSentToReferee = {
            isPlay: !video.paused,
            pauseOrPlayFlag: true,
            currentTime: video.currentTime,
          };
          this.webSocketService!.sendMessage(objSentToReferee);
        });
      }
    } else {
      video.play();
      let objSentToReferee = {
        isPlay: !video.paused,
        pauseOrPlayFlag: true,
        currentTime: video.currentTime,
      };
      this.webSocketService!.sendMessage(objSentToReferee);
    }
  }

  setTime(time: number) {
    this.isPlay = false;
    this.videoPlayer.nativeElement.currentTime = time;
  }


  playbackRate(rate: string) {
    switch (rate) {
      case 'x0.1':
        this.videoPlayer.nativeElement.playbackRate = 0.1;
        break;
      case 'x0.5':
        this.videoPlayer.nativeElement.playbackRate = 0.5;
        break;
      default:
        this.videoPlayer.nativeElement.playbackRate = 1;
    }
    this.currentRate = rate;
  }
  
  checkTypeOfScreen() {
    if (this.typeOfScreen === SCREENS.FOUR_SCREENS) {
      return 2;
    } else if (this.typeOfScreen === SCREENS.NINE_SCREENS) {
      return 3;
    } else {
      return 1;
    }
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
      this.webSocketService!.sendMessage(objSentToReferee);
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
    this.renderer?.setStyle(this.videoPlayer?.nativeElement, 'transform', `scale(${zoomLevel})`);
  }

  resetPosition(): void {
    this.renderer?.setStyle(this.videoPlayer?.nativeElement, 'left', `${this.initialLeft}px`);
    this.renderer?.setStyle(this.videoPlayer?.nativeElement, 'top', `${this.initialTop}px`);
  }

  //=====================END ZOOM=======================

  //=====================START DRAG=====================
  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    this.isDragging = true;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.videoPlayer.nativeElement.style.cursor = 'grabbing'; // Change cursor to grabbing
    event.preventDefault(); // Prevent default to stop text selection

    this.webSocketService?.sendMessage(
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
    this.isDragging = false;
    this.videoPlayer.nativeElement.style.cursor = 'grab'; // Change cursor back to grab
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      this.webSocketService?.sendMessage(
        {
          isPlay: false,
          typeOfAction: 'onMouseMove',
          clientX: event.clientX,
          clientY: event.clientY,
          typeOfScreen: this.checkTypeOfScreen()
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
    this.renderer?.setStyle(this.videoPlayer?.nativeElement, 'left', `${currentLeft + deltaX}px`);
    this.renderer?.setStyle(this.videoPlayer?.nativeElement, 'top', `${currentTop + deltaY}px`);
  }
  //=====================STOP DRAG=====================


  ngOnDestroy(): void {
    if (this.hls) {
      this.hls.destroy();
    }
  }
}
