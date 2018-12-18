const getArgs = f => f.toString ()
		.replace (/[\r\n\s]+/g, ' ')
		.match (/(?:function\s*\w*)?\s*(?:\((.*?)\)|([^\s]+))/)
		.slice (1,3)
		.join ('')
		.split (/\s*,\s*/);

const cycleGraph = {
	n : (a) => a,
	b : (n) => n,
	z : (x) => x,
	x : (y) => y,
	y : (z) => z
}

const testGraph = {
	n : (xs) => xs.length,
	m : (xs, n) => xs.reduce((store, item) => item + store, 0) / n,
	m2 : (xs, n) => xs.reduce((store, item) => item * store, 1) / n,
	v : (m, m2) => m * m - m2,
	xs : () => [1, 2, 3]
}

const eagerGraph = {
	receiveGraph(graph) {
		this.graph = graph;
		this.calcVertex();
		return this;
	}, 

	calcVertex() {
		const evaluated = {};
		const dependencies = Object.keys(this.graph);
		const path = new Set();

		while (dependencies.length > 0) {
			const node = dependencies.pop();

			if (evaluated[node] != undefined) continue;

			const nodeDependencies = getArgs(this.graph[node]);

			if (nodeDependencies.some(d => path.has(d))) {
				const cycleNode = nodeDependencies.find(d => path.has(d));
				const cycleString = Array.from(path).reduce((store, item) => store + (item === cycleNode ? '( ' + item + ' )' : item) + ' -> ', '');
				console.log("Error: cyclic dependency detected: " + cycleString + node + ' -> ' + '( ' + cycleNode + ' )');
				return;
			}
			
			const notEvaluated = nodeDependencies.filter(d => d != "" && evaluated[d] == undefined);

			if (notEvaluated.length > 0) {
				dependencies.push(node);
				path.add(node);
				dependencies.push(...notEvaluated);
			} else {
				evaluated[node] = this.graph[node].apply(null, nodeDependencies.map(d => evaluated[d]));
				path.delete(node);
			}
		}

		this.values = evaluated;
		return this;
	},

	getVertexValue(vertex) {
		return this.values[vertex];
	}
}

console.log(eagerGraph.receiveGraph(testGraph).getVertexValue('v'));

