let map;
let markers = []; // 마커를 저장할 배열

function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const defaultLocation = {lat: lat, lng: lng};
            const defaultZoom = 17;
            map = new google.maps.Map(document.getElementById('map'), {
                zoom: defaultZoom,
                center: defaultLocation
            });

            // 지도에 이벤트 리스너 추가
            map.addListener('click', hideResultsPanel);
            map.addListener('drag', hideResultsPanel);
        });
    } else {
        alert('Geolocation is not supported by this browser.');
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

    // 기존 마커 제거
    clearMarkers();

    service.textSearch(request, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            map.setCenter(results[0].geometry.location);
            showResultsPanel(results);
            for (let i = 0; i < results.length; i++) {
                createMarker(results[i]);
            }
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
    markers.push(marker); // 마커 배열에 추가
}

function handleProfileClick() {
    alert('Profile clicked!');
}

function showResultsPanel(results) {
    const resultsTitle = document.getElementById('results-title');
    resultsTitle.textContent = '검색 결과';
    const resultsList = document.getElementById('results-list');
    resultsList.innerHTML = ''; // 기존 결과 초기화

    results.forEach(result => {
        const li = document.createElement('li');
        li.textContent = result.name;
        resultsList.appendChild(li);
    });
}

function hideResultsPanel() {
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
    } else {
        logo.src = '/images/pasture_logo_dark.png';
        darkModeButton.textContent = '다크 모드';
    }
}
