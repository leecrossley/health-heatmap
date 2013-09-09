var hhm = (function () {
    "use strict";
    var hhm = {},
        map, layer;
    
    var getMap = function () {
        return map || new google.maps.Map(document.getElementById("heatmap"));
    };
    
    var getLayer = function () {
        return layer || new google.maps.visualization.HeatmapLayer({
            map: map,
            radius: 25
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
        //layer.setData(/* data */);
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