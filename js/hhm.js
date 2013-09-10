var hhm = (function () {
    "use strict";
    var hhm = {}, chart, year, current = 0, dataset = [], isPlaying;
    
    var getDataForYear = lambda.partition(function (item) {
        return item.year === year;
    });
    
    var getMapData = lambda.map(function (item) {
        return [item.country, parseFloat(item.value)];
    });
    
    var nextYear = function () {
        if (!isPlaying) {
            return;
        }
        chart.draw(dataset[current]);
        $(".year").text(current + 2000);
        $(".progress-bar").width(current * 10 + "%");
        if (current === 10) {
            current = 0;
        } else {
            current = current + 1;
        }
        if (isPlaying) {
            setTimeout(nextYear, 1500);
        }
    };
    
    var configurePlay = function () {
        $(".play").on("click", function() {
           if (!isPlaying) {
               isPlaying = true;
               nextYear();
               $(this).removeClass("btn-success");
               $(this).addClass("btn-warning");
               $(this).text("Stop");
           } else {
               isPlaying = false;
               $(this).removeClass("btn-warning");
               $(this).addClass("btn-success");
               $(this).text("Play");
           }
        });
    };
    
    var preloadData = function () {
        // "Preload" data to fix horrible Google bug
        for (var i = dataset.length - 1; i >= 0; i--) {
            chart.draw(dataset[i]);
        }
    };
    
    var filename = function () {
        var country = $.QueryString["country"],
            disbursement = $.QueryString["disbursement"],
            name;
        if (country && country === "donor") {
            name = "Donor";
        } else {
            name = "Recipient";
        }
        if (disbursement) {
            name = name + "-disbursement";
        } else {
            name = name + "-commitment";
        }
        $(".dropdown-current .current").text(name.replace("-", " countries - "));
        $(".dropdown-current").show();
        return name.toLowerCase();
    };
    
    var getData = function () {
        $.getJSON("/data/" + filename() + ".json", function(data) {
            for (var i = 2000; i <= 2010; i++) {
                year = i.toString();
                var partitioned = getDataForYear(data);
                var mapData = getMapData(partitioned[0]);
                data = partitioned[1];
                mapData.unshift(["Country", "Amount"]);
                dataset.push(google.visualization.arrayToDataTable(mapData));
            }
            preloadData();
            configurePlay();
        });
    };
    
    var initMap = function () {
        chart = new google.visualization.GeoChart(document.getElementById("heatmap"));
        getData();
    };
    
    hhm.init = function () {
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

(function($) {
    $.QueryString = (function(a) {
        if (a == "") return {};
        var b = {};
        for (var i = 0; i < a.length; ++i)
        {
            var p=a[i].split('=');
            if (p.length != 2) continue;
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    })(window.location.search.substr(1).split('&'))
})(jQuery);