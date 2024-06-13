export const lightModeStyles = [
    {
        featureType: 'all',
        elementType: 'labels',
        stylers: [{visibility: 'off'}]
    },
    {
        featureType: 'administrative',
        elementType: 'labels',
        stylers: [{visibility: 'on'}]
    },
    {
        featureType: 'transit.station',
        elementType: 'labels',
        stylers: [{visibility: 'on'}]
    }
];

export const darkModeStyles = [
    {
        featureType: 'all',
        elementType: 'labels',
        stylers: [{visibility: 'off'}]
    },
    {
        featureType: 'administrative',
        elementType: 'labels',
        stylers: [{visibility: 'on'}]
    },
    {
        featureType: 'transit.station',
        elementType: 'labels',
        stylers: [{visibility: 'on'}]
    },
    {
        elementType: 'geometry',
        stylers: [{color: '#212121'}]
    },
    {
        elementType: 'labels.text.fill',
        stylers: [{color: '#757575'}]
    },
    {
        elementType: 'labels.text.stroke',
        stylers: [{color: '#212121'}]
    },
    {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{color: '#2c2c2c'}]
    },
    {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{color: '#000000'}]
    }
];
