import { Component } from '@angular/core';
import { ChangePassword } from './change-password/change-password';
import { ProfileInformation } from './profile-information/profile-information';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ChangePassword, ProfileInformation],
  templateUrl: './profile.html',
})
export class Profile {}
