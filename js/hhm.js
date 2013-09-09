var hhm = (function () {
    "use strict";
    var hhm = {}, chart, year;
    
    var getDataForYear = lambda.partition(function (item) {
        return item.year === year;
    });
    
    var getMapData = lambda.map(function (item) {
        return [item.country, parseFloat(item.value)];
    });
    
    var getData = function () {
        $.getJSON("/data/recipient-commitment.json", function(data) {
            var dataForYear = getDataForYear(data)[0];
            var mapData = getMapData(dataForYear);
            mapData.unshift(["Country", "Commitment"]);
            chart.draw(google.visualization.arrayToDataTable(mapData));
        });
    };
    
    var initMap = function () {
        chart = new google.visualization.GeoChart(document.getElementById("heatmap"));
        year = "2000";
        getData();
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