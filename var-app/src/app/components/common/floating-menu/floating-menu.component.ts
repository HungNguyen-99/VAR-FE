import { NgClass, NgIf } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { MATERIAL_MODULE } from '../../../consts/material.const';
import { PLAYBACK_RATE, SCREENS } from '../../../consts/system-contant';

@Component({
  selector: 'app-floating-menu',
  templateUrl: './floating-menu.component.html',
  styleUrls: ['./floating-menu.component.scss'],
  standalone: true,
  imports: [NgClass, NgIf, MATERIAL_MODULE]
})
export class FloatingMenuComponent implements OnInit, OnChanges {
  isMenuOpen = false;

  playBackRateUsing = '';
  curretSpeed = 2;
  @Input() screenUsing: string = SCREENS.FOUR_SCREENS;
  @Input() isLive = false;
  @Input() isLiveOnPlayback = false;
  @Output() screenUsingOut = new EventEmitter();
  @Output() playBackRateUsingOut = new EventEmitter();
  @Output() refreshAll = new EventEmitter();
  @Output() seekToLive = new EventEmitter();
  @Output() setSpeedRo = new EventEmitter();
  @Output() endTheMatchEvent = new EventEmitter();
  arrangeSwitchScreens = [SCREENS.FOUR_SCREENS, SCREENS.NINE_SCREENS, SCREENS.ONE_SCREENS];
  arrangePlaybackRate = [PLAYBACK_RATE.X1, PLAYBACK_RATE.X05, PLAYBACK_RATE.X01];

  // Handle change Play back rate x1
  // @HostListener('window:keydown.shift.t', ['$event'])
  // onWindowShiftKeyT(event: KeyboardEvent) {
  //   console.log('Shift key + T key pressed');
  //   this.switchPlaybackRate(PLAYBACK_RATE.X1);
  // }
  // Handle change Play back rate x0.5
  // @HostListener('window:keydown.shift.y', ['$event'])
  // onWindowShiftKeyY(event: KeyboardEvent) {
  //   console.log('Shift key + Y key pressed');
  //   this.switchPlaybackRate(PLAYBACK_RATE.X05);
  // }
  // Handle change Play back rate x0.1
  // @HostListener('window:keydown.shift.u', ['$event'])
  // onWindowShiftKeyU(event: KeyboardEvent) {
  //   console.log('Shift key + U key pressed');
  //   this.switchPlaybackRate(PLAYBACK_RATE.X01);
  // }

  // // Handle Button 1 on RO
  // @HostListener('window:keydown.meta.shift.x', ['$event'])
  // onWindowShiftKeyX(event: KeyboardEvent) {
  //   const currPlaybackRate = this.arrangePlaybackRate.findIndex((element) => element === this.playBackRateUsing);
  //   if (currPlaybackRate >= 0) {
  //     if (this.arrangePlaybackRate[currPlaybackRate] === PLAYBACK_RATE.X1) {
  //       this.switchPlaybackRate(PLAYBACK_RATE.X05);
  //     } else if (this.arrangePlaybackRate[currPlaybackRate] === PLAYBACK_RATE.X05) {
  //       this.switchPlaybackRate(PLAYBACK_RATE.X01);
  //     } else {
  //       this.switchPlaybackRate(PLAYBACK_RATE.X1);
  //     }
  //   } else {
  //     this.switchPlaybackRate(PLAYBACK_RATE.X1);
  //   }
  // }

  // Handle Button Switch Screen
  @HostListener('window:keydown.meta.shift.b', ['$event'])
  onWindowShiftKeyB(event: KeyboardEvent) {
    console.log('Window + Shift key + B key pressed');
    const currIndexScreen = this.arrangeSwitchScreens.findIndex((element) => element === this.screenUsing);
    if (currIndexScreen < this.arrangeSwitchScreens.length - 1) {
      this.switchScreen(this.arrangeSwitchScreens[currIndexScreen + 1]);
    } else if (currIndexScreen === this.arrangeSwitchScreens.length - 1) {
      this.switchScreen(this.arrangeSwitchScreens[0]);
    }
  }
  // Handle Button Switch rate for video
  @HostListener('window:keydown.meta.shift.n', ['$event'])
  onWindowShiftKeyN(event: KeyboardEvent) {
    const currIndexScreen = this.arrangePlaybackRate.findIndex((element) => element === this.playBackRateUsing);
    if (currIndexScreen < this.arrangePlaybackRate.length - 1) {
      this.switchPlaybackRate(this.arrangePlaybackRate[currIndexScreen + 1]);
    } else if (currIndexScreen === this.arrangePlaybackRate.length - 1) {
      this.switchPlaybackRate(this.arrangePlaybackRate[0]);
    }
  }

  // Handle Button Switch speed of spin RO
  @HostListener('window:keydown.meta.shift.f', ['$event'])
  onWindowShiftKeyF(event: KeyboardEvent) {
    this.curretSpeed--;
    if (this.curretSpeed < 0) this.curretSpeed = 2;
    this.switchSpeedRo(this.curretSpeed);
  }

  constructor() {}

  ngOnInit(): void {
    this.switchPlaybackRate('x1');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isLiveOnPlayback']?.currentValue) {
      this.switchPlaybackRate('x1');
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
  getRefreshAll() {
    this.refreshAll.emit(true);
  }
  switchScreen(screenUsing: any) {
    switch (screenUsing) {
      case SCREENS.FOUR_SCREENS:
        this.screenUsing = SCREENS.FOUR_SCREENS;
        break;

      case SCREENS.NINE_SCREENS:
        this.screenUsing = SCREENS.NINE_SCREENS;
        break;

      case SCREENS.ONE_SCREENS:
        this.screenUsing = SCREENS.ONE_SCREENS;
        break;
    }
    this.screenUsingOut.emit(this.screenUsing);
  }

  switchPlaybackRate(playBackRateUsing: any) {
    switch (playBackRateUsing) {
      case PLAYBACK_RATE.X1:
        this.playBackRateUsing = PLAYBACK_RATE.X1;
        break;

      case PLAYBACK_RATE.X05:
        this.playBackRateUsing = PLAYBACK_RATE.X05;
        break;

      case PLAYBACK_RATE.X01:
        this.playBackRateUsing = PLAYBACK_RATE.X01;
        break;
    }
    this.playBackRateUsingOut.emit(this.playBackRateUsing);
  }

  endTheMatch(){
    this.endTheMatchEvent.emit();
  }

  switchSpeedRo(speed: any) {
    this.curretSpeed = speed;
    this.setSpeedRo.emit(speed);
  }

  isShow = false;
  mouseenterFn() {
    this.isShow = true;
  }

  mouseleaveFn() {
    this.isShow = false;
  }
}
