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
