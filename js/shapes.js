import PointFactory from './point';

const Shapes = {
  regularPolygon({ centerX, centerY, sideLength, edges }) {
		const { sin, PI, cos } = Math;
		const angle = PI / edges;
		const radius = sideLength / (2 * sin(angle));
		let verticies = [];
		
		for (let i = 0; i < edges; i++) {
			const x = centerX + radius * cos(angle * (1 + 2 * i));
			const y = centerY + radius * sin(angle * (1 + 2 * i));
			verticies[i] = PointFactory(x, y); 
		}
		
		verticies = verticies.concat([verticies[0]]);

		return verticies;
  },
};

export default Shapes;
