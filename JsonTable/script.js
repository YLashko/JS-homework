var keys;

//fetchFile("Data_.json");

function fetchFile(fileName) {
    fetch("./table/" + fileName).then(function(response) {
        return response.json();
    }).then(function(data) {
        generateTable(data);
    });
}

function loadFile(event) {
    var reader = new FileReader();

    reader.onload = function(event) {
        var JSONData = JSON.parse(event.target.result);
        generateTable(JSONData);
    }

    reader.readAsText(event.target.files[0]);
}

function clickEdit(button) {
    var buttonTr = button.parentElement.parentElement;
    editRow(buttonTr);
    if (button.innerHTML == "Edit") {
        button.innerHTML = "Save";
    } else {
        button.innerHTML = "Edit";
        countSumsAndAvgs();
        aggregateTable();
    }
}

function clickDelete(button) {
    var buttonTr = button.parentElement.parentElement;
    buttonTr.parentElement.removeChild(buttonTr);
    countSumsAndAvgs();
    aggregateTable();
}

function clickAdd(button) {
    button.innerHTML = "Edit";
    var buttonTr = button.parentElement.parentElement;
    editRow(buttonTr);
    buttonTr.removeChild(buttonTr.children[buttonTr.children.length - 1]);
    addButtons(buttonTr);
    document.querySelectorAll('.json-table-row-calc').forEach(e => e.remove());
    addForm(globalThis.keys);
    countSumsAndAvgs();
    aggregateTable();
}

function editRow(row) {
    for (let i = 0; i < row.children.length; i++) {
        var el = row.children[i];
        if (el.children[0].tagName == "SPAN") {
            el.appendChild(Fields.Input("countable", el.children[0].innerHTML));
            el.removeChild(el.children[0]);
        } else if (el.children[0].tagName == "INPUT") {
            el.appendChild(Fields.Span("countable", el.children[0].value));
            el.removeChild(el.children[0]);
        }
    }
}

function addButtons(tr) {
    tr.appendChild(TableElements.Td("json-table-cell", Buttons.Edit()));
    tr.appendChild(TableElements.Td("json-table-cell", Buttons.Delete()));
}

function addForm(keys) {
    var table = document.getElementById("json-table");
    var tr = document.createElement("tr");
    table.appendChild(tr);
    tr.className = "json-table-row";

    tr.appendChild(TableElements.Td("json-table-cell", Fields.Input("Notcountable", tr.rowIndex)));
    keys.forEach(function(_) {
        tr.appendChild(TableElements.Td("json-table-cell", Fields.Input("Notcountable", "")));
    });

    td = TableElements.Td("json-table-cell", Buttons.Add());

    tr.appendChild(td);
}

function generateTable(JSONData) {

    var table = document.getElementById("json-table");
    table.innerHTML = "";
    globalThis.keys = getAllKeys(JSONData);

    var tr = document.createElement("tr");
    tr.className = "json-table-head-row";
    tr.appendChild(TableElements.Td("json-table-head-cell", Fields.Span("Notcountable", "Nr")));

    globalThis.keys.forEach (function(value) {
        tr.appendChild(TableElements.Td("json-table-head-cell", Fields.Span("json-table-head-cell", value)));
    });
    table.appendChild(tr);

    for (var i = 0; i < JSONData.length; i++) {
        var tr = document.createElement("tr");
        tr.className = "json-table-row";
        tr.appendChild(TableElements.Td("json-table-cell-num", Fields.Span("Notcountable", i + 1)));
        keys.forEach (function(value) {
            tr.appendChild(TableElements.Td("json-table-cell", Fields.Span("countable", JSONData[i][value])));
        });
        addButtons(tr);
        table.appendChild(tr);
    }
    addForm(globalThis.keys);
    countSumsAndAvgs();
    aggregateTable();
}

function countSumsAndAvgs() {
    var table = document.getElementById("json-table");
    var children = table.children;
    var colSums = new Array(children[0].children.length - 1).fill(0);
    var rowsCount = children.length;
    for (var row = 1; row < children.length; row++) {
        var child = children[row];
        for (var col = 1; col < child.children.length; col++) {
            var child2 = child.children[col];
            if (child2.children.length > 0) {
                if (child2.children[0].className == "countable") {
                    var value = child2.children[0].tagName == "SPAN"? child2.children[0].innerHTML : child2.children[0].value;
                    if (!isNaN(parseFloat(value))) {
                        colSums[col - 1] = colSums[col - 1] + parseFloat(value);
                    }
                }
            }
        }
    }
    document.querySelectorAll('.json-table-row-calc').forEach(e => e.remove());
    appendCalculated(colSums, table, "Sum");
    appendCalculated(colSums.map(x => x / rowsCount), table, "Avg");
}

