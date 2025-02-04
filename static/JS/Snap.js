const PhillyMap = L.map('map').setView([39.99, -75.16], 12); // Example initial view for San Francisco


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(PhillyMap);

// Load GeoJSON data first
let link = "https://opendata.arcgis.com/datasets/8bc0786524a4486bb3cf0f9862ad0fbf_0.geojson"
d3.json(link).then(geojsonData => {
    
    // Load the CSV data - Note: I had to run a server in the project folder in order to view the CSV data
    // In a terminal window run: python -m http.server 8000
    d3.csv("/data/Philadelphia_Food_Access.csv").then(csvData => {

        // Create a lookup for faster access
        let censusLookup = {};
        csvData.forEach(row => {
            censusLookup[row["Census Tract"]] = row;

        });

        // Add the GeoJSON layer with data matching
        L.geoJson(geojsonData, {
            style: function (feature) {
                let tractID = feature.properties["GEOID10"];
                let data = censusLookup[tractID];

                if (data) {
                    let snap = +data["Snap Percentage"];
                
                    return {
                        color: "black",
                        weight: 1,
                        fillColor: getColor(snap), // Use CSV data
                        fillOpacity: 0.4
                    };
                 } else {
                    return {
                        color: "black",
                        weight: 1,
                        fillColor: "gray", // Default color
                        fillOpacity: 0.4
                    };
                }
            },
            onEachFeature: function (feature, layer) {
                let tractID = feature.properties["GEOID10"];
                let data = censusLookup[tractID];
                // Add content to pop-ups
                let popupContent = `<b>Census Tract:</b> ${tractID}<br>`;
                if (data) {
                    popupContent += `<b>Snap Percentage:</b> ${data["Snap Percentage"]}%<br>`;
                    popupContent += `<b>Median Income: </b> ${data["Median Family Income"]}<br>`;
                } else {
                    popupContent += "No data available";
                }

                layer.bindPopup(popupContent);
            }
        }).addTo(PhillyMap);

    }).catch(error => console.log("Error loading CSV:", error));
}).catch(error => console.log("Error loading GeoJSON:", error));


//https://leafletjs.com/examples/choropleth/ this is where the color portioncomes from
//https://colorbrewer2.org/#type=sequential&scheme=Reds&n=8
function getColor(snap) {
    return snap > 60 ? '#d73027' :
    snap > 40  ? '#fdae61' :
    snap > 20   ? '#d9ef8b' :
    snap >= 0 ? '#1a9850':
              '#e0e0e0';

}

//leaflet user guide was referenced to create the legend 
let legend = L.control({
    position: "bottomright"
});

// Then add all the details for the legend
legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");

    // Set legend styles
    div.style.background = "white";
    div.style.opacity = ".75";
    div.style.padding = "10px";
    div.style.borderRadius = "5px";
    div.style.alignItems = "left";

    // Add title
    div.innerHTML = "<h2 style='text-align: center; margin-bottom: 10px;'>Legend</h2>";

    // Define categories based on getColor scheme
    let categories = [
        {label: "61% or more receive SNAP benefits", color: "#d73027"},
        {label: "41-60% receive SNAP benefits", color: "#fdae61"},
        {label: "21-40% receive SNAP benefits ", color: "#d9ef8b"},
        {label: "0-20% receive SNAP benefits", color: "#1a9850"},
        {label: "No data reported", color: "#e0e0e0"}
    ];


    // Loop through categories to create legend items
    categories.forEach(item => {
        div.innerHTML += `<div style="display: flex; align-items: center; gap: 5px; margin-bottom: 10px;">
            <i style="background: ${item.color}; width: 18px; height: 18px; display: inline-block;"></i>
            ${item.label}
        </div>`;
    });

 return div;
};
// Finally, add the legend to the map.
legend.addTo(PhillyMap);

const MarketLayer = L.layerGroup();

//Gathering data for markers color based on if it accepts SNAP benefits or not 
fetch("FarmersMarketClean.json")
  .then(response => response.json())
  .then(locations => {
    locations.forEach(location => {
      const {Latitude, Longitude, Accepts_SNAP, Name} = location
      let markerColor;
      if(Accepts_SNAP === 'Yes'){
        markerColor = 'green'
      } else if(Accepts_SNAP === 'No') {
         markerColor = 'red'
      } else { 
         markerColor = 'yellow'
      }

      //Thank you to this github user for having marker links available: https://github.com/pointhi/leaflet-color-markers?tab=readme-ov-file - these pull the correct color marker based on the above. 
      const markerIcon = L.icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${markerColor}.png`,
        iconSize: [15, 26],  // Size of the marker
        iconAnchor: [12, 41], // Anchor point
        popupAnchor: [1, -34],  // Popup position
        shadowSize: [41, 41]  // Shadow size (optional)
      });

      //Making the actual marker and adding it to the overlay 
      const marker = L.marker([Latitude, Longitude], { icon: markerIcon}).bindPopup(`<h3>${Name}; </h3>Does this Farmer's Market accept SNAP benefits?: ${Accepts_SNAP}</br>`);
          MarketLayer.addLayer(marker);
    
    });
  })
  .catch(error => console.error('Error loading the JSON:', error));

const FreeMealLayer = L.layerGroup();


//adding markers for free meals that are available - all the markers are the same color here. 
fetch("FreeMealsClean.json")
  .then(pull => pull.json())
  .then(free => {
    free.forEach(meals => {
    const {Latitude, Longitude, Site,Subcategory,Status} = meals //defining meals so we can just pull the columns without saying meals.X
    const markerIcon = L.icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png`, //added the link here too so I could match the markers size 
        iconSize: [15, 26],  // Size of the marker
        iconAnchor: [12, 41], // Anchor point
        popupAnchor: [1, -34],  // Popup position
        shadowSize: [41, 41]  // Shadow size (optional)
        });

//making the actual marker and then adding it to the overlay
    const marker = L.marker([Latitude, Longitude], { icon: markerIcon}).bindPopup(`<h3>${Site} </h3> Type of free meal: ${Subcategory}<br> Status: ${Status}<br>`);
        FreeMealLayer.addLayer(marker);

    });
  })

  const overlays = {
    "Farmer's Markets in Philadelphia": MarketLayer,
    "Free Meals in Philadelphia": FreeMealLayer
};

L.control.layers(null, overlays).addTo(PhillyMap);

//Adding the Farmer's Markets layer to the map when you first open it. 
MarketLayer.addTo(PhillyMap);
