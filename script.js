import {
    API_KEY,
    ACCESS_TOKEN
} from "./secret.js";
// import ACCESS_TOKEN from "./secret.js";

const input = document.querySelector('input');
const btn = document.querySelector('button');
const resultIP = document.querySelector('.result-ip');
const resultLocation = document.querySelector('.result-location');
const resultTimezone = document.querySelector('.result-timezone');
const resultISP = document.querySelector('.result-isp');
const apiKey = API_KEY;
// const apiKey = 'at_YgsRaC0dg8vDzy3vTPe0dX6fUUDEs';
const accessToken = ACCESS_TOKEN;
// const accessToken = 'pk.eyJ1IjoibXJpdmFuIiwiYSI6ImNra3YzeDRyeTE2eXEydm9panQzNWFuamQifQ.OiklG6yxFivBONPOvOPwbw';
let map;
let marker;




// when load windows
window.addEventListener('load', async function () {
    // fetch API
    return await fetch(`https://geo.ipify.org/api/v1?apiKey=${apiKey}`)
        .then(response => response.json())
        .then(displayResults);
});

// when user click search button
btn.addEventListener('click', async function () {
    const result = await getIP(input.value);
    // after user click search button, clear the value
    input.value = '';
});

function getIP(keyword) {
    return fetch(`https://geo.ipify.org/api/v1?apiKey=${apiKey}&ipAddress=${keyword}&domain=${keyword}`)
        .then(response => response.json())
        .then(displayResults);
}

function displayResults(response) {
    try {
        resultIP.innerHTML = response.ip;
        resultISP.innerHTML = response.isp;
        resultTimezone.innerHTML = `UTC${response.location.timezone}`;
        resultLocation.innerHTML = `${response.location.city}, ${response.location.region} ${response.location.postalCode}`;
        // refresh leaflet map
        if (map != undefined) {
            map.remove();
        }
        map = L.map('map').setView([response.location.lat, response.location.lng], 13);
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: accessToken
        }).addTo(map);
        // set market to map
        marker = L.marker([response.location.lat, response.location.lng]).addTo(map);
    } catch (error) {
        console.error(error);
    }
}