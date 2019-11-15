$(document).ready(function(){
    let arr2, temperature2, lux2;
    const arr = JSON.parse(localStorage.getItem("arr"))

    //Set all of the top items
    $($('.celcius').children()[0]).html(arr[arr.length-1].temperature + "&#xb0; / " + arr[arr.length-1].humidity + "%");
    $($('.lux').children()[0]).html(arr[arr.length-1].illuminance + "lx");
    $($('.threshold').children()[0]).html(arr[arr.length-1].threshold + "lx");

    const temperature = arr.slice(0).map(function(a){
        return {ts:a.time, temperature: a.temperature, humidity: a.humidity};
    });

    const lux = arr.slice(0).map(function(a){
        return {ts:a.time, illuminance: a.illuminance};
    });

    const chart1 = createMultiTimelineChart(temperature, "ts", ["temperature","humidity"], "temperature_container",["Temperature","Humidity"]);
    const chart2 = createBulletChart(lux, "ts", "illuminance", "illuminance_container","Illuminance");
    const gaugeHand = createGaugeChart(arr[arr.length-1].threshold, "threshold_container", "Threshold");
    
    function updateChart(){

        arr2 = JSON.parse(localStorage.getItem("arr"))
        //Set all of the top items
        $($('.celcius').children()[0]).html(arr2[arr2.length-1].temperature + "&#xb0; / " + arr2[arr2.length-1].humidity + "%");
        $($('.lux').children()[0]).html(arr2[arr2.length-1].illuminance + "lx");
        $($('.threshold').children()[0]).html(arr2[arr2.length-1].threshold + "lx");
        
        temperature2 = arr2.slice(0).map(function(a){
                return {ts:a.time, temperature: a.temperature, humidity: a.humidity};
        });

        lux2 = arr2.slice(0).map(function(a){
            return {ts:a.time, illuminance: a.illuminance};
        });

        const temp_update = temperature2.filter(item1 => 
            !temperature.some(item2 => (item2.ts === item1.ts && item2.temperature === item1.temperature && item2.humidity === item1.humidity)));
        
        const lux_update = lux2.filter(item1 => 
            !lux.some(item2 => (item2.ts === item1.ts && item2.illuminance === item1.illuminance)));
        

        for(i = 0; i < temp_update.length; i++){
            //chart1.series.removeIndex(0);
            chart1.addData(
                { ts: temp_update[i].ts, temperature: temp_update[i].temperature, humidity: temp_update[i].humidity },
            );
            chart2.addData(
                { ts: lux_update[i].ts, illuminance: lux_update[i].illuminance },
            );
        }
        //chart3.value = Math.round(Math.random() * 100, 0);
        var animation = new am4core.Animation(gaugeHand, {
            property: "value",
            to: Math.round(Math.random() * 100, 0)
          }, 2000, am4core.ease.cubicOut).start();
        
        setTimeout(updateChart,10000);
        
    }

    function removeDupes(e){
        return this.indexOf(e) < 0;
        //which clearly can't work since we don't have the reference <,< 
    }

    updateChart();
})

