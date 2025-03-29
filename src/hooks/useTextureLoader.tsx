
import { useState, useEffect } from 'react';
import * as THREE from 'three';

interface TextureOptions {
  wrapS?: THREE.Wrapping;
  wrapT?: THREE.Wrapping;
  repeat?: [number, number];
  offset?: [number, number];
  anisotropy?: number;
}

interface TextureMap {
  [key: string]: string;
}

interface TextureOptionsMap {
  [key: string]: TextureOptions;
}

export function useTextureLoader(
  texturePaths: TextureMap,
  options: TextureOptionsMap = {}
) {
  const [textures, setTextures] = useState<{ [key: string]: THREE.Texture | null }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    const loadedTextures: { [key: string]: THREE.Texture | null } = {};
    let isMounted = true;
    
    const loadAllTextures = async () => {
      try {
        const textureKeys = Object.keys(texturePaths);
        const totalTextures = textureKeys.length;
        let loadedCount = 0;
        
        // Load each texture
        for (const key of textureKeys) {
          try {
            const texture = await new Promise<THREE.Texture>((resolve, reject) => {
              textureLoader.load(
                texturePaths[key],
                (loadedTexture) => {
                  // Apply options if provided
                  if (options[key]) {
                    const opts = options[key];
                    if (opts.wrapS) loadedTexture.wrapS = opts.wrapS;
                    if (opts.wrapT) loadedTexture.wrapT = opts.wrapT;
                    if (opts.repeat) loadedTexture.repeat.set(...opts.repeat);
                    if (opts.offset) loadedTexture.offset.set(...opts.offset);
                    if (opts.anisotropy) loadedTexture.anisotropy = opts.anisotropy;
                  }
                  loadedTexture.needsUpdate = true;
                  resolve(loadedTexture);
                },
                undefined, // onProgress not supported by TextureLoader
                (err) => reject(new Error(`Failed to load texture ${key}: ${err.message}`))
              );
            });
            
            if (isMounted) {
              loadedTextures[key] = texture;
              loadedCount++;
            }
          } catch (err) {
            console.warn(`Error loading texture for ${key}:`, err);
            if (isMounted) loadedTextures[key] = null;
          }
        }

        if (isMounted) {
          setTextures(loadedTextures);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error in texture loading process:', err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      }
    };

    loadAllTextures();

    return () => {
      isMounted = false;
      // Dispose textures to prevent memory leaks
      Object.values(loadedTextures).forEach(texture => {
        if (texture) texture.dispose();
      });
    };
  }, [JSON.stringify(texturePaths), JSON.stringify(options)]);

  // Extract the primary texture for convenience
  const mainTextureKey = Object.keys(texturePaths)[0];
  const texture = mainTextureKey ? textures[mainTextureKey] : null;
  
  // Extract the normal map if it exists
  const normalMap = textures['normal'] || null;

  return { textures, texture, normalMap, loading, error };
}

export default useTextureLoader;
