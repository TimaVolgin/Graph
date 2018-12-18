
const testGraph = {
	m : (xs, n) => xs.reduce((store, item) => item + store, 0) / n,
	m2 : (xs, n) => xs.reduce((store, item) => item * store, 1) / n,
	v : (m, m2) => m * m - m2,
	n : (xs) => xs.length,
	xs : () => [1, 2, 3]
}

const lazyGraph = {
	receiveGraph : (graph) => {
		for (var property in graph) {
  			if (graph.hasOwnProperty(property)) {
    			eval('Object.defineProperty(this, "' + property + '", { ' + 
    				'get : () => ' + graph[property].toString().substring(graph[property].toString().indexOf('=>') + 2) +
    				'});'
				)
  			}
		}
		return lazyGraph;
	}, 

	calcVertex : (vertex) => this[vertex]
}

console.log(lazyGraph.receiveGraph(testGraph).calcVertex('v'))
