// Erstelle Network-Instanz
var nodes = new vis.DataSet([]);
var edges = new vis.DataSet([]);
var container = document.getElementById("network");
var data = { nodes: nodes, edges: edges };
var options = { physics: false };
var network = new vis.Network(container, data, options);

// Node-Zähler
var nodeIdCounter = 0;

// Node hinzufügen
function addNode() {
  var label = String.fromCharCode(65 + nodeIdCounter);
  nodes.add({ id: nodeIdCounter, label: label });
  nodeIdCounter++;
  updateMatrix();
  generateBinaryWord();
}

// Kante hinzufügen
function addEdge(fromId, toId) {
  edges.add({ from: fromId, to: toId });
  updateMatrix();
  generateBinaryWord();
}

// Graph leeren
function clearGraph() {
  nodes.clear();
  edges.clear();
  nodeIdCounter = 0;
  updateMatrix();
  generateBinaryWord();
}

// Matrix updaten
function updateMatrix() {
  var matrixDiv = document.getElementById("matrix");
  matrixDiv.innerHTML = "";

  var table = document.createElement("table");
  var headerRow = document.createElement("tr");
  headerRow.appendChild(document.createElement("th"));

  nodes.forEach(function (node) {
    var th = document.createElement("th");
    th.innerText = node.label;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  nodes.forEach(function (fromNode) {
    var row = document.createElement("tr");
    var rowHeader = document.createElement("th");
    rowHeader.innerText = fromNode.label;
    row.appendChild(rowHeader);

    nodes.forEach(function (toNode) {
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
          edges.remove(
            edges.get({
              filter: function (item) {
                return (
                  (item.from === fromNode.id && item.to === toNode.id) ||
                  (item.from === toNode.id && item.to === fromNode.id)
                );
              },
            })
          );
        } else {
          addEdge(fromNode.id, toNode.id);
        }
        updateMatrix();
        generateBinaryWord();
      };
      row.appendChild(cell);
    });
    table.appendChild(row);
  });

  matrixDiv.appendChild(table);
}

// Binärwort generieren
function generateBinaryWord() {
  let word = "";
  const nodeList = nodes.get();
  const nodeCount = nodeList.length;

  for (let i = 0; i < nodeCount; i++) {
    for (let j = 0; j < nodeCount; j++) {
      let edgeExists = edges.get({
        filter: e =>
          (e.from === nodeList[i].id && e.to === nodeList[j].id) ||
          (e.from === nodeList[j].id && e.to === nodeList[i].id),
      }).length > 0;
      word += edgeExists ? "1" : "0";
    }
  }
  document.getElementById("binaryOutput").innerText = word;
}
