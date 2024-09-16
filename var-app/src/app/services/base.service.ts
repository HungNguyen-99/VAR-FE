import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  constructor(private http: HttpClient) {}

  public get(param?: string): Observable<any> {
    return this.http.get<any>(environment.backendUrl + param);
  }
  public post(param: string, body: any): Observable<any> {
    return this.http.post<any>(environment.backendUrl + param, body);
  }
  public put(param: string, body: any): Observable<any> {
    return this.http.put<any>(environment.backendUrl + param, body);
  }
  public getMediaRtx(param?: string): Observable<any> {
    return this.http.get<any>(environment.backendMediaRtxUrl + param);
  }
  public postMediaRtx(param: string, body: any): Observable<any> {
    return this.http.post<any>(environment.backendMediaRtxUrl + param, body);
  }
  public getRTCList(param?: string): Observable<any> {
    return this.http.get<any>(environment.backendRTCUrl + param);
  }

  public getRecord(param?: string): Observable<any> {
    return this.http.get<any>(environment.backendRecordUrl + param);
  }

  public postOnvif(param: string, body: any): Observable<any> {
    return this.http.post<any>(environment.backendOnvif + param, body);
  }
}
