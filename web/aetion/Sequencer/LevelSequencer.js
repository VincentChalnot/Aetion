/**
 * Description of Sequencer
 *
 * @author vincent
 */
Aetion.LevelSequencer = function(entity) {

	this.contour = null;

	this.init = function(entity) {
		this.entity = entity;
		this.wallDepth = entity.wallDepth;
		this.isGroundLevel = entity.isGroundLevel;
	};

	this.getGeometry = function() {
		var b = this.entity.boundaries;

		var cellX = this.computeCellSize(b.width);
		var cellCountX = b.width / cellX;
		var cellY = this.computeCellSize(b.depth);
		var cellCountY = b.depth / cellY;
		var contour = this.getContour(cellCountX, cellCountY);

		var extContour = [];
		for (i in contour) {
			extContour.push(new THREE.Vector2(contour[i].x * cellX - b.width / 2, contour[i].y * cellY - b.depth / 2));
		}
		var levelShape = new THREE.Shape(extContour);

		var levelGeometry = levelShape.extrude({amount: b.height, size: 1, bevelEnabled: false});
		levelGeometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 2)); // Rotate to position it horizontally
		levelGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, b.height / 2, 0)); // Lower position to fit boundaries
		return levelGeometry;
	};

	this.getContour = function(cellCountX, cellCountY) {
		if (this.contour) {
			return this.contour;
		}
		var contour = [];
		// Creating random point in the grid to create a shape from it
		var randPoint = {
			x: Aetion.Sequencer.chooseFromRange(0, cellCountX, this.entity.seed + 'level.randPointX'),
			y: Aetion.Sequencer.chooseFromRange(0, cellCountY, this.entity.seed + 'level.randPointY')
		};
		var skip = false;
		if (cellCountX < 4 || cellCountY < 4) {
			skip = true; // Skip the random process
		}
		if (randPoint.x === 0 || randPoint.x === cellCountX || randPoint.y === 0 || randPoint.y === cellCountY) {
			skip = true;
		}
		if (randPoint.x < cellCountX / 2 && randPoint.y < cellCountY / 2 && !skip) {
			contour.push({x: randPoint.x, y: 0});
			contour.push({x: randPoint.x, y: randPoint.y});
			contour.push({x: 0, y: randPoint.y});
		} else {
			contour.push({x: 0, y: 0});
		}
		if (randPoint.x < cellCountX / 2 && randPoint.y > cellCountY / 2 && !skip) {
			contour.push({x: 0, y: randPoint.y});
			contour.push({x: randPoint.x, y: randPoint.y});
			contour.push({x: randPoint.x, y: cellCountY});
		} else {
			contour.push({x: 0, y: cellCountY});
		}
		if (randPoint.x > cellCountX / 2 && randPoint.y > cellCountY / 2 && !skip) {
			contour.push({x: randPoint.x, y: cellCountY});
			contour.push({x: randPoint.x, y: randPoint.y});
			contour.push({x: cellCountX, y: randPoint.y});
		} else {
			contour.push({x: cellCountX, y: cellCountY});
		}
		if (randPoint.x > cellCountX / 2 && randPoint.y < cellCountY / 2 && !skip) {
			contour.push({x: cellCountX, y: randPoint.y});
			contour.push({x: randPoint.x, y: randPoint.y});
			contour.push({x: randPoint.x, y: 0});
		} else {
			contour.push({x: cellCountX, y: 0});
		}
		return this.contour = contour;
	};

	this.computeCellSize = function(s) {
		var cs = Math.floor(s / 2);
		return s / cs;
	};

	this.getWindowsPositions = function() {
		var b = this.entity.boundaries;

		var cellX = this.computeCellSize(b.width);
		var cellCountX = b.width / cellX;
		var cellY = this.computeCellSize(b.depth);
		var cellCountY = b.depth / cellY;
		var contour = this.getContour(cellCountX, cellCountY);
		
		contour = this.getContour(cellCountX, cellCountY);
		contour.push(contour[0]);
		var windows = [];
		var matrix;
		for(i in contour){
			if(contour[i-1]){
				var wallSize = Math.round(Math.sqrt(Math.pow(contour[i].x - contour[i-1].x, 2) + Math.pow(contour[i].y - contour[i-1].y, 2)));
				if(wallSize === 1){
					wallSize = 2;
				}
				for (var j = 1; j < wallSize; j++){
					matrix = new THREE.Matrix4().makeTranslation(
						(contour[i - 1].x + (contour[i].x - contour[i - 1].x) / (wallSize / j)) * cellX - b.width / 2,
						0,
						(contour[i - 1].y + (contour[i].y - contour[i - 1].y) / (wallSize / j)) * cellY - b.depth / 2
					);
					if(contour[i].y === contour[i - 1].y){ // Meaning perpendicular to normal
						if(contour[i].y < cellCountY / 2) {
							matrix.multiply(new THREE.Matrix4().makeRotationY(Math.PI/2));
						} else {
							matrix.multiply(new THREE.Matrix4().makeRotationY(-Math.PI/2));
						}
					} else {
						if(contour[i].x < cellCountX / 2) {
							matrix.multiply(new THREE.Matrix4().makeRotationY(Math.PI));
						}
					}
					windows.push(matrix);
				}
			}
		}
		return windows;
	};

	this.init(entity);
};
