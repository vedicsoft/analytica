var VAMPSAnalytics = (function () {

    var fns = {};

    var Templates = {};

    Templates.staticMetricTemplate =
        '<a class="dashboard-stat dashboard-stat-v2 {{widget.class}} col-lg-4" href="#">'+
        '<div class="visual">'+
        '<i class="fa fa-shopping-cart"></i>'+
        '</div>'+
        '<div class="details">'+
        '<div class="number">'+
        '<span data-counter="counterup" data-value="549">{{value}}&nbsp;{{format}}</span>'+
        '</div>'+
        '<div class="desc"> {{caption}} </div>'+
        '</div>'+
        '</a>';

    Templates.emptyMetricTemplate =
        '<div id="empty-metric" class="empty-container widget-body">'+
        '<div class="center-block">'+
        '<img class="addmetric-img" src="components/analytica/img/add-metrics.png" data-widgetid="wid-id-{{widget.id}}" data-cardid="cardflip-{{widget.id}}">'+
        '</div>'+
        '</div>';

    Templates.seriesMetricTemplate =
        '<div id="widget-body-{{widget.id}}" class="widget-body">'+
        '</div>';

    Templates.chartTemplate =
        '<div class="chart-wrapper">' +
        '<div class="chart-inner">' +
        '<div id="{{metricId}}" metric-class="{{metricClass}} chart" data-widgetid="wid-id-{{widgetId}}" style="width:100%; height: 100%;" >' +
        '</div>' +
        '</div>' +
        '</div>';

    Templates.seriesWidgetTemplate =
        '<article id="vs-{{widget.id}}" class="vs-analytics-item col-xs-12 col-sm-6 col-md-6 col-lg-6">' +
        '<div class="jarviswidget {{compClass}}" id="wid-id-{{widget.id}}" data-itemid="{{widget.id}}" data-widget-colorbutton="false">' +
        '<header>' +
        '<h2 class="widget-title"></h2>' +
        '<div class="widget-toolbar">' +
        '<a href="javascript:;" class="flipcancel btn btn-sm red" data-widgetid="wid-id-{{widget.id}}" data-cardid="cardflip-{{widget.id}}">' +
        '<i class="fa fa-edit fa-3x"></i>' +
        '</a>' +
        '</div>' +
        '</header>' +
        '<div class="dashboard-module cardflip flip-v">' +
        '<div id="cardflip-{{widget.id}}" class="flipwrap">' +
        '<div class="flipface flipfront" id="series-content-{{widget.id}}" data-widgetid="wid-id-{{widget.id}}"' +
        'data-cardid="cardflip-{{widget.id}}">' +
        <!--load metric content and empty content according to the call-->
        '</div>' +
        '<div class="flipface flipback">' +
        '<div class="row header">' +
        '<span class="caption-subject black">Set custom dashboard module</span>' +
        '<button type="button" class="flipcancel btn red-sunglo" data-widgetid="wid-id-{{widget.id}}" data-cardid="cardflip-{{widget.id}}">'+
        'Cancel'+
        '</button>' +
        '</div>' +
        '<form id="metrics-form-{{widget.id}}" role="form" class="form-horizontal metrics-change-form">' +
        '<div class="form-body">' +
        '<div class="form-group form-md-line-input">' +
        '<label class="col-md-2 control-label" for="input-metrictype-{{widget.id}}">Metric' +
        'Type</label>' +
        '<div class="col-md-10">' +
        '<select class="form-control select-metrictype " id="input-metrictype-{{widget.id}}" data-widgetid="wid-id-{{widget.id}}" data-cardid="cardflip-{{widget.id}}">' +
        '{{#cats}}' +
        '<option value="{{cat_id}}">{{cat_name}}</option>' +
        '{{/cats}}' +
        '</select>' +
        '<div class="form-control-focus">' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="form-group form-md-line-input">' +
        '<label class="col-md-2 control-label" for="input-metricsname-{{widget.id}}">Metric Name</label>' +
        '<div class="col-md-10">' +
        '<select class="form-control select-metricname" id="input-metricsname-{{widget.id}}" data-widgetid="wid-id-{{widget.id}}" data-cardid="cardflip-{{widget.id}}">' +
        '</select>' +
        '<div class="form-control-focus">' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="form-group form-md-line-input">' +
        '<button type="button" class="flipconfirm btn green-meadow" data-widgetid="wid-id-{{widget.id}}" data-cardid="cardflip-{{widget.id}}">Confirm </button>' +
        '</div>' +
        '</div>' +
        '</form>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</article>';


    var allWidgetsOnContainer = {};

    var loadStaticBase = function (returnOutput, data, staticOpt) {
        data.widget = staticOpt.staticOpt;
        data.format = staticOpt.metric.chartOptions.format;
        returnOutput(Mustache.render(Templates.staticMetricTemplate, data));
    };

    var loadStaticMetric = function (returnOutput, metricOpt) {
        var options = {};
        if (typeof metricOpt.ajax !== "undefined") {
            $.ajax({
                type: metricOpt.ajax.type,
                url: metricOpt.ajax.url,
                success: function (data) {
                    options.caption = metricOpt.name;
                    options.value = metricOpt.ajax.dataSrc(data);
                    returnOutput(options)
                },
                error: function () {
                }
            });
        }else if(typeof metricOpt.data !== "undefined"){
            options.caption = metricOpt.name;
            options.value = metricOpt.data;
            returnOutput(options)
        }
    };

    var initStaticWidget = function (returnOutput, staticOpt) {
        loadStaticMetric(function (data) {
            loadStaticBase(function (staticBase) {
                returnOutput({
                    staticBase: staticBase
                })
            }, data, staticOpt)
        }, staticOpt.metric)
    };

    var getAllWidgetsOnContainer = function (containerName) {
        if (!(allWidgetsOnContainer.hasOwnProperty(containerName))) {
            allWidgetsOnContainer[containerName] = [];
        }
        return allWidgetsOnContainer[containerName];
    };

    var getExistWidgetOnContainer = function (containerName, filterParam, value) {
        var returnWidget;
        var allWidgets = getAllWidgetsOnContainer(containerName);
        for (var key in allWidgets) {
            var widgetOpt = allWidgets[key];
            if (widgetOpt.widget.widget[filterParam] == value) {
                returnWidget = widgetOpt;
            }
        }
        return returnWidget;
    };

    var updateWidgetObjOnQueue = function (containerName, widget, metric) {
        var allWidgets = getAllWidgetsOnContainer(containerName);
        for (var key in allWidgets) {
            var widgetOpt = allWidgets[key];
            if (widgetOpt.widget.widget.id == widget.widget.id) {
                widgetOpt.metric = metric;
            }
        }
    };

    var initializeWidgets = function (widgetId) {
        $('#vs-' + widgetId).jarvisWidgets({
            toggleClass: 'fa fa-minus | fa fa-plus',
            deleteClass: 'fa fa-times',
            editClass: 'fa fa-cog | fa fa-save',
            fullscreenClass: 'fa fa-expand | fa fa-compress',
            refreshButtonClass: 'fa fa-refresh',
            grid: 'article',
            sortable: true,
            onFullscreen: function () {

            },
            onDelete: function () {
                alert("Are you want to delete this widget");
            }
        });
    };

    var loadMetricContainer = function (returnOutput, widgetOpt) {
        var template;
        if (widgetOpt.metric == null || typeof widgetOpt.metric == "undefined") {
            template = Templates.emptyMetricTemplate;
        } else {
            template = Templates.seriesMetricTemplate;
        }
        returnOutput(Mustache.render(template, widgetOpt.widget));
    };


    var loadWidget = function (returnOutput, widgetOpt) {
        returnOutput(Mustache.render(Templates.seriesWidgetTemplate, widgetOpt.widget));
    };


    // This was called all create and update
    var loadMetric = function (returnOutput, widgetOpt) {
        returnOutput(Mustache.render(Templates.chartTemplate, {
            metricClass: "rangebased-metrics",
            widgetId: widgetOpt.widget.widget.id,
            metricId: widgetOpt.widget.generatedMetricId
        }));
    };


    var intiCreateWidget = function (returnOutput, widgetOpt) {
        loadWidget(function (widgetContent) {
            loadMetricContainer(function (metricContainer) {
                if (widgetOpt.metric != null) {
                    loadMetric(function (metricContent) {
                        returnOutput({
                            widgetContent: widgetContent,
                            metricContainer: metricContainer,
                            moduleContentId: "#series-content-" + widgetOpt.widget.widget.id,
                            metricContent: metricContent,
                            metricbodyid: "#widget-body-" + widgetOpt.widget.widget.id
                        })
                    }, widgetOpt)
                } else {
                    returnOutput({
                        widgetContent: widgetContent,
                        metricContainer: metricContainer,
                        moduleContentId: "#series-content-" + widgetOpt.widget.widget.id
                    })
                }
            }, widgetOpt)
        }, widgetOpt);
    };

    var initUpdateWidget = function (returnOutput, widgetOpt) {
        loadMetricContainer(function (metricContainer) {
            loadMetric(function (metricContent) {
                returnOutput({
                    metricContainer: metricContainer,
                    moduleContentId: "#series-content-" + widgetOpt.widget.widget.id,
                    metricContent: metricContent,
                    metricbodyid: "#widget-body-" + widgetOpt.widget.widget.id
                })
            }, widgetOpt)
        }, widgetOpt)
    };

    var generateWidgetMetric = function (metricOpt, metricData) {
        var chartOptions = {};
        // TODO : Have categories chart types into several categories according to the data manupulation for chart
        if (metricOpt.chartOptions.type == "pie") {
            chartOptions = metricOpt.chartOptions;
            chartOptions.dataSeries = Charts.renderCompositionsCharts(metricData);
        } else if (metricOpt.chartOptions.type == "custom") {
            chartOptions = metricOpt.chartOptions;
            chartOptions.dataSeries = metricData;
            chartOptions.customType = metricOpt.name;
        } else {
            var uploadsTimeSeriesData = [];
            var dist = {
                type: metricOpt.chartOptions.type,
                name: metricOpt.name,
                data: Charts.convertData(metricData)
            };
            uploadsTimeSeriesData.push(dist);
            chartOptions = metricOpt.chartOptions;
            chartOptions.dataSeries = uploadsTimeSeriesData;
        }
        chartOptions.element = metricOpt.generatedMetricId;
        var element = $('#' + $('#' + chartOptions.element).data('widgetid'));
        element.find('header > h2.widget-title').html(metricOpt.name)
        Charts.distributionsCharts(chartOptions);
    };

    var getRelavantParentIds = function (element) {
        return {
            widgetid: $(element).data('widgetid'),
            cardid: $(element).data('cardid')
        }
    };

    fns.CreateStaticWidget = function (staticOpt) {
        initStaticWidget(function (content) {
            staticOpt.container.append(content.staticBase);
            getAllWidgetsOnContainer(staticOpt.container.attr('id')).push(staticOpt);
        }, staticOpt);
    };

    fns.ReInitializeStaticWidget = function (staticOpt) {
        initStaticWidget(function (content) {
            staticOpt.container.append(content.staticBase);
        }, staticOpt);
    };

    fns.CreateWidget = function (widgetOpt) {
        // TODO : Do the widgetOpt validation
        intiCreateWidget(function (content) {
            widgetOpt.container.append(content.widgetContent);
            $(content.moduleContentId).html(content.metricContainer);
            $(content.metricbodyid).html(content.metricContent);
            if (!(widgetOpt.metric == null || typeof widgetOpt.metric == "undefined")) {
                var wid_container = $("#wid-id-" + widgetOpt.widget.widget.id);
                wid_container.LoadingOverlay("show");
                fns.RefreshWidget(wid_container, widgetOpt.metric);
                getAllWidgetsOnContainer(widgetOpt.container.attr('id')).push(widgetOpt);
            }
            initializeWidgets(widgetOpt.widget.widget.id);
        }, widgetOpt);
    };

    fns.UpdateWidget = function (widgetOpt) {
        initUpdateWidget(function (content) {
            $(content.moduleContentId).html(content.metricContainer);
            $(content.metricbodyid).html(content.metricContent);
            var wid_container = $("#wid-id-" + widgetOpt.widget.widget.id);
            wid_container.LoadingOverlay("show");
            fns.RefreshWidget(wid_container, widgetOpt.metric);
            updateWidgetObjOnQueue(widgetOpt.container.attr('id'), widgetOpt.widget, widgetOpt.metric);
        }, widgetOpt);
    };

    fns.InitializeMetric = function (returnSuccess, metricOpt) {
        // TODO : Have to validate metricOpt is correct manner
        // TODO : we have to manage use give json format data other wise using
        if (typeof metricOpt.ajax !== "undefined") {
            $.ajax({
                type: metricOpt.ajax.type,
                url: metricOpt.ajax.url,
                success: function (data) {
                    var metricData = metricOpt.ajax.dataSrc(data);
                    generateWidgetMetric(metricOpt, metricData);
                    returnSuccess({
                        success: true
                    });
                },
                error: function () {
                }
            });
        }else if(typeof metricOpt.data !== "undefined"){
            var metricData = metricOpt.data;
            generateWidgetMetric(metricOpt, metricData);
            returnSuccess({
                success: true
            });
        }
    };

    fns.getConfiguredAllWidgets = function (containerName) {
        return getAllWidgetsOnContainer(containerName);
    };

    fns.getConfiguredExistWidget = function (containerName, filter) {
        return getExistWidgetOnContainer(containerName, filter.param, filter.value);
    };

    fns.RefreshWidget = function (widContainer, metricOpt) {
        fns.InitializeMetric(function (success) {
            if (success) {
                widContainer.LoadingOverlay("hide");
            }
        }, metricOpt);
    };

    fns.InitializeDashboard = function (mainContainerId, editable) {

        var offClick = $("#" + mainContainerId).off('click');

        offClick.on("click", '.flipconfirm', function (ev) {
            ev.stopImmediatePropagation();
            var ids, widgetComponet, itemId, metricId, flipCard;

            ids = getRelavantParentIds(this);
            widgetComponet = $("#" + ids.widgetid);

            itemId = widgetComponet.data("itemid");
            metricId = widgetComponet.find('.select-metricname').val();

            DashboardMetrics.updateMetricComponent(itemId, metricId);


            flipCard = $("#" + ids.cardid);
            if (!flipCard.hasClass("flipped")) {
                flipCard.addClass("flipped");
            } else {
                flipCard.removeClass("flipped");
            }
            widgetComponet.addClass("db-range-metrics");
            widgetComponet.removeClass("db-empty-metrics");
        });

        offClick.on("click", '.flipcancel', function (ev) {
            ev.stopImmediatePropagation();
            var ids, flipCard;
            ids = getRelavantParentIds(this);
            flipCard = $("#" + ids.cardid);
            if (!flipCard.hasClass("flipped")) {
                flipCard.addClass("flipped");
            } else {
                flipCard.removeClass("flipped");
            }
        });

        offClick.on("click", '.addmetric-img', function (ev) {
            ev.stopImmediatePropagation();
            var ids, flipCard;
            ids = getRelavantParentIds(this);
            flipCard = $("#" + ids.cardid);
            if (!flipCard.hasClass("flipped")) {
                flipCard.addClass("flipped");
            } else {
                flipCard.removeClass("flipped");
            }
        });

        $("#" + mainContainerId).off('change').on("change", '.select-metrictype', function (ev) {
            ev.stopImmediatePropagation();
            var selectedMetrics;
            var value = $(this).val();
            var ids = getRelavantParentIds(this);
            var getMetrics = $.get('api/dashboard/metrics/category/' + value + '/2', function (metrics) {
                selectedMetrics = metrics;
            });
            $.when(getMetrics).done(function () {
                var optionsAsString = "";
                $.each(selectedMetrics, function (key, obj) {
                    optionsAsString += "<option value='" + obj.id + "'>" + obj.name + "</option>";
                });
                $("#" + ids.widgetid).find('.select-metricname').html("").append(optionsAsString);
            });
        });

    };

    return fns;
})();

