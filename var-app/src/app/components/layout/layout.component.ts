import { BreakpointObserver } from "@angular/cdk/layout";
import { NgIf } from "@angular/common";
import { Component, ViewChild } from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";
import { LocService } from "../../services/loc-service.service";
import { MatDialog } from "@angular/material/dialog";
import { ConfigurationComponent } from "../../dialogs/configuration/configuration.component";
import { RouterOutlet } from "@angular/router";
import { MATERIAL_MODULE } from "../../consts/material.const";

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.scss',
    standalone: true,
    imports: [NgIf, RouterOutlet, MATERIAL_MODULE]
})
export class LayoutComponent {
    @ViewChild('sidenav', { static: false }) sidenav!: MatSidenav;
    currentTime!: string;
    isUnlocked = false;
    constructor(private breakpoint: BreakpointObserver, public locService: LocService, public dialog: MatDialog) { }

    ngOnInit() {
        setInterval(() => {
            const currentDate = new Date();
            this.currentTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        }, 1000);

    }

    lockOrUnlock() {
        this.isUnlocked = !this.isUnlocked;
        this.locService.layout.next({ status: this.isUnlocked })
    }
    openConfigDialog() {
        this.dialog.open(ConfigurationComponent, {
            maxHeight: '100vh',
            maxWidth: '100vw',
            width: '60vw',
            minHeight: '40vh'
        });
    }
}