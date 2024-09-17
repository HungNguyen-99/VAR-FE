import { Injectable } from "@angular/core";
import { HandleSyncAllVideoService } from "../../../../services/handle-sync-all-video.service";

@Injectable()
export class HomeHandleHostListenerFacade {

    private readonly _handleSyncAllVideoService?: HandleSyncAllVideoService;

    // @HostListener('window:keydown.space', ['$event']) // (SPACE)
    // onSpacebar(event: KeyboardEvent) {
    //   this._handleSyncAllVideoService?.sendPauseOrPlay(true);
    //   this.isLive = false;
    // }
  
    // @HostListener('window:keydown.arrowleft', ['$event']) //Spin left on Normal RO
    // onArrowLeft(event: KeyboardEvent) {
    //   if (this.isDoneUpdateTime) {
    //     this.isDoneUpdateTime = false
    //     let speedRO = Math.floor(this.speedROArr[this.currIndexSpeedRO] * 100000) / 100000;
    //     this.controlAll(TYPE_CONTROL.REWIND, speedRO);
    //   }
    // }
  
    // @HostListener('window:keydown.arrowright', ['$event']) //Spin right on Normal RO
    // onArrowRight(event: KeyboardEvent) {
    //   if (this.isDoneUpdateTime) {
    //     this.isDoneUpdateTime = false
    //     let speedRO = Math.floor(this.speedROArr[this.currIndexSpeedRO] * 100000) / 100000;
    //     this.controlAll(TYPE_CONTROL.FORWARD, speedRO);
    //   }
    // }
  
    // @HostListener('window:keydown.meta.shift.l', ['$event']) //SEEK TO LIVE BY RO
    // onWindowShiftKeyL(event: KeyboardEvent) {
    //   this.controlAll(TYPE_CONTROL.LIVE);
    // }
  
    // @HostListener('window:keydown.shift.arrowleft', ['$event']) //Spin left on Mark RO
    // onArrowMarkLeft(event: KeyboardEvent) {
    //   if (this.markedTimesHls.length > 0) {
    //     if (this.selectedMarkedTimeIndex === -1) this.selectedMarkedTimeIndex = this.markedTimesHls.length;
    //     this.selectedMarkedTimeIndex =
    //       (this.selectedMarkedTimeIndex - 1 + this.markedTimesHls.length) % this.markedTimesHls.length;
    //     this._handleSyncAllVideoService?.sendTime(this.markedTimesHls[this.selectedMarkedTimeIndex]);
    //     let objSentToReferee = {
    //       isPlay: false,
    //       currentTime: this.markedTimesHls[this.selectedMarkedTimeIndex],
    //       seekVideoPlayback: true,
    //     };
    //     this.webSocketService!.sendMessage(objSentToReferee);
    //   }
    //   this.isLive = false;
    // }
  
    // @HostListener('window:keydown.shift.arrowright', ['$event']) //Spin right on Mark RO
    // onArrowMarkRight(event: KeyboardEvent) {
    //   if (this.markedTimesHls.length > 0) {
    //     this.selectedMarkedTimeIndex = (this.selectedMarkedTimeIndex + 1) % this.markedTimesHls.length;
    //     this._handleSyncAllVideoService?.sendTime(this.markedTimesHls[this.selectedMarkedTimeIndex]);
    //     let objSentToReferee = {
    //       isPlay: false,
    //       currentTime: this.markedTimesHls[this.selectedMarkedTimeIndex],
    //       seekVideoPlayback: true,
    //     };
    //     this.webSocketService!.sendMessage(objSentToReferee);
    //   }
    //   this.isLive = false;
    // }
  
    // @HostListener('window:keydown.meta.shift.o', ['$event']) // PAUSE - PLAY (RO)
    // onWindowShiftKeyP(event: KeyboardEvent) {
    //   this._handleSyncAllVideoService?.sendPauseOrPlay(true);
    //   this.isLive = false;
    // }
  
    // @HostListener('window:keydown.meta.shift.d', ['$event']) //MARK ON TIMELINE BY RO
    // onWindowShiftKeyD(event: KeyboardEvent) {
    //   this.markedTimesHls.push(this.getCurrentTimeHls() - 5);
    //   this.markedTimesHls = this.markedTimesHls.sort((a, b) => a - b);
    // }
}