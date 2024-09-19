import { ElementRef, EventEmitter, inject, Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { ObjDbClickSentToReferee } from "../../../interfaces/Object-to-referee.interface";
import { WebSocketService } from "../../../services/web-socket.service";
import Hls from "hls.js";
import { HlsConfig } from "../../../consts/hls-config.const";
import { HandleCurrentDurationTimeService } from "../../../services/handle-current-duration-time.service";
import { HandleSyncAllVideoService } from "../../../services/handle-sync-all-video.service";
import { takeUntil, tap } from "rxjs";
import { SCREENS } from "../../../consts/system-contant";

interface ImediamtxVideoPlayerState {
    currentTime: number;
    duration: number;
    isPlay: boolean;
    currentRate: string;
    typeOfScreen: string;
}

const initialState: ImediamtxVideoPlayerState = {
    currentTime: 0,
    duration: 0,
    isPlay: true,
    currentRate: 'x1',
    typeOfScreen: SCREENS.FOUR_SCREENS
};

@Injectable()
export class MediamtxVideoPlayerFacade extends ComponentStore<ImediamtxVideoPlayerState> {

    private readonly _webSocketService = inject(WebSocketService);
    private readonly handleCurrentDurationTimeService = inject(HandleCurrentDurationTimeService);
    private readonly _handleSyncAllVideoService = inject(HandleSyncAllVideoService);

    private readonly hls = new Hls(HlsConfig);

    constructor() {
        super(initialState);
    }

    readonly updateCurrentTime = this.updater((state, currentTime: number) => ({ ...state, currentTime }));
    readonly updateDuration = this.updater((state, duration: number) => ({ ...state, duration }));
    readonly updateIsPlay = this.updater((state, isPlay: boolean) => ({ ...state, isPlay }));
    readonly updateCurrentRate = this.updater((state, currentRate: string) => ({ ...state, currentRate }));
    readonly updateTypeOfScreen = this.updater((state, typeOfScreen: string) => ({ ...state, typeOfScreen }));

    readonly currentTime$ = this.select(state => state.currentTime);
    readonly duration$ = this.select(state => state.duration);
    readonly isPlay$ = this.select(state => state.isPlay);
    readonly currentRate$ = this.select(state => state.currentRate);
    readonly typeOfScreen$ = this.select(state => state.typeOfScreen);

    readonly vm$ = this.select({
    });

    get currentTime(): number {
        return this.get().currentTime;
    }

    get currentRate(): string {
        return this.get().currentRate;
    }

    dbClick(objSentToReferee: ObjDbClickSentToReferee): void {
        this._webSocketService!.sendMessage(objSentToReferee);
    }

    createVideoElement(videoPlayer: ElementRef, videoUrl: string, isDoneInitial: EventEmitter<boolean>): void {
        if (videoPlayer && Hls.isSupported()) {
            let video = videoPlayer!.nativeElement;
            this.hls.loadSource(videoUrl);
            this.hls.attachMedia(videoPlayer?.nativeElement);
            this.hls.on(Hls.Events.MEDIA_ATTACHED, () => {
                if (videoPlayer) {
                    video.addEventListener('timeupdate', () => {
                        this.updateCurrentTime(video.currentTime);
                        this.updateDuration(video.duration);
                        this.handleCurrentDurationTimeService.currentTime = video.currentTime;
                        this.handleCurrentDurationTimeService.duration = video.duration;
                        this._handleSyncAllVideoService?.sendDoneUpdateTime(true);
                    });
                    video.addEventListener('canplay', () => {
                        if (this.get().isPlay) {
                            video.muted = true;
                            setTimeout(() => {
                                // isDoneInitial.emit(true);
                                video.play();
                            }, 100);
                            this.updateIsPlay(false);
                        } else {
                            // video.pause();
                        }
                    });
                }
            });
            this.hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
                let lowestQualityLevel = 0;
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

    handleSubjectGetEmitData(videoPlayer: ElementRef) {
        this._handleSyncAllVideoService
            ?.getTime()
            .pipe(
                takeUntil(this.destroy$),
                tap((res) => {
                    this.setTime(res, videoPlayer);
                })
            )
            .subscribe();

        this._handleSyncAllVideoService
            ?.getPauseOrPlay()
            .pipe(
                takeUntil(this.destroy$),
                tap((res) => {
                    this.handlePauseOrPlay(videoPlayer);
                })
            )
            .subscribe();

        this._handleSyncAllVideoService
            ?.getSeekToLive()
            .pipe(
                takeUntil(this.destroy$),
                tap((res) => {
                    this.handleSeekToLive(videoPlayer);
                })
            )
            .subscribe();

        this._handleSyncAllVideoService
            ?.getPlayBackRate()
            .pipe(
                takeUntil(this.destroy$),
                tap((res) => {
                    this.playbackRate(res, videoPlayer);
                })
            )
            .subscribe();
    }

    setTime(time: number, videoPlayer: ElementRef) {
        this.updateIsPlay(false);
        videoPlayer.nativeElement.currentTime = time;
    }

    handlePauseOrPlay(videoPlayer: ElementRef) {
        const video = videoPlayer.nativeElement;
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
                    this._webSocketService!.sendMessage(objSentToReferee);
                });
            }
        } else {
            video.play();
            let objSentToReferee = {
                isPlay: !video.paused,
                pauseOrPlayFlag: true,
                currentTime: video.currentTime,
            };
            this._webSocketService!.sendMessage(objSentToReferee);
        }
    }

    playbackRate(rate: string, videoPlayer: ElementRef) {
        switch (rate) {
            case 'x0.1':
                videoPlayer.nativeElement.playbackRate = 0.1;
                break;
            case 'x0.5':
                videoPlayer.nativeElement.playbackRate = 0.5;
                break;
            default:
                videoPlayer.nativeElement.playbackRate = 1;
        }
        this.updateCurrentRate(rate);
    }

    handleSeekToLive(videoPlayer: ElementRef) {
        // this.updateIsPlay(true);
        videoPlayer.nativeElement.currentTime = videoPlayer.nativeElement.duration - 2;
        let objSentToReferee = {
            isPlay: true,
            currentTime: videoPlayer.nativeElement.currentTime,
            seekVideoPlayback: true,
        };
        this._webSocketService!.sendMessage(objSentToReferee);
    }

    checkTypeOfScreen() {
        if (this.get().typeOfScreen === SCREENS.FOUR_SCREENS) {
            return 2;
        } else if (this.get().typeOfScreen === SCREENS.NINE_SCREENS) {
            return 3;
        } else {
            return 1;
        }
    }

}