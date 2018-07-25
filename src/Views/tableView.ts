module powerbi.extensibility.visual {
    export class tableView {
        private table: HTMLTableElement;
        private thead: HTMLTableSectionElement;
        private tbody: HTMLTableSectionElement;
        private viewModel: CBCBarChartViewModel;

        constructor( viewModel: CBCBarChartViewModel) {
            this.viewModel = viewModel;
            this.table = document.createElement("table");
            this.table.className="tableView";
            this.thead = <HTMLTableSectionElement>this.table.createTHead();
            this.tbody = <HTMLTableSectionElement>this.table.createTBody();
            let headRow = <HTMLTableRowElement>this.thead.insertRow(0);
            this.viewModel.categories.displayNames.forEach(el => {
                let th = <HTMLTableCellElement>document.createElement("th");
                th.innerHTML=el;
                headRow.appendChild(th);
            })
            let th = <HTMLTableCellElement>document.createElement("th");
            th.innerHTML=viewModel.referenceDataPoints.displayName;
            headRow.appendChild(th);
            this.viewModel.stackDataPoints.displayName.forEach(el => {
                let th = <HTMLTableCellElement>document.createElement("th");
                th.innerHTML=el;
                headRow.appendChild(th);
            });
        }
        public getTable(): HTMLTableElement {
            return this.table;
        }
        public loadBody() {
            let bodyRow: HTMLTableRowElement;
            let i=0;

            this.viewModel.categories.values.forEach(row => {
                bodyRow = <HTMLTableRowElement>this.tbody.insertRow(-1);
                row.forEach(cell => {
                    let td = <HTMLTableCellElement>bodyRow.insertCell(-1);
                    td.innerHTML = cell +"";
                });
                let td = <HTMLTableCellElement>bodyRow.insertCell(-1);
                td.innerHTML=this.viewModel.referenceDataPoints.values[i] + "";
                this.viewModel.stackDataPoints.values[i].forEach(cell => {
                    for(var j =0; j < cell["length"]; j++) {
                        let td = <HTMLTableCellElement>bodyRow.insertCell(-1);
                        td.innerHTML = cell[j] + "";
                    }
                });
                i++;
            });
        }
    }
}
