import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FloatingMenuComponent } from '../floating-menu/floating-menu.component';
import { SCREENS, SPEED_RO, TYPE_CONTROL } from '../../consts/system-contant';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { MediamtxVideoPlayerComponent } from '../mediamtx-video-player/mediamtx-video-player.component';
import { LocService } from '../../services/loc-service.service';
import { WebSocketService } from '../../services/web-socket.service';
import { HandleSyncAllVideoService } from '../../services/handle-sync-all-video.service';
import { MATERIAL_MODULE } from '../../consts/material.const';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FloatingMenuComponent, NgIf, NgFor, NgClass, MediamtxVideoPlayerComponent, MATERIAL_MODULE],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {

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

  constructor(
    private locService: LocService,
    private webSocketService?: WebSocketService,
    private _handleSyncAllVideoService?: HandleSyncAllVideoService
  ) { }

  ngOnInit(): void {
    this.getListCamera();
  }

  playBackRateHls(event: string) {
    if (event !== 'x1') this.isLive = false;
    this._handleSyncAllVideoService?.sendPlayBackRate(event);
    let objSentToReferee = {
      playBackRate: event,
    };
    this.webSocketService!.sendMessage(objSentToReferee);
  }

  setSpeedRo(event: number) {
    this.currIndexSpeedRO = event;
  }

  endTheMatchEvent() {
    this.locService.endTheMatchEvent.next(true);
  }

  getListCamera() {
    this.videos = [];
    this.locService.getListCamera().subscribe(
      (rs) => {
        if (rs) {
          const listCamera = rs.items.map((camera: any) => camera.name);
          listCamera.forEach((cam: string) => {
            this.videos.push(`http://localhost:8888/${cam}/stream.m3u8`)
          });
          console.log(this.videos);
          this.switchScreen(this.screenType)
        }
      },
      (err) => {
      }
    );
  }

  switchScreen(screenType: string) {
    switch (screenType) {
      case SCREENS.FOUR_SCREENS:
        this.videoX4 = this.videos.slice(0, 4);
        this.screenType = screenType;
        this.controlAll(TYPE_CONTROL.LIVE);
        break;
      case SCREENS.NINE_SCREENS:
        this.screenType = screenType;
        if (this.videos.length === 9) {
          break;
        } else if (this.videos.length < 9) {
          while (this.videos.length < 9) {
            this.videos.push('');
          }
        }
        this.controlAll(TYPE_CONTROL.LIVE);
        break;
      case SCREENS.ONE_SCREENS:
        this.screenType = screenType;
        this.videosForOneView = this.videos.filter((ele) => ele !== '');
        this.controlAll(TYPE_CONTROL.LIVE);
        break;
    }

    localStorage.setItem('screenType', this.screenType);
  }

  tooltipTimeHls!: string;
  tooltipPositionHls!: number;
  isLive = true;
  play: boolean = false;

  @ViewChild('timeTooltipHls') timeTooltipHls!: ElementRef;
  @ViewChild('controlsHls') controlsHls!: ElementRef;
  showTimeTooltipHls(event: any) {
    this.tooltipTimeHls = this.getNewTimeHls(event);
    this.tooltipPositionHls = event.clientX;
    this.timeTooltipHls!.nativeElement.style.display = 'block';
  }
  hideTimeTooltipHls() {
    this.timeTooltipHls!.nativeElement.style.display = 'none';
  }
  getNewTimeHls(event: any) {
    let controlBarWidth = this.controlsHls!.nativeElement.clientWidth;

    const currentTimeInSeconds = (event.clientX / controlBarWidth) * this.getDurationHls();
    if (currentTimeInSeconds) {
      const totalHours = currentTimeInSeconds / 3600; // Chuyển từ giây sang giờ

      const totalMilliseconds = totalHours * 60 * 60 * 1000; // Chuyển từ giờ sang milliseconds

      const date = new Date(totalMilliseconds);

      const hours = date.getUTCHours().toString().padStart(2, '0');
      const minutes = date.getUTCMinutes().toString().padStart(2, '0');
      const seconds = date.getUTCSeconds().toString().padStart(2, '0');

      return `${hours}:${minutes}:${seconds}`;
    }
    return '00:00:00';
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
  seekVideoPlaybackHls(event: any) {
    let currentTime = this.getNewTimeWhenSeekHls(event);
    this.controlAll(TYPE_CONTROL.SEEK_TIMELINE, undefined, currentTime);
    this.controlAll(TYPE_CONTROL.PAUSE);
    this.isLive = false;
    let objSentToReferee = {
      isPlay: false,
      currentTime: currentTime,
      seekVideoPlayback: true,
    };
    this.webSocketService!.sendMessage(objSentToReferee);
  }
  getNewTimeWhenSeekHls(event: any) {
    let controlBarWidth = this.controlsHls!.nativeElement.clientWidth;
    return (event.clientX / controlBarWidth) * this.getDurationHls();
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

  handleWidthOfTimeLineHls() {
    let currentWidth = (this.getCurrentTimeHls() / this.getDurationHls()) * 100;
    return currentWidth + '%';
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

  nextVideoX4() {
    this.currentIndexVideoX4++;
    if (this.currentIndexVideoX4 > 1) {
      this.currentIndexVideoX4 = 0;
      this.videoX4 = this.videos.slice(0, 4)
    } else {
      this.videoX4 = this.videos.slice(4, 8);
    }
    while (this.videoX4.length < 4) {
      this.videoX4.push('');
    }
  }

  previousVideoX4() {
    this.currentIndexVideoX4--;
    if (this.currentIndexVideoX4 < 0) {
      this.currentIndexVideoX4 = 1;
      this.videoX4 = this.videos.slice(4, 8);
    } else {
      this.videoX4 = this.videos.slice(0, 4);
    }
    while (this.videoX4.length < 4) {
      this.videoX4.push('');
    }
  }

  changeSourceVideoOne(index: number) {
    this.screen1 = false;
    this.indexForClassContainerX1 = index;
    setTimeout(() => {
      this.screen1 = true;
    }, 100);
  }

  @HostListener('window:keydown.space', ['$event']) // (SPACE)
  onSpacebar(event: KeyboardEvent) {
    this._handleSyncAllVideoService?.sendPauseOrPlay(true);
    this.isLive = false;
  }

  @HostListener('window:keydown.arrowleft', ['$event']) //Spin left on Normal RO
  onArrowLeft(event: KeyboardEvent) {
    let speedRO = Math.floor(this.speedROArr[this.currIndexSpeedRO] * 100000) / 100000;
    this.controlAll(TYPE_CONTROL.REWIND, speedRO);
  }

  @HostListener('window:keydown.arrowright', ['$event']) //Spin right on Normal RO
  onArrowRight(event: KeyboardEvent) {
    let speedRO = Math.floor(this.speedROArr[this.currIndexSpeedRO] * 100000) / 100000;
    this.controlAll(TYPE_CONTROL.FORWARD, speedRO);
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
