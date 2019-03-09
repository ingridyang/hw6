// All the paths
let paths = [];
// Are we painting?
let painting = false;
// How long until the next circle
let next = 0;
// Where are we now and where were we?
let current;
let previous;

// sound 
// var mySound;

// function preload() {
//   mySound = loadSound('small-dog-barking-daniel-simion.mp3');
// }

function setup() {
  createCanvas(720, 600);
  current = createVector(0,0);
  previous = createVector(0,0);
}

function draw() {
  background(220);
  
  // new point
  if (millis() > next && painting) {

    // mouse position      
    current.x = mouseX;
    current.y = mouseY;

    // new particle with mouse movement
    let force = p5.Vector.sub(current, previous);
    force.mult(0.05);

    // Add circle
    paths[paths.length - 1].add(current, force);
    
    // next circle
    next = millis() + random(200);

    // Store mouse values
    previous.x = current.x;
    previous.y = current.y;
  }

  // Draw all paths
  for( let i = 0; i < paths.length; i++) {
    paths[i].update();
    paths[i].display();
  }
}

// Start
function mousePressed() {
  next = 0;
  painting = true;
  previous.x = mouseX;
  previous.y = mouseY;
  paths.push(new Path());
}

// Stop
function mouseReleased() {
  painting = false;
}

// A Path is a list of particles
class Path {
  constructor() {
    this.particles = [];
    this.hue = random(50);
  }

  add(position, force) {
    // Add a new particle with a position, force, and hue
    this.particles.push(new Particle(position, force, this.hue));
  }
  
  // display
  update() {  
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update();
    }
  }  
  
  // display 2
  display() {    
    // loop 
    for (let i = this.particles.length - 1; i >= 0; i--) {
      // If it should be remove it
      if (this.particles[i].lifespan <= 0) {
        this.particles.splice(i, 1);
      // Otherwise, display it
      } else {
        this.particles[i].display(this.particles[i+1]);
      }
    }
  
  }  
}

// circle along the line
class Particle {
  constructor(position, force, hue) {
    this.position = createVector(position.x, position.y);
    this.velocity = createVector(force.x, force.y);
    this.drag = 0.95;
    this.lifespan = 200;
  }

  update() {
    // Move it
    this.position.add(this.velocity);
    // Slow it down
    this.velocity.mult(this.drag);
    // Fade out
    this.lifespan--;
  }

  // Draw particle and connect it with a line to another
  display(other) {
    stroke(0, this.lifespan);
    fill(0, this.lifespan/2);    
    ellipse(this.position.x,this.position.y, 8, 8);    
    // draw  line
    if (other) {
      line(this.position.x, this.position.y, other.position.x, other.position.y);
    }
  }
}
