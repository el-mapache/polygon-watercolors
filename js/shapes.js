import PointFactory from './point';

const Shapes = {
  regularPolygon({ centerX, centerY, edgeLength, edges }) {
		const { sin, PI, cos } = Math;
		/**
		 * in radians, PI maps to 180 degrees. This angle is needed
		 * to compute the radius of a polygon, following this formula:
		 * 
		 * sideLength / 2 * sin(180/numOfSides)
		 */
		const angle = PI / edges;
		/**
		 * as noted above, this is the standard formula for finding
		 * the radius of a regular polygon
		 */
		const radius = edgeLength / (2 * sin(angle));

		let verticies = [];
		
		for (let i = 0; i < edges; i++) {
			/**
			 * moving in a circle from the center point of the ploygon,
			 * generate verticies `${edgeLength}` degrees (technically, in radians)
			 * apart from one another
			*/
			const x = centerX + radius * cos(angle * (1 + 2 * i));
			const y = centerY + radius * sin(angle * (1 + 2 * i));
			verticies[i] = PointFactory(x, y); 
		}
		
		/**
		 * Manually add the first vertex to the end of the array
		 * so the polygon closes itself. Without this, there will be
		 * a pacman-style bite taken out of the shape!
		*/
		verticies = verticies.concat([verticies[0]]);

		return verticies;
  },
};

export default Shapes;
