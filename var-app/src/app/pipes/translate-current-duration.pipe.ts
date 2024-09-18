import { Pipe } from "@angular/core";

@Pipe({
    name: 'translateCurrentDuration',
    standalone: true
})
export class TranslateCurrentDurationPipe {
    transform(currentTime?: number, duration?: number): string {
        if (currentTime) {
            const totalHours = currentTime / 3600;

            const totalMilliseconds = totalHours * 60 * 60 * 1000;

            const date = new Date(totalMilliseconds);

            const hours = date.getUTCHours().toString().padStart(2, '0');
            const minutes = date.getUTCMinutes().toString().padStart(2, '0');
            const seconds = date.getUTCSeconds().toString().padStart(2, '0');

            return `${hours}:${minutes}:${seconds}`;
        }
        if (duration) {
            const totalHours = duration / 3600;

            const totalMilliseconds = totalHours * 60 * 60 * 1000;

            const date = new Date(totalMilliseconds);

            const hours = date.getUTCHours().toString().padStart(2, '0');
            const minutes = date.getUTCMinutes().toString().padStart(2, '0');
            const seconds = date.getUTCSeconds().toString().padStart(2, '0');

            return `${hours}:${minutes}:${seconds}`;
        }
        return '00:00:00';
    }
}