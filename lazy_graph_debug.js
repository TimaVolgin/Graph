const DEBUG = true;

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

const lazyGraph = {
	receiveGraph(graph) {
		this.graph = graph;
		return this;
	}, 

	calcVertex(vertex) {
		if (DEBUG) console.log('evaluate for: ' + vertex);

		const evaluated = {};
		const dependencies = [vertex];
		const path = new Set([vertex]);

		while (dependencies.length > 0) {
			if (DEBUG) console.log('=====================');
			if (DEBUG) console.log('dependencies = ' + dependencies);

			const node = dependencies.pop();

			if (DEBUG) console.log('current: ' + node);
			if (DEBUG) console.log('evaluated: ' + evaluated[node]);

			if (evaluated[node] != undefined) continue;

			const nodeDependencies = getArgs(this.graph[node]);

			if (DEBUG) console.log('dependicies: ' + nodeDependencies);

			if (nodeDependencies.some(d => path.has(d))) {
				console.log("Error: cyclic dependency detected");
				return;
			}
			
			const notEvaluated = nodeDependencies.filter(d => d != "" && evaluated[d] == undefined);

			if (DEBUG) console.log('notEvaluated: ' + notEvaluated);

			if (notEvaluated.length > 0) {
				if (DEBUG) console.log('add notEvaluated');
				dependencies.push(node);

				path.add(node);
				if (DEBUG) console.log('path: ' + path);
				
				dependencies.push(...notEvaluated);
			} else {
				if (DEBUG) console.log('evaluate and add');
				evaluated[node] = this.graph[node].apply(null, nodeDependencies.map(d => evaluated[d]));
				if (DEBUG) console.log('Evaluated: ' + evaluated);

				path.delete(node);
				if (DEBUG) console.log('path: ' + path);
			}
		}

		return evaluated[vertex]
	}
}

console.log(lazyGraph.receiveGraph(testGraph).calcVertex('v'))

