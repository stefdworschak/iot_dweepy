dweetio.listen_for("test_dwo_iot_BzEsQxDrq0",function(err,dweet){
    try {  
        console.log(dweet)
        var dweet = dweet[0];
        console.log(dweet);
        
        document.getElementById("date_out").innerText = dweet.created;
        document.getElementById("message_out").innerText = dweet.content.temperature;
    } catch(e){
        console.log(e)
    }
})