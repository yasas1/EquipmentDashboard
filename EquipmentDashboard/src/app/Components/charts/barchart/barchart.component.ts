import { Component, Input } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.scss']
})
export class BarchartComponent  {

  //chart data from dashboard component
  @Input() chartData : Array<{assetCategory:string,count:number}>;

  constructor() {}

  ngAfterViewInit() {
    this. chartInitialization();
  }

  /**
   * chart initialization
   */
  private chartInitialization(){
    // Chart code goes in here
    am4core.useTheme(am4themes_animated);

    let chart = am4core.create("chartdiv", am4charts.XYChart);

    // Add data
    chart.data = this.chartData;

    // Create axes

    // category axis
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "assetCategory";
  
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.title.text="Equipment Type";
    categoryAxis.title.fontWeight = "bolder";
    categoryAxis.title.fontSize = 18; 
    categoryAxis.title.fill = am4core.color("#33A4FF");
    
    //value axis
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.extraMax = 0.22;

    // hide labels
    let label = categoryAxis.renderer.labels.template;
    label.hide();

    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "count";
    series.dataFields.categoryX = "assetCategory";
    series.name = "Count";
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = .8;
    series.columns.template.column.cornerRadiusTopRight = 4;
    series.columns.template.column.cornerRadiusTopLeft = 4;
    series.columns.template.strokeWidth = 1;
    series.columns.template.strokeOpacity = 1;

    //put label as bullets on the top of bars
    let bullet = series.bullets.push(new am4charts.LabelBullet);
    bullet.label.text = "{categoryX}";
    bullet.label.fontSize = 14; 
    bullet.label.fontWeight="bolder";
    bullet.label.fontFamily="Teko";
    bullet.label.fill = am4core.color("#3B9C9C");
    bullet.label.rotation = 270;
    bullet.label.truncate = false;
    bullet.label.hideOversized = false;
    bullet.label.horizontalCenter="left";

    //add cursor 
    chart.cursor = new am4charts.XYCursor();

    //add scroll bar on bottom
    chart.scrollbarX = new am4core.Scrollbar();
    chart.scrollbarX.parent = chart.bottomAxesContainer;
    chart.scrollbarX.startGrip.background.fill = am4core.color("#3388FF");
    chart.scrollbarX.endGrip.background.fill = am4core.color("#3388FF");
    chart.scrollbarX.thumb.background.fill = am4core.color("#33A4FF");

  }

}
