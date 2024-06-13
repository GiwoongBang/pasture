import {lightModeStyles, darkModeStyles} from './mapMode.js';

let map;
let markers = [];
let searchPerformed = false;

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

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const defaultLocation = {lat: lat, lng: lng};
            mapOptions.center = defaultLocation;
            map = new google.maps.Map(document.getElementById('map'), mapOptions);

            map.addListener('click', hideResultsPanel);
            map.addListener('drag', hideResultsPanel);
        });
    } else {
        alert('Geolocation is not supported by this browser.');
        map = new google.maps.Map(document.getElementById('map'), mapOptions);
    }
}

function search() {
    const searchTerm = document.getElementById('search-input').value;
    if (!searchTerm) {
        alert("검색어를 입력해주세요.");
        return;
    }

    const service = new google.maps.places.PlacesService(map);
    const request = {
        query: searchTerm,
        fields: ['name', 'geometry']
    };

    clearMarkers();

    service.textSearch(request, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            map.setCenter(results[0].geometry.location);
            showResultsPanel(results);
            for (let i = 0; i < results.length; i++) {
                createMarker(results[i]);
            }
            searchPerformed = true;
        }
    });
}

function clearMarkers() {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}

function handleKeyDown(event) {
    if (event.key === 'Enter') {
        search();
    }
}

function createMarker(place) {
    const marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        title: place.name
    });
    markers.push(marker);
}

function handleProfileClick() {
    alert('Profile clicked!');
}

function showResultsPanel(results) {
    const resultsTitle = document.getElementById('results-title');
    resultsTitle.textContent = '검색 결과';
    const resultsList = document.getElementById('results-list');
    resultsList.innerHTML = '';

    results.forEach(result => {
        const li = document.createElement('li');
        li.textContent = result.name;
        resultsList.appendChild(li);
    });
}

function updateResultsPanel() {
    if (!searchPerformed) {
        showPopularPlaces(); // 검색 전이면 인기 장소를 표시
    }
}

function showPopularPlaces() {
    const resultsTitle = document.getElementById('results-title');
    resultsTitle.textContent = '인기 장소';
    const resultsList = document.getElementById('results-list');
    resultsList.innerHTML = `
        <li>인기 장소 1</li>
        <li>인기 장소 2</li>
        <li>인기 장소 3</li>
        <li>인기 장소 4</li>
        <li>인기 장소 5</li>
    `;
}

function toggleDarkMode() {
    const body = document.body;
    const logo = document.querySelector('.logo img');
    const darkModeButton = document.getElementById('toggle-dark-mode');

    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        logo.src = '/images/pasture_logo_light.png';
        darkModeButton.textContent = '라이트 모드';
        map.setOptions({styles: darkModeStyles});
    } else {
        logo.src = '/images/pasture_logo_dark.png';
        darkModeButton.textContent = '다크 모드';
        map.setOptions({styles: lightModeStyles});
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('search-button').addEventListener('click', search);
    document.getElementById('search-input').addEventListener('keydown', handleKeyDown);
    document.getElementById('contact-link').addEventListener('click', () => {
        window.open('https://www.naver.com', '_blank');
    });
    window.addEventListener('beforeunload', () => {searchPerformed = false;});
    // document.getElementById('toggle-dark-mode').addEventListener('click', toggleDarkMode);

    initMap();
    showPopularPlaces();
});
