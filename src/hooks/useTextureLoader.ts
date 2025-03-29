
import { useState, useEffect } from 'react';
import * as THREE from 'three';

interface TextureOptions {
  wrapS?: THREE.Wrapping;
  wrapT?: THREE.Wrapping;
  repeat?: [number, number];
  offset?: [number, number];
  anisotropy?: number;
}

type TexturePaths = {
  main?: string;
  normal?: string;
  accent?: string;
  fallback?: string;
};

interface TextureOptionsMap {
  main?: TextureOptions;
  normal?: TextureOptions;
  accent?: TextureOptions;
}

export const useTextureLoader = (
  texturePaths: TexturePaths,
  textureOptions: TextureOptionsMap = {}
) => {
  const [textures, setTextures] = useState<Record<string, THREE.Texture | null>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    const texturePromises: Promise<void>[] = [];
    const loadedTextures: Record<string, THREE.Texture | null> = {};
    
    // Helper function to load a texture with options
    const loadTexture = async (key: string, path?: string, options?: TextureOptions) => {
      if (!path) {
        loadedTextures[key] = null;
        return;
      }
      
      try {
        return new Promise<void>((resolve) => {
          textureLoader.load(
            path,
            (texture) => {
              // Apply options
              if (options) {
                if (options.wrapS) texture.wrapS = options.wrapS;
                if (options.wrapT) texture.wrapT = options.wrapT;
                if (options.repeat) texture.repeat.set(options.repeat[0], options.repeat[1]);
                if (options.offset) texture.offset.set(options.offset[0], options.offset[1]);
                if (options.anisotropy) texture.anisotropy = options.anisotropy;
              }
              
              loadedTextures[key] = texture;
              resolve();
            },
            undefined,
            (err) => {
              console.error(`Error loading texture ${key} from ${path}:`, err);
              
              // If fallback is provided, try loading it
              if (key !== 'fallback' && texturePaths.fallback) {
                textureLoader.load(
                  texturePaths.fallback,
                  (fallbackTexture) => {
                    loadedTextures[key] = fallbackTexture;
                    resolve();
                  },
                  undefined,
                  () => {
                    loadedTextures[key] = null;
                    resolve();
                  }
                );
              } else {
                loadedTextures[key] = null;
                resolve();
              }
            }
          );
        });
      } catch (err) {
        console.error(`Error in texture promise for ${key}:`, err);
        loadedTextures[key] = null;
      }
    };
    
    // Queue texture loading promises
    if (texturePaths.main) {
      texturePromises.push(loadTexture('main', texturePaths.main, textureOptions.main));
    }
    if (texturePaths.normal) {
      texturePromises.push(loadTexture('normal', texturePaths.normal, textureOptions.normal));
    }
    if (texturePaths.accent) {
      texturePromises.push(loadTexture('accent', texturePaths.accent, textureOptions.accent));
    }
    
    // Load all textures
    setLoading(true);
    Promise.all(texturePromises)
      .then(() => {
        setTextures(loadedTextures);
        setLoading(false);
      })
      .catch((err) => {
        setError(err as Error);
        setLoading(false);
      });
    
    return () => {
      // Dispose textures on unmount
      Object.values(loadedTextures).forEach((texture) => {
        if (texture) texture.dispose();
      });
    };
  }, [texturePaths, textureOptions]);
  
  return {
    textures,
    texture: textures.main || null,
    normalMap: textures.normal || null,
    loading,
    error
  };
};

export default useTextureLoader;
