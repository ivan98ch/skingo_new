import { Injectable } from '@angular/core';
import { StoredItemModel } from '../models/storedItemModel.model';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';


const STORAGE_KEY = 'skingoData';

@Injectable({
  providedIn: 'root'
})

export class StorageService {

  data: StoredItemModel[];
  item: StoredItemModel = {
    buyUrl: '',
    imageUrl: '',
    name: ''
  };

  constructor(
    private storage: Storage,
    private router: Router,
  ) {}

  updateItemStoredData(dataItem) {
    this.item.buyUrl = dataItem['hostPageUrl'];
    this.item.imageUrl = dataItem['thumbnailUrl'];
    this.item.name = dataItem['name'];

    this.storage.get(STORAGE_KEY).then( data => {
        this.data = JSON.parse(data);
        if (!this.data) {
            this.data = [this.item];
        } else {
            this.data.push(this.item);
        }
        this.storage.set(STORAGE_KEY, JSON.stringify(this.data));
        this.data = [this.item, ...this.data];
    });
  }
}
