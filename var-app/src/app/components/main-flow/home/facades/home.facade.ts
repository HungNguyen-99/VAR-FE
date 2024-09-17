import { inject, Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ComponentStore } from '@ngrx/component-store';
import { SCREENS, TYPE_CONTROL } from "../../../../consts/system-contant";
import { EndMatchDialogComponent } from "../../../../dialogs/end-match-dialog/end-match-dialog.component";
import { HandleCurrentDurationTimeService } from "../../../../services/handle-current-duration-time.service";
import { HandleSyncAllVideoService } from "../../../../services/handle-sync-all-video.service";
import { LocService } from "../../../../services/loc-service.service";
import { WebSocketService } from "../../../../services/web-socket.service";

export interface IHomeState {
    screenType: string;
    videos: string[];
    videoX4: string[];
    videosForOneView: string[];
    isLive: boolean;
    currentIndexVideoX4: number;
}

const initialState: IHomeState = {
    screenType: SCREENS.FOUR_SCREENS,
    videos: [],
    videoX4: [],
    videosForOneView: [],
    isLive: false,
    currentIndexVideoX4: 0
};

@Injectable()
export class HomeFacade extends ComponentStore<IHomeState> {

    private readonly _locService = inject(LocService);
    private readonly _handleSyncAllVideoService = inject(HandleSyncAllVideoService);
    private readonly _webSocketService = inject(WebSocketService);
    private readonly _handleCurrentDurationTimeService = inject(HandleCurrentDurationTimeService);
    private readonly _dialog = inject(MatDialog);

    constructor() {
        super(initialState);
    }

    readonly updateCurrentScreenType = this.updater((state, screenType: string) => ({ ...state, screenType }));
    readonly updateCurrentVideos = this.updater((state, videos: string[]) => ({ ...state, videos }));
    readonly updateCurrentVideoX4 = this.updater((state, videoX4: string[]) => ({ ...state, videoX4 }));
    readonly updateCurrentVideosForOneView = this.updater((state, videosForOneView: string[]) => ({ ...state, videosForOneView }));
    readonly updateCurrentIsLive = this.updater((state, isLive: boolean) => ({ ...state, isLive }));
    readonly updateCurrentIndexVideoX4 = this.updater((state, currentIndexVideoX4: number) => ({ ...state, currentIndexVideoX4 }));

    readonly screenType$ = this.select(state => state.screenType);
    readonly videos$ = this.select(state => state.videos);
    readonly videoX4$ = this.select(state => state.videoX4);
    readonly videosForOneView$ = this.select(state => state.videosForOneView);
    readonly isLive$ = this.select(state => state.isLive);
    readonly currentIndexVideoX4$ = this.select(state => state.currentIndexVideoX4);

    readonly vm$ = this.select({
        screenType: this.screenType$,
        videos: this.videos$,
        videoX4: this.videoX4$,
        videosForOneView: this.videosForOneView$,
        isLive: this.isLive$,
        currentIndexVideoX4: this.currentIndexVideoX4$
    });


    getListCamera() {
        const videos: string[] = [];
        // this.locService.getListCamera().subscribe(
        //     (rs) => {
        //         if (rs) {
        //             const listCamera = rs.items.map((camera: any) => camera.name);
        //             listCamera.forEach((cam: string) => {
        //                 videos.push(`http://localhost:8888/${cam}/stream.m3u8`)
        //             });
        //             this.updateCurrentVideos(videos);
        //             //this.switchScreen(this.screenType)
        //         }
        //     },
        //     (err) => {
        //     }
        // );
        videos.push('https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8');
        videos.push('https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8');
        videos.push('https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.mp4/.m3u8');
        videos.push('https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.mp4/.m3u8');
        videos.push('https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.mp4/.m3u8');
        this.updateCurrentVideos(videos);
        this.switchScreen(this.get().screenType);
    }

