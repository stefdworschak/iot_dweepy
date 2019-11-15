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

function charts(){ 
    
    var data = {
        "thing_id":"dwo_iot_BzEsQxDrq0",
        "location":{
            "latitude":53.348892,
            "longitude":-6.243029
        },
        "illuminance":500,
        "temperature":32,
        "humidity": 20,
        "button": 0,
        "sound": 100
    }
    //var container = $('#chartcontainer');
    var container = document.getElementById('chartcontainer');
    console.log(container)
    var chart = am4core.create(container, am4charts.XYChart);
    //docum
 //   console.log()

}

//document.onload = charts();