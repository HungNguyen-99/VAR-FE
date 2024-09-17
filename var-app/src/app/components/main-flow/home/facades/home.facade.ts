import { inject, Injectable } from "@angular/core";
import { ComponentStore } from '@ngrx/component-store';
import { SCREENS } from "../../../../consts/system-contant";
import { LocService } from "../../../../services/loc-service.service";

export interface IHomeState {
    screenType: string;
    videos: string[];
    videoX4: string[];
    videosForOneView: string[];
}

const initialState: IHomeState = {
    screenType: SCREENS.FOUR_SCREENS,
    videos: [],
    videoX4: [],
    videosForOneView: [],
};

@Injectable()
export class HomeFacade extends ComponentStore<IHomeState> {

    private readonly locService = inject(LocService);

    constructor() {
        super(initialState);
    }

    readonly updateCurrentScreenType = this.updater((state, screenType: string) => ({ ...state, screenType }));
    readonly updateCurrentVideos = this.updater((state, videos: string[]) => ({ ...state, videos }));
    readonly updateCurrentVideoX4 = this.updater((state, videoX4: string[]) => ({ ...state, videoX4 }));
    readonly updateCurrentVideosForOneView = this.updater((state, videosForOneView: string[]) => ({ ...state, videosForOneView }));

    readonly screenType$ = this.select(state => state.screenType);
    readonly videos$ = this.select(state => state.videos);
    readonly videoX4$ = this.select(state => state.videoX4);
    readonly videosForOneView$ = this.select(state => state.videosForOneView);

    readonly vm$ = this.select({
        screenType: this.screenType$,
        videos: this.videos$,
        videoX4: this.videoX4$,
        videosForOneView: this.videosForOneView$
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
                // this.controlAll(TYPE_CONTROL.LIVE);
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
                // this.controlAll(TYPE_CONTROL.LIVE);
                break;
            case SCREENS.ONE_SCREENS:
                const videosForOneView = this.get().videos.filter((ele) => ele !== '');
                this.updateCurrentVideosForOneView(videosForOneView);
                // this.controlAll(TYPE_CONTROL.LIVE);
                break;
        }

        localStorage.setItem('screenType', this.get().screenType);
    }


    // controlAll(action: string, timeRo?: number, timelineValue?: any): void {
    //     if (action === TYPE_CONTROL.LIVE) {
    //       this.isLive = true;
    //       this._handleSyncAllVideoService?.sendSeekToLive(true);
    //     }
    
    //     document.querySelectorAll('.video-var').forEach((element: Element) => {
    //       const vid = element as HTMLVideoElement;
    //       switch (action) {
    //         case TYPE_CONTROL.REWIND:
    //           vid.pause();
    //           if (timeRo) {
    //             vid.currentTime = Math.max(vid.currentTime - timeRo, 0);
    //           } else {
    //             vid.currentTime = Math.max(vid.currentTime - 1, 0);
    //           }
    //           this.webSocketService!.sendMessage({
    //             isPlay: false,
    //             currentTime: vid.currentTime,
    //             seekVideoPlayback: true,
    //           });
    //           this.isLive = false;
    //           break;
    //         case TYPE_CONTROL.FORWARD:
    //           vid.pause();
    //           if (timeRo) {
    //             vid.currentTime = Math.max(vid.currentTime + timeRo, 0);
    //           } else {
    //             vid.currentTime = Math.max(vid.currentTime + 1, 0);
    //           }
    //           this.webSocketService!.sendMessage({
    //             isPlay: false,
    //             currentTime: vid.currentTime,
    //             seekVideoPlayback: true,
    //           });
    //           this.isLive = false;
    //           break;
    //         case TYPE_CONTROL.PAUSE:
    //           this.isLive = false;
    //           this.play = false;
    //           vid.pause();
    //           break;
    //         case TYPE_CONTROL.PLAY:
    //           vid.play().catch(error => console.error('Error playing the video:', error));
    //           break;
    //         case TYPE_CONTROL.SEEK_TIMELINE:
    //           vid.currentTime = timelineValue;
    //           break;
    //       }
    //     });
    //   }
}