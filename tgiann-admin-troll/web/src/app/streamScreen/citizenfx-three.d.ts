declare module "@citizenfx/three" {
  export class CfxTexture {
    needsUpdate: boolean;
    constructor();
  }

  export class Mesh {
    position: { z: number };
    constructor(geometry: any, material: any);
  }

  export class OrthographicCamera {
    position: { z: number };
    constructor(
      left: number,
      right: number,
      top: number,
      bottom: number,
      near: number,
      far: number
    );
  }

  export class PlaneBufferGeometry {
    constructor(width: number, height: number);
  }

  export class Scene {
    add(object: any): void;
    constructor();
  }

  export class ShaderMaterial {
    constructor(parameters: {
      uniforms: any;
      vertexShader: string;
      fragmentShader: string;
    });
  }

  export class WebGLRenderer {
    autoClear: boolean;
    constructor(parameters: {
      canvas: HTMLCanvasElement;
      logarithmicDepthBuffer: boolean;
    });
    setPixelRatio(ratio: number): void;
    setSize(width: number, height: number): void;
    clear(): void;
    render(scene: Scene, camera: OrthographicCamera): void;
  }
}
