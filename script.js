var nodes = new vis.DataSet([]);
var edges = new vis.DataSet([]);
var container = document.getElementById("network");
var data = { nodes: nodes, edges: edges };
var options = { physics: false };
var network = new vis.Network(container, data, options);

var nodeIdCounter = 0;

function addNode() {
  var label = String.fromCharCode(65 + nodeIdCounter);
  nodes.add({ id: nodeIdCounter, label: label });
  nodeIdCounter++;
  updateMatrix();
}

function addEdge(fromId, toId) {
  edges.add({ from: fromId, to: toId });
  updateMatrix();
}

function removeEdge(fromId, toId) {
  edges.get().forEach(function (e) {
    if (
      (e.from === fromId && e.to === toId) ||
      (e.from === toId && e.to === fromId)
    ) {
      edges.remove(e.id);
    }
  });
  updateMatrix();
}

function clearGraph() {
  nodes.clear();
  edges.clear();
  nodeIdCounter = 0;
  updateMatrix();
}

function updateMatrix() {
  var matrixDiv = document.getElementById("matrix");
  matrixDiv.innerHTML = "";

  var table = document.createElement("table");
  var headerRow = document.createElement("tr");
  headerRow.appendChild(document.createElement("th"));

  var nodeList = nodes.get();

  nodeList.forEach(function (node) {
    var th = document.createElement("th");
    th.innerText = node.label;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  nodeList.forEach(function (fromNode) {
    var row = document.createElement("tr");
    var rowHeader = document.createElement("th");
    rowHeader.innerText = fromNode.label;
    row.appendChild(rowHeader);

    nodeList.forEach(function (toNode) {
      var cell = document.createElement("td");
      var edgeExists = edges.get({
        filter: function (item) {
          return (
            (item.from === fromNode.id && item.to === toNode.id) ||
            (item.from === toNode.id && item.to === fromNode.id)
          );
        },
      }).length > 0;

      cell.innerText = edgeExists ? "1" : "0";
      cell.onclick = function () {
        if (edgeExists) {
          removeEdge(fromNode.id, toNode.id);
        } else {
          addEdge(fromNode.id, toNode.id);
        }
      };
      row.appendChild(cell);
    });
    table.appendChild(row);
  });

  matrixDiv.appendChild(table);
  updateBinaryWord();
}

function updateBinaryWord() {
  var word = "";
  var nodeList = nodes.get();

  nodeList.forEach(function (fromNode) {
    nodeList.forEach(function (toNode) {
      var edgeExists = edges.get({
        filter: function (item) {
          return (
            (item.from === fromNode.id && item.to === toNode.id) ||
            (item.from === toNode.id && item.to === fromNode.id)
          );
        },
      }).length > 0;

      word += edgeExists ? "1" : "0";
    });
  });

  document.getElementById("binaryOutput").innerText = word;
}

function loadFromBinary() {
  var input = document.getElementById("binaryInput").value.trim();
  if (!/^[01]+$/.test(input)) {
    alert("Bitte nur 0 und 1 eingeben.");
    return;
  }

  var length = input.length;
  var size = Math.sqrt(length);
  if (size !== Math.floor(size)) {
    alert("Die Länge des Binärworts muss ein Quadrat sein (z.B. 4, 9, 16...)");
    return;
  }

  clearGraph();

  for (var i = 0; i < size; i++) {
    addNode();
  }

  var index = 0;
  for (var from = 0; from < size; from++) {
    for (var to = 0; to < size; to++) {
      if (input[index] === "1") {
        addEdge(from, to);
      }
      index++;
    }
  }
}
