// AI-assisted: see AI-ATTRIBUTION.md

// Stores profile images and returns a public URL for each.
export interface ImageDAO {
  // Saves the base64-encoded image under fileName and returns its URL.
  putImage(fileName: string, imageStringBase64Encoded: string): Promise<string>;
}
