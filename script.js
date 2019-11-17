$(document).ready(function(){
    let chart1, chart2, gaugeHand, gaugeLabel;
    let arr = [];
    let temperature = [];
    let lux = [];
    let arr2, temperature2, lux2;
    
    arr = JSON.parse(localStorage.getItem("arr")) == null ? [] : JSON.parse(localStorage.getItem("arr"));
    if(arr.length != 0) {

        //Set all of the top items
        $($('.celcius').children()[0]).html(arr[arr.length-1].temperature + "&#xb0; / " + arr[arr.length-1].humidity + "%");
        $($('.lux').children()[0]).html(arr[arr.length-1].illuminance + "lx");
        $($('.threshold').children()[0]).html(arr[arr.length-1].threshold + "lx");
        console.log(Math.floor(new Date(arr[arr.length-1].time).getTime() / 1000))
        temperature = arr.slice(0).map(function(a){
            return {ts:a.time, temperature: a.temperature, humidity: a.humidity};
        });

        lux = arr.slice(0).map(function(a){
            return {ts:a.time, illuminance: a.illuminance};
        });

        chart1 = createMultiTimelineChart(temperature, "ts", ["temperature","humidity"], "temperature_container",["Temperature","Humidity"]);
        chart2 = createBarChart(lux, "ts", "illuminance", "illuminance_container","Illuminance");
        chart3 = createGaugeChart((Math.round((Number(arr[arr.length-1].threshold) / 900.0) * 100,0)), "threshold_container", "Threshold");
        gaugeHand = chart3[0];
        gaugeLabel = chart3[1];
        
    } else {
        updateChart();
    }   
    
    function updateChart(){
        try {
            console.log("Updating Chart");
            arr_original = JSON.parse(localStorage.getItem("arr"));
            arr2 = arr_original.slice(0).splice(arr.length);
            //Set all of the top items
            $($('.celcius').children()[0]).html(arr2[arr2.length-1].temperature + "&#xb0; / " + arr2[arr2.length-1].humidity + "%");
            $($('.lux').children()[0]).html(arr2[arr2.length-1].illuminance + "lx");
            $($('.threshold').children()[0]).html(arr2[arr2.length-1].threshold + "lx");
                
            temperature2 = arr2.slice(0).map(function(a){
                    return {ts:a.time, temperature: a.temperature, humidity: a.humidity};
            });

            //console.log(temperature);
            console.log(temperature2);
            lux2 = arr2.slice(0).map(function(a){
                return {ts:a.time, illuminance: a.illuminance};
            });
            let temp_update = temperature2.slice(0).filter(item1 => 
                !temperature.some(item2 => (item2.ts == item1.ts && item2.temperature === item1.temperature && item2.humidity === item1.humidity)));
            
                console.log(temp_update)
            let lux_update = lux2.slice(0).filter(item1 => 
                !lux.some(item2 => (item2.ts == item1.ts && item2.illuminance === item1.illuminance)));
            
                console.log(lux_update)
            if(chart1 == null){
                chart1 = createMultiTimelineChart(temperature, "ts", ["temperature","humidity"], "temperature_container",["Temperature","Humidity"]);
                chart2 = createBulletChart(lux, "ts", "illuminance", "illuminance_container","Illuminance");
                gaugeHand = createGaugeChart(arr[arr.length-1].threshold, "threshold_container", "Threshold");
            } else {
                for(i = 0; i < temp_update.length; i++){
                    chart1.addData(
                        { ts: temp_update[i].ts, temperature: temp_update[i].temperature, humidity: temp_update[i].humidity },
                    );
                    chart2.addData(
                        { ts: lux_update[i].ts, illuminance: lux_update[i].illuminance },
                    );
                }
               // chart1.data = temperat;
            }

            var animation = new am4core.Animation(gaugeHand, {
                property: "value",
                to: Math.round((Number(arr2[arr2.length-1].threshold) / 900.0) * 100, 0)
            }, 2000, am4core.ease.cubicOut).start();
            //console.log(gaugeLabel)
            gaugeLabel.text = (Math.round((Number(arr2[arr2.length-1].threshold) / 900.0) * 100,0)).toString() + "%";

        } catch(e){
            console.log(e);
        }
        
        arr = arr_original;
        setTimeout(updateChart,2000);  
    }

    function removeDupes(e){
        return this.indexOf(e) < 0;
        //which clearly can't work since we don't have the reference <,< 
    }

    updateChart();
})

