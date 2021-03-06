var metricOpt = {
    "id": 2,
    "name": "Total Daily Uploads",
    "type": 2,
    "category": "",
    "chartOptions": {
        "type": "spline",
        "format": "GB",
        "toolTipHeader": "Uploads",
        "yAxisTitle": "Daily Uploads"
    }
};

var widgetOpt = {
    "widget": {
        "id": "58329a26b4ba7e6b5a80343c",
        "position": 8,
        "type": 2,
        "metricid": 7
    },
    "empty": false,
    "generatedMetricId": "58329a26b4ba7e6b5a80343c10",
    "compClass": "db-range-metrics",
    "cats": [{
        "cat_id": 1,
        "cat_name": "Usage Analytics"
    }, {
        "cat_id": 2,
        "cat_name": "Network Analytics"
    }, {
        "cat_id": 3,
        "cat_name": "User Analytics"
    }]
};

var data = [{
    "name": "2016-11-09 12:00:00",
    "value": 0.0002
}, {
    "name": "2016-11-09 13:00:00",
    "value": 0
}, {
    "name": "2016-11-10 16:00:00",
    "value": 0
}, {
    "name": "2016-11-12 11:00:00",
    "value": 0.0003
}, {
    "name": "2016-11-12 12:00:00",
    "value": 0.0523
}, {
    "name": "2016-11-13 09:00:00",
    "value": 0.0002
}, {
    "name": "2016-11-13 10:00:00",
    "value": 0.0002
}, {
    "name": "2016-11-14 10:00:00",
    "value": 0
}, {
    "name": "2016-11-14 11:00:00",
    "value": 0.0011
}, {
    "name": "2016-11-14 12:00:00",
    "value": 0.0979
}, {
    "name": "2016-11-14 13:00:00",
    "value": 0.0014
}, {
    "name": "2016-11-15 07:00:00",
    "value": 0.0002
}, {
    "name": "2016-11-15 08:00:00",
    "value": 0.0047
}, {
    "name": "2016-11-15 09:00:00",
    "value": 0.008
}, {
    "name": "2016-11-15 10:00:00",
    "value": 0.0008
}];


VAMPSAnalytics.CreateWidget({
    container: $('#main-content'),
    widget: widgetOpt,
    metric: {
        generatedMetricId: widgetOpt.generatedMetricId, // TODO : This id should be generate from the libary
        name: metricOpt.name,
        chartOptions: metricOpt.chartOptions,
        data: data
    },
    onLoad : function (widget) {
        widget.chartEle.highcharts().reflow();
    }
});


// How to apply static widget


var staticOpt = {
	"widget": {
		"position": 7,
		"class": "yellow"
	}
};

var staticMetricOpt = {
	"name": "Total Sessions",
};

var staticOpt2 = {
    "widget": {
        "position": 7,
        "class": "red"
    }
};

var staticMetricOpt2 = {
    "name": "Total Download",
};

VAMPSAnalytics.CreateStaticWidget({
    container: $("#static-metrics-content"),
    staticOpt: staticOpt.widget,
    metric: {
        name: staticMetricOpt.name,
        data: 10
    }
});

VAMPSAnalytics.CreateStaticWidget({
    container: $("#static-metrics-content"),
    staticOpt: staticOpt.widget,
    metric: {
        name: metricOpt.name,
        "ajax": {
            "url": "project/api/endpoint/url",
            "type": "GET",
            "error": function (e) {
            },
            "dataSrc": function (d) {
                return d
            }
        }
    }
});


VAMPSAnalytics.CreateStaticWidget({
    container: $("#static-metrics-content"),
    staticOpt: staticOpt2.widget,
    metric: {
        name: staticMetricOpt2.name,
        data: "20 GB"
    }
});













