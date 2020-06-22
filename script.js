// Selectors

let body = document.querySelector('body')

// Making a map and tiles
const mymap = L.map('issMap').setView([0, 0], 1)
const attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'

const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const tiles = L.tileLayer(tileUrl, { attribution })
tiles.addTo(mymap)

// Making a marker with a custom icon
const issIcon = L.icon({
    iconUrl: 'img/iss.png',
    iconSize: [50, 32],
    iconAnchor: [25, 16]
})

const marker = L.marker([0, 0], { icon: issIcon }).addTo(mymap)

const api_url = 'https://api.wheretheiss.at/v1/satellites/25544'

let firstTime = true

async function getISS() {
    const response = await fetch(api_url)
    const data = await response.json()
    const { latitude, longitude } = data

    marker.setLatLng([latitude, longitude])
    if (firstTime) {
        mymap.setView([latitude, longitude], 2)
        firstTime = false
    }
    const lat = document.querySelector('[data-lat]')
    const lon = document.querySelector('[data-lon]')
    lat.textContent = latitude.toFixed(2)
    lon.textContent = longitude.toFixed(2)
}

getISS()
    .then(response => {
        const msg = document.createElement('p')
        body.appendChild(msg)
        msg.classList = 'msg'
        msg.textContent = 'Success! This is the live location of the ISS!'
        msg.style.color = 'green'
    })
    .catch(error => {
        const msg = document.createElement('p')
        body.appendChild(msg)
        msg.classList = 'msg'
        msg.textContent = 'Oops, something went wrong...'
        msg.style.color = 'red'
    })

setInterval(getISS, 1000);