function appendCalculated(dataArray, table, rowName) {
    var tr = document.createElement("tr");
    tr.className = "json-table-row-calc";
    tr.appendChild(TableElements.Td("json-table-cell-num", Fields.Span("Notcountable", rowName)));
    dataArray.forEach(el => {
        tr.appendChild(TableElements.Td("json-table-cell", Fields.Span("Notcountable", el)));
    });
    table.appendChild(tr);
}

function getValueCountable(obj) {
    if (obj.className == "countable") {
        if (obj.tagName == "SPAN") {
            return obj.innerHTML;
        }
        if (obj.tagName == "INPUT") {
            return obj.value;
        }
    }
    return null;
}

function getColIndex(colName) {
    var table = document.getElementById("json-table");
    headRow = table.children[0];
    for (c = 1; c < headRow.children.length; c++) {
        var cell = headRow.children[c];
        if (cell.children[0].innerHTML == colName) {
            return c;
        }
    }
    return null;
}

function aggregateTable() {
    var aggTable = document.getElementById("agg-table");
    aggTable.innerHTML = "";
    var jsonTable = document.getElementById("json-table");
    var quanMap = new Map();
    var sellsMap = new Map();
    
    var calcHeadRow = ["manager", "quantity", "price"];
    var managerCellNum = getColIndex(calcHeadRow[0]);
    var quanCellNum = getColIndex(calcHeadRow[1]);
    var priceCellNum = getColIndex(calcHeadRow[2]);
    

    for (var trn = 1; trn < jsonTable.children.length; trn++) {
        var tr = jsonTable.children[trn];
        var cell = tr.children[managerCellNum];
        var manager = getValueCountable(cell.children[0]);
        quanMap.set(manager, 0);
        sellsMap.set(manager, 0)
    }

    var headrow = ["Manager", "Quantity", "Total sold price"];

    for (var trn = 1; trn < jsonTable.children.length; trn++) {
        var tr = jsonTable.children[trn];
        var managerCell = tr.children[managerCellNum];
        var quanCell = tr.children[quanCellNum];
        var priceCell = tr.children[priceCellNum];
        var manager = getValueCountable(managerCell.children[0]);
        var quan = getValueCountable(quanCell.children[0]);
        var price = getValueCountable(priceCell.children[0]);

        quanMap.set(manager, quanMap.get(manager) + parseFloat(quan));
        sellsMap.set(manager, sellsMap.get(manager) + parseFloat(quan) * parseFloat(price));
    }


    var headtr = TableElements.Tr();
    headrow.forEach(element => {
        headtr.appendChild(TableElements.Td("agg-table-head-row", Fields.Span("agg-table-head-cell", element)))
    });
    aggTable.appendChild(headtr);

    for (var key of quanMap.keys()) {
        if (!(key == null)) {
            var tr = TableElements.Tr("agg-table-row");
            tr.appendChild(TableElements.Td("agg-table-cell", Fields.Span(null, key)));
            tr.appendChild(TableElements.Td("agg-table-cell", Fields.Span(null, quanMap.get(key))));
            tr.appendChild(TableElements.Td("agg-table-cell", Fields.Span(null, sellsMap.get(key))));
            aggTable.appendChild(tr);
        }
    }
    
}

function getAllKeys(JSONData) {
    const keys = new Set();
    for (var i = 0; i < JSONData.length; i++) {
        for (var key in JSONData[i]) {
            keys.add(key);
        }
    }
    return keys;
}

class Fields {

    static Span(className, value) {
        var span = document.createElement("span");
        span.className = className;
        span.innerHTML = value;
        return span;
    } 

    static Input(className, value) {
        var input = document.createElement("input");
        input.oninput = function() {this.size = this.value.length + 1;};
        input.className = className;
        input.value = value;
        input.size = input.value.length + 1;
        return input;
    }
}

class Buttons {

    static Edit() {
        var editButton = document.createElement("button");
        editButton.type = "button";
        editButton.innerHTML = "Edit";
        editButton.className = "table-edit-button";
        editButton.onclick = function () {clickEdit(this);};
        return editButton;
    }

    static Delete() {
        var deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.innerHTML = "Delete";
        deleteButton.className = "table-delete-button";
        deleteButton.onclick = function () {clickDelete(this);};
        return deleteButton;
    }

    static Add() {
        var addButton = document.createElement("button");
        addButton.type = "button";
        addButton.onclick = function() {clickAdd(this);};
        addButton.innerHTML = "Add";
        return addButton;
    }
}

class TableElements {

    static Tr(className, inner = null) {
        var tr = document.createElement("tr");
        tr.className = className;
        if (!(inner == null)) {
            tr.appendChild(inner);
        }
        return tr;
    }

    static Td(className, inner = null) {
        var td = document.createElement("td");
        td.className = className;
        if (!(inner == null)) {
            td.appendChild(inner);
        }
        return td;
    }
}