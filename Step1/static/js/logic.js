// background map.
console.log("Step 1");

var graymap = L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  }
);

// map object with options
var map = L.map("map", {
  center: [
    40.7, -94.5
  ],
  zoom: 3
});

// add 'graymap'
graymap.addTo(map);

// all earthquakes past 7 days
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson").then(function(data) {

  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  //the color of the marker (circles on the map)
  function getColor(depth) {
    switch (true) {
    case depth > 90:
      // red
      return "#F51106";
      // orange
    case depth > 70:
      return "#F9A003"; 
      // yellow
    case depth > 50:
      return "#F5F903";
      //grenn 
    case depth > 30:
      return "#0BF903";
      // blue
    case depth > 10:
      return "#0382F9";
    default:
        // purple
      return "#AB42FD";
    }
  }

  // Checking if magnitude is not 0
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
  }

  L.geoJson(data, {
    
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    
    style: styleInfo,
    // marker display magnitude and location
    onEachFeature: function(feature, layer) {
      layer.bindPopup(
        "Magnitude: "
          + feature.properties.mag
          + "<br>Depth: "
          + feature.geometry.coordinates[2]
          + "<br>Location: "
          + feature.properties.place
      );
    }
  }).addTo(map);

  var legend = L.control({
    position: "bottomleft"
  });

  // Legend details
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    // legend discription
    var grades = [-10, 10, 30, 50, 70, 90];
    var colors = [
      "#AB42FD",
      "#0382F9",
      "#0BF903",
      "#F5F903",
      "#F9A003",
      "#F51106"
    ];

    // Looping through intervals
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
      + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  // legend to the map.
  legend.addTo(map);
});