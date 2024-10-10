import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { tap } from 'rxjs';
import { MATERIAL_MODULE } from '../../../consts/material.const';
import { TYPE_CONTROL } from '../../../consts/system-contant';
import { HandleWidthOfTimeLinePipe } from '../../../pipes/handle-width-of-timeLine.pipe';
import { TranslateCurrentDurationPipe } from '../../../pipes/translate-current-duration.pipe';
import { HandleCurrentDurationTimeService } from '../../../services/handle-current-duration-time.service';
import { HandleSyncAllVideoService } from '../../../services/handle-sync-all-video.service';
import { WebSocketService } from '../../../services/web-socket.service';
import { FloatingMenuComponent } from '../../common/floating-menu/floating-menu.component';
import { MediamtxVideoPlayerComponent } from '../../common/mediamtx-video-player/mediamtx-video-player.component';
import { HomeFacade } from './home.facade';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { LocalStorageService } from '../../../services/localStorage.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FloatingMenuComponent, NgIf, NgFor, NgClass, MediamtxVideoPlayerComponent, MATERIAL_MODULE, AsyncPipe, HandleWidthOfTimeLinePipe, TranslateCurrentDurationPipe, DragDropModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [HomeFacade]
})
export class HomeComponent implements OnInit {

  readonly homeFacade = inject(HomeFacade);
  readonly _handleCurrentDurationTimeService = inject(HandleCurrentDurationTimeService);
  readonly _localStorageService = inject(LocalStorageService);


  isDoneUpdateTime = false;

  @ViewChild('timeTooltip') timeTooltipHls!: ElementRef;
  @ViewChild('controlsHls') controlsHls!: ElementRef;

  constructor(
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

  @HostListener('window:keydown.space', ['$event']) // SPACE
  onSpacebar(event: KeyboardEvent) {
    this._handleSyncAllVideoService?.sendPauseOrPlay(true);
    this.homeFacade.updateCurrentIsLive(false);
  }

  @HostListener('window:keydown.meta.shift.o', ['$event']) // PAUSE - PLAY (RO)
  onWindowShiftKeyP(event: KeyboardEvent) {
    this._handleSyncAllVideoService?.sendPauseOrPlay(true);
    this.homeFacade.updateCurrentIsLive(false);
  }

  @HostListener('window:keydown.arrowleft', ['$event'])  //SPIN LEFT ON NORMAL RO
  onArrowLeft(event: KeyboardEvent) {
    if (this.isDoneUpdateTime) {
      this.isDoneUpdateTime = false
      let speedRO = Math.floor(this.homeFacade.speedROArr[this.homeFacade.speedRo] * 100000) / 100000;
      this.homeFacade.controlAll(TYPE_CONTROL.REWIND, speedRO);
    }
  }

  @HostListener('window:keydown.arrowright', ['$event']) //SPIN RIGHT ON NORMAL RO
  onArrowRight(event: KeyboardEvent) {
    if (this.isDoneUpdateTime) {
      this.isDoneUpdateTime = false
      let speedRO = Math.floor(this.homeFacade.speedROArr[this.homeFacade.speedRo] * 100000) / 100000;
      this.homeFacade.controlAll(TYPE_CONTROL.FORWARD, speedRO);
    }
  }

  @HostListener('window:keydown.meta.shift.l', ['$event']) //SEEK TO LIVE BY RO
  onWindowShiftKeyL(event: KeyboardEvent) {
    this.homeFacade.seekToLive();
  }

  @HostListener('window:keydown.meta.shift.d', ['$event']) //MARK ON TIMELINE BY RO
  onWindowShiftKeyD(event: KeyboardEvent) {
    let markedTimesHls = this.homeFacade.markedTimesHls;
    markedTimesHls.push(this._handleCurrentDurationTimeService.currentTime - 5);
    markedTimesHls = markedTimesHls.sort((a, b) => a - b);
    this.homeFacade.updateMarkedTimesHls(markedTimesHls);
  }

  @HostListener('window:keydown.shift.arrowleft', ['$event']) //SPIN LEFT ON MARK RO
  onArrowMarkLeft(event: KeyboardEvent) {
    if (this.homeFacade.markedTimesHls.length > 0) {
      if (this.homeFacade.selectedMarkedTimeIndex === -1) this.homeFacade.updateSelectedMarkedTimeIndex(this.homeFacade.markedTimesHls.length);
      this.homeFacade.updateSelectedMarkedTimeIndex((this.homeFacade.selectedMarkedTimeIndex - 1 + this.homeFacade.markedTimesHls.length) % this.homeFacade.markedTimesHls.length);
      this._handleSyncAllVideoService?.sendTime(this.homeFacade.markedTimesHls[this.homeFacade.selectedMarkedTimeIndex]);
      let objSentToReferee = {
        isPlay: false,
        currentTime: this.homeFacade.markedTimesHls[this.homeFacade.selectedMarkedTimeIndex],
        seekVideoPlayback: true,
      };
      // this.webSocketService!.sendMessage(objSentToReferee);
      this._localStorageService.setData(objSentToReferee);
    }
    this.homeFacade.updateCurrentIsLive(false);
  }

  @HostListener('window:keydown.shift.arrowright', ['$event']) //SPIN RIGHT ON MARK RO
  onArrowMarkRight(event: KeyboardEvent) {
    if (this.homeFacade.markedTimesHls.length > 0) {
      this.homeFacade.updateSelectedMarkedTimeIndex((this.homeFacade.selectedMarkedTimeIndex + 1) % this.homeFacade.markedTimesHls.length)
      this._handleSyncAllVideoService?.sendTime(this.homeFacade.markedTimesHls[this.homeFacade.selectedMarkedTimeIndex]);
      let objSentToReferee = {
        isPlay: false,
        currentTime: this.homeFacade.markedTimesHls[this.homeFacade.selectedMarkedTimeIndex],
        seekVideoPlayback: true,
      };
      // this.webSocketService!.sendMessage(objSentToReferee);
      this._localStorageService.setData(objSentToReferee);
    }
    this.homeFacade.updateCurrentIsLive(false);
  }
}
