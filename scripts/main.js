window.addEventListener("load", function() {

    var long;
    var lat;

    var today = new Date();
    var hours = today.getHours();
    var ampm = hours >= 12 ? "pm" : "am";

    hours = hours % 12;
    hours = hours ? hours : 12;

    console.log(hours);

    if (this.navigator.geolocation) {

        this.navigator.geolocation.getCurrentPosition(function(position) {

            long = position.coords.longitude;
            lat = position.coords.latitude;
            var proxy = "https://cors-anywhere.herokuapp.com/"
            var api = `${proxy}https://api.darksky.net/forecast/343d05c7e1ca8afed52746ce1b0023b6/${lat},${long}`;

            this.fetch(api)
        
            .then(function(data) {
            
                return data.json();
            })

            .then(function(data) {
                var current_celsius = (data.currently.apparentTemperature - 32) * (5 / 9);
                var current_data = data.currently;
                var daily_data = data.daily;

                console.log(current_data);
                console.log(daily_data.data);

                document.getElementById("temperature").textContent = Math.floor(current_celsius) + "°C";
                document.getElementById("description").textContent = current_data.summary;
                document.getElementById("probability").textContent = current_data.precipProbability * 100 + "%";

                if (hours > 6 && hours < 8) {
                    console.log("night");
                    document.body.style.backgroundColor = "#26142a";
                    document.body.style.color = "#fff";

                } else {
                    console.log("day");
                    document.body.style.backgroundColor = "#add8e6";
                    document.body.style.color = "#000";
                }

                if (current_data.icon.indexOf("snow") > -1) {
                    document.getElementById("weather-anim").setAttribute("src", "weather_anim/snow.gif");
                
                } else if (current_data.icon.indexOf("clear") > -1 && current_data.icon.indexOf("night") > -1) {
                    document.getElementById("weather-anim").setAttribute("src", "weather_anim/clear-night.gif");
                
                } else if (current_data.icon.indexOf("rain") > - 1 || current_data.icon.indexOf("thunderstorm") > -1) {
                    document.getElementById("weather-anim").setAttribute("src", "weather_anim/rain.gif");
                
                } else if (current_data.icon.indexOf("cloudy") > - 1) {
                    document.getElementById("weather-anim").setAttribute("src", "weather_anim/clouds.gif");
                
                } else if (current_data.icon.indexOf("clear-day") > - 1) {
                    document.getElementById("weather-anim").setAttribute("src", "");
                }

                icon_setter(current_data.icon, document.getElementById("icon"));

                var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

                for (var i = 0; i < daily_data.data.length; i++) {

                    var el = document.createElement("li");
                    el.innerHTML =  days[i] +  ": " + Math.floor((daily_data.data[i].apparentTemperatureMax - 32) * (5 / 9)) + "</br>" + "description: " + daily_data.data[i].precipType;
                    el.innerHTML += "</br>" + "percipitation percent: " + daily_data.data[i].precipProbability * 100 + "%";
                    el.innerHTML += "</br>" + "Skys: " + daily_data.data[i].summary; 
                    document.body.appendChild(el);
                }
            });
        }); 

    } else {
        console.log("sorry your browser said NAH");
    }

    function icon_setter(icon, icon_id) {

        var sky_cons = new Skycons({color: "#000"});

        if (document.body.style.backgroundColor === "rgb(38, 20, 42)") {
            sky_cons = new Skycons({color: "#fff"});

        } else if (document.body.style.backgroundColor == "rgb(173, 216, 230)") {
            sky_cons = new Skycons({color: "#000"});
        }

        var current_icon = icon.replace(/-/g, "_").toUpperCase();
        sky_cons.play();

        return sky_cons.set(icon_id, Skycons[current_icon]);
    }
});

setInterval(function() {

    window.location.reload();
}, 300000);