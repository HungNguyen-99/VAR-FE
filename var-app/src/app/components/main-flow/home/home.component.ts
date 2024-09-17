import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { tap } from 'rxjs';
import { MATERIAL_MODULE } from '../../../consts/material.const';
import { SCREENS, SPEED_RO, TYPE_CONTROL } from '../../../consts/system-contant';
import { HandleSyncAllVideoService } from '../../../services/handle-sync-all-video.service';
import { LocService } from '../../../services/loc-service.service';
import { WebSocketService } from '../../../services/web-socket.service';
import { FloatingMenuComponent } from '../../common/floating-menu/floating-menu.component';
import { MediamtxVideoPlayerComponent } from '../../common/mediamtx-video-player/mediamtx-video-player.component';
import { HomeFacade } from './facades/home.facade';
import { HandleWidthOfTimeLinePipe } from '../../../pipes/handle-width-of-timeLine.pipe';
import { HandleCurrentDurationTimeService } from '../../../services/handle-current-duration-time.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FloatingMenuComponent, NgIf, NgFor, NgClass, MediamtxVideoPlayerComponent, MATERIAL_MODULE, AsyncPipe, HandleWidthOfTimeLinePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [HomeFacade]
})
export class HomeComponent implements OnInit {

  readonly homeFacade = inject(HomeFacade);

  readonly _handleCurrentDurationTimeService = inject(HandleCurrentDurationTimeService);

  readonly dialog = inject(MatDialog);

  screenType = SCREENS.FOUR_SCREENS;

  videoX4: string[] = [];

  videos: string[] = [];

  displayComponent = true;

  markedTimesHls: number[] = [];

  currentIndexVideoX4: number = 0;

  speedROArr = SPEED_RO;

  currIndexSpeedRO = 2;

  indexForClassContainerX1 = 0;

  screen1 = true;

  videosForOneView: string[] = [];

  selectedMarkedTimeIndex: number = -1;

  isDoneUpdateTime = false;

  tooltipTimeHls!: string;
  tooltipPositionHls!: number;
  isLive = true;
  play: boolean = false;

  @ViewChild('timeTooltip') timeTooltipHls!: ElementRef;
  @ViewChild('controlsHls') controlsHls!: ElementRef;

  constructor(
    private locService: LocService,
    private webSocketService?: WebSocketService,
    private _handleSyncAllVideoService?: HandleSyncAllVideoService
  ) { }

  ngOnInit(): void {
    this.homeFacade.getListCamera();

    this._handleSyncAllVideoService
      ?.getDoneUpdateTime()
      .pipe(
        tap((rs) => {
          if (rs) {
            this.isDoneUpdateTime = rs;
          }
        })
      )
      .subscribe();
  }

  setSpeedRo(event: number) {
    this.currIndexSpeedRO = event;
  }

  getDurationHls() {
    let hlsDuration: number = 0;
    document.querySelectorAll('.video-var').forEach((element: Element) => {
      const vid = element as HTMLVideoElement;
      hlsDuration = vid.duration;
    });
    return hlsDuration;
  }
  getCurrentTimeHls() {
    let hlsCurrentTime: number = 0;
    document.querySelectorAll('.video-var').forEach((element: Element) => {
      const vid = element as HTMLVideoElement;
      hlsCurrentTime = vid.currentTime;
    });
    return hlsCurrentTime;
    // return this.handleVideoByHlsComponent?.currentTime;
  }

  controlAll(action: string, timeRo?: number, timelineValue?: any): void {
    if (action === TYPE_CONTROL.LIVE) {
      this.isLive = true;
      this._handleSyncAllVideoService?.sendSeekToLive(true);
    }

    document.querySelectorAll('.video-var').forEach((element: Element) => {
      const vid = element as HTMLVideoElement;
      switch (action) {
        case TYPE_CONTROL.REWIND:
          vid.pause();
          if (timeRo) {
            vid.currentTime = Math.max(vid.currentTime - timeRo, 0);
          } else {
            vid.currentTime = Math.max(vid.currentTime - 1, 0);
          }
          this.webSocketService!.sendMessage({
            isPlay: false,
            currentTime: vid.currentTime,
            seekVideoPlayback: true,
          });
          this.isLive = false;
          break;
        case TYPE_CONTROL.FORWARD:
          vid.pause();
          if (timeRo) {
            vid.currentTime = Math.max(vid.currentTime + timeRo, 0);
          } else {
            vid.currentTime = Math.max(vid.currentTime + 1, 0);
          }
          this.webSocketService!.sendMessage({
            isPlay: false,
            currentTime: vid.currentTime,
            seekVideoPlayback: true,
          });
          this.isLive = false;
          break;
        case TYPE_CONTROL.PAUSE:
          this.isLive = false;
          this.play = false;
          vid.pause();
          break;
        case TYPE_CONTROL.PLAY:
          vid.play().catch(error => console.error('Error playing the video:', error));
          break;
        case TYPE_CONTROL.SEEK_TIMELINE:
          vid.currentTime = timelineValue;
          break;
      }
    });
  }

