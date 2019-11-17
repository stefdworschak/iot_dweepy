function createMultiTimelineChart(data, category, values, container, series_names){
    console.log("LineChart")
    console.log(data)

    am4core.useTheme(am4themes_animated);
    var chart = am4core.create(container, am4charts.XYChart);
    chart.data = data;
    chart.zoomOutButton.disabled = true;

    chart.dateFormatter.inputDateFormat = "YYYY-mm-dd H:mm:ss";
    chart.scrollbarX = new am4core.Scrollbar();
    chart.scrollbarX.parent = chart.bottomAxesContainer;

    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.dataFields.category = category;
    dateAxis.baseInterval = {
        "timeUnit": "second",
        "count": 1
    } 
    dateAxis.dateFormats.setKey("second", "H:mm:ss");
    dateAxis.periodChangeDateFormats.setKey("second", "H:mm:ss");
    dateAxis.periodChangeDateFormats.setKey("minute", "H:mm:ss");
    dateAxis.periodChangeDateFormats.setKey("hour", "H:mm:ss");  
    dateAxis.periodChangeDateFormats.setKey("day", "d/m/y H:mm:ss");

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    var series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = values[0];
    series.dataFields.dateX = category;
    series.strokeWidth = 3;
    series.name = series_names[0];

    var series2 = chart.series.push(new am4charts.LineSeries());
    series2.dataFields.valueY = values[1];
    series2.dataFields.dateX = category;
    series2.strokeWidth = 3;
    series2.name = series_names[1];

    series.interpolationDuration = 500;
    series.defaultState.transitionDuration = 0;
    series2.interpolationDuration = 500;
    series2.defaultState.transitionDuration = 0;
    
    dateAxis.interpolationDuration = 500;
    dateAxis.rangeChangeDuration = 500;

    chart.events.on("datavalidated", function () {
        dateAxis.zoom({ start: 1-10/data.length, end: 1 }, false, true);        
    });

    chart.events.on("beforedatavalidated", function(ev) {
        chart.data.sort(function(a, b) {
          return (new Date(a[category])) - (new Date(b[category]));
        });
      });

    return chart;
}

function createBarChart(data, category, value, container, series_name){
    var chart = am4core.create(container, am4charts.XYChart);
    chart.data = data;
    chart.zoomOutButton.disabled = true;

    chart.dateFormatter.inputDateFormat = "YYYY-mm-dd H:mm:ss";
    chart.scrollbarX = new am4core.Scrollbar();
    chart.scrollbarX.parent = chart.bottomAxesContainer;

    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.dataFields.category = category;
    dateAxis.baseInterval = {
        "timeUnit": "second",
        "count": 1
    } 
    dateAxis.dateFormats.setKey("second", "H:mm:ss");
    dateAxis.periodChangeDateFormats.setKey("second", "H:mm:ss");
    dateAxis.periodChangeDateFormats.setKey("minute", "H:mm:ss");
    dateAxis.periodChangeDateFormats.setKey("hour", "H:mm:ss");  
    dateAxis.periodChangeDateFormats.setKey("day", "d/m/y H:mm:ss");

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = value;
    series.dataFields.dateX = category;
    series.strokeWidth = 0;
    series.name = series_name;
    series.groupFields.valueY = "average";

    chart.events.on("datavalidated", function () {
        dateAxis.zoom({ start: 1-10/data.length, end: 1 }, false, true);        
    });

    chart.events.on("beforedatavalidated", function(ev) {
        chart.data.sort(function(a, b) {
          return (new Date(a[category])) - (new Date(b[category]));
        });
      });

    return chart;
}

function createGaugeChart(data, container, series_name){

    // create chart
    var chart = am4core.create("threshold_container", am4charts.GaugeChart);
    chart.innerRadius = am4core.percent(82);
    
    /**
     * Normal axis
     */

    var axis = chart.xAxes.push(new am4charts.ValueAxis());
    axis.min = 0;
    axis.max = 100;
    axis.strictMinMax = true;
    axis.renderer.radius = am4core.percent(80);
    axis.renderer.inside = false;
    axis.renderer.line.strokeOpacity = 1;
    axis.renderer.ticks.template.disabled = false
    axis.renderer.ticks.template.strokeOpacity = 1;
    axis.renderer.ticks.template.length = 10;
    axis.renderer.grid.template.disabled = true;
    axis.renderer.labels.template.radius = 40;
    axis.renderer.labels.template.adapter.add("text", function(text) {
    return text + "%";
    })

    /**
     * Axis for ranges
     */

    var colorSet = new am4core.ColorSet();

    var axis2 = chart.xAxes.push(new am4charts.ValueAxis());
    axis2.min = 0;
    axis2.max = 100;
    axis2.renderer.innerRadius = 10
    axis2.strictMinMax = true;
    axis2.renderer.labels.template.disabled = true;
    axis2.renderer.ticks.template.disabled = true;
    axis2.renderer.grid.template.disabled = true;

    var range0 = axis2.axisRanges.create();
    range0.value = 0;
    range0.endValue = 50;
    range0.axisFill.fillOpacity = 1;
    range0.axisFill.fill = colorSet.getIndex(0);

    var range1 = axis2.axisRanges.create();
    range1.value = 50;
    range1.endValue = 100;
    range1.axisFill.fillOpacity = 1;
    range1.axisFill.fill = colorSet.getIndex(2);

    /**
     * Label
     */

    var label = chart.radarContainer.createChild(am4core.Label);
    label.isMeasured = false;
    label.fontSize = 30;
    label.x = am4core.percent(50);
    label.y = am4core.percent(100);
    label.horizontalCenter = "middle";
    label.verticalCenter = "bottom";
    label.text = data.toString()+"%";

    var hand = chart.hands.push(new am4charts.ClockHand());
    hand.axis = axis2;
    hand.innerRadius = am4core.percent(20);
    hand.startWidth = 10;
    hand.pin.disabled = true;
    hand.value = data;

    hand.events.on("propertychanged", function(ev) {
        range0.endValue = ev.target.value;
        range1.value = ev.target.value;
        axis2.invalidate();
    });

    return [hand,label];
}