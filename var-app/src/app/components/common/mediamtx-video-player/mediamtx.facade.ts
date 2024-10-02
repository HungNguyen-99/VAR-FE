import { ElementRef, EventEmitter, inject, Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { ObjDbClickSentToReferee } from "../../../interfaces/Object-to-referee.interface";
import { WebSocketService } from "../../../services/web-socket.service";
import Hls from "hls.js";
import { HlsConfig } from "../../../consts/hls-config.const";
import { HandleCurrentDurationTimeService } from "../../../services/handle-current-duration-time.service";
import { HandleSyncAllVideoService } from "../../../services/handle-sync-all-video.service";
import { Subject, takeUntil, tap } from "rxjs";
import { SCREENS } from "../../../consts/system-contant";

@Injectable()
export class MediamtxVideoPlayerFacade {

    private readonly _webSocketService = inject(WebSocketService);
    private readonly _handleCurrentDurationTimeService = inject(HandleCurrentDurationTimeService);
    private readonly _handleSyncAllVideoService = inject(HandleSyncAllVideoService);

    public readonly hls = new Hls(HlsConfig);
    private isPlay: boolean = true;
    private readonly destroy$ = new Subject();

    dbClick(objSentToReferee: ObjDbClickSentToReferee): void {
        this._webSocketService!.sendMessage(objSentToReferee);
    }

    createVideoElement(videoPlayer: ElementRef, videoUrl: string, currentTimeX1?: number): void {
        if (videoPlayer && Hls.isSupported()) {
            let video = videoPlayer!.nativeElement;
            this.hls.loadSource(videoUrl);
            this.hls.attachMedia(videoPlayer?.nativeElement);
            this.hls.on(Hls.Events.MEDIA_ATTACHED, () => {
                console.log('MEDIA_ATTACHED');
                if (videoPlayer && !currentTimeX1) {
                    video.addEventListener('timeupdate', () => {
                        if(!currentTimeX1){
                            this._handleCurrentDurationTimeService.currentTime = video.currentTime;
                        }
                        this._handleCurrentDurationTimeService.duration = video.duration;
                        this._handleCurrentDurationTimeService.isPause = video.paused;
                        this._handleSyncAllVideoService?.sendDoneUpdateTime(true);
                    });
                    video.addEventListener('canplay', () => {
                        if (this.isPlay) {
                            video.muted = true;
                            setTimeout(() => {
                                video.play();
                            }, 100);
                            this.isPlay = false;
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
            video.addEventListener('loadedmetadata', () => {
                // Video is initialized
                if(currentTimeX1) {
                    video.currentTime = currentTimeX1;
                    if(this._handleCurrentDurationTimeService.isPause) {
                        video.pause();
                    }else {
                        video.play();
                    }
                }
            });
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
        this.isPlay = false;
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
        this._handleCurrentDurationTimeService.currentRate = rate;
    }

    handleSeekToLive(videoPlayer: ElementRef) {
        videoPlayer.nativeElement.currentTime = videoPlayer.nativeElement.duration - 2;
        let objSentToReferee = {
            isPlay: true,
            currentTime: videoPlayer.nativeElement.currentTime,
            seekVideoPlayback: true,
        };
        this._webSocketService!.sendMessage(objSentToReferee);
    }

    checkTypeOfScreen(typeOfScreen: string) {
        if (typeOfScreen === SCREENS.FOUR_SCREENS) {
            return 2;
        } else if (typeOfScreen === SCREENS.NINE_SCREENS) {
            return 3;
        } else {
            return 1;
        }
    }

}