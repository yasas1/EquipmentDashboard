import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Equipment } from 'src/app/Models/Equipment';
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

  // chart data for the chart component
  public chartData: Array<{assetCategory:string,count:number}>;

  private equipmentlist :Array<Equipment> =[];

  constructor(private equipmentService : EquipmentService) { }

  ngOnInit(): void {
    this.initialization();
  }

  /**
   * Initially check the localstorage or call to fetch
   */
  private initialization(): void {

    let equipmentFromStore = localStorage.getItem("data");

    if(equipmentFromStore != null ){
      
      let equipmentJson =  JSON.parse(equipmentFromStore);
      this.setChartData(Array.of(equipmentJson)[0]);
          
    }
    else{
      this.getEquipmentsAndStore();
    }

  }

  /**
   * fetch equipment data from api and store in localstoreage 
   */
   private async getEquipmentsAndStore(): Promise<void>{

    let equipmentData = await this.equipmentService.getEquipmentData();

    // use and store only needed data 
    for(let item of equipmentData){
      let equipment = new Equipment();
      equipment.AssetID = item.AssetID;
      equipment.AssetCategoryID = (item.AssetCategoryID);
      equipment.__rowid__= item.__rowid__;
      equipment.OperationalStatus= item.OperationalStatus;
      this.equipmentlist.push(equipment);
    }

    //pass for chart
    this.setChartData(this.equipmentlist);

    //store in localstorage
    localStorage.setItem("data",JSON.stringify(this.equipmentlist));

  }

  /**
   * set data into chartData
   * @param dataArray is the data array that is included data fetched from the store or api
   */
  private setChartData(dataArray:Array<Equipment>): void {

    this.operationalCount = 0;
    this.operationalCount = 0;
    this.chartData = [];

    let categoryIdCount = {};

    for(let equipment of dataArray){

      if(equipment.OperationalStatus == OperationalStatus.Operational){
        this.operationalCount++;
      }
      else if(equipment.OperationalStatus == OperationalStatus.NonOperational){
        this.nonOperationalCount++;
      }
      //count occurences by assest category id
      let assetCategoryID = equipment.AssetCategoryID;
      categoryIdCount[assetCategoryID] = categoryIdCount[assetCategoryID]? categoryIdCount[assetCategoryID] + 1 : 1;
    }

    for(let data in categoryIdCount){
      this.chartData.push({assetCategory: data, count:categoryIdCount[data]} );
    }

  }


}
