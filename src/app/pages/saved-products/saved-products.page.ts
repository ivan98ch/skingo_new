import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { StoredItemModel } from '../../models/storedItemModel.model';


const STORAGE_KEY = 'skingoData';

@Component({
  selector: 'app-saved-products',
  templateUrl: './saved-products.page.html',
  styleUrls: ['./saved-products.page.scss'],
})
export class SavedProductsPage implements OnInit {

  data: StoredItemModel[] = [];
  item: StoredItemModel;

  constructor(
    private storage: Storage,
    private plt: Platform,
    private ref: ChangeDetectorRef,
    private inAppBrowser: InAppBrowser,
    ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.plt.ready().then(() => {
      this.storage.get(STORAGE_KEY).then(data => {
        if (data) {
          this.data = JSON.parse(data);
        }
      });
    });
  }

  deleteData(itemPosition) {
    this.storage.get(STORAGE_KEY).then( data => {
      this.data = JSON.parse(data);
      this.data.splice(itemPosition, 1);
      this.storage.set(STORAGE_KEY, JSON.stringify(this.data));
      this.ref.detectChanges();
    });
  }

  openBuyPage(url) {
    this.inAppBrowser.create(url);
  }

}
