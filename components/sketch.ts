import { Sketch, SketchProps } from '@p5-wrapper/react';
import { Mold } from '@/lib/Mold';
import { FoodSource } from '@/lib/FoodSource';
import { themes, Theme } from '@/lib/themes';
import { portfolioSections } from '@/lib/portfolioNodes';

type MySketchProps = SketchProps & {
  currentTheme: Theme;
};

export const createSketch = () => {
  const sketch: Sketch<MySketchProps> = (p) => {
    let molds: Mold[] = [];
    let foodSources: FoodSource[] = [];
    let d: number;
    let currentTheme: Theme = themes.light;

    const num = 1000;
    const foodSourceWeight = 0.035;
    const MAX_MOLDS = 6000;
    const DECAY_RATE = 7;

    p.updateWithProps = (props: MySketchProps) => {
      if (props.currentTheme) {
        currentTheme = props.currentTheme;

        // Update existing molds
        for (let mold of molds) {
          mold.scheme.r = currentTheme.mold.r;
          mold.scheme.g = currentTheme.mold.g;
          mold.scheme.b = currentTheme.mold.b;
          mold.currentTheme = currentTheme; // Update theme reference
        }

        // Update existing food sources
        for (let source of foodSources) {
          source.scheme.r = currentTheme.food.r;
          source.scheme.g = currentTheme.food.g;
          source.scheme.b = currentTheme.food.b;
          source.currentTheme = currentTheme; // Update theme reference
        }
      }
    };

    p.setup = () => {
      p.createCanvas(1600, 900);
      p.pixelDensity(2);
      p.angleMode(p.DEGREES);
      d = p.pixelDensity();

      initFoodSources();

      if (foodSources.length > 0) {
        let startSource = foodSources[0];
        for (let i = 0; i < num; i++) {
          molds[i] = new Mold(startSource.x, startSource.y, 20, currentTheme.mold, p, currentTheme);
        }
      }
    };

    p.draw = () => {
      p.background(currentTheme.background, DECAY_RATE);
      p.loadPixels();

      for (let source of foodSources) {
        source.projectChemoattractant(d, p);

        if (molds.length < MAX_MOLDS) {
          let newMold = source.spawnMold(currentTheme.mold, p);
          if (newMold) {
            molds.push(newMold);
          }
        }
      }
      p.updatePixels();

      for (let mold of molds) {
        mold.update(p, foodSources, d);
        mold.display(p);
      }

      molds = molds.filter((mold) => !mold.offScreen);

      let anyHovered = false;
      for (let source of foodSources) {
        source.checkDiscovery(molds, 30, p);
        if (source.checkHover(p.mouseX, p.mouseY, p)) {
          anyHovered = true;
        }
        source.update(p);
        source.display(p);
      }

      p.cursor(anyHovered ? 'pointer' : 'default');
    };

    p.mousePressed = () => {
      for (let source of foodSources) {
        source.handleClick();
      }
    };

    function initFoodSources() {
      foodSources = [];

      let margin = 150;
      let minDistance = 150;
      let maxAttempts = 100;

      // Create first node near center
      let firstSection = portfolioSections[0];
      let centerRadius = 200;
      let angle = p.random(p.TWO_PI);
      let distance = p.random(centerRadius);
      let firstX = p.width / 2 + p.cos(angle) * distance;
      let firstY = p.height / 2 + p.sin(angle) * distance;

      let firstNode = new FoodSource(
        firstX,
        firstY,
        foodSourceWeight,
        true,
        currentTheme.food,
        20,
        firstSection.url,
        firstSection.title,
        firstSection.image,
        20,
        currentTheme
      );
      foodSources.push(firstNode);
      firstNode.discover();

      // Create remaining nodes
      for (let i = 1; i < portfolioSections.length; i++) {
        let attempts = 0;
        let validPosition = false;
        let newSource: FoodSource | undefined;
        let section = portfolioSections[i];

        while (!validPosition && attempts < maxAttempts) {
          let x = p.random(margin, p.width - margin);
          let y = p.random(margin, p.height - margin);

          validPosition = true;
          for (let existing of foodSources) {
            if (p.dist(x, y, existing.x, existing.y) < minDistance) {
              validPosition = false;
              break;
            }
          }

          if (validPosition) {
            newSource = new FoodSource(
              x,
              y,
              foodSourceWeight,
              false,
              currentTheme.food,
              20,
              section.url,
              section.title,
              section.image,
              20,
              currentTheme
            );
          }

          attempts++;
        }

        if (validPosition && newSource) {
          foodSources.push(newSource);
        }
      }
    }
  };

  return sketch;
};