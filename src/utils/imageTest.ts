// Simple test to verify image generation
// You can run this in the browser console to test

export const testImageGeneration = async () => {
  console.log('Testing image generation...');
  
  // Test Picsum URLs directly
  const testUrls = [
    'https://picsum.photos/1080/1080?random=123',
    'https://picsum.photos/1080/1080?blur=1&random=123',
    'https://picsum.photos/id/10/1080/1080',
    'https://picsum.photos/id/20/1080/1080',
    'https://picsum.photos/id/30/1080/1080'
  ];
  
  for (const url of testUrls) {
    console.log(`Testing URL: ${url}`);
    try {
      const img = document.createElement('img');
      const promise = new Promise((resolve, reject) => {
        img.onload = () => {
          console.log(`✅ SUCCESS: ${url}`);
          resolve(url);
        };
        img.onerror = () => {
          console.log(`❌ FAILED: ${url}`);
          reject(url);
        };
      });
      
      img.src = url;
      await promise;
    } catch (error) {
      console.log(`❌ ERROR: ${url} - ${error}`);
    }
  }
  
  console.log('Image generation test completed!');
};

// Test function you can call from browser console
(window as any).testImageGeneration = testImageGeneration;
