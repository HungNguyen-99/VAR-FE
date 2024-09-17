import { inject, Pipe } from "@angular/core";

@Pipe({
    name: 'handleWidthOfTimeLine',
    standalone: true
})
export class HandleWidthOfTimeLinePipe {
    transform(currentTime : number, duration: number): string {
        let currentWidth = (currentTime / duration) * 100;
        return currentWidth + '%';
    }
}