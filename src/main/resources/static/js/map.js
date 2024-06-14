import {lightModeStyles, darkModeStyles} from './mapMode.js';

let map;
let marker;

const popularPlaces = [
    '투썸 플레이스 서울대입구역점', '디뮤지엄 성수', '스타벅스 서울대입구역점', '따뜻한 우동 한그릇', '네형님', '무근본', '무신사 테라스 성수', '디뮤지엄 성수'
];

async function loadGoogleMapsApi() {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapKey}&libraries=places&callback=initMap`;
        script.defer = true;
        window.initMap = () => {
            resolve();
        };
        document.head.appendChild(script);
    });
}

async function initMap() {
    await loadGoogleMapsApi();

    const mapOptions = {
        zoom: 17,
        center: {lat: 0, lng: 0},
        styles: lightModeStyles
    };

    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                map.setCenter(pos);
                marker = new google.maps.Marker({
                    map: map,
                    position: pos,
                    title: "현재 위치"
                });
            },
            () => {
                handleLocationError(true, map.getCenter());
            }
        );
    } else {
        handleLocationError(false, map.getCenter());
    }

    // Autocomplete 기능 추가
    const input = document.getElementById('autocomplete');
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
            alert("No details available for input: '" + place.name + "'");
            return;
        }

        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }

        if (marker) {
            marker.setMap(null);
        }

        marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            title: place.name
        });


        input.addEventListener('click', () => {
            input.value = ''; // 검색창을 클릭하면 초기화
        });
    });


    document.getElementById('current-location-link').addEventListener('click', moveToCurrentLocation);
    displayPopularPlaces();
}

function moveToCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                map.setCenter(pos);
                if (marker) {
                    marker.setMap(null);
                }
                marker = new google.maps.Marker({
                    map: map,
                    position: pos,
                    title: "현재 위치"
                });
            },
            () => {
                handleLocationError(true, map.getCenter());
            }
        );
    } else {
        handleLocationError(false, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, pos) {
    alert(browserHasGeolocation ? "Error: The Geolocation service failed." : "Error: Your browser doesn't support geolocation.");
}

function displayPopularPlaces() {
    const popularPlacesContainer = document.querySelector('.popular-places');
    popularPlacesContainer.innerHTML = '';
    for (let i = 0; i < popularPlaces.length; i += 4) {
        const row = document.createElement('div');
        row.classList.add('popular-row');
        for (let j = i; j < i + 4 && j < popularPlaces.length; j++) {
            const placeLink = document.createElement('a');
            placeLink.href = '#';
            const placeText = document.createElement('span');
            placeText.textContent = popularPlaces[j];
            placeLink.appendChild(placeText);
            placeLink.innerHTML += " ↘";
            row.appendChild(placeLink);
        }
        popularPlacesContainer.appendChild(row);
    }
}

function handleProfileClick() {
    alert('Profile clicked!');
}

document.addEventListener('DOMContentLoaded', () => {
    initMap();
});
