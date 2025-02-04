const PhillyMap = L.map('map').setView([39.99, -75.16], 12); // Initial view for Philadelphia


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(PhillyMap);

// Load GeoJSON data first
let link = "https://opendata.arcgis.com/datasets/8bc0786524a4486bb3cf0f9862ad0fbf_0.geojson"
d3.json(link).then(geojsonData => {
    
    // Load the CSV data
    d3.csv("https://khovkevin25.github.io/Project3/static/Data/Philadelphia_Food_Access.csv").then(csvData => {

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
                    let seniors05 = +data["LA Senior population - 0.5 mile radius"];
                    let income = +data["Median Family Income"];
                    let poverty = +data["Poverty Rate (%)"];
                
                    return {
                        color: "black",
                        weight: 1,
                        fillColor: getColor(seniors05, income, poverty), // Use CSV data
                        fillOpacity: 0.6
                    };
                 } else {
                    return {
                        color: "black",
                        weight: 1,
                        fillColor: "gray", // Default color
                        fillOpacity: 0.6
                    };
                }
            },
            onEachFeature: function (feature, layer) {
                let tractID = feature.properties["GEOID10"];
                let data = censusLookup[tractID];
                // Add content to pop-ups
                let popupContent = `<b>Census Tract:</b> ${tractID}<br>`;
                if (data) {
                    let lowAccessStatus = data["LA - 1 mile radius", "LA - 0.5 mile radius"] === "1" ? "Low Access" : "Not Low Access";

                    popupContent += `<b>Population:</b> ${data["Population"]}<br>`;
                    popupContent += `<b>Senior Population: </b> ${data["LA - Senior population, 0.5 mile radius"]}<br>`;
                    popupContent += `<b>Status:</b> ${lowAccessStatus}<br>`;
                    popupContent += `<b>Poverty Rate: </b> ${data["Poverty Rate (%)"]}<br>`;
                    popupContent += `<b>Median Income: </b> $${data["Median Family Income"]}<br>`;

                } else {
                    popupContent += "No data available";
                }

                layer.bindPopup(popupContent);
            }
        }).addTo(PhillyMap);

    }).catch(error => console.log("Error loading CSV:", error));
}).catch(error => console.log("Error loading GeoJSON:", error));

// Adjust the colors of the number of seniors there are in a tract based on median income or poverty rate
function getColor(seniors05, income, poverty) {
    return (seniors05 > 0 && income > 77156 || poverty <= 10) ? '#41ae76' : // Green
    ((seniors05 > 500 && seniors05 <= 1000) && (income <= 77156 && income > 52500) || (poverty > 10 && poverty < 15)) ? '#ffeda0' : // Yellow
    ((seniors05 > 1000 && seniors05 <= 1500) && (income <= 52500 && income > 36964) || (poverty >= 15 && poverty < 20)) ? '#fd8d3c' : // Orange
    (seniors05 > 1500 && income <= 36964 || poverty >= 20) ? '#e31a1c': // Red
              '#e0e0e0';
}

// Create markers for free meal locations
const FreeMealLayer = L.layerGroup();
fetch("FreeMealsClean.json")
  .then(pull => pull.json())
  .then(free => {
    free.forEach(meals => {
    const {Latitude, Longitude, Site, Category, Subcategory, Status} = meals
    const markerIcon = L.icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png`, 
        iconSize: [15, 26],  // Size of the marker
        iconAnchor: [12, 41], // Anchor point
        popupAnchor: [1, -34],  // Popup position
        shadowSize: [41, 41]  // Shadow size
        });

// Making the actual marker and then adding it to the overlay
    const marker = L.marker([Latitude, Longitude], { icon: markerIcon}).bindPopup(`<h3> ${Site} </h3> <br> Organization: ${Category} <br> Type of Free Meal: ${Subcategory} <br> Status: ${Status}<br>`);
        FreeMealLayer.addLayer(marker);
    });
  })

  const overlays = {
    "Free Meals in Philadelphia": FreeMealLayer
};

L.control.layers(null, overlays).addTo(PhillyMap);
FreeMealLayer.addTo(PhillyMap);

// Create a legend for the map
let legend = L.control({
    position: "bottomright"
});
legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");

    // Set legend styles
    div.style.background = "white";
    div.style.opacity = ".95";
    div.style.padding = "10px";
    div.style.borderRadius = "5px";
    div.style.alignItems = "center";

    // Add title
    div.innerHTML = "<h2 style='text-align: center; margin-bottom: 10px;'>Legend</h2>";

    // Define categories based on getColor scheme
    let categories = [
        {label: "Senior Population <500; Income >$77156 or <10% Poverty", color: "#41ae76"}, // Green
        {label: "Senior Population 500-1000; Income $52500-$77156 or 10-15% Poverty ", color: "#ffeda0"}, // Yellow
        {label: "Senior Population 1000-1500; Income $36964-$52500 or 15-20% Poverty", color: "#fd8d3c"}, // Orange
        {label: "Senior Population >1500; Income <$36394 or >20% Poverty", color: "#e31a1c"}, // Red
        {label: "No Data Available", color: "#e0e0e0"} // Gray
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

// Add the legend to the map
legend.addTo(PhillyMap);