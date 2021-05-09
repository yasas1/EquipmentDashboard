import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import EquipmentProperty from 'src/app/Models/EquipmentProperty.interface';
import { OperationalStatus } from 'src/app/Models/OperationalStatus';
import { EquipmentService } from 'src/app/Services/equipment/equipment.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public operationalCount = 0;
  public nonOperationalCount = 0;

  // for chart data
  public chartData: Array<{assetCategory:string,count:number}>;

  private equipmentlist :Array<EquipmentProperty> =[];

  private numberOfEquipment = 250; // number of equipment to be fetched from api
  private maxPerOneRequest = 100; // maximum number of equipment to be fetched from api per once (<= 100)

  constructor(private equipmentService : EquipmentService) { }

  ngOnInit(): void {
    this.initialization();
  }

  /**
   * Initiali check the localstorage for the and call to fetch
   */
  private initialization(): void {

    let dataFromStore = localStorage.getItem("data");

    if(dataFromStore != null ){
      
      let dataJson = JSON.parse(dataFromStore);

      if(dataJson.length == this.numberOfEquipment){
        this.setChartData(Array.of(dataJson)[0]);
      }
      else{
        this.getEquipmentsAndStore();
      }
      
    }
    else{
      this.getEquipmentsAndStore();
    }

  }

  /**
   * fetch equipment data and store in localstoreage 
   */
  private getEquipmentsAndStore(): void {

    let countMaxPerOne = Math.floor(this.numberOfEquipment/this.maxPerOneRequest);
    let remain = this.numberOfEquipment % this.maxPerOneRequest;
    let max= this.maxPerOneRequest<this.numberOfEquipment?this.maxPerOneRequest:this.numberOfEquipment;
    let last = 0;
    let maxAndLast: Array<{max:number,last:number}>=[];
    let arrayFork=[]; //all needed promises

    // set up max and last variables and http requests for full number of equipments
    for (let i = 1 ; i <= countMaxPerOne+1; i++){
      
      if(max >0){
        maxAndLast.push({max,last});
        arrayFork.push(this.equipmentService.getEquipmentData(max,last));
      }
      
      if(countMaxPerOne == i){
        max = remain;
      }
      last += this.maxPerOneRequest;
    }
    
    // now parallely fetch the data and store
    forkJoin(arrayFork).subscribe(results=>{

      for(let i = 0 ; i < maxAndLast.length; i++){

        for(let j = 0 ; j <maxAndLast[i].max; j++){
          this.equipmentlist.push(results[i][j]);
        }
      }

      this.setChartData(this.equipmentlist);

      //store in localstorage as one string Json 
      localStorage.setItem("data",JSON.stringify(this.equipmentlist));
      
    });

  }

  /**
   * set data into chartData
   * @param dataArray is the data array that is included data fetched from the store or api
   */
  private setChartData(dataArray:Array<EquipmentProperty>): void {

    this.operationalCount = 0;
    this.operationalCount = 0;
    this.chartData = [];

    let count = {};

    for(let equipment of dataArray){

      if(equipment.OperationalStatus == OperationalStatus.Operational){
        this.operationalCount++;
      }
      else if(equipment.OperationalStatus == OperationalStatus.NonOperational){
        this.nonOperationalCount++;
      }
      //count occurences by assest category id
      let assetCategoryID = equipment.AssetCategoryID;
      count[assetCategoryID] = count[assetCategoryID]? count[assetCategoryID] + 1 : 1;
    }

    for(let data in count){
      this.chartData.push({assetCategory: data,count:count[data]} );
    }

  }


}
