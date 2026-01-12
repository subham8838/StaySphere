mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    style: 'mapbox://styles/mapbox/streets-v12',//styling url // streets-v12 we can also change for dark-v11
    zoom: 8 // starting zoom
});

const popup = new mapboxgl.Popup({ offset: 25 })
    .setHTML(`<h4>${listing.location}</h3><p>Exact Location will be provided after booking </p>`);

// Create a default Marker and add it to the map. for changing like color adding text in marker
    const marker = new mapboxgl.Marker({color:'red'})
        .setLngLat(listing.geometry.coordinates)//listing.geometry.coordinates
        .setPopup(popup)
        .addTo(map);
