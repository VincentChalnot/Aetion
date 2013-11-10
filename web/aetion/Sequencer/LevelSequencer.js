/**
 * Description of Sequencer
 *
 * @author vincent
 */
Aetion.LevelSequencer = function(entity) {

	this.init = function(entity) {
		this.entity = entity;
		this.wallDepth = entity.wallDepth;
		this.isGroundLevel = entity.isGroundLevel;
	};

	this.generateGeometry = function() {
		var b = this.entity.boundaries;
		var contour = this.generateContour(b.width, b.depth);
		
		var extContour = [];
		for(i in contour){
			extContour.push(new THREE.Vector2(contour[i].ext.x, contour[i].ext.y));
		}
		var levelShape = new THREE.Shape(extContour);
		
		var intContour = [];
		for(i in contour){
			intContour.push(new THREE.Vector2(contour[i].int.x, contour[i].int.y));
		}
		levelShape.holes.push(new THREE.Path(intContour));
		
		var levelGeometry = levelShape.extrude({amount: b.height, size: 1, bevelEnabled: false});
		levelGeometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2)); // Rotate to position it horizontally
		levelGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -b.height / 2, 0)); // Lower position to fit boundaries
		return levelGeometry;
	};
	
	this.generateContour = function(w, h){
		var wd = this.wallDepth;
		var mx = w / 2;
		var my = h / 2;
		var contour = [];
		var cellX = this.computeCellSize(w);
		var cellCountX = w / cellX;
		var cellY = this.computeCellSize(h);
		var cellCountY = h / cellY;
		contour.push({ ext: { x: mx, y: my }, int: { x: mx - wd, y: my - wd} });
		if(cellCountX >= 8 && this.isGroundLevel){
			contour.push({ ext: { x: mx - cellX * 2,  y: my },         int: { x: mx - cellX * 2 + wd,  y: my - wd} });
			contour.push({ ext: { x: mx - cellX * 2,  y: my - cellY }, int: { x: mx - cellX * 2 + wd,  y: my - cellY - wd} });
			contour.push({ ext: { x: -mx + cellX * 2, y: my - cellY }, int: { x: -mx + cellX * 2 + wd, y: my - cellY - wd} });
			contour.push({ ext: { x: -mx + cellX * 2, y: my },         int: { x: -mx + cellX * 2 + wd, y: my - wd} });
		}
		contour.push({ ext: { x: -mx, y: my}, int: { x: -mx + wd, y: my - wd} });
		if(cellCountY >= 8 && this.isGroundLevel){
			contour.push({ ext: { x: -mx,         y: my - cellY * 2 },  int: { x: -mx + wd,         y: my - cellY * 2 + wd} });
			contour.push({ ext: { x: -mx + cellX, y: my - cellY * 2 },  int: { x: -mx + cellX + wd, y: my - cellY * 2 + wd} });
			contour.push({ ext: { x: -mx + cellX, y: -my + cellY * 2 }, int: { x: -mx + cellX + wd, y: -my + cellY * 2 - wd} });
			contour.push({ ext: { x: -mx,         y: -my + cellY * 2 }, int: { x: -mx + wd,         y: -my + cellY * 2 - wd} });
		}
		contour.push({ ext: { x: -mx, y: -my}, int: { x: -mx + wd, y: -my + wd} });
		if(cellCountX >= 8 && cellCountY >= 8){
			
		}
		contour.push({ ext: { x: mx, y: -my}, int: { x: mx - wd, y: -my + wd} });
		if(cellCountX >= 8 && cellCountY >= 8){
			
		}
		return contour;
	};
	
	this.computeCellSize = function (s){
		var cs = Math.floor(s / 2);
		return s / cs;
	};
	
	this.init(entity);
};
