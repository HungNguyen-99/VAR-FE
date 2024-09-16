import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class LocService extends BaseService {
  shareData = new BehaviorSubject<any>({});
  shareData$ = this.shareData.asObservable();
  endTheMatchEvent = new Subject();
  endTheMatchEvent$ = this.endTheMatchEvent.asObservable();
  
  layout = new BehaviorSubject<any>({});
  layout$ = this.layout.asObservable();

  
  camera = new BehaviorSubject<any>({});
  camera$ = this.camera.asObservable();

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getLiveVideos(dataSource: any) {
    return this.post('/generate-live-videos', dataSource);
  }

  getListCamera() {
    return this.getMediaRtx('/v3/config/paths/list');
  }
  getAllCameras(){
    return this.getMediaRtx('/v3/paths/list');
  }

  getRtspLink(payload: any){
    return this.postOnvif('/camera-rtsp', payload)
  }

  addCamera(name: string,payload: any){
    return this.postMediaRtx('/v3/config/paths/add/' + name, payload);
  }
}


