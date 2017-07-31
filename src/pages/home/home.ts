import { Component } from '@angular/core';

//Global Providers
import { GlobalService } from './../../providers/global-service';

//Pages
import { AboutAppPage } from './../about-app/about-app';
import { OrientationsPage } from './../orientations/orientations';
import { DoctorAreaPage } from './../doctor-area/doctor-area';
import { AboutUsPage } from './../about-us/about-us';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  aboutApp     = AboutAppPage;
  orientations = OrientationsPage;
  doctorArea   = DoctorAreaPage;
  aboutUs      = AboutUsPage;

  constructor(public global: GlobalService) {}

}
