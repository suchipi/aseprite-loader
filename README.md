# `aseprite-loader`

This is a webpack loader that loads [Aseprite](https://www.aseprite.org/) [`.ase` and `.aseprite` files](https://github.com/aseprite/aseprite/blob/master/docs/ase-file-specs.md) via [ase-parser](https://github.com/TheCyberRonin/ase-parser).

It sets `module.exports` of the file you're importing to an object of the type `AsepriteLoader.Data` as defined below:

```ts
declare namespace AsepriteLoader {
  interface Data {
    frames: Array<AsepriteLoader.Frame>;
    layers: Array<AsepriteLoader.Layer>;
    tags: Array<AsepriteLoader.Tag>;
    palette?: AsepriteLoader.Palette;
    fileSize: number;
    width: number;
    height: number;
    numFrames: number;
    colorDepth: number;
    numColors: number;
    pixelRatio: string;
    colorProfile: {
      type: string;
      flag: number;
      fGamma: number;
    };
  }

  interface Palette {
    paletteSize: number;
    firstColor: number;
    lastColor: number;
    colors: Array<Color>;
  }
  interface Color {
    red: number;
    green: number;
    blue: number;
    alpha: number;
    name: string;
  }
  interface Cel {
    layerIndex: number;
    xpos: number;
    ypos: number;
    opacity: number;
    celType: number;
    w: number;
    h: number;
    rawCelData: Uint8Array;
  }
  interface Tag {
    name: string;
    from: number;
    to: number;
    animDirection: string;
    color: string;
  }
  interface Layer {
    flags: number;
    type: number;
    layerChildLevel: number;
    blendMode: number;
    opacity: number;
    name: string;
  }
  interface Frame {
    bytesInFrame: number;
    frameDuration: number;
    numChunks: number;
    cels: Array<Cel>;
  }
}
```

> NOTE: Even if a Cel is of type 2 (zlib compressed), the `rawCelData` will always be inflated, as if it was type 0. See [the Aseprite File Format Specification](https://github.com/aseprite/aseprite/blob/master/docs/ase-file-specs.md#chunk-types) for more info.

## Usage

```js
// webpack.config.js

module.exports = {
  module: {
    rules: [
      {
        test: /\.ase(prite)?$/i,
        use: ["aseprite-loader"],
      },
    ],
  },
};
```

```js
const blueSlime = require("./blue-slime.aseprite");

console.log(blueSlime);
// Object { frames: [...], layers: [...], ... };
```

## License

MIT
