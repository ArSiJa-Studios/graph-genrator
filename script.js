// Binäranzeige
document.getElementById("binaryInput").addEventListener("input", function () {
  document.getElementById("binaryOutput").innerText = this.value;
});

// Graph-Daten
let nodes = new vis.DataSet([]);
let edges = new vis.DataSet([]);
let network = null;
let nodeId = 1;
let adjMatrix = [];

// Graph initialisieren
function initGraph() {
  const container = document.getElementById("graph");
  const data = { nodes, edges };
  const options = {
    interaction: { multiselect: true },
    manipulation: {
      enabled: true,
      addEdge: function (data, callback) {
        if (data.from !== data.to) {
          edges.add(data);
          updateMatrix();
        }
        callback(null);
      },
      deleteNode: function (data, callback) {
        edges.remove(function (item) {
          return data.nodes.includes(item.from) || data.nodes.includes(item.to);
        });
        callback(data);
        updateMatrix();
      },
      deleteEdge: function (data, callback) {
        callback(data);
        updateMatrix();
      },
    },
  };
  network = new vis.Network(container, data, options);
}

// Knoten hinzufügen
function addNode() {
  nodes.add({ id: nodeId, label: "Node " + nodeId });
  adjMatrix.push(new Array(nodeId).fill(0));
  adjMatrix.forEach(row => row.push(0));
  nodeId++;
  updateMatrix();
}

// Graph und Matrix zurücksetzen
function clearGraph() {
  nodes.clear();
  edges.clear();
  nodeId = 1;
  adjMatrix = [];
  updateMatrix();
}

// Adjazenzmatrix aktualisieren
function updateMatrix() {
  const matrixContainer = document.getElementById("matrixContainer");
  matrixContainer.innerHTML = "";

  if (nodes.length === 0) return;

  let table = document.createElement("table");
  let headerRow = document.createElement("tr");
  headerRow.innerHTML = "<th></th>";
  nodes.forEach(n => {
    headerRow.innerHTML += `<th>${n.id}</th>`;
  });
  table.appendChild(headerRow);

  nodes.forEach(fromNode => {
    let row = document.createElement("tr");
    row.innerHTML = `<th>${fromNode.id}</th>`;
    nodes.forEach(toNode => {
      let cell = document.createElement("td");
      let edgeExists = edges.get({
        filter: e => (e.from === fromNode.id && e.to === toNode.id) || (e.from === toNode.id && e.to === fromNode.id)
      }).length > 0;
      cell.innerText = edgeExists ? "1" : "0";

      // Zelle klickbar machen
      cell.addEventListener("click", () => {
        if (edgeExists) {
          // Kante löschen
          edges.remove(edges.get({
            filter: e => (e.from === fromNode.id && e.to === toNode.id) || (e.from === toNode.id && e.to === fromNode.id)
          }).map(e => e.id));
        } else if (fromNode.id !== toNode.id) {
          // Kante hinzufügen
          edges.add({ from: fromNode.id, to: toNode.id });
        }
        updateMatrix();
      });

      row.appendChild(cell);
    });
    table.appendChild(row);
  });

  matrixContainer.appendChild(table);
}

// Start
initGraph();