    switchScreen(screenType: string) {
        this.updateCurrentScreenType(screenType);
        switch (screenType) {
            case SCREENS.FOUR_SCREENS:
                this.updateCurrentVideoX4(this.get().videos.slice(0, 4));
                this.controlAll(TYPE_CONTROL.LIVE);
                break;
            case SCREENS.NINE_SCREENS:
                if (this.get().videos.length === 9) {
                    break;
                } else if (this.get().videos.length < 9) {
                    const videos: string[] = this.get().videos;
                    while (videos.length < 9) {
                        videos.push('');
                    }
                    this.updateCurrentVideos(videos);
                }
                this.controlAll(TYPE_CONTROL.LIVE);
                break;
            case SCREENS.ONE_SCREENS:
                const videosForOneView = this.get().videos.filter((ele) => ele !== '');
                this.updateCurrentVideosForOneView(videosForOneView);
                this.controlAll(TYPE_CONTROL.LIVE);
                break;
        }

        localStorage.setItem('screenType', this.get().screenType);
    }

    playBackRateHls(event: string) {
        if (event !== 'x1') this.updateCurrentIsLive(false);
        this.controlAll(TYPE_CONTROL.PLAY);
        this._handleSyncAllVideoService?.sendPlayBackRate(event);
        let objSentToReferee = {
            playBackRate: event,
        };
        this._webSocketService!.sendMessage(objSentToReferee);
    }

    endTheMatchEvent() {
        const dialogRef = this._dialog.open(EndMatchDialogComponent, {
            maxHeight: '100vh',
            maxWidth: '100vw',
            width: '25vw'
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
            if (result) {
                this._locService.endTheMatchEvent.next(true);
            }
        });
    }

    nextVideoX4() {
        let currentIndexVideoX4 = this.get().currentIndexVideoX4;
        this.updateCurrentIndexVideoX4(currentIndexVideoX4 += 1);
        if (this.get().currentIndexVideoX4 > 1) {
            this.updateCurrentIndexVideoX4(0);
            this.updateCurrentVideoX4(this.get().videos.slice(0, 4));
        } else {
            this.updateCurrentVideoX4(this.get().videos.slice(4, 8));
        }
        const videoX4 = this.get().videoX4;
        while (videoX4.length < 4) {
            videoX4.push('');
        }
        this.updateCurrentVideoX4(videoX4);
    }

    previousVideoX4() {

        let currentIndexVideoX4 = this.get().currentIndexVideoX4;
        this.updateCurrentIndexVideoX4(currentIndexVideoX4 -= 1);
        if (this.get().currentIndexVideoX4 < 0) {
            this.updateCurrentIndexVideoX4(1);
            this.updateCurrentVideoX4(this.get().videos.slice(4, 8));
        } else {
            this.updateCurrentVideoX4(this.get().videos.slice(0, 4));
        }
        const videoX4 = this.get().videoX4;
        while (videoX4.length < 4) {
            videoX4.push('');
        }
        this.updateCurrentVideoX4(videoX4);
    }

    seekVideoPlaybackHls(event: any, clientWidth: number) {
        let currentTime = this.getNewTimeWhenSeekHls(event, clientWidth);
        this.controlAll(TYPE_CONTROL.SEEK_TIMELINE, undefined, currentTime);
        this.controlAll(TYPE_CONTROL.PAUSE);
        this.updateCurrentIsLive(false);
        let objSentToReferee = {
            isPlay: false,
            currentTime: currentTime,
            seekVideoPlayback: true,
        };
        this._webSocketService!.sendMessage(objSentToReferee);
    }

    getNewTimeWhenSeekHls(event: any, clientWidth: number) {
        let controlBarWidth = clientWidth;
        return (event.clientX / controlBarWidth) * this._handleCurrentDurationTimeService.duration;
    }

    controlAll(action: string, timeRo?: number, timelineValue?: any): void {
        if (action === TYPE_CONTROL.LIVE) {
            this.updateCurrentIsLive(true);
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
                    this._webSocketService!.sendMessage({
                        isPlay: false,
                        currentTime: vid.currentTime,
                        seekVideoPlayback: true,
                    });;
                    this.updateCurrentIsLive(false);
                    break;
                case TYPE_CONTROL.FORWARD:
                    vid.pause();
                    if (timeRo) {
                        vid.currentTime = Math.max(vid.currentTime + timeRo, 0);
                    } else {
                        vid.currentTime = Math.max(vid.currentTime + 1, 0);
                    }
                    this._webSocketService!.sendMessage({
                        isPlay: false,
                        currentTime: vid.currentTime,
                        seekVideoPlayback: true,
                    });
                    this.updateCurrentIsLive(false);
                    break;
                case TYPE_CONTROL.PAUSE:
                    this.updateCurrentIsLive(false);
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
}