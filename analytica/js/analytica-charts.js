var CustomHighChart = (function () {

    var fns = {};
    var loadGenderBreakDownTemplate = function (retunrOutput, options) {
        $.get('components/analytica/templates/genderBreakDown.html', function (template) {
            var rendered = Mustache.render(template, {
                id : options.element
            });
            retunrOutput({
                content:rendered
            })
        })
    };

    // [{name:"Male" , value: 12},{name:"Female", value:23}]
    var generateGenderBreakDownMetric = function (options) {
        loadGenderBreakDownTemplate(function (renderContent) {
            var chartEle = $('#' + options.element)
            console.log("newewe");
            console.log(chartEle);
            console.log("old")
            chartEle.append(renderContent.content);
            var metricId = options.element;

            var maleC = 0, femaleC = 0
            options.dataSeries.forEach(function(entry) {
                if (entry.name == "Male" || entry.name == "M"){
                    maleC = entry.value;
                }else if (entry.name == "Female" || entry.name == "F"){
                    femaleC = entry.value;
                }
            });
            var maleCount = new CountUp("male-count-"+metricId, 0, maleC, 0, 2.5, {});
            var femaleCount = new CountUp("female-count-"+metricId, 0, femaleC, 0, 2.5, {});
            maleCount.start();
            femaleCount.start();
            $('#gender-composition-' +metricId).highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie',
                },
                title: {
                    style : {
                        display : 'none'
                    }
                },
                credits: {
                    enabled: false
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '{point.percentage:.1f} %',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        },
                        showInLegend: true
                    }
                },
                series: [{
                    name: "Brands",
                    colorByPoint: true,
                    data: Charts.renderGenderBreakDownCharts(options.dataSeries)
                }]
            });
        }, options);
    } ;

    var loadDemographicTemplate = function (retunrOutput, options) {
        $.get('components/analytica/templates/demographic.html', function (template) {
            var rendered = Mustache.render(template, {
                id : options.element
            });
            retunrOutput({
                content:rendered
            })
        })
    };

    var generateDemographicMetric = function (options) {
        loadDemographicTemplate(function (renderContent) {
            var chartEle = $('#' + options.element)
            chartEle.append(renderContent.content);
            var metricId = options.element;

            var dataSet = Charts.convertDataForCompare(options.dataSeries)

            $('#demographic-chart-' + metricId).highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    categories:dataSet.categories
                },
                yAxis: {
                    title: {
                        text: options.yAxisTitle
                    },
                    min: 0
                },
                tooltip: {
                    headerFormat: '<b>' + options.toolTipHeader + '</b><br>',
                    pointFormat: '{point.x:%e. %b}: {point.y:.2f}'
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                credits: {
                    enabled: false
                },
                series: dataSet.data
            });
        }, options);
    } ;

    fns.splineCharts = function (options) {
        var chartEle = $('#' + options.element)
        console.log("newewe");
        console.log(chartEle);
        console.log("old")
        chartEle.highcharts({
            chart: {
                zoomType: 'x'
            },
            title: {
                text: ''
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: { // don't display the dummy year
                    hour: '%I %p',
                    month: '%e. %b',
                    year: '%b'
                },
                title: {
                    text: 'Date'
                }
            },
            yAxis: {
                title: {
                    text: '<b>' + options.yAxisTitle +'  ('+options.format+')' + '</b>'
                },
                min: 0
            },
            tooltip: {
                headerFormat: '<b>' + options.toolTipHeader + '</b><br>',
                pointFormat: 'Date/Time : {point.x:%e. %b. %Y | %I %P} <br>'+ options.toolTipHeader+'  :  {point.y:.2f} ' + options.format
            },
            plotOptions: {
                spline: {
                    marker: {
                        enabled: true
                    }
                }
            },
            exporting: {
                sourceWidth: 1600,
                sourceHeight: 500,
                chartOptions: {
                    subtitle: null
                }
            },
            series: options.dataSeries,
            credits: {
                enabled: false
            }
        });
        return chartEle;
    };

    fns.areaCharts = function (options) {
        var chartEle = $('#' + options.element)
        chartEle.highcharts({
            chart: {
                type: 'area',
                zoomType: 'x'
            },
            title: {
                text: ''
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: { // don't display the dummy year
                    month: '%e. %b',
                    year: '%b'
                },
                title: {
                    text: 'Date'
                }
            },
            yAxis: {
                title: {
                    text: options.yAxisTitle
                },
                min: 0
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },
            series: options.dataSeries
        });
        return chartEle;
    };

    fns.areasplineCharts = function (options) {
        var chartEle = $('#' + options.element)
        chartEle.highcharts({
            chart: {
                type: 'areaspline'
            },
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: { // don't display the dummy year
                    month: '%e. %b',
                    year: '%b'
                },
                title: {
                    text: 'Date'
                }
            },
            yAxis: {
                title: {
                    text: options.yAxisTitle
                },
                min: 0
            },
            tooltip: {
                headerFormat: '<b>' + options.toolTipHeader + '</b><br>',
                pointFormat: '{point.x:%e. %b}: {point.y:.2f}'
            },
            plotOptions: {
                areaspline: {
                    fillOpacity: 0.5
                }
            },
            series: options.dataSeries
        });
        return chartEle;
    };

    fns.columnCharts = function (options) {
        var chartEle = $('#' + options.element)
        chartEle.highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: { // don't display the dummy year
                    month: '%e. %b',
                    year: '%b'
                },
                title: {
                    text: 'Date'
                }
            },
            yAxis: {
                title: {
                    text: options.yAxisTitle
                },
                min: 0
            },
            tooltip: {
                headerFormat: '<b>' + options.toolTipHeader + '</b><br>',
                pointFormat: '{point.x:%e. %b}: {point.y:.2f}'
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: options.dataSeries
        });
        return chartEle
    };

    fns.pieCharts = function (options) {
        var chartEle = $('#' + options.element)
        chartEle.highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
            },
            title: {
                style : {
                    display : 'none'
                }
            },
            credits: {
                enabled: false
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '{point.percentage:.1f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    },
                    showInLegend: true
                }
            },
            series: [{
                name: "Brands",
                colorByPoint: true,
                data: options.dataSeries
            }]
        });
        return chartEle;
    };

    fns.customCharts = function (options) {
        switch (options.customType) {
            case "WiFi User Gender Break Down":
                generateGenderBreakDownMetric(options)
                break;
            case "WiFi User Demographics":
                generateDemographicMetric(options)
                break;
        }
    };

    return fns;
})();


/*
%a: Short weekday, like ‘Mon’.
%A: Long weekday, like ‘Monday’.
%d: Two digit day of the month, 01 to 31.
%e: Day of the month, 1 through 31.
%b: Short month, like ‘Jan’.
%B: Long month, like ‘January’.
%m: Two digit month number, 01 through 12.
%y: Two digits year, like 09 for 2009.
%Y: Four digits year, like 2009.
%H: Two digits hours in 24h format, 00 through 23.
%I: Two digits hours in 12h format, 00 through 11.
%l (Lower case L): Hours in 12h format, 1 through 11.
%M: Two digits minutes, 00 through 59.
%p: Upper case AM or PM.
%P: Lower case AM or PM.
%S: Two digits seconds, 00 through 59
*/
