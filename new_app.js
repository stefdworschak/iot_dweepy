/*dweetio.listen_for("test_dwo_iot_BzEsQxDrq0",function(dweet){
    try {  
        console.log(dweet);
        //console.log(err);
        var dweet = dweet[0];
        //console.log(dweet);
        
        document.getElementById("date_out").innerText = dweet.created;
        document.getElementById("message_out").innerText = dweet.content.temperature;
    } catch(e){
        console.log(e)
    }
})*/

window.setInterval(function(){
    let arr = JSON.parse(localStorage.getItem("arr")) == null ? [] : JSON.parse(localStorage.getItem("arr"));
    arr.push({
        thing_id:"dwo_iot_BzEsQxDrq0",
        location:{
            latitude:53.348892,
            longitude:-6.243029
        },
        illuminance:Math.round(700 * Math.random(),0),
        temperature:Math.round(32 * Math.random(),0),
        humidity: Math.round(20 * Math.random(),0),
        button:  Math.round(Math.random(),0),
        sound: Math.round(100 * Math.random(),0),
        time: new Date().toISOString()
    })
    localStorage.setItem("arr", JSON.stringify(arr));

},1000)

$(document).ready(function(){
    let new_arr = [{
                x:'2019-11-12 00:00:00',
                y:0
            }]
    let arr = JSON.parse(localStorage.getItem("arr")) == null ? [] : JSON.parse(localStorage.getItem("arr"));
    const XAXISRANGE = 77760;
    const XAXISRANGE2 = 7776;

    var options1 = {
        chart: {
            //height: '100%',
              type: 'line',
              animations: {
                enabled: true,
                easing: 'linear',
                dynamicAnimation: {
                    speed: 1000
                },
                toolbar: {
                    show:false
                }
            },
            stroke: {
                curve: 'smooth'
            },
            dataLabels: {
                enabled: false
            }
        },
        series: [{
            name:"Temperature",
            data:{
                x:'2019-11-12 00:00:00',
                y:0
            }
        },{ 
            name:"Humidity",
            data:{
                x:'2019-11-12 00:00:00',
                y:0
            }
        }],
        xaxis: {
            type: 'datetime',
            range: XAXISRANGE,
            labels: {
                show:false
            }
        },
        yaxis: [{
            max: 50,
            forceNiceScale: true
        },{
            max: 20,
            forceNiceScale: true
        }],
      };

      var options2 = {
        chart: {
            //height: 350,
            type: 'bar',
            animations: {
                enabled: true,
                easing: 'linear',
                dynamicAnimation: {
                    speed: 1000
                }
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                //endingShape: 'rounded'	
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 10,
            colors: ['transparent']
        },
        series: [{
            name: 'Illuminance',
            data: {x: '2019-11-12 00:00:00' , y:0}
        }],
        xaxis: {
            type: 'datetime',
            range: XAXISRANGE2,
            labels: {
                show:false
            }
        },
        fill: {
            opacity: 1

        }
    }
      
      var chart1 = new ApexCharts(document.querySelector("#temperature_container"), options1);
      var chart2 = new ApexCharts(document.querySelector("#illuminance_container"), options2);
      
      chart1.render();
      chart2.render();
        
    saveData();     
        
        function saveData(){
        let arr = JSON.parse(localStorage.getItem("arr")) == null ? [] : JSON.parse(localStorage.getItem("arr"));
        
        $($('.celcius').children()[0]).html(arr[arr.length-1].temperature+'&#xb0;');
        $($('.humidity').children()[0]).text(arr[arr.length-1].humidity+'%');
        $($('.lux').children()[0]).html(arr[arr.length-1].illuminance+'lx');
        


        const temperature = arr.slice(0).map(function(a){
            return {x: a.time, y: a.temperature};
        });
        const humidity = arr.slice(0).map(function(a){
            
            return {x: a.time, y:a.humidity}
        })

        const illuminance = arr.slice(0).map(function(a){
            
            return {x: a.time, y:a.illuminance}
        })
    
        chart1.updateSeries([{
            data: temperature
        },{
            data: humidity
        }])

        chart2.updateSeries([{
            data: illuminance
        }])     

        window.setTimeout(saveData,10000)
    }

})