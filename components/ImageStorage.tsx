import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

export interface CapturedImage {
  name: string;
  uri: string;
  type: string;
  size: number;
  width?: number;
  height?: number;
  capturedAt: string;
}

export class ImageStorage {
  private static readonly IMAGE_DIRECTORY = `${FileSystem.documentDirectory}captured_images/`;

  // Ensure the image directory exists
  static async ensureDirectoryExists(): Promise<void> {
    try {
      const dirInfo = await FileSystem.getInfoAsync(this.IMAGE_DIRECTORY);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.IMAGE_DIRECTORY, { intermediates: true });
      }
    } catch (error) {
      console.error('Error creating image directory:', error);
    }
  }

  // Save image to permanent storage
  static async saveImage(imageUri: string, imageName: string): Promise<string> {
    try {
      await this.ensureDirectoryExists();
      
      const newPath = `${this.IMAGE_DIRECTORY}${imageName}`;
      await FileSystem.copyAsync({
        from: imageUri,
        to: newPath,
      });
      
      return newPath;
    } catch (error) {
      console.error('Error saving image:', error);
      throw error;
    }
  }

  // Save multiple images
  static async saveImages(images: CapturedImage[]): Promise<CapturedImage[]> {
    try {
      const savedImages = await Promise.all(
        images.map(async (image) => {
          const savedUri = await this.saveImage(image.uri, image.name);
          return {
            ...image,
            uri: savedUri,
          };
        })
      );
      
      return savedImages;
    } catch (error) {
      console.error('Error saving images:', error);
      throw error;
    }
  }

  // Delete image from storage
  static async deleteImage(imageUri: string): Promise<void> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(imageUri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(imageUri);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }

  // Get all saved images
  static async getAllSavedImages(): Promise<string[]> {
    try {
      await this.ensureDirectoryExists();
      const files = await FileSystem.readDirectoryAsync(this.IMAGE_DIRECTORY);
      return files.map(file => `${this.IMAGE_DIRECTORY}${file}`);
    } catch (error) {
      console.error('Error getting saved images:', error);
      return [];
    }
  }

  // Clear all saved images
  static async clearAllImages(): Promise<void> {
    try {
      const images = await this.getAllSavedImages();
      await Promise.all(images.map(imageUri => this.deleteImage(imageUri)));
    } catch (error) {
      console.error('Error clearing all images:', error);
    }
  }

  // Get storage size
  static async getStorageSize(): Promise<number> {
    try {
      const images = await this.getAllSavedImages();
      let totalSize = 0;
      
      for (const imageUri of images) {
        const fileInfo = await FileSystem.getInfoAsync(imageUri);
        if (fileInfo.exists && 'size' in fileInfo) {
          totalSize += fileInfo.size || 0;
        }
      }
      
      return totalSize;
    } catch (error) {
      console.error('Error calculating storage size:', error);
      return 0;
    }
  }
}
