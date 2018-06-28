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

module powerbi.extensibility.visual {
    /**
     * Interface for EnelBarChartSettings
     * 
     * @interface
     * @property {{xAxis:boolean,{yAxis:boolean}}} xyAxis                            - Object property that allows x-axis to be enabled.
     * @property {{opacity:number},{showHelpLink: boolean}} generalView - Defines the EnelBarChart general view setting.
     *                                                                  - Opacity - Controls opacity of plotted bars, values range between 10 (almost transparent) to 100 (fully opaque, default)
     *                                                                  - Help Button - When TRUE, the plot displays a button which launch a link to documentation.
     */
    interface CBCBarChartSettings {
        xyAxis: {
            xAxis: boolean;
            yAxis: boolean;
        };
    }
    /**
     * Interface for BarChart data points.
     *
     * @interface
     * @property {string} category          - Corresponding category of data value.
     * @property {PrimitiveValue[]} value   - Array of values for the reference value.
     *                                        and visual interaction.
     */
    interface ReferenceChartDataPoint {
        displayName: string;
        values: PrimitiveValue[];
    };

        /***
     * Interface StackChartDataPoint
     * 
     * @interface
     * @property {BarChartDataPoint[]} dataPoints - Data points array of the measure to compare to the reference
     * 
     */
    interface StackChartDataPoint {
        displayName: string[];
        values: PrimitiveValue[][];
    }
    /**
     * Interface for CBCBarChartViewModel
     * 
     * @interface
     * @property {BarChartDataPoint} datapoint          - The reference measure
     * @property {StackChartDataPoint} stackDataPoint   - The measure to compare datapoint with the reference measure 
     * @property {CBCBarChartSettings} settings         - Manage the settings for the EnelBarChartInterface
     * 
     */
    interface CBCBarChartViewModel {
        categories: string[][]
        referenceDataPoints: ReferenceChartDataPoint;
        stackDataPoints: StackChartDataPoint;
        settings: CBCBarChartSettings;
    }
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
    function data2ViewModel(options:VisualUpdateOptions, host: IVisualHost): CBCBarChartViewModel {
        let dataViews = options.dataViews;
        

        let defaultSettings: CBCBarChartSettings = {
            xyAxis: {
                xAxis: false,
                yAxis: false
            },
        }
        let viewModel: CBCBarChartViewModel = {
            categories: [],
            referenceDataPoints: <ReferenceChartDataPoint>{},
            stackDataPoints: <StackChartDataPoint>{},
            settings: <CBCBarChartSettings>{}
        }
        if(     !dataViews
            ||  !dataViews[0]
            ||  !dataViews[0].categorical
            ||  !dataViews[0].categorical.categories
            ||  !dataViews[0].categorical.categories[0]
            ||  !dataViews[0].categorical.values) {
                return viewModel;
        };
        
        let categorical = dataViews[0].categorical;
        let category = categorical.categories[0];
        for (let i=0,cat=[]; i<category.values.length; i++) {
            for(let j=0; j<categorical.categories.length; j++) {
                cat.push(categorical.categories[j].values[i] + '');
            }
            viewModel.categories.push(cat);
            cat=[];
        }

        viewModel.referenceDataPoints.values = [];
        viewModel.referenceDataPoints.displayName = categorical.values[0].source.displayName;
        viewModel.stackDataPoints.values = [];
        viewModel.stackDataPoints.displayName = [];
        viewModel.stackDataPoints.displayName = categorical.values.filter(dv => 
            dv.source.roles['measure']).map<string>(dv => 
                dv.source.displayName).filter( (v,i,k) =>
                k.indexOf(v) === i);
        
        let colorPalette: IColorPalette = host.colorPalette;

        let objects = dataViews[0].metadata.objects;
        let cbcBarChartSettings: CBCBarChartSettings = {
            xyAxis: {
                xAxis: getValue<boolean>(objects, 'xyAxis', 'xAxis', defaultSettings.xyAxis.xAxis),
                yAxis: getValue<boolean>(objects, 'xyAxis', 'yAxis', defaultSettings.xyAxis.yAxis)
            },
        };
        viewModel.settings = cbcBarChartSettings;
        for ( let i = 0, len = category.values.length, cat=[] ; i < len; i++) {
            let dataValues = categorical.values.filter((dv => 
                (dv.values.filter ((v,k) => 
                    v!== null && k===i)).length !== 0 ));

            viewModel.referenceDataPoints.values.push(dataValues.filter (dv => 
                dv.source.roles['referenceValue'])[0].values[i]);
                cat.push(dataValues.filter (dv => 
                dv.source.roles['measure']).map<PrimitiveValue>(dv => 
                    dv.values[i]));
            viewModel.stackDataPoints.values.push(cat);
            cat = [];
        }
        return viewModel;
    }
    export class Visual implements IVisual {
        private target: HTMLElement;
        private host: IVisualHost;
        private barCharSettings: CBCBarChartSettings

        constructor(options: VisualConstructorOptions) {
            console.log('Constructor Debugger')
            
            this.host = options.host;

            var captionArea = document.createElement("div");
            captionArea.innerHTML = "Flavio è fesso";
            options.element.appendChild(captionArea);
            this.target = document.createElement("div");
            options.element.appendChild(this.target);
        };

        public update(options: VisualUpdateOptions) {
            console.log('Visual update ', options);
            debugger;
            let viewModel: CBCBarChartViewModel = data2ViewModel(options, this.host);
            let settings: CBCBarChartSettings = this.barCharSettings = viewModel.settings;

            if(settings !== undefined) {
                this.target.innerHTML = 
                "x-axis is " + settings.xyAxis.xAxis + "</br> y-axis is " + settings.xyAxis.yAxis;
            } else {
                this.target.innerHTML =
                "xy-axis are undefined";
            }

        };

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
            console.log('Visual enumerateObjectInstances');
            debugger;
            let objectName = options.objectName;
            let objectEnumeration: VisualObjectInstance[] = [];
        
            switch (objectName) {
              case 'xyAxis':
                objectEnumeration.push({
                  objectName: objectName,
                  properties: {
                    xAxis: this.barCharSettings.xyAxis.xAxis,
                    yAxis: this.barCharSettings.xyAxis.yAxis
                  },
                  selector: null
                });
                break;
            };
        
            return objectEnumeration;
       }
        public destroy(): void {
            //TODO: Perform any cleanup tasks here
          }
    }
}