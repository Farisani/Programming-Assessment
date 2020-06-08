module.exports = function sortJsonDataByDistance(latitude , longitude) {

  const geoData = require('./../domain/geo.json');
  var results = [];
  
  for(var i = 0;i < geoData.length; i++) {
    coordinates = geoData[i].geo.split(',');
    results.push({
      "ipv4": geoData[i].ipv4,
      "geoData": geoData[i],
      "distance": getDistanceFromLatLon(latitude, longitude, coordinates[0], coordinates[1])
    });
  }

  results.sort(function(a, b) {
    if (a.distance > b.distance) {
      return 1;
    }

    if (b.distance > a.distance) {
      return -1
    }

    return 0;
  });

  geoResults = [];
  
  for (var i = 0; i < results.length; i++) {
    geoResults.push(results[i].geoData);
  }

  const data = require('./../domain/data.json');
  dataResults = [];

  for (var j = 0; j < geoResults.length; j++) {
    const ipAddress = geoResults[j].ipv4;

    for (var k = 0; k < data.length; k++) {
      if (ipAddress === getIpAddress(data[k].meta)) {
        dataResults.push(data[k]);
      }
    }
    
  }

  return geoResults;
}

function getIpAddress(metaData) {
  return metaData.match("\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b");
}

function getDistanceFromLatLon(latitude1, longitude1, latitude2, longitude2) {
  var earthRadius = 6371;  //Earth radius in km
  var distanceLatitude = toRadius(latitude2-latitude1); 
  var distanceLongitude = toRadius(longitude2-longitude1); 

  var distanceCalculation = Math.sin(distanceLatitude/2) * Math.sin(distanceLatitude/2) + 
                            Math.cos(toRadius(latitude1)) * Math.cos(toRadius(latitude2)) * 
                            Math.sin(distanceLongitude/2) * Math.sin(distanceLongitude/2);

  var distanceCalculation = 2 * Math.atan2(Math.sqrt(distanceCalculation), Math.sqrt(1-distanceCalculation)); 
  var distance = earthRadius * distanceCalculation;

  return distance;
}
  
  function toRadius(value) {
    return value * (Math.PI/180)
  }