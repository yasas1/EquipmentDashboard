import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import EquipmentProperty from 'src/app/Models/EquipmentProperty.interface';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  private apiKey = 'SC:demo:64a9aa122143a5db';
  private url:string;

  private maxPerOneRequest = 100;

  /* API: http://ivivaanywhere.ivivacloud.com/api/Asset/Asset/All?pikey=SC:demo:64a9aa122143a5db&max=10&last=0  */

  constructor(private http:HttpClient) { 
    this.url='/api/Asset/Asset/All?apikey=';
  }

 /**
   * get equipment data from the api
   */
  async getEquipmentData() {

    let countWithMax = 0;
    let lastId = 0;
    const resultArray: Array<EquipmentProperty> = [];

    do{

      await this.http.get(this.url+this.apiKey+'&max='+this.maxPerOneRequest+'&last='+lastId).toPromise().then(data=>{
        for(const item in data){
          if(data.hasOwnProperty(item)){
            resultArray.push(data[item]);
            lastId = parseInt(data[item].__rowid__);
          }
        }
      });
      countWithMax += this.maxPerOneRequest;
      
    }while(lastId >= countWithMax);

    return resultArray;

  }

}
