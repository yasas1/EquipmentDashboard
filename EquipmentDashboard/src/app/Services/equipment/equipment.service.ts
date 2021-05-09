import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import EquipmentProperty from 'src/app/Models/EquipmentProperty.interface';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  private apiKey = 'SC:demo:64a9aa122143a5db';
  private url:string;

  /* API: http://ivivaanywhere.ivivacloud.com/api/Asset/Asset/All?pikey=SC:demo:64a9aa122143a5db&max=10&last=0  */

  constructor(private http:HttpClient) { 
    this.url='/api/Asset/Asset/All?apikey=';
  }

 /**
   * get equipment data from the api
   * @param max The maximum number of items to return each time the api is called
   * @param last Last rowid of the data to be started 
   */
  getEquipmentData(max:number,last:number):Observable<EquipmentProperty[]>{
    return this.http.get(this.url+this.apiKey+'&max='+max+'&last='+last).pipe(
      map(data =>{

        const array: Array<EquipmentProperty> = [];
        for(const item in data){
          if(data.hasOwnProperty(item)){
            array.push(data[item]);
          }
          
        }
        return array;
      })
    )
  }

}