  translateCurrentTimeHls() {
    const currentTimeInSeconds = this.getCurrentTimeHls();
    if (currentTimeInSeconds) {
      const totalHours = currentTimeInSeconds / 3600;

      const totalMilliseconds = totalHours * 60 * 60 * 1000;

      const date = new Date(totalMilliseconds);

      const hours = date.getUTCHours().toString().padStart(2, '0');
      const minutes = date.getUTCMinutes().toString().padStart(2, '0');
      const seconds = date.getUTCSeconds().toString().padStart(2, '0');

      return `${hours}:${minutes}:${seconds}`;
    }
    return '00:00:00';
  }

  translateDurationHls() {
    const durationInSeconds = this.getDurationHls();
    if (durationInSeconds) {
      const totalHours = durationInSeconds / 3600;

      const totalMilliseconds = totalHours * 60 * 60 * 1000;

      const date = new Date(totalMilliseconds);

      const hours = date.getUTCHours().toString().padStart(2, '0');
      const minutes = date.getUTCMinutes().toString().padStart(2, '0');
      const seconds = date.getUTCSeconds().toString().padStart(2, '0');

      return `${hours}:${minutes}:${seconds}`;
    }
    return '00:00:00';
  }

  @HostListener('window:keydown.space', ['$event']) // (SPACE)
  onSpacebar(event: KeyboardEvent) {
    this._handleSyncAllVideoService?.sendPauseOrPlay(true);
    this.homeFacade.updateCurrentIsLive(false);
  }

  @HostListener('window:keydown.arrowleft', ['$event']) //Spin left on Normal RO
  onArrowLeft(event: KeyboardEvent) {
    if (this.isDoneUpdateTime) {
      this.isDoneUpdateTime = false
      let speedRO = Math.floor(this.speedROArr[this.currIndexSpeedRO] * 100000) / 100000;
      this.controlAll(TYPE_CONTROL.REWIND, speedRO);
    }
  }

  @HostListener('window:keydown.arrowright', ['$event']) //Spin right on Normal RO
  onArrowRight(event: KeyboardEvent) {
    if (this.isDoneUpdateTime) {
      this.isDoneUpdateTime = false
      let speedRO = Math.floor(this.speedROArr[this.currIndexSpeedRO] * 100000) / 100000;
      this.controlAll(TYPE_CONTROL.FORWARD, speedRO);
    }
  }

  @HostListener('window:keydown.meta.shift.l', ['$event']) //SEEK TO LIVE BY RO
  onWindowShiftKeyL(event: KeyboardEvent) {
    this.controlAll(TYPE_CONTROL.LIVE);
  }

  @HostListener('window:keydown.shift.arrowleft', ['$event']) //Spin left on Mark RO
  onArrowMarkLeft(event: KeyboardEvent) {
    if (this.markedTimesHls.length > 0) {
      if (this.selectedMarkedTimeIndex === -1) this.selectedMarkedTimeIndex = this.markedTimesHls.length;
      this.selectedMarkedTimeIndex =
        (this.selectedMarkedTimeIndex - 1 + this.markedTimesHls.length) % this.markedTimesHls.length;
      this._handleSyncAllVideoService?.sendTime(this.markedTimesHls[this.selectedMarkedTimeIndex]);
      let objSentToReferee = {
        isPlay: false,
        currentTime: this.markedTimesHls[this.selectedMarkedTimeIndex],
        seekVideoPlayback: true,
      };
      this.webSocketService!.sendMessage(objSentToReferee);
    }
    this.isLive = false;
  }

  @HostListener('window:keydown.shift.arrowright', ['$event']) //Spin right on Mark RO
  onArrowMarkRight(event: KeyboardEvent) {
    if (this.markedTimesHls.length > 0) {
      this.selectedMarkedTimeIndex = (this.selectedMarkedTimeIndex + 1) % this.markedTimesHls.length;
      this._handleSyncAllVideoService?.sendTime(this.markedTimesHls[this.selectedMarkedTimeIndex]);
      let objSentToReferee = {
        isPlay: false,
        currentTime: this.markedTimesHls[this.selectedMarkedTimeIndex],
        seekVideoPlayback: true,
      };
      this.webSocketService!.sendMessage(objSentToReferee);
    }
    this.isLive = false;
  }

  @HostListener('window:keydown.meta.shift.o', ['$event']) // PAUSE - PLAY (RO)
  onWindowShiftKeyP(event: KeyboardEvent) {
    this._handleSyncAllVideoService?.sendPauseOrPlay(true);
    this.isLive = false;
  }

  @HostListener('window:keydown.meta.shift.d', ['$event']) //MARK ON TIMELINE BY RO
  onWindowShiftKeyD(event: KeyboardEvent) {
    this.markedTimesHls.push(this.getCurrentTimeHls() - 5);
    this.markedTimesHls = this.markedTimesHls.sort((a, b) => a - b);
  }
}
