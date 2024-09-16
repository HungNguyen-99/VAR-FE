import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  durationInSeconds = 3;
  constructor(private _snackBar: MatSnackBar) { }
  success(message: string, duration?: number) {
    this._snackBar.open(message, 'X', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: 'success-snackbar',
      duration: (duration ? duration : this.durationInSeconds) * 1000,
    });
  }
  warn(message: string, duration?: number) {
    this._snackBar.open(message, 'X', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: 'warn-snackbar',
      duration: (duration ? duration : this.durationInSeconds) * 1000,
    });
  }
  info(message: string, duration?: number) {
    this._snackBar.open(message, 'X', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: 'info-snackbar',
      duration: (duration ? duration : this.durationInSeconds) * 1000,
    });
  }
  danger(message: string, duration?: number) {
    this._snackBar.open(message, 'X', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: 'danger-snackbar',
      duration: (duration ? duration : this.durationInSeconds) * 1000,
    });
  }
}
