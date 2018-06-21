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

module powerbi.extensibility.visual.enelBarChartEBEB93C31AAC4EC2BE2A4236ECFF9DCA  {
    "use strict";
    export class Visual implements IVisual {
        private target: HTMLElement;
        private myVisualProp: boolean;
        private myDataViewObjects: DataViewObjects;
        

        constructor(options: VisualConstructorOptions) {
            console.log('Constructor Debugger')
            var captionArea = document.createElement("div");
            captionArea.innerHTML = "Flavio è fesso";
            options.element.appendChild(captionArea);
            this.target = document.createElement("div");
            options.element.appendChild(this.target);
        
            this.myVisualProp = false;
        };

        public update(options: VisualUpdateOptions) {
            console.log('Visual update', options);
            debugger;
            let objects = options.dataViews[0].metadata.objects;
            let object = objects["myCustomObj"]
            if(object) {
                this.myVisualProp = <boolean>object["myprop"];
            }
            this.target.innerHTML = 
                "Custom prop is " + this.myVisualProp;
        };

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
            console.log('Visual enumerateObjectInstances');
            debugger;
            let objectName = options.objectName;
            let objectEnumeration: VisualObjectInstance[] = [];
        
            switch (objectName) {
              case 'myCustomObj':
                objectEnumeration.push({
                  objectName: objectName,
                  properties: {
                    myprop: this.myVisualProp,
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