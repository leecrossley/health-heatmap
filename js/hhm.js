var hhm = (function () {
    "use strict";
    var hhm = {},
        map, layer, longlat, code;
    
    var getMap = function () {
        return map || new google.maps.Map(document.getElementById("heatmap"));
    };
    
    var getLayer = function () {
        return layer || new google.maps.visualization.HeatmapLayer({
            map: map,
            radius: 25
        });
    };
    
    var getLongLat = lambda.first(function (item) {
        return item.code === code;
    });
    
    var getValidData = lambda.select(function (item) {
        return item.GHO === "DEVICES01" && item.Numeric && item.COUNTRY;
    });
    
    var getMapData = lambda.map(function (item) {
        code = item.COUNTRY;
        var country = getLongLat(longlat);
        return { 
            location: new google.maps.LatLng(country.lat, country.long),
            weight: parseFloat(item.Numeric, 10)
        };
    });
    
    var getData = function () {
        $.getJSON("/data/countrylonglat.json", function(data) {
            longlat = data;
            $.getJSON("/data/healthinfrastructure.json", function(data) {
                var validData = getValidData(data);
                var heatmapData = getMapData(validData);
                layer.setData(heatmapData);
            });
        });
    };
    
    var initMap = function () {
        map = getMap();
        map.setOptions({
            zoom: 2,
            center: new google.maps.LatLng(20, 0),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: []
        });
        layer = getLayer();
        getData();
    };
    
    hhm.init = function (elementId) {
        if (!google.maps.visualization.HeatmapLayer) {
            throw "Google Heatmaps failed to load";
        }
        initMap();
    };
    
    return hhm;
})();

$(window).load(function(){
    hhm.init("heatmap");
});