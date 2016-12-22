# Analytica | Customize Dashboard Creation JS Plugin

- Following are the sample metricOpt, widgetOpt and metric data.For get a idea about how we create widgets.

        var metricOpt = {
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
            },
            "empty": false,
            "generatedMetricId": "58329a26b4ba7e6b5a80343c10",  // unique id
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

# VAMPAnalytics

- you can create new widget using CreateWidget by given properties.

        VAMPSAnalytics.CreateWidget({
            container: $('#main-content'),
            widget: widgetOpt,
            metric: {
                generatedMetricId: widgetOpt.generatedMetricId,
                name: metricOpt.name,
                chartOptions: metricOpt.chartOptions,
                data: data
            }
        });

- you can create new statuc widget using CreateStaticWidget by given properties.

        var staticOpt = {
            "widget": {
                "id": "5830348c9f3d86d6841ad2341",
                "position": 7,
                "type": 1,
                "class": "yellow"
            }
        };
        
        var staticMetricOpt = {
            "id": 10,
            "name": "Total Sessions",
            "type": 1,
            "chartOptions": {
            }
        }
    Initiate static widget on container 
    
    Set static widget metric value as data value
        
        VAMPSAnalytics.CreateStaticWidget({
            container: $("#static-metrics-content"),
            staticOpt: staticOpt.widget,
            metric: {
                name: staticMetricOpt.name,
                data: 10  // set the data value
            }
        });
        
    OR 
    
    Set static widget metric value by calling api endpoint that api end point return the value
        
        VAMPSAnalytics.CreateStaticWidget({
            container: $("#static-metrics-content"),
            staticOpt: staticOpt.widget,
            metric: {
                name: metricOpt.name,
                "ajax": {   // set api end point
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


#### Example Image
![alt text](https://github.com/vedicsoft/analytica/blob/master/analytica/img/sample.png "sample")
