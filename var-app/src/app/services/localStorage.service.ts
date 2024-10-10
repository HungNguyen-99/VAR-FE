import { Injectable, NgZone } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {
    private storageKey = 'sharedDataReferee';
    private storageSubject = new BehaviorSubject<any>(this.getData());

    constructor(private ngZone: NgZone) {
        window.addEventListener('storage', (event) => this.onStorageChange(event));
    }

    setData(value: any): void {
        localStorage.setItem(this.storageKey, JSON.stringify(value));
        this.storageSubject.next(value);
    }

    getStorageObservable() {
        return this.storageSubject.asObservable();
    }

    private onStorageChange(event: StorageEvent) {
        if (event.key === this.storageKey) {
            this.ngZone.run(() => {
                this.storageSubject.next(this.getData());
            });
        }
    }

    getData(): number {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : null;
    }
}  