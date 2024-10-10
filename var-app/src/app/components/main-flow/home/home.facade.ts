import { ElementRef, inject, Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ComponentStore } from '@ngrx/component-store';
import { SCREENS, SPEED_RO, TYPE_CONTROL } from "../../../consts/system-contant";
import { EndMatchDialogComponent } from "../../../dialogs/end-match-dialog/end-match-dialog.component";
import { HandleCurrentDurationTimeService } from "../../../services/handle-current-duration-time.service";
import { HandleSyncAllVideoService } from "../../../services/handle-sync-all-video.service";
import { LocService } from "../../../services/loc-service.service";
import { WebSocketService } from "../../../services/web-socket.service";
import { LocalStorageService } from "../../../services/localStorage.service";

export interface IHomeState {
    screenType: string;
    videos: string[];
    videoX4: string[];
    videosForOneView: string[];
    isLive: boolean;
    currentIndexVideoX4: number;
    screen1: boolean;
    indexForClassContainerX1: number;
    tooltipTimeHls: string;
    tooltipPositionHls: number;
    currIndexSpeedRO: number;
    speedROArr: number[];
    markedTimesHls: number[];
    selectedMarkedTimeIndex: number;
}

const initialState: IHomeState = {
    screenType: SCREENS.FOUR_SCREENS,
    videos: [],
    videoX4: [],
    videosForOneView: [],
    isLive: true,
    currentIndexVideoX4: 0,
    screen1: true,
    indexForClassContainerX1: 0,
    tooltipTimeHls: '',
    tooltipPositionHls: 0,
    currIndexSpeedRO: 2,
    speedROArr: SPEED_RO,
    markedTimesHls: [],
    selectedMarkedTimeIndex: -1
};

@Injectable()
export class HomeFacade extends ComponentStore<IHomeState> {

    private readonly _locService = inject(LocService);
    private readonly _handleSyncAllVideoService = inject(HandleSyncAllVideoService);
    private readonly _webSocketService = inject(WebSocketService);
    private readonly _handleCurrentDurationTimeService = inject(HandleCurrentDurationTimeService);
    private readonly _dialog = inject(MatDialog);
    readonly _localStorageService = inject(LocalStorageService);

    constructor() {
        super(initialState);
    }

    readonly updateCurrentScreenType = this.updater((state, screenType: string) => ({ ...state, screenType }));
    readonly updateCurrentVideos = this.updater((state, videos: string[]) => ({ ...state, videos }));
    readonly updateCurrentVideoX4 = this.updater((state, videoX4: string[]) => ({ ...state, videoX4 }));
    readonly updateCurrentVideosForOneView = this.updater((state, videosForOneView: string[]) => ({ ...state, videosForOneView }));
    readonly updateCurrentIsLive = this.updater((state, isLive: boolean) => ({ ...state, isLive }));
    readonly updateCurrentIndexVideoX4 = this.updater((state, currentIndexVideoX4: number) => ({ ...state, currentIndexVideoX4 }));
    readonly updateScreen1 = this.updater((state, screen1: boolean) => ({ ...state, screen1 }));
    readonly updateIndexForClassContainerX1 = this.updater((state, indexForClassContainerX1: number) => ({ ...state, indexForClassContainerX1 }));
    readonly updateTooltipTimeHls = this.updater((state, tooltipTimeHls: string) => ({ ...state, tooltipTimeHls }));
    readonly updateTooltipPositionHls = this.updater((state, tooltipPositionHls: number) => ({ ...state, tooltipPositionHls }));
    readonly updateCurrIndexSpeedRO = this.updater((state, currIndexSpeedRO: number) => ({ ...state, currIndexSpeedRO }));
    readonly updateSpeedROArr = this.updater((state, speedROArr: number[]) => ({ ...state, speedROArr }));
    readonly updateMarkedTimesHls = this.updater((state, markedTimesHls: number[]) => ({ ...state, markedTimesHls }));
    readonly updateSelectedMarkedTimeIndex = this.updater((state, selectedMarkedTimeIndex: number) => ({ ...state, selectedMarkedTimeIndex }));

    readonly screenType$ = this.select(state => state.screenType);
    readonly videos$ = this.select(state => state.videos);
    readonly videoX4$ = this.select(state => state.videoX4);
    readonly videosForOneView$ = this.select(state => state.videosForOneView);
    readonly isLive$ = this.select(state => state.isLive);
    readonly currentIndexVideoX4$ = this.select(state => state.currentIndexVideoX4);
    readonly screen1$ = this.select(state => state.screen1);
    readonly indexForClassContainerX1$ = this.select(state => state.indexForClassContainerX1);
    readonly tooltipTimeHls$ = this.select(state => state.tooltipTimeHls);
    readonly tooltipPositionHls$ = this.select(state => state.tooltipPositionHls);
    readonly currIndexSpeedRO$ = this.select(state => state.currIndexSpeedRO);
    readonly speedROArr$ = this.select(state => state.speedROArr);
    readonly markedTimesHls$ = this.select(state => state.markedTimesHls);
    readonly selectedMarkedTimeIndex$ = this.select(state => state.selectedMarkedTimeIndex);


    readonly vm$ = this.select({
        screenType: this.screenType$,
        videos: this.videos$,
        videoX4: this.videoX4$,
        videosForOneView: this.videosForOneView$,
        isLive: this.isLive$,
        currentIndexVideoX4: this.currentIndexVideoX4$,
        screen1: this.screen1$,
        indexForClassContainerX1: this.indexForClassContainerX1$,
        tooltipTimeHls: this.tooltipTimeHls$,
        tooltipPositionHls: this.tooltipPositionHls$,
        currIndexSpeedRO: this.currIndexSpeedRO$,
        speedROArr: this.speedROArr$,
        markedTimesHls: this.markedTimesHls$,
        selectedMarkedTimeIndex: this.selectedMarkedTimeIndex$
    });

