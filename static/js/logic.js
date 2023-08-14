// Fetch earthquake data from the USGS API
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson')
  .then(response => response.json())
  .then(data => {
    // Log the data to the console to inspect its structure
    console.log(data);

    // Create a Leaflet map with a base map layer
    const map = L.map('map', {
      center: [0, 0], // Center the map at [0, 0]
      zoom: 2 // Zoom level
    });

    // Add a base map layer from OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Function to determine marker color based on magnitude
    function getColor(magnitude) {
      // Define a gradient of colors
      const colors = [
        '#f7f7f7', // Lightest color
        '#ffcc66',
        '#ff9933',
        '#ff6600',
        '#ff3300',
        '#ff0000'  // Brightest color
      ];

      // Determine the index based on the magnitude and the length of the colors array
      const index = Math.min(Math.floor(magnitude), colors.length - 1);

      return colors[index];
    }

    // Iterate through earthquake data and create markers
    data.features.forEach(feature => {
      const { geometry, properties } = feature;
      const marker = L.circleMarker([geometry.coordinates[1], geometry.coordinates[0]], {
        radius: properties.mag * 4,
        fillColor: getColor(properties.mag),
        fillOpacity: 0.7,
        color: '#000',
        weight: 1
      }).addTo(map);

      // Add a popup to the marker
      marker.bindPopup(
        `<b>Location:</b> ${properties.place}<br>` +
        `<b>Magnitude:</b> ${properties.mag}<br>` +
        `<b>Depth:</b> ${properties.depth}`
      );
    });

    // Create a legend
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = function(map) {
      const div = L.DomUtil.create('div', 'legend');
      div.innerHTML = `
        <!-- Legend content here -->
      `;
      return div;
    };
    legend.addTo(map);
  })
  .catch(error => console.error('Error fetching earthquake data:', error));
