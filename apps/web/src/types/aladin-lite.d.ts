
declare module "aladin-lite" {
  export interface HiPSLayer {
    setSliceNumber(slice: number): void;
  }

  export interface AladinInstance {
    setBaseImageLayer(source: string | HiPSLayer): void;
    getBaseImageLayer(): HiPSLayer;
    setProjection(projection: string): void;
    setFoV(fov: number): void;
    gotoRaDec(ra: number, dec: number): void;
    remove(): void;
  }

  interface HiPSOptions {
    name?: string;
    imgFormat?: string;
    successCallback?: (layer: HiPSLayer) => void;
    errorCallback?: (error: unknown) => void;
  }

  interface AladinAPI {
    init: Promise<void>;

    HiPS(url: string, options?: HiPSOptions): HiPSLayer;

    aladin(
      selector: string,
      options: {
        survey: string;
        target?: string;
        fov?: number;
        projection?: string;
        cooFrame?: string;
        log: boolean;
      }
    ): AladinInstance;
  }

  const A: AladinAPI;
  export default A;
}
