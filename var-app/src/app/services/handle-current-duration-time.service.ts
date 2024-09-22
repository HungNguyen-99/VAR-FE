import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class HandleCurrentDurationTimeService {

    private _currentTime: number = 0;
    private _duration: number = 0;
    private _isPause: boolean = true;

    public get currentTime(): number {
        return this._currentTime;
    }

    public set currentTime(value: number) {
        this._currentTime = value;
    }

    public get duration(): number {
        return this._duration;
    }

    public set duration(value: number) {
        this._duration = value;
    }

    public get isPause(): boolean {
        return this._isPause;
    }

    public set isPause(value: boolean) {
        this._isPause = value;
    }
}