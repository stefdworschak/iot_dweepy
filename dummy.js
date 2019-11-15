function createDummy(){
    //localStorage.removeItem("arr");
    let arr = JSON.parse(localStorage.getItem("arr")) == null ? [] : JSON.parse(localStorage.getItem("arr"));
    if(arr.length >= 100){
        arr.unshift();
    }
    const opt = {hour:"2-digit", minute: "2-digit", second: "2-digit"}
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
        threshold: Math.round(700 * Math.random(),0),
        sound: Math.round(100 * Math.random(),0),
        time: new Date().getTime()
    })
    localStorage.setItem("arr", JSON.stringify(arr));
    console.log(arr.length) 
    setTimeout(createDummy,1000);
}
createDummy();
