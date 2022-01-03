// define URL for JSON data
var URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// create streetmap
var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});


//create baseMaps and overlay objects
var baseMaps = {
    "Street Map": street,
    "Satellite Map": satellite
};

var overlayMaps = {
    "Earthquakes": earthquakes
};

// create map and add layers
var myMap = L.map('map', {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [street, earthquakes]

});

streetmap.addTo(myMap);

// layer control
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);

// loop through data to create markers
var colors = ['purple', 'blue', 'green', 'yellow', 'orange', 'red'];

d3.json(url).then(function(data){
    console.log(data)
    for (var i = 0; i < data.features.length; i++) {
      coordinates = [data.features[i].geometry.coordinates[1], data.features[i].geometry.coordinates[0]]
      var color = '';
      var depth = data.features[i].geometry.coordinates[2];
      switch(true){
        case (depth > -20 && depth < 0):
          color = colors[0]
          break;
        case (depth >= 0 && depth < 20):
          color = colors[1]
          break;
        case (depth >= 20 && depth < 40):
          color = colors[2]
          break;
        case (depth >= 40 && depth < 60):
          color = colors[3]
          break;
        case ( depth >= 60 && depth < 80):
          color = colors[4]
          break;
        case (depth >= 80):
          color = colors[5]
          break;
      }

    //   pop-up information
    var date = data.features[i].properties.time;
    var place = data.features[i].properties.place;
    var mag = data.features[i].properties.mag;

    // create markers
    L.circle(coordinates, {
        fillOpacity: 0.75,
        opacity: 0.75,
        color: 'white',
        fillColor: color,
        raduis: mag * 5000
    }).bindPopup('<p align="center"> <b>Date:</b> ${date} <br> <b>Location:</b> ${place} <br> <b>Magnitude:</b> ${mag} </p>').addTo(myMap);

    newMarker = L.layer

    }});

    // create legend
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function(){
        var div = L.DomUtil.create('div', 'info legend');
        var grades = ['-20-0', '0-20', '20-40', '40-60', '60-80', '80+'];
        var colors = ['purple', 'blue', 'green', 'yellow', 'orange', 'red'];
        var labels = [];
        grades.forEach(function(grade, index){
            labels.push("<div class = 'row'><li style=\"background-color: " + colors[index] +  "; width: 20px"+ "; height: 15px" + "\"></li>" + "<li>" + grade + "</li></div>")
        });

        div.innerHTML = "<ul>" + labels.join("") + "</ul>";
        return div;
    };

    legend.addTo(myMap);
    