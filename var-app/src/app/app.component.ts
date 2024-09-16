import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingScreenComponent } from './components/loading-screen/loading-screen.component';
import { NgIf } from '@angular/common';
import { CreateMatchComponent } from './components/create-match/create-match.component';
import { MATERIAL_MODULE } from './consts/material.const';
import { LayoutComponent } from './components/layout/layout.component';
import { LocService } from './services/loc-service.service';
import { tap } from 'rxjs';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingScreenComponent, CreateMatchComponent, LayoutComponent, NgIf, MATERIAL_MODULE],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChild('loadingScreen', { static: true }) loadingScreenElement!: ElementRef;

  isLoading = true;
  isSubmitted = false;

  constructor(
    private renderer: Renderer2,
    private locService: LocService,
  ){}

  ngOnInit(){
    this.isExpired();
    this.endTheMatchEvent();
  }

  ngAfterViewInit(): void {
    this.showLoadingScreen();
  }

  showLoadingScreen(): void {
    // Simulate initial loading time
    setTimeout(() => {
      if (this.loadingScreenElement) {
        this.renderer.addClass(this.loadingScreenElement.nativeElement, 'hidden');
      }
      setTimeout(() => {
        this.isLoading = false;
      }, 500); // Wait for the fade-out transition to complete
    }, 4000); // Adjust the duration as needed
  }

  getFormInfo(data: any) {
    console.log(data);
    this.isSubmitted = true;
    sessionStorage.setItem('START_TIME', Date.now().toString());
  }

  endTheMatchEvent(){
    this.locService.endTheMatchEvent$.pipe(
      tap(() => {
        sessionStorage.clear();
        this.isExpired();
      })
    ).subscribe();
  }

  isExpired() {
    const now = Date.now();
    const startTime = sessionStorage.getItem('START_TIME');
    const duration = 90 * 60 * 1000; // 1 minute
    if (startTime && duration && (now - (+startTime) < duration)) {
      this.isSubmitted = true;
    }else {
      sessionStorage.clear();
      this.isSubmitted = false;
    }
  }
}
