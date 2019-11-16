$(document).ready(function(){
    let chart1, chart2, gaugeHand;
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

        temperature = arr.slice(0).map(function(a){
            return {ts:new Date(a.time).getTime(), temperature: a.temperature, humidity: a.humidity};
        });

        lux = arr.slice(0).map(function(a){
            return {ts:new Date(a.time).getTime(), illuminance: a.illuminance};
        });

        chart1 = createMultiTimelineChart(temperature, "ts", ["temperature","humidity"], "temperature_container",["Temperature","Humidity"]);
        chart2 = createBulletChart(lux, "ts", "illuminance", "illuminance_container","Illuminance");
        gaugeHand = createGaugeChart(arr[arr.length-1].threshold, "threshold_container", "Threshold");
        
    } else {
        updateChart();
    }   
    
    function updateChart(){
        try {
            arr2 = JSON.parse(localStorage.getItem("arr"))
            //Set all of the top items
            $($('.celcius').children()[0]).html(arr2[arr2.length-1].temperature + "&#xb0; / " + arr2[arr2.length-1].humidity + "%");
            $($('.lux').children()[0]).html(arr2[arr2.length-1].illuminance + "lx");
            $($('.threshold').children()[0]).html(arr2[arr2.length-1].threshold + "lx");
                
            temperature2 = arr2.slice(0).map(function(a){
                    return {ts:new Date(a.time).getTime(), temperature: a.temperature, humidity: a.humidity};
            });
            
            lux2 = arr2.slice(0).map(function(a){
                return {ts:new Date(a.time).getTime(), illuminance: a.illuminance};
            });
            /*const temp_update = temperature2.filter(function(item1){
                    !temperature.some(function(item2){
                        return (new Date(item2.ts) === new Date(item1.ts))
                    })
            });

            const lux_update = lux2.filter(function(item1){
                !lux.some(function(item2){
                    return (new Date(item2.ts) === new Date(item1.ts))
                })
            });*/
            console.log("Checking ts")
            //console.log(temperature[0].ts)
            //console.log(temperature2[0].ts)
            //console.log(new Date(temperature[0].ts).getTime() == new Date(temperature2[0].ts).getTime());
            //console.log(temperature[temperature.length-1].ts == temperature2[temperature.length-1].ts);
            const temp_update = temperature2.filter(item1 => 
                !temperature.some(item2 => (new Date(item2.ts).getTime() === new Date(item1.ts).getTime() && item2.temperature === item1.temperature && item2.humidity === item1.humidity)));
            console.log(temp_update)
            const lux_update = lux2.filter(item1 => 
                !lux.some(item2 => (new Date(item2.ts).getTime() === new Date(item1.ts).getTime() && item2.illuminance === item1.illuminance)));
            console.log(lux_update)
            if(chart1 == null){
                chart1 = createMultiTimelineChart(temperature, "ts", ["temperature","humidity"], "temperature_container",["Temperature","Humidity"]);
                chart2 = createBulletChart(lux, "ts", "illuminance", "illuminance_container","Illuminance");
                gaugeHand = createGaugeChart(arr[arr.length-1].threshold, "threshold_container", "Threshold");
            } else {
                for(i = 0; i < temp_update.length; i++){
                    chart1.addData(
                        { ts: new Date(temp_update[i].ts).getTime(), temperature: temp_update[i].temperature, humidity: temp_update[i].humidity },
                    );
                    chart2.addData(
                        { ts: new Date(lux_update[i].ts).getTime(), illuminance: lux_update[i].illuminance },
                    );
                }
            }

            var animation = new am4core.Animation(gaugeHand, {
                property: "value",
                to: Math.round(Math.random() * 100, 0)
            }, 2000, am4core.ease.cubicOut).start();

        } catch(e){
            console.log(e);
        }
            
        setTimeout(updateChart,10000);  
    }

    function removeDupes(e){
        return this.indexOf(e) < 0;
        //which clearly can't work since we don't have the reference <,< 
    }

    updateChart();
})

