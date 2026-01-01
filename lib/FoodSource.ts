import type p5 from 'p5';
import { Mold } from './Mold';

export class FoodSource {
  x: number;
  y: number;
  baseWeight: number;
  weight: number;
  isStartNode: boolean;
  fadeSpeed: number;
  firstNodeIncrease: number;
  maxAlpha: number;
  scheme: { r: number; g: number; b: number; a: number };
  discovered: boolean;
  size: number;
  hoverSize: number;
  currentSize: number;
  spawnRate: number;
  spawnRadius: number;
  canSpawn: boolean;
  url: string | null;
  label: string | null;
  isHovered: boolean;
  popupData: any;
  targetSize: number;
  currentTheme: any; // Add theme property

  constructor(
    x: number,
    y: number,
    weight: number,
    isStartNode: boolean,
    foodScheme: { r: number; g: number; b: number; a: number },
    size: number,
    url: string | null,
    title: string | null,
    image: any,
    targetSize: number,
    currentTheme: any // Add theme parameter
  ) {
    this.x = x;
    this.y = y;
    this.baseWeight = weight;
    this.weight = weight;
    this.isStartNode = isStartNode;
    this.fadeSpeed = 0.5;
    this.firstNodeIncrease = 0.001;
    this.maxAlpha = foodScheme.a;

    this.scheme = {
      r: foodScheme.r,
      g: foodScheme.g,
      b: foodScheme.b,
      a: 0,
    };
    this.discovered = false;
    this.size = size;
    this.hoverSize = size * 1.5;
    this.currentSize = size;
    this.targetSize = size;

    this.spawnRate = 1.5;
    this.spawnRadius = 0;
    this.canSpawn = false;

    this.url = url;
    this.label = title;
    this.isHovered = false;
    this.popupData = {
      title: title,
      image: image,
    };
    this.currentTheme = currentTheme; // Store theme
  }

  checkDiscovery(molds: Mold[], discoveryRadius: number, p: p5) {
    if (!this.discovered) {
      for (let mold of molds) {
        let d = p.dist(mold.x, mold.y, this.x, this.y);
        if (d < discoveryRadius) {
          this.discover();
          return true;
        }
      }
    }
    return false;
  }

  discover() {
    if (!this.discovered) {
      this.discovered = true;
      this.canSpawn = true;
    }
  }

  spawnMold(moldScheme: any, p: p5) {
    if (this.canSpawn && this.discovered && p.random(1) < this.spawnRate) {
      let angle = p.random(p.TWO_PI);
      let distance = p.random(this.spawnRadius);
      let newX = this.x + p.cos(angle) * distance;
      let newY = this.y + p.sin(angle) * distance;

      return new Mold(newX, newY, 0, moldScheme, p, this.currentTheme);
    }
    return null;
  }

  update(p: p5) {
    if (this.discovered && this.scheme.a < this.maxAlpha) {
      this.scheme.a += this.fadeSpeed;
      this.scheme.a = p.min(this.scheme.a, this.maxAlpha);
    }

    if (this.isStartNode && this.weight < this.baseWeight) {
      this.weight += this.baseWeight * this.firstNodeIncrease;
      this.weight = p.min(this.weight, this.baseWeight);
    }

    this.targetSize = this.isHovered ? this.hoverSize : this.size;
    this.currentSize = p.lerp(this.currentSize, this.targetSize, 0.2);
  }

  projectChemoattractant(pixelDensity: number, p: p5) {
    let x = p.floor(this.x);
    let y = p.floor(this.y);

    if (x >= 0 && x < p.width && y >= 0 && y < p.height) {
      let index = 4 * (pixelDensity * y) * (pixelDensity * p.width) + 4 * (pixelDensity * x);

      let boost = this.weight * 1000;

      if (index >= 0 && index < p.pixels.length - 3) {
        if (this.currentTheme.isDarkMode) {
          // dark mode - add brightness
          p.pixels[index] = p.min(255, p.pixels[index] + boost);
          p.pixels[index + 1] = p.min(255, p.pixels[index + 1] + boost);
          p.pixels[index + 2] = p.min(255, p.pixels[index + 2] + boost);
        } else {
          // light mode - subtract brightness
          p.pixels[index] = p.max(0, p.pixels[index] - boost);
          p.pixels[index + 1] = p.max(0, p.pixels[index + 1] - boost);
          p.pixels[index + 2] = p.max(0, p.pixels[index + 2] - boost);
        }
      }
    }
  }

  display(p: p5) {
    if (this.scheme.a > 0) {
      p.push();

      let hoverAlpha = this.isHovered ? p.min(this.scheme.a + 50, 255) : this.scheme.a;

      p.fill(this.scheme.r, this.scheme.g, this.scheme.b, hoverAlpha);
      p.noStroke();
      p.circle(this.x, this.y, this.currentSize);

      p.pop();
    }
  }

  checkHover(mx: number, my: number, p: p5) {
    if (!this.discovered) return false;

    let distance = p.dist(mx, my, this.x, this.y);
    let wasHovered = this.isHovered;
    
    // When popup is showing, use the popup circle's radius (70px / 2 = 35px)
    // Otherwise use the initial hover size
    let popupRadius = 35; // Half of the 70px popup circle
    let hoverRadius = this.isHovered ? popupRadius : this.hoverSize / 2;
    
    this.isHovered = distance < hoverRadius;

    if (this.isHovered && !wasHovered) {
      this.showPopup();
    }
    if (!this.isHovered && wasHovered) {
      this.hidePopup();
    }

    return this.isHovered;
  }

  showPopup() {
    if (typeof window === 'undefined') return;
    
    const popup = document.getElementById('node-popup');
    const title = document.getElementById('popup-title');
    const image = document.getElementById('popup-image') as HTMLImageElement;
    const clickable = document.getElementById('popup-clickable') as HTMLDivElement;

    if (!popup || !title || !image || !clickable) return;

    title.textContent = this.popupData.title;

    if (this.popupData.image) {
      image.src = this.popupData.image;
      image.style.display = 'block';
    } else {
      image.style.display = 'none';
    }

    // Position popup at node location
    popup.style.left = `${this.x}px`;
    popup.style.top = `${this.y}px`;
    popup.style.display = 'block';
    
    // Trigger fade-in animation
    setTimeout(() => {
      popup.style.opacity = '1';
    }, 10);

    // Add click handler to the entire circle
    clickable.onclick = () => {
      if (this.url) {
        window.location.href = this.url;
      }
    };
  }

  hidePopup() {
    if (typeof window === 'undefined') return;
    
    const popup = document.getElementById('node-popup');
    if (popup) {
      popup.style.opacity = '0';
      setTimeout(() => {
        popup.style.display = 'none';
      }, 700); // Match the transition duration in CSS
    }
  }

  handleClick() {
    // Click is now handled by the popup element itself
  }

  multiplyWeight(factor: number) {
    this.weight *= factor;
  }

  // targetSize: number = this.size;
}