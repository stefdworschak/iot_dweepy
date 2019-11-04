dweetio.get_latest_dweet_for("sd_dwo_20191102",function(err,dweet){
    
    var dweet = dweet[0];
    console.log(dweet);
    
    document.getElementById("date_out").innerText = dweet.created;
    document.getElementById("message_out").innerText = dweet.content.message;

})