    get speedRo() {
        return this.get().currIndexSpeedRO;
    }

    get speedROArr() {
        return this.get().speedROArr;
    }

    get markedTimesHls() {
        return this.get().markedTimesHls;
    }

    get selectedMarkedTimeIndex() {
        return this.get().selectedMarkedTimeIndex;
    }

    getListCamera() {
        const videos: string[] = [];
        this._locService.getListCamera().subscribe(
            (rs) => {
                if (rs) {
                    const listCamera = rs.items.map((camera: any) => camera.name);
                    listCamera.forEach((cam: string) => {
                        videos.push(`http://localhost:8888/${cam}/stream.m3u8`)
                    });
                    this.updateCurrentVideos(videos);
                    this.switchScreen(this.get().screenType);
                }
            },
            (err) => {
            }
        );
        // videos.push('https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8');
        // videos.push('https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8');
        // videos.push('https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.mp4/.m3u8');
        // videos.push('https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.mp4/.m3u8');
        // videos.push('https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.mp4/.m3u8');
        // this.updateCurrentVideos(videos);
        // this.switchScreen(this.get().screenType);
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

    setSpeedRo(event: number) {
        this.updateCurrIndexSpeedRO(event);
    }

    playBackRateHls(event: string) {
        if (event !== 'x1') this.updateCurrentIsLive(false);
        this.controlAll(TYPE_CONTROL.PLAY);
        this._handleSyncAllVideoService?.sendPlayBackRate(event);
        let objSentToReferee = {
            playBackRate: event,
        };
        // this._webSocketService!.sendMessage(objSentToReferee);
        this._localStorageService.setData(objSentToReferee);
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
        const currentTime = structuredClone(this._handleCurrentDurationTimeService.currentTime);
        const isPause = structuredClone(this._handleCurrentDurationTimeService.isPause);
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
        setTimeout(() => {
            this._handleSyncAllVideoService?.sendTime(currentTime);
            setTimeout(() => {
                if (isPause) {
                    this.controlAll(TYPE_CONTROL.PAUSE);
                } else {
                    this.controlAll(TYPE_CONTROL.PLAY);
                }
            }, 100);
        }, 0);
    }

    previousVideoX4() {
        const currentTime = structuredClone(this._handleCurrentDurationTimeService.currentTime);
        const isPause = structuredClone(this._handleCurrentDurationTimeService.isPause);
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
        setTimeout(() => {
            this._handleSyncAllVideoService?.sendTime(currentTime);
            if (isPause) {
                this.controlAll(TYPE_CONTROL.PAUSE);
            } else {
                this.controlAll(TYPE_CONTROL.PLAY);
            }
        }, 100);
    }

    changeSourceVideoOne(index: number) {
        this.updateScreen1(false);
        this.updateIndexForClassContainerX1(index);
        setTimeout(() => {
            this.updateScreen1(true);
        }, 100);
    }

    seekVideoPlaybackHls(event: any, clientWidth: number) {
        let currentTime = this.getNewTimeWhenSeekHls(event, clientWidth);
        this._handleSyncAllVideoService?.sendTime(currentTime);
        this.controlAll(TYPE_CONTROL.PAUSE);
        this.updateCurrentIsLive(false);
        let objSentToReferee = {
            isPlay: false,
            currentTime: currentTime,
            seekVideoPlayback: true,
        };
        // this._webSocketService!.sendMessage(objSentToReferee);
        this._localStorageService.setData(objSentToReferee);
    }

    seekToLive() {
        this.updateCurrentIsLive(true);
        this._handleSyncAllVideoService?.sendSeekToLive(true);
        this.controlAll(TYPE_CONTROL.PLAY);
    }

    getNewTimeWhenSeekHls(event: any, clientWidth: number) {
        let controlBarWidth = clientWidth;
        return (event.clientX / controlBarWidth) * this._handleCurrentDurationTimeService.duration;
    }

    showTimeTooltipHls(event: any, clientWidth: number, timeTooltipHls: ElementRef) {
        this.updateTooltipTimeHls(this.getNewTimeHls(event, clientWidth));
        this.updateTooltipPositionHls(event.clientX);
        timeTooltipHls!.nativeElement.style.display = 'block';
    }

    hideTimeTooltipHls(timeTooltipHls: ElementRef) {
        timeTooltipHls!.nativeElement.style.display = 'none';
    }

    getNewTimeHls(event: any, clientWidth: number) {
        let controlBarWidth = clientWidth;

        const currentTimeInSeconds = (event.clientX / controlBarWidth) * this._handleCurrentDurationTimeService.duration;
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

    controlAll(action: string, timeRo?: number, timelineValue?: any): void {
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
                    // this._webSocketService!.sendMessage({
                    //     isPlay: false,
                    //     currentTime: vid.currentTime,
                    //     seekVideoPlayback: true,
                    // });
                    this._localStorageService.setData({
                        isPlay: false,
                        currentTime: vid.currentTime,
                        seekVideoPlayback: true,
                    });
                    this.updateCurrentIsLive(false);
                    break;
                case TYPE_CONTROL.FORWARD:
                    vid.pause();
                    if (timeRo) {
                        vid.currentTime = Math.max(vid.currentTime + timeRo, 0);
                    } else {
                        vid.currentTime = Math.max(vid.currentTime + 1, 0);
                    }
                    // this._webSocketService!.sendMessage({
                    //     isPlay: false,
                    //     currentTime: vid.currentTime,
                    //     seekVideoPlayback: true,
                    // });
                    this._localStorageService.setData({
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
            }
        });
    }
}