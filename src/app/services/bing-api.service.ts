import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BingApiService {

  constructor(private http: HttpClient) { }

  postVisualSearch( image: File) {
    const endPoint = 'https://buscadorproductosimagen.cognitiveservices.azure.com/bing/v7.0/images/visualsearch';
    const headers: HttpHeaders = new HttpHeaders({
      'Ocp-Apim-Subscription-Key': '14b28ea4a801419faa6f15e769862ba0',
      'X-BingApis-SDK': 'true',
      'Content-Type': 'multipart/form-data'
    });
    const options = { headers };
    const formData: FormData = new FormData();
    formData.append('image', image, image.name);

    return this.http.post(endPoint, formData, options).subscribe( res => {
      console.log(res);
    });
  }

}
