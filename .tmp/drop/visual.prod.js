/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                // TODO: refactor & focus DataViewTransform into a service with well-defined dependencies.
                var DataViewTransform;
                (function (DataViewTransform) {
                    // TODO: refactor this, setGrouped, and groupValues to a test helper to stop using it in the product
                    function createValueColumns(values, valueIdentityFields, source) {
                        if (values === void 0) { values = []; }
                        var result = values;
                        setGrouped(result);
                        if (valueIdentityFields) {
                            result.identityFields = valueIdentityFields;
                        }
                        if (source) {
                            result.source = source;
                        }
                        return result;
                    }
                    DataViewTransform.createValueColumns = createValueColumns;
                    function setGrouped(values, groupedResult) {
                        values.grouped = groupedResult
                            ? function () { return groupedResult; }
                            : function () { return groupValues(values); };
                    }
                    DataViewTransform.setGrouped = setGrouped;
                    /** Group together the values with a common identity. */
                    function groupValues(values) {
                        var groups = [], currentGroup;
                        for (var i = 0, len = values.length; i < len; i++) {
                            var value = values[i];
                            if (!currentGroup || currentGroup.identity !== value.identity) {
                                currentGroup = {
                                    values: []
                                };
                                if (value.identity) {
                                    currentGroup.identity = value.identity;
                                    var source = value.source;
                                    // allow null, which will be formatted as (Blank).
                                    if (source.groupName !== undefined) {
                                        currentGroup.name = source.groupName;
                                    }
                                    else if (source.displayName) {
                                        currentGroup.name = source.displayName;
                                    }
                                }
                                groups.push(currentGroup);
                            }
                            currentGroup.values.push(value);
                        }
                        return groups;
                    }
                    DataViewTransform.groupValues = groupValues;
                })(DataViewTransform = dataview.DataViewTransform || (dataview.DataViewTransform = {}));
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                var DataRoleHelper;
                (function (DataRoleHelper) {
                    function getMeasureIndexOfRole(grouped, roleName) {
                        if (!grouped || !grouped.length) {
                            return -1;
                        }
                        var firstGroup = grouped[0];
                        if (firstGroup.values && firstGroup.values.length > 0) {
                            for (var i = 0, len = firstGroup.values.length; i < len; ++i) {
                                var value = firstGroup.values[i];
                                if (value && value.source) {
                                    if (hasRole(value.source, roleName)) {
                                        return i;
                                    }
                                }
                            }
                        }
                        return -1;
                    }
                    DataRoleHelper.getMeasureIndexOfRole = getMeasureIndexOfRole;
                    function getCategoryIndexOfRole(categories, roleName) {
                        if (categories && categories.length) {
                            for (var i = 0, ilen = categories.length; i < ilen; i++) {
                                if (hasRole(categories[i].source, roleName)) {
                                    return i;
                                }
                            }
                        }
                        return -1;
                    }
                    DataRoleHelper.getCategoryIndexOfRole = getCategoryIndexOfRole;
                    function hasRole(column, name) {
                        var roles = column.roles;
                        return roles && roles[name];
                    }
                    DataRoleHelper.hasRole = hasRole;
                    function hasRoleInDataView(dataView, name) {
                        return dataView != null
                            && dataView.metadata != null
                            && dataView.metadata.columns
                            && dataView.metadata.columns.some(function (c) { return c.roles && c.roles[name] !== undefined; }); // any is an alias of some
                    }
                    DataRoleHelper.hasRoleInDataView = hasRoleInDataView;
                    function hasRoleInValueColumn(valueColumn, name) {
                        return valueColumn
                            && valueColumn.source
                            && valueColumn.source.roles
                            && (valueColumn.source.roles[name] === true);
                    }
                    DataRoleHelper.hasRoleInValueColumn = hasRoleInValueColumn;
                })(DataRoleHelper = dataview.DataRoleHelper || (dataview.DataRoleHelper = {}));
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                var DataViewObject;
                (function (DataViewObject) {
                    function getValue(object, propertyName, defaultValue) {
                        if (!object) {
                            return defaultValue;
                        }
                        var propertyValue = object[propertyName];
                        if (propertyValue === undefined) {
                            return defaultValue;
                        }
                        return propertyValue;
                    }
                    DataViewObject.getValue = getValue;
                    /** Gets the solid color from a fill property using only a propertyName */
                    function getFillColorByPropertyName(object, propertyName, defaultColor) {
                        var value = getValue(object, propertyName);
                        if (!value || !value.solid) {
                            return defaultColor;
                        }
                        return value.solid.color;
                    }
                    DataViewObject.getFillColorByPropertyName = getFillColorByPropertyName;
                })(DataViewObject = dataview.DataViewObject || (dataview.DataViewObject = {}));
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                var DataViewObjects;
                (function (DataViewObjects) {
                    /** Gets the value of the given object/property pair. */
                    function getValue(objects, propertyId, defaultValue) {
                        if (!objects) {
                            return defaultValue;
                        }
                        return dataview.DataViewObject.getValue(objects[propertyId.objectName], propertyId.propertyName, defaultValue);
                    }
                    DataViewObjects.getValue = getValue;
                    /** Gets an object from objects. */
                    function getObject(objects, objectName, defaultValue) {
                        if (objects && objects[objectName]) {
                            return objects[objectName];
                        }
                        return defaultValue;
                    }
                    DataViewObjects.getObject = getObject;
                    /** Gets the solid color from a fill property. */
                    function getFillColor(objects, propertyId, defaultColor) {
                        var value = getValue(objects, propertyId);
                        if (!value || !value.solid) {
                            return defaultColor;
                        }
                        return value.solid.color;
                    }
                    DataViewObjects.getFillColor = getFillColor;
                    function getCommonValue(objects, propertyId, defaultValue) {
                        var value = getValue(objects, propertyId, defaultValue);
                        if (value && value.solid) {
                            return value.solid.color;
                        }
                        if (value === undefined
                            || value === null
                            || (typeof value === "object" && !value.solid)) {
                            return defaultValue;
                        }
                        return value;
                    }
                    DataViewObjects.getCommonValue = getCommonValue;
                })(DataViewObjects = dataview.DataViewObjects || (dataview.DataViewObjects = {}));
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                // powerbi.extensibility.utils.dataview
                var DataRoleHelper = powerbi.extensibility.utils.dataview.DataRoleHelper;
                var converterHelper;
                (function (converterHelper) {
                    function categoryIsAlsoSeriesRole(dataView, seriesRoleName, categoryRoleName) {
                        if (dataView.categories && dataView.categories.length > 0) {
                            // Need to pivot data if our category soure is a series role
                            var category = dataView.categories[0];
                            return category.source &&
                                DataRoleHelper.hasRole(category.source, seriesRoleName) &&
                                DataRoleHelper.hasRole(category.source, categoryRoleName);
                        }
                        return false;
                    }
                    converterHelper.categoryIsAlsoSeriesRole = categoryIsAlsoSeriesRole;
                    function getSeriesName(source) {
                        return (source.groupName !== undefined)
                            ? source.groupName
                            : source.queryName;
                    }
                    converterHelper.getSeriesName = getSeriesName;
                    function isImageUrlColumn(column) {
                        var misc = getMiscellaneousTypeDescriptor(column);
                        return misc != null && misc.imageUrl === true;
                    }
                    converterHelper.isImageUrlColumn = isImageUrlColumn;
                    function isWebUrlColumn(column) {
                        var misc = getMiscellaneousTypeDescriptor(column);
                        return misc != null && misc.webUrl === true;
                    }
                    converterHelper.isWebUrlColumn = isWebUrlColumn;
                    function getMiscellaneousTypeDescriptor(column) {
                        return column
                            && column.type
                            && column.type.misc;
                    }
                    converterHelper.getMiscellaneousTypeDescriptor = getMiscellaneousTypeDescriptor;
                    function hasImageUrlColumn(dataView) {
                        if (!dataView || !dataView.metadata || !dataView.metadata.columns || !dataView.metadata.columns.length) {
                            return false;
                        }
                        return dataView.metadata.columns.some(function (column) { return isImageUrlColumn(column) === true; });
                    }
                    converterHelper.hasImageUrlColumn = hasImageUrlColumn;
                })(converterHelper = dataview.converterHelper || (dataview.converterHelper = {}));
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                var DataViewObjectsParser = (function () {
                    function DataViewObjectsParser() {
                    }
                    DataViewObjectsParser.getDefault = function () {
                        return new this();
                    };
                    DataViewObjectsParser.createPropertyIdentifier = function (objectName, propertyName) {
                        return {
                            objectName: objectName,
                            propertyName: propertyName
                        };
                    };
                    DataViewObjectsParser.parse = function (dataView) {
                        var dataViewObjectParser = this.getDefault(), properties;
                        if (!dataView || !dataView.metadata || !dataView.metadata.objects) {
                            return dataViewObjectParser;
                        }
                        properties = dataViewObjectParser.getProperties();
                        for (var objectName in properties) {
                            for (var propertyName in properties[objectName]) {
                                var defaultValue = dataViewObjectParser[objectName][propertyName];
                                dataViewObjectParser[objectName][propertyName] = dataview.DataViewObjects.getCommonValue(dataView.metadata.objects, properties[objectName][propertyName], defaultValue);
                            }
                        }
                        return dataViewObjectParser;
                    };
                    DataViewObjectsParser.isPropertyEnumerable = function (propertyName) {
                        return !DataViewObjectsParser.InnumerablePropertyPrefix.test(propertyName);
                    };
                    DataViewObjectsParser.enumerateObjectInstances = function (dataViewObjectParser, options) {
                        var dataViewProperties = dataViewObjectParser && dataViewObjectParser[options.objectName];
                        if (!dataViewProperties) {
                            return [];
                        }
                        var instance = {
                            objectName: options.objectName,
                            selector: null,
                            properties: {}
                        };
                        for (var key in dataViewProperties) {
                            if (dataViewProperties.hasOwnProperty(key)) {
                                instance.properties[key] = dataViewProperties[key];
                            }
                        }
                        return {
                            instances: [instance]
                        };
                    };
                    DataViewObjectsParser.prototype.getProperties = function () {
                        var _this = this;
                        var properties = {}, objectNames = Object.keys(this);
                        objectNames.forEach(function (objectName) {
                            if (DataViewObjectsParser.isPropertyEnumerable(objectName)) {
                                var propertyNames = Object.keys(_this[objectName]);
                                properties[objectName] = {};
                                propertyNames.forEach(function (propertyName) {
                                    if (DataViewObjectsParser.isPropertyEnumerable(objectName)) {
                                        properties[objectName][propertyName] =
                                            DataViewObjectsParser.createPropertyIdentifier(objectName, propertyName);
                                    }
                                });
                            }
                        });
                        return properties;
                    };
                    return DataViewObjectsParser;
                }());
                DataViewObjectsParser.InnumerablePropertyPrefix = /^_/;
                dataview.DataViewObjectsParser = DataViewObjectsParser;
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));

