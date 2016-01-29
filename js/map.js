
/** Generate a map using Leaflet. */
function runMap() {

    var map = L.map('map').setView([42.7278794815519, -84.47821140289307], 15);
    // Add map tile layer by referencing existing project at api.tiles.mapbox.com - other map tiles can be used.
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'devinhiggins.cigkvwbu100ziv1lz677b1jqi',
        accessToken: 'pk.eyJ1IjoiZGV2aW5oaWdnaW5zIiwiYSI6ImNpZ2t2d2QyMzAwNTN0ZW0zaHlxcHB5MWsifQ.ZXFzdj4xBkG6KhRjEHNWwg'
    }).addTo(map);

    // Load CSV data to populate map.
    getCsvData(map);

}

/** 
 * Use AJAX to get CSV data and parse.
 * @param {leaflet} - Leaflet map object.
 */
function getCsvData(map) {

    $.get("data/msudh_sites.csv", function(data) {
        
        var csvData = Papa.parse(data, {"header": true});
        var csvDataCoord = {}
        
        $.each(csvData["data"], function(index, value){

            if (value["LatLong"]) {

                if (value["LatLong"] in csvDataCoord) {
                    csvDataCoord[value["LatLong"]]["Entity"].push([value["Entity"], value["Link"]]);
                    csvDataCoord[value["LatLong"]]["FullData"].push(value);

                }else{
                    
                    csvDataCoord[value["LatLong"]] = new Array();
                    csvDataCoord[value["LatLong"]]["Entity"] = [[value["Entity"], value["Link"]]];
                    csvDataCoord[value["LatLong"]]["FullData"] = [value];
                    csvDataCoord[value["LatLong"]]["Location"] = value["Location"];

                    var coordinates = value["LatLong"].split(",");
                    var coordinates_array = [coordinates[0].trim(), coordinates[1].trim()];
                    csvDataCoord[value["LatLong"]]["LatLong"] = coordinates_array;

                }
            }
        });
        var markerLayer = Array();
        var displayList = Array();
        $.each(csvDataCoord, function(key, value) {
            var marker = L.marker(value["LatLong"]).addTo(map);
            var popUpHtml = "<h4 class='location-heading'>" + value["Location"] + "</h4>";
            $.each(value["Entity"], function(index, entity){
                popUpHtml += "<p><a target='_blank' href='"+entity[1]+"'>"+entity[0] + "</a></p>"
                });
            marker.bindPopup(popUpHtml);
            marker.on('click', function (e) {
                this.openPopup();
            });
        });
    });
}


