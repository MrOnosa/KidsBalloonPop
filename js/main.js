
window.onload = function () {
    // TODO:: Do your initialization job

    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName === "back") {
			try {
			    tizen.application.getCurrentApplication().exit();
			} catch (ignore) {
			}
		}
	});

    // Sample code
    //var textbox = document.querySelector('.contents');
    //textbox.addEventListener("click", function(){
    //	var box = document.querySelector('#textbox');
    //	box.innerHTML = (box.innerHTML === "Basic") ? "Sample" : "Basic";
    //});
    
    //document.body.addEventListener('click', function click(){
    	//document.body.innerHTML = '';
    	//new p5(sketch);}, true);
	//new p5(sketch);

    
};


/*
var sketch = function(p) {
	  var initial_size = 2;
	  var initial_deviation = 300;
	  var deviation = 90;

	  var points;
	  var current;

	  p.setup = function() {
	    p.createCanvas(360, 360);
	    p.background("#ffface");
	    p.noStroke();
	    p.colorMode(p.HSB);
	    p.blendMode(p.DARKEST);
	    p.noLoop();
	  }

	  p.draw = function() {
	    for (var h = -10; h < p.height; h+=30) {
	      init(h);
	      p.fill(p.random(360),100,80, .01);
	      for (var i = 0; i < 5; i++) {
	        current = update();
	        display();
	      }
	    }
	  }
	  
	  function init (ypos) {
	    points = [];
	    for (var i = 0; i < initial_size; i++) {
	      points.push(p.createVector((i / (initial_size - 1)) * p.width, ypos, p.random(-1,1)));
	    }
	    for(var b = 0; b < 6; b++) {
	      interpolate(points, initial_deviation);
	    }
	  }
	  
	  function update () {
	    var c = deep_copy(points);
	    for(var b = 0; b < 5; b++) {
	      for (var i = 0; i < c.length; i++) {
	        move_nearby(c[i], deviation);
	      }
	    }
	    return c;
	  }

	  function display () {
	    p.beginShape();
	    for (var i = 0; i < current.length; i++) {
	      p.vertex(current[i].x, current[i].y);
	    }
	    p.vertex(p.width,p.height);
	    p.vertex(0,p.height);
	    p.endShape(p.CLOSE);
	  }

	  function interpolate (points, sd) {
	    for (var i = points.length-1; i > 0; i--) {
	      points.splice(i, 0, generate_midpoint(points[i-1], points[i], sd));
	    }
	  }

	  function generate_midpoint (p1, p2, sd) {
	    var p3 = p.createVector((p1.x + p2.x) / 2, (p1.y + p2.y) / 2, ((p1.z + p2.z) / 2) * .45 * p.random(.1, 3.5));
	    move_nearby(p3, sd);
	    return p3;
	  }

	  var move_nearby = function(pnt, sd) {
	    pnt.x = p.randomGaussian(pnt.x, pnt.z * sd);
	    pnt.y = p.randomGaussian(pnt.y, pnt.z * sd);
	  }

	  var deep_copy = function(arr) {
	    var narr = [];
	    for (var i = 0; i < arr.length; i++) {
	      narr.push(arr[i].copy());
	    }
	    return narr;
	  }

	  p.keyPressed = function () {
	    if (p.keyCode === 80) {
	      p.saveCanvas("foggy", "jpeg");
	    }
	  }
	}
	*/

