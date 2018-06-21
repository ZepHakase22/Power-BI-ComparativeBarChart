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
    interface EnelBarChartSettings {
        xyAxis: {
            xAxis: boolean;
            yAxis: boolean;
        };
    }
    /**
     * Interface for EnelBarChartViewModel
     * 
     * @interface
     * @property {EnelBarChartSettings} settings - Manage the settings for the EnelBarChartInterface
     * 
     */
    interface EnelBarChartViewModel {
        settings: EnelBarChartSettings;
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
    function data2ViewModel(options:VisualUpdateOptions, host: IVisualHost): EnelBarChartViewModel {
        let dataViews = options.dataViews;
        let defaultSettings: EnelBarChartSettings = {
            xyAxis: {
                xAxis: false,
                yAxis: false
            },
        }
        let viewModel: EnelBarChartViewModel = {
            settings: <EnelBarChartSettings>{}
        }
        if(     !dataViews
            ||  !dataViews[0]
            ||  !dataViews[0].categorical
            ||  !dataViews[0].categorical.values) {
                return viewModel;
        };
        
        let objects = dataViews[0].metadata.objects;
        let enelBarChartSettings: EnelBarChartSettings = {
            xyAxis: {
                xAxis: getValue<boolean>(objects, 'xyAxis', 'xAxis', defaultSettings.xyAxis.xAxis),
                yAxis: getValue<boolean>(objects, 'xyAxis', 'yAxis', defaultSettings.xyAxis.yAxis)
            },
        };
        return {
            settings:enelBarChartSettings
        }
    }
    export class Visual implements IVisual {
        private target: HTMLElement;
        private host: IVisualHost;
        private barCharSettings: EnelBarChartSettings

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
            let viewModel: EnelBarChartViewModel = data2ViewModel(options, this.host);
            let settings: EnelBarChartSettings = this.barCharSettings = viewModel.settings;

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