import { Component } from '@angular/core';
import { ProfileInformation } from './profile-information/profile-information';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ProfileInformation],
  templateUrl: './profile.html',
})
export class Profile {}
