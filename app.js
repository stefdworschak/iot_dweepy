dweetio.get_all_dweets_for("test_dwo_iot_BzEsQxDrq0",function(err,dweets){
    try {  
        console.log(dweets);
        var dweet = dweets[0];
        //console.log(dweet);
        
        document.getElementById("date_out").innerText = dweet.created;
        document.getElementById("message_out").innerText = dweet.content.temperature;
    } catch(e){
        console.log(e)
    }
})