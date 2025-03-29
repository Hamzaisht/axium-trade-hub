
import { useState, useEffect } from 'react';
import * as THREE from 'three';

export interface LoadedTextures {
  texture: THREE.Texture | null;
  normalMap: THREE.Texture | null;
  lavaMap: THREE.Texture | null;
  texturesLoaded: boolean;
}

interface TextureOptions {
  wrapS?: THREE.Wrapping;
  wrapT?: THREE.Wrapping;
  repeat?: [number, number];
  offset?: [number, number];
}

/**
 * A custom hook for loading and managing Three.js textures with fallbacks
 */
export function useTextureLoader(
  texturePaths: {
    main?: string;
    normal?: string;
    accent?: string;
    fallback?: string;
  },
  options: {
    main?: TextureOptions;
    normal?: TextureOptions;
    accent?: TextureOptions;
  } = {}
): LoadedTextures {
  const [textures, setTextures] = useState<LoadedTextures>({
    texture: null,
    normalMap: null,
    lavaMap: null,
    texturesLoaded: false,
  });

  useEffect(() => {
    // Create fallback texture
    const fallbackTexture = texturePaths.fallback 
      ? new THREE.TextureLoader().load(
          texturePaths.fallback,
          undefined,
          undefined,
          (error) => {
            console.error('Error loading fallback texture:', error);
          }
        )
      : new THREE.CanvasTexture(
          new OffscreenCanvas(2, 2)
        );
    
    const textureLoader = new THREE.TextureLoader();
    const loadedTextures: LoadedTextures = {
      texture: null,
      normalMap: null,
      lavaMap: null,
      texturesLoaded: false,
    };
    
    // Load main texture
    if (texturePaths.main) {
      textureLoader.load(
        texturePaths.main,
        (texture) => {
          if (options.main?.wrapS) texture.wrapS = options.main.wrapS;
          if (options.main?.wrapT) texture.wrapT = options.main.wrapT;
          if (options.main?.repeat) texture.repeat.set(...options.main.repeat);
          if (options.main?.offset) texture.offset.set(...options.main.offset);
          
          loadedTextures.texture = texture;
          updateTextures(loadedTextures);
          console.info(`Texture loaded successfully: ${texturePaths.main}`);
        },
        undefined,
        (error) => {
          console.warn(`Could not load texture: ${texturePaths.main}`, error);
          loadedTextures.texture = fallbackTexture;
          updateTextures(loadedTextures);
        }
      );
    }
    
    // Load normal map
    if (texturePaths.normal) {
      textureLoader.load(
        texturePaths.normal,
        (texture) => {
          if (options.normal?.wrapS) texture.wrapS = options.normal.wrapS;
          if (options.normal?.wrapT) texture.wrapT = options.normal.wrapT;
          if (options.normal?.repeat) texture.repeat.set(...options.normal.repeat);
          if (options.normal?.offset) texture.offset.set(...options.normal.offset);
          
          loadedTextures.normalMap = texture;
          updateTextures(loadedTextures);
          console.info(`Normal map loaded successfully: ${texturePaths.normal}`);
        },
        undefined,
        (error) => {
          console.warn(`Could not load normal map: ${texturePaths.normal}`, error);
          // Create a default normal map
          const defaultNormal = new THREE.CanvasTexture(
            new OffscreenCanvas(2, 2)
          );
          loadedTextures.normalMap = defaultNormal;
          updateTextures(loadedTextures);
        }
      );
    }
    
    // Load accent/lava texture
    if (texturePaths.accent) {
      textureLoader.load(
        texturePaths.accent,
        (texture) => {
          if (options.accent?.wrapS) texture.wrapS = options.accent.wrapS;
          if (options.accent?.wrapT) texture.wrapT = options.accent.wrapT;
          if (options.accent?.repeat) texture.repeat.set(...options.accent.repeat);
          if (options.accent?.offset) texture.offset.set(...options.accent.offset);
          
          loadedTextures.lavaMap = texture;
          updateTextures(loadedTextures);
          console.info(`Accent texture loaded successfully: ${texturePaths.accent}`);
        },
        undefined,
        (error) => {
          console.warn(`Could not load accent texture: ${texturePaths.accent}`, error);
          const defaultLava = new THREE.CanvasTexture(
            new OffscreenCanvas(2, 2)
          );
          const ctx = defaultLava.image.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#D4AF37';
            ctx.fillRect(0, 0, 2, 2);
          }
          loadedTextures.lavaMap = defaultLava;
          updateTextures(loadedTextures);
        }
      );
    }
    
    // Update textures state when all are loaded
    function updateTextures(loadedTextures: LoadedTextures) {
      loadedTextures.texturesLoaded = true;
      setTextures({...loadedTextures});
    }
    
    // Initial texture state update
    updateTextures(loadedTextures);
    
    // Cleanup function to dispose textures
    return () => {
      if (textures.texture) textures.texture.dispose();
      if (textures.normalMap) textures.normalMap.dispose();
      if (textures.lavaMap) textures.lavaMap.dispose();
      fallbackTexture.dispose();
    };
  }, [texturePaths]);

  return textures;
}

export default useTextureLoader;
