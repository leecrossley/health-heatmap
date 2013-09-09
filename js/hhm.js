var hhm = (function () {
    "use strict";
    var hhm = {};
    
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
        var chart = new google.visualization.GeoChart(document.getElementById("heatmap"));
        
        var data = google.visualization.arrayToDataTable([
          ['Country', 'Popularity'],
          ['Germany', 200],
          ['United States', 300],
          ['Brazil', 400],
          ['Canada', 500],
          ['AF', 1000],
          ['RU', 700]
        ]);
        
        chart.draw(data);
    };
    
    hhm.init = function (elementId) {
        if (!google.visualization) {
            throw "Google jsapi failed to load";
        }
        initMap();
    };
    
    return hhm;
})();

$(window).load(function(){
    hhm.init("heatmap");
});