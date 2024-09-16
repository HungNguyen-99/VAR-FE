import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HandleSyncAllVideoService {
  constructor() {}

  private _updateTime = new Subject<any>();
  private _pauseOrPlay = new Subject<any>();
  private _seekToLive = new Subject<any>();
  private _playBackRate = new Subject<any>();

  private _doneUpdateTime = new Subject<any>();

  sendTime(data: any) {
    this._updateTime.next(data);
  }

  getTime() {
    return this._updateTime.asObservable();
  }

  sendPauseOrPlay(data: any) {
    this._pauseOrPlay.next(data);
  }
  getPauseOrPlay() {
    return this._pauseOrPlay.asObservable();
  }

  sendSeekToLive(data: any) {
    this._seekToLive.next(data);
  }
  getSeekToLive() {
    return this._seekToLive.asObservable();
  }

  sendPlayBackRate(data: any) {
    this._playBackRate.next(data);
  }
  getPlayBackRate() {
    return this._playBackRate.asObservable();
  }

  sendDoneUpdateTime(data: any) {
    this._doneUpdateTime.next(data);
  }
  getDoneUpdateTime() {
    return this._doneUpdateTime.asObservable();
  }
}
