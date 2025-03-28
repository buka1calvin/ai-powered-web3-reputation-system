export const resizeImage = async (
  file: File, 
  options: { 
    maxWidth: number; 
    maxHeight: number; 
    quality: number 
  }
): Promise<File> => {
  return new Promise((resolve, reject) => {
    // Check if file is an image
    if (!file.type.match('image.*')) {
      reject(new Error('Not an image file'));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      
      img.onload = () => {
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calculate new dimensions
        let { width, height } = img;
        if (width > options.maxWidth || height > options.maxHeight) {
          const ratio = Math.min(
            options.maxWidth / width, 
            options.maxHeight / height
          );
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        
        // Set canvas size
        canvas.width = width;
        canvas.height = height;
        
        // Draw resized image
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Create new file from blob
              const resizedFile = new File(
                [blob], 
                file.name, 
                { 
                  type: 'image/jpeg', 
                  lastModified: Date.now() 
                }
              );
              resolve(resizedFile);
            } else {
              reject(new Error('Could not create blob'));
            }
          }, 
          'image/jpeg', 
          options.quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Error loading image'));
      };
      
      // Set image source
      img.src = event.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    // Read the file
    reader.readAsDataURL(file);
  });
};