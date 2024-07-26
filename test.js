async function pickAndUploadFile(signedUrl) {
    const fileInput = document.getElementById('fileInput');
    
    fileInput.addEventListener('change', async (event) => {
      const file = event.target.files[0];
      if (!file) {
        return; // No file selected
      }
      
      try {
        await uploadFileToSignedUrl(file, signedUrl);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    });
    
    // Trigger file selection dialog
    fileInput.click();
  }
  
  // Example usage
  const signedUrl = 'https://storage.googleapis.com/ad_classify_trigger/testFile?GoogleAccessId=ads-detection%40techenggisgdeliver-1000286105.iam.gserviceaccount.com&Expires=1720607547&Signature=j4zV6sqJG%2FefheeKHx3TMQVtwVHxDlUCi7Cxc1sLeGOtlcK7bDjjdXFqBTgNU91YhVFq%2B1ftVQr6t1O246hrMYyDPutjhLNhIo2pOcRsSN88xkmJzx4%2FdWNCpI6%2B08a9fjL%2Fz%2FsVioEjC%2F8QBVbXbUZtwS4EzTBGx66WTEnf3Ox%2BjBuBRc8aVlmtomUHBRIepiEhgdwyq%2FND8kf%2BIbg9T1xY00jvfrtR%2FyjrUqjV8tOBGKa9puUrxY5pIRzjVpu%2BQzBdf91Ua4QQ0anJ4SMfdWMLsgURmkV5Z69qgXPfz%2F7Uo9CiWfa5J7DiZT8dEZnf1iCeVM7lENynoLMc8VNWTQ%3D%3D';
  pickAndUploadFile(signedUrl);
  