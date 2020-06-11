import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { GooglePlus } from '@ionic-native/google-plus/ngx/';

import { environment } from 'src/environments/environment';

import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/File/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { IonicStorageModule } from '@ionic/storage';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { PayPal } from '@ionic-native/paypal/ngx';



@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  providers: [
    GooglePlus,
    StatusBar,
    SplashScreen,
    HttpClientModule,
    Camera,
    File,
    FilePath,
    WebView,
    Crop,
    InAppBrowser,
    PayPal,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