/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var enelBarChartEBEB93C31AAC4EC2BE2A4236ECFF9DCA;
            (function (enelBarChartEBEB93C31AAC4EC2BE2A4236ECFF9DCA) {
                ;
                "use strict";
                /**
                 * Function that converts queried data into a view model that will be used by the visual.
                 *
                 * @function
                 * @param {VisualUpdateOptions} options - Contains references to the size of the container
                 *                                        and the dataView which contains all the data
                 *                                        the visual had queried.
                 * @param {IVisualHost} host            - Contains references to the host which contains services
                 */
                function data2ViewModel(options, host) {
                    var dataViews = options.dataViews;
                    var defaultSettings = {
                        xyAxis: {
                            xAxis: false,
                            yAxis: false
                        },
                    };
                    var viewModel = {
                        categories: {},
                        referenceDataPoints: {},
                        stackDataPoints: {},
                        settings: {}
                    };
                    if (!dataViews
                        || !dataViews[0]
                        || !dataViews[0].categorical
                        || !dataViews[0].categorical.categories
                        || !dataViews[0].categorical.categories[0]
                        || !dataViews[0].categorical.values) {
                        return viewModel;
                    }
                    ;
                    var categorical = dataViews[0].categorical;
                    var category = categorical.categories[0];
                    viewModel.categories.values = [];
                    viewModel.categories.displayNames = categorical.categories.map(function (c) { return c.source.displayName; });
                    for (var i = 0, cat = []; i < category.values.length; i++) {
                        for (var j = 0; j < categorical.categories.length; j++) {
                            cat.push(categorical.categories[j].values[i] + '');
                        }
                        viewModel.categories.values.push(cat);
                        cat = [];
                    }
                    viewModel.referenceDataPoints.values = [];
                    viewModel.referenceDataPoints.displayName = categorical.values[0].source.displayName;
                    viewModel.stackDataPoints.values = [];
                    viewModel.stackDataPoints.displayName = [];
                    viewModel.stackDataPoints.displayName = categorical.values.filter(function (dv) {
                        return dv.source.roles['measure'];
                    }).map(function (dv) {
                        return dv.source.displayName;
                    }).filter(function (v, i, k) {
                        return k.indexOf(v) === i;
                    });
                    var colorPalette = host.colorPalette;
                    var objects = dataViews[0].metadata.objects;
                    var cbcBarChartSettings = {
                        xyAxis: {
                            xAxis: enelBarChartEBEB93C31AAC4EC2BE2A4236ECFF9DCA.getValue(objects, 'xyAxis', 'xAxis', defaultSettings.xyAxis.xAxis),
                            yAxis: enelBarChartEBEB93C31AAC4EC2BE2A4236ECFF9DCA.getValue(objects, 'xyAxis', 'yAxis', defaultSettings.xyAxis.yAxis)
                        },
                    };
                    viewModel.settings = cbcBarChartSettings;
                    var referenceDefaultColor = {
                        solid: {
                            color: colorPalette.getColor(viewModel.referenceDataPoints.displayName).value
                        }
                    };
                    var stackDefaultColor = [];
                    for (var i = 0; i < viewModel.stackDataPoints.displayName.length; i++) {
                        var dc = {
                            solid: {
                                color: colorPalette.getColor(viewModel.stackDataPoints.displayName[i]).value
                            }
                        };
                        stackDefaultColor.push(dc);
                    }
                    var firstTime = true;
                    var _loop_1 = function (i, len, cat) {
                        var dataValues = categorical.values.filter((function (dv) {
                            return (dv.values.filter(function (v, k) {
                                return v !== null && k === i;
                            })).length !== 0;
                        }));
                        if (i === 0) {
                            var referenceDataValue = dataValues.filter(function (dv) {
                                return dv.source.roles['referenceValue'];
                            })[0];
                            viewModel.referenceDataPoints.color = enelBarChartEBEB93C31AAC4EC2BE2A4236ECFF9DCA.getObjectValue(referenceDataValue, 0, 'colorSelector', 'fill', referenceDefaultColor).solid.color;
                            viewModel.referenceDataPoints.selectionId = host.createSelectionIdBuilder()
                                .withMeasure(referenceDataValue.source.queryName)
                                .createSelectionId();
                        }
                        viewModel.referenceDataPoints.values.push(dataValues.filter(function (dv) {
                            return dv.source.roles['referenceValue'];
                        })[0].values[i]);
                        if (i == 0) {
                            var stackDataValues_1 = dataValues.filter(function (dv) {
                                return dv.source.roles['measure'];
                            });
                            viewModel.stackDataPoints.color = stackDataValues_1.map(function (sdv) {
                                return enelBarChartEBEB93C31AAC4EC2BE2A4236ECFF9DCA.getObjectValue(sdv, 0, 'colorSelector', 'fill', stackDefaultColor[stackDataValues_1.indexOf(sdv)]).solid.color;
                            });
                            viewModel.stackDataPoints.selectionId = stackDataValues_1.map(function (sdv) {
                                return host.createSelectionIdBuilder()
                                    .withMeasure(sdv.source.queryName)
                                    .createSelectionId();
                            });
                        }
                        cat.push(dataValues.filter(function (dv) {
                            return dv.source.roles['measure'];
                        }).map(function (dv) {
                            return dv.values[i];
                        }));
                        viewModel.stackDataPoints.values.push(cat);
                        cat = [];
                        out_cat_1 = cat;
                    };
                    var out_cat_1;
                    for (var i = 0, len = category.values.length, cat = []; i < len; i++) {
                        _loop_1(i, len, cat);
                        cat = out_cat_1;
                    }
                    return viewModel;
                }
                var Visual = (function () {
                    function Visual(options) {
                        console.log('Constructor Debugger');
                        this.host = options.host;
                        this.cbcElement = options.element;
                    }
                    ;
                    Visual.prototype.update = function (options) {
                        console.log('Visual update ', options);
                        debugger;
                        var viewModel = this.cbcChartViewModel = data2ViewModel(options, this.host);
                        var settings = this.barChartSettings = viewModel.settings;
                        var tv = new enelBarChartEBEB93C31AAC4EC2BE2A4236ECFF9DCA.tableView(viewModel);
                        tv.loadBody();
                        this.target = tv.getTable();
                        var n = this.cbcElement.firstElementChild;
                        if (n === null)
                            this.cbcElement.appendChild(this.target);
                        else {
                            n.parentNode.replaceChild(n, this.target);
                        }
                        //            const self:this =this;
                    };
                    ;
                    Visual.prototype.enumerateObjectInstances = function (options) {
                        console.log('Visual enumerateObjectInstances');
                        debugger;
                        var objectName = options.objectName;
                        var objectEnumeration = [];
                        switch (objectName) {
                            case 'xyAxis':
                                objectEnumeration.push({
                                    objectName: objectName,
                                    properties: {
                                        xAxis: this.barChartSettings.xyAxis.xAxis,
                                        yAxis: this.barChartSettings.xyAxis.yAxis
                                    },
                                    selector: null
                                });
                                break;
                            case 'colorSelector':
                                objectEnumeration.push({
                                    objectName: objectName,
                                    displayName: this.cbcChartViewModel.referenceDataPoints.displayName,
                                    properties: {
                                        fill: {
                                            solid: {
                                                color: this.cbcChartViewModel.referenceDataPoints.color
                                            }
                                        }
                                    },
                                    selector: this.cbcChartViewModel.referenceDataPoints.selectionId.getSelector()
                                });
                                for (var i = 0; i < this.cbcChartViewModel.stackDataPoints.displayName.length; i++) {
                                    objectEnumeration.push({
                                        objectName: objectName,
                                        displayName: this.cbcChartViewModel.stackDataPoints.displayName[i],
                                        properties: {
                                            fill: {
                                                solid: {
                                                    color: this.cbcChartViewModel.stackDataPoints.color[i]
                                                }
                                            }
                                        },
                                        selector: this.cbcChartViewModel.stackDataPoints.selectionId[i].getSelector()
                                    });
                                }
                                break;
                        }
                        ;
                        return objectEnumeration;
                    };
                    Visual.prototype.destroy = function () {
                        //TODO: Perform any cleanup tasks here
                    };
                    return Visual;
                }());
                enelBarChartEBEB93C31AAC4EC2BE2A4236ECFF9DCA.Visual = Visual;
            })(enelBarChartEBEB93C31AAC4EC2BE2A4236ECFF9DCA = visual.enelBarChartEBEB93C31AAC4EC2BE2A4236ECFF9DCA || (visual.enelBarChartEBEB93C31AAC4EC2BE2A4236ECFF9DCA = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var enelBarChartEBEB93C31AAC4EC2BE2A4236ECFF9DCA;
            (function (enelBarChartEBEB93C31AAC4EC2BE2A4236ECFF9DCA) {
                /**
                     * Gets property value for a particular object.
                     *
                     * @function
                     * @param {DataViewObjects} objects - Map of defined objects.
                     * @param {string} objectName       - Name of desired object.
                     * @param {string} propertyName     - Name of desired property.
                     * @param {T} defaultValue          - Default value of desired property.
                     */
                function getValue(objects, objectName, propertyName, defaultValue) {
                    if (objects) {
                        var object = objects[objectName];
                        if (object) {
                            var property = object[propertyName];
                            if (property !== undefined) {
                                return property;
                            }
                        }
                    }
                    return defaultValue;
                }
                enelBarChartEBEB93C31AAC4EC2BE2A4236ECFF9DCA.getValue = getValue;
                /**
                  * Gets property value for a particular object in a category.
                  *
                  * @function
                  * @param {DataViewValueColumn} category - List of category objects.
                  * @param {number} index                    - Index of category object.
                  * @param {string} objectName               - Name of desired object.
                  * @param {string} propertyName             - Name of desired property.
                  * @param {T} defaultValue                  - Default value of desired property.
                  */
                function getObjectValue(category, index, objectName, propertyName, defaultValue) {
                    var categoryObjects = category.source.objects;
                    if (categoryObjects) {
                        var categoryObject = categoryObjects;
                        if (categoryObject) {
                            var object = categoryObject[objectName];
                            if (object) {
                                var property = object[propertyName];
                                if (property !== undefined) {
                                    return property;
                                }
                            }
                        }
                    }
                    return defaultValue;
                }
                enelBarChartEBEB93C31AAC4EC2BE2A4236ECFF9DCA.getObjectValue = getObjectValue;
            })(enelBarChartEBEB93C31AAC4EC2BE2A4236ECFF9DCA = visual.enelBarChartEBEB93C31AAC4EC2BE2A4236ECFF9DCA || (visual.enelBarChartEBEB93C31AAC4EC2BE2A4236ECFF9DCA = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var enelBarChartEBEB93C31AAC4EC2BE2A4236ECFF9DCA;
            (function (enelBarChartEBEB93C31AAC4EC2BE2A4236ECFF9DCA) {
                var tableView = (function () {
                    function tableView(viewModel) {
                        this.viewModel = viewModel;
                        this.table = document.createElement("table");
                        this.table.className = "tableView";
                        this.thead = this.table.createTHead();
                        this.tbody = this.table.createTBody();
                        var headRow = this.thead.insertRow(0);
                        this.viewModel.categories.displayNames.forEach(function (el) {
                            var th = document.createElement("th");
                            th.innerHTML = el;
                            headRow.appendChild(th);
                        });
                        var th = document.createElement("th");
                        th.innerHTML = viewModel.referenceDataPoints.displayName;
                        headRow.appendChild(th);
                        this.viewModel.stackDataPoints.displayName.forEach(function (el) {
                            var th = document.createElement("th");
                            th.innerHTML = el;
                            headRow.appendChild(th);
                        });
                    }
                    tableView.prototype.getTable = function () {
                        return this.table;
                    };
                    tableView.prototype.loadBody = function () {
                        var _this = this;
                        var bodyRow;
                        var i = 0;
                        this.viewModel.categories.values.forEach(function (row) {
                            bodyRow = _this.tbody.insertRow(-1);
                            row.forEach(function (cell) {
                                var td = bodyRow.insertCell(-1);
                                td.innerHTML = cell + "";
                            });
                            var td = bodyRow.insertCell(-1);
                            td.innerHTML = _this.viewModel.referenceDataPoints.values[i] + "";
                            _this.viewModel.stackDataPoints.values[i].forEach(function (cell) {
                                for (var j = 0; j < cell["length"]; j++) {
                                    var td_1 = bodyRow.insertCell(-1);
                                    td_1.innerHTML = cell[j] + "";
                                }
                            });
                            i++;
                        });
                    };
                    return tableView;
                }());
                enelBarChartEBEB93C31AAC4EC2BE2A4236ECFF9DCA.tableView = tableView;
            })(enelBarChartEBEB93C31AAC4EC2BE2A4236ECFF9DCA = visual.enelBarChartEBEB93C31AAC4EC2BE2A4236ECFF9DCA || (visual.enelBarChartEBEB93C31AAC4EC2BE2A4236ECFF9DCA = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var plugins;
        (function (plugins) {
            plugins.enelBarChartEBEB93C31AAC4EC2BE2A4236ECFF9DCA_DEBUG = {
                name: 'enelBarChartEBEB93C31AAC4EC2BE2A4236ECFF9DCA_DEBUG',
                displayName: 'EnelBarChart',
                class: 'Visual',
                version: '1.0.0',
                apiVersion: '1.12.0',
                create: function (options) { return new powerbi.extensibility.visual.enelBarChartEBEB93C31AAC4EC2BE2A4236ECFF9DCA.Visual(options); },
                custom: true
            };
        })(plugins = visuals.plugins || (visuals.plugins = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
//# sourceMappingURL=visual.js.map