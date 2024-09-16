import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LocService } from '../../services/loc-service.service';
import { NotificationService } from '../../services/notification.service';
import { MATERIAL_MODULE } from '../../consts/material.const';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-add-new-camera',
  templateUrl: './add-new-camera.component.html',
  styleUrls: ['./add-new-camera.component.scss'],
  imports: [MATERIAL_MODULE, FormsModule, ReactiveFormsModule, NgIf],
  standalone: true
})
export class AddNewCameraComponent {
  rtspForm!: FormGroup;
  rtspUrl!: string;
  storageCam: any = localStorage.getItem('listCamera');
  constructor(private fb: FormBuilder, private notify: NotificationService, private locService: LocService,
    public dialogRef: MatDialogRef<AddNewCameraComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
    this.createForm();
  }

  createForm() {
    this.rtspForm = this.fb.group({
      cameraName: ['', [Validators.required]],
      ip: ['', [Validators.required, Validators.pattern(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/)]],
      port: [554, Validators.required],  // Default port 554
      user: ['admin', Validators.required],
      pass: ['', Validators.required]
    });
  }

  generateRtspUrl() {
    if (this.rtspForm.valid) {
      const { cameraName, ip, port, user, pass } = this.rtspForm.value;
      this.locService.getRtspLink({ ip, port, user, pass }).subscribe(res => {
        this.rtspUrl = res.rtspUrl
        this.notify.success('Add cam successfully');
        const fullRtsp = this.generateFullRtspLink(this.rtspUrl, user, pass);
        this.locService.addCamera(cameraName, { name: cameraName, source: fullRtsp }).subscribe(rs => {
          if (!rs) {
            if (!this.storageCam) {
              this.storageCam = []
            } else {
              this.storageCam = JSON.parse(this.storageCam)
            }
            this.storageCam.push({ cameraName, ip, port, user, pass });
            localStorage.setItem('listCamera', JSON.stringify(this.storageCam));
            this.dialogRef.close({ name: cameraName, source: fullRtsp });
          }
        })
      })
    } else {
      console.error('Form is not valid');
      this.notify.warn('Please input form!');
    }
  }
  generateFullRtspLink(baseRtspUrl: string, username: string, password: string) {
    // Split the URL at '://'
    const parts = baseRtspUrl.split('://');

    // Reassemble the URL with username and password inserted
    const fullRtspUrl = `${parts[0]}://${username}:${password}@${parts[1]}`;

    return fullRtspUrl;
  }
}
