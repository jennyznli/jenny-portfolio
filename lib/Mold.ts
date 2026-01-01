import type p5 from 'p5';

export class Mold {
  x: number;
  y: number;
  r: number;
  scheme: { r: number; g: number; b: number; a: number };
  heading: number;
  vx: number;
  vy: number;
  rotAngle: number;
  stop: boolean;
  speed: number;
  rSensorPos: p5.Vector;
  lSensorPos: p5.Vector;
  fSensorPos: p5.Vector;
  sensorAngle: number;
  sensorDist: number;
  offScreen: boolean = false;
  currentTheme: any; // Add theme property

  constructor(
    centerX: number,
    centerY: number,
    spread: number,
    moldScheme: { r: number; g: number; b: number; a: number },
    p: p5,
    currentTheme: any // Add theme parameter
  ) {
    this.x = p.random(centerX - spread, centerX + spread);
    this.y = p.random(centerY - spread, centerY + spread);
    this.r = 0.8;
    this.scheme = { ...moldScheme };

    this.heading = p.random(360);
    this.vx = p.cos(this.heading);
    this.vy = p.sin(this.heading);
    this.rotAngle = 45;
    this.stop = false;
    this.speed = 1.7;

    this.rSensorPos = p.createVector(0, 0);
    this.lSensorPos = p.createVector(0, 0);
    this.fSensorPos = p.createVector(0, 0);
    this.sensorAngle = 45;
    this.sensorDist = 100;
    this.currentTheme = currentTheme; // Store theme
  }

  update(p: p5, foodSources: any[], d: number) {
    this.x = this.x + p.cos(this.heading) * this.speed;
    this.y = this.y + p.sin(this.heading) * this.speed;

    this.offScreen = this.x < 0 || this.x > p.width || this.y < 0 || this.y > p.height;

    if (this.offScreen) {
      return;
    }

    this.getSensorPos(this.rSensorPos, this.heading + this.sensorAngle, p);
    this.getSensorPos(this.lSensorPos, this.heading - this.sensorAngle, p);
    this.getSensorPos(this.fSensorPos, this.heading, p);

    let index, l, r, f;
    index = 4 * (d * p.floor(this.rSensorPos.y)) * (d * p.width) + 4 * (d * p.floor(this.rSensorPos.x));
    r = p.pixels[index];
    index = 4 * (d * p.floor(this.lSensorPos.y)) * (d * p.width) + 4 * (d * p.floor(this.lSensorPos.x));
    l = p.pixels[index];
    index = 4 * (d * p.floor(this.fSensorPos.y)) * (d * p.width) + 4 * (d * p.floor(this.fSensorPos.x));
    f = p.pixels[index];

    // Chemotaxis logic - inverted for dark vs light mode
    if (this.currentTheme.isDarkMode) {
      // dark mode - seek bright areas
      if (f > l && f > r) {
        this.heading += 0; 
      } else if (f < l && f < r) {
        if (p.random(1) < 0.5) {
          this.heading += this.rotAngle;
        } else {
          this.heading -= this.rotAngle;
        }
      } else if (l > r) {
        this.heading += -this.rotAngle;
      } else if (r > l) {
        this.heading += this.rotAngle;
      }
    } else {
      // light mode - seek dark areas
      if (f < l && f < r) {
        this.heading += 0;
      } else if (f > l && f > r) {
        if (p.random(1) < 0.5) {
          this.heading += this.rotAngle;
        } else {
          this.heading -= this.rotAngle;
        }
      } else if (l < r) {
        this.heading += -this.rotAngle;
      } else if (r < l) {
        this.heading += this.rotAngle;
      }
    }

    // Food source attraction
    let closestFood = null;
    let closestDist = Infinity;

    for (let food of foodSources) {
      let distance = p.dist(this.x, this.y, food.x, food.y);
      if (distance < closestDist) {
        closestDist = distance;
        closestFood = food;
      }
    }

    if (closestFood && closestDist < 200) {
      let targetAngle = p.atan2(closestFood.y - this.y, closestFood.x - this.x);
      let angleDiff = targetAngle - this.heading;

      while (angleDiff > 180) angleDiff -= 360;
      while (angleDiff < -180) angleDiff += 360;

      let falloff = 1 - closestDist / 200;
      let attractionStrength = closestFood.weight * falloff;

      this.heading += angleDiff * attractionStrength * 0.3;
    }
  }

  display(p: p5) {
    p.noStroke();
    p.fill(this.scheme.r, this.scheme.g, this.scheme.b, this.scheme.a);
    p.ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }

  getSensorPos(sensor: p5.Vector, angle: number, p: p5) {
    sensor.x = this.x + this.sensorDist * p.cos(angle);
    sensor.y = this.y + this.sensorDist * p.sin(angle);

    sensor.x = p.constrain(sensor.x, 0, p.width);
    sensor.y = p.constrain(sensor.y, 0, p.height);
  }
}