var Charts = (function () {

    var fns = {};

    var genderPieColors = {
        Male: '#7cb5ec',
        Female: '#f15c80',
        M: '#7cb5ec',
        F: '#f15c80'
    };

    fns.renderCompositionsCharts = function (data) {
        return $.map(data, function (obj, i) {
            return [{"name": obj.name, "y": obj.value}];
        });
    };

    fns.convertData = function (arr) {
        return data = $.map(arr, function (val, i) {
            return [[moment.utc(val.name, 'YYYY-M-D H:m:s').valueOf(), val.value]];
        });
    };

    fns.convertDataForCompare = function (data) {
        var dataArr = [];
        var femaleData = $.map(data.femaledemog, function (obj, i) {
            return obj.value;
        });
        var femaleObj = {
            name: "Female",
            data: femaleData,
            color: genderPieColors["Female"],
            showInLegend: false,
        };
        var maleData = $.map(data.maledemog, function (obj, i) {
            return obj.value;
        });

        var categories = $.map(data.maledemog, function (obj, i) {
            return obj.name;
        });
        var maleObj = {
            name: "Male",
            data: maleData,
            color: genderPieColors["Male"],
            showInLegend: false,
        };
        dataArr.push(maleObj);
        dataArr.push(femaleObj);

        return {
            categories: categories,
            data: dataArr
        }
    };

    fns.convertNonSeriesData = function (data) {
        return $.map(data, function (obj, i) {
            return [{"name": obj.name, "data": [obj.value]}];
        });
    };

    fns.renderGenderBreakDownCharts = function (data) {
        console.log(data)
        return $.map(data, function (obj, i) {
            return [{"name": obj.name, "y": obj.value, "color": genderPieColors[obj.name]}];
        });
    };

    fns.distributionsCharts = function (options) {
        switch (options.type) {
            case "column":
                CustomHighChart.columnCharts(options);
                break;
            case "areaspline":
                CustomHighChart.areasplineCharts(options);
                break;
            case "spline":
                CustomHighChart.splineCharts(options);
                break;
            case "area":
                CustomHighChart.areaCharts(options);
                break;
            case "pie":
                CustomHighChart.pieCharts(options);
                break;
            case "custom":
                CustomHighChart.customCharts(options);
                break;
        }
    };
    return fns
})();
