import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';

interface CapturedImage {
  name: string;
  uri: string;
  type: string;
  size: number;
  width?: number;
  height?: number;
}

interface CameraPreviewProps {
  images: CapturedImage | CapturedImage[] | null;
  onRemove: (index?: number) => void;
  onRetake: () => void;
  multiple?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');

export const CameraPreview: React.FC<CameraPreviewProps> = ({
  images,
  onRemove,
  onRetake,
  multiple = false,
}) => {
  if (!images) return null;

  const imageArray = Array.isArray(images) ? images : [images];

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {imageArray.length} {imageArray.length === 1 ? 'Photo' : 'Photos'} Captured
        </Text>
        <TouchableOpacity style={styles.retakeButton} onPress={onRetake}>
          <Text style={styles.retakeButtonText}>📷 Retake</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal={imageArray.length > 1} 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {imageArray.map((image, index) => (
          <View key={index} style={styles.imageContainer}>
            <View style={styles.imageWrapper}>
              <Image source={{ uri: image.uri }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => onRemove(multiple ? index : undefined)}
              >
                <Text style={styles.removeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.imageInfo}>
              <Text style={styles.imageName} numberOfLines={1}>
                {image.name}
              </Text>
              <Text style={styles.imageDetails}>
                {formatFileSize(image.size)}
                {image.width && image.height && (
                  <Text> • {image.width}×{image.height}</Text>
                )}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  retakeButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  retakeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  scrollContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  imageContainer: {
    alignItems: 'center',
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#e9ecef',
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  imageInfo: {
    marginTop: 8,
    alignItems: 'center',
    maxWidth: 120,
  },
  imageName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  imageDetails: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
    textAlign: 'center',
  },
});
