import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaTimes, FaImage, FaTrashAlt, FaFolder, FaCopy, FaDownload } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ImageManager() {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFileNames, setSelectedFileNames] = useState([]);

  // Fetch folders and images
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await axios.get('/api/folders');
        setFolders(response.data);
      } catch (error) {
        toast.error('Error fetching folders');
      }
    };

    fetchFolders();
  }, []); // Fetch only once when the component mounts

  // Handle folder creation
  const createFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error('Folder name cannot be empty.');
      return;
    }
    try {
      const response = await axios.post('/api/folders/create-folder', { name: newFolderName });
      setFolders((prevFolders) => [...prevFolders, response.data]);
      setNewFolderName('');
      setIsFolderModalOpen(false);
      toast.success('Folder created successfully.');
    } catch (error) {
      console.error(error.response?.data?.message || 'Error creating folder');
    }
  };

  // Delete folder
  const deleteFolder = async (folderId) => {
    try {
      await axios.delete(`/api/folders/${folderId}`);
      setFolders(folders.filter(folder => folder._id !== folderId));
      toast.success('Folder deleted successfully.');
    } catch (error) {
      console.error('Error deleting folder');
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setSelectedFileNames(files.map(file => file.name)); // Store file names
  };

  // Fetch images when a folder is selected
  const fetchImages = async (folderId) => {
    try {
      const response = await axios.get(`/api/folders/${folderId}/images`);
      setImages(response.data);
    } catch (error) {
      console.error('Error fetching images');
    }
  };

  // Handle folder selection (toggle)
  const selectFolder = (folder) => {
    if (selectedFolder === folder._id) {
      // If the same folder is clicked again, close it
      setSelectedFolder(null);
      setImages([]);
    } else {
      // Open the folder and fetch images
      setSelectedFolder(folder._id);
      fetchImages(folder._id);
    }
  };


  // Upload images to the selected folder
  const uploadImages = async () => {
    if (!selectedFolder) {
      console.error('Please select a folder first.');
      return;
    }
  
    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append('images', file));
  
    try {
      const response = await axios.post(`/api/folders/${selectedFolder}/upload-images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      setImages([...images, ...response.data]); // Add new images to the selected folder
      setIsImageModalOpen(false);
      setSelectedFiles([]);
      toast.success('Images uploaded successfully.');
    } catch (error) {
      console.error('Error uploading images');
    }
  };
  
  // Delete an image
  const deleteImage = async (imageId) => {
    try {
      await axios.delete(`/api/folders/images/${imageId}`); // Call the API to delete the image
      setImages(images.filter(image => image._id !== imageId)); // Remove the image from state (UI)
      toast.success('Image deleted successfully.');  // Display success message
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Error deleting image.');
    }
  };
  

  // Copy image link
  const copyImageLink = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('Image link copied to clipboard!');
  };
  
  const downloadAllFolders = async () => {
    try {
      // Make a request to download all folders as a zip
      const response = await axios.get('/api/folders/download/all', {
        responseType: 'blob', // Handle binary data (zip file)
      });
  
      // Create a download link and trigger it
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(new Blob([response.data]));
      link.href = url;
      link.setAttribute('download', 'all_folders.zip'); // Name of the zip file
      document.body.appendChild(link); // Append the link to the body
      link.click(); // Trigger the click event to download
      document.body.removeChild(link); // Remove the link after download
    } catch (error) {
      console.error('Error downloading all folders:', error);
      toast.error('Error downloading all folders');
    }
  };

  // Modal component
  const Modal = ({ title, children, onClose }) => (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', width: '400px', textAlign: 'center', position: 'relative' }}>
        <span onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer', fontSize: '20px' }}>
          <FaTimes />
        </span>
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  );

  return (
    <div className="image-manager" style={{ padding: '30px', backgroundColor: '#f4f4f4' }}>
      <ToastContainer />
      <h1 style={{ textAlign: 'center', color: '#333', fontSize: '2rem', marginBottom: '20px' }}>
        <FaImage style={{ marginRight: '10px' }} />
        Image Management
      </h1>

      {/* Create Folder Button */}
      <div onClick={() => setIsFolderModalOpen(true)} style={{ backgroundColor: '#FF9800', color: 'white', borderRadius: '8px', width: '20%', height: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', cursor: 'pointer' }}>
        <FaPlus style={{ marginRight: '10px' }} /> Add New Folder
      </div>
      {/* Download All Folders Button */}
      <div style={{ marginTop: '20px' }}>
        <button onClick={downloadAllFolders} // Trigger download for all folders
          style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px', borderRadius: '5px', width: '100%' }}
        >
          <FaDownload style={{ marginRight: '10px' }} /> Download All Folders
        </button>
      </div>

      {/* Folder Creation Modal */}
      {isFolderModalOpen && (
        <Modal title="Create New Folder" onClose={() => setIsFolderModalOpen(false)}>
          <input type="text" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} placeholder="Folder Name"
            style={{ marginBottom: '10px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '100%' }}
          />
          <button onClick={createFolder} style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px', borderRadius: '5px', width: '100%' }}>Create</button>
        </Modal>
      )}

      {/* Folder List */}
      <div className="folder-list" style={{ marginTop: '30px' }}>
        {folders.length === 0 ? (
          <p>No folders available.</p>
        ) : (
          folders.map((folder) => (
            <div key={folder._id} onClick={() => selectFolder(folder)} style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
              <div onClick={() => setSelectedFolder(folder._id)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                <FaFolder style={{ marginRight: '10px' }} />
                {folder.name}
              </div>
               {/* Download Icon */}
              {/* <FaDownload onClick={() => downloadFolder(folder._id)} style={{ cursor: 'pointer', color: 'blue', marginRight: '10px' }}/> */}
              <FaTrashAlt onClick={() => deleteFolder(folder._id)} style={{ cursor: 'pointer', color: 'red' }} />
            </div>
          ))
        )}
      </div>

      {/* Add Images Button */}
      {selectedFolder && (
        <div onClick={() => setIsImageModalOpen(true)} 
          style={{ backgroundColor: '#4CAF50', color: 'white', borderRadius: '8px', width: '30%', height: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px auto', cursor: 'pointer' }}
        >
          <FaImage style={{ marginRight: '10px' }} /> Upload Images to {folders.find(f => f._id === selectedFolder)?.name}
        </div>
      )}


      {/* Image Upload Modal */}
      {isImageModalOpen && (
        <Modal title={`Upload Images to ${folders.find(f => f._id === selectedFolder)?._id || 'Selected Folder'}`} onClose={() => setIsImageModalOpen(false)}>
          <p>Selected Folder: <strong>{folders.find(f => f._id === selectedFolder)?._id}</strong></p>
          <p>Selected Folder: <strong>{folders.find(f => f._id === selectedFolder)?._id}</strong></p>
          <input type="file" multiple onChange={handleFileChange}
            style={{ marginBottom: '10px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '100%' }}
          />
          <div style={{ marginBottom: '10px', textAlign: 'left' }}>
            {selectedFileNames.length > 0 && <strong>Selected Files:</strong>}
            <ul>
              {selectedFileNames.map((fileName, index) => (
                <li key={index}>{fileName}</li>
              ))}
            </ul>
          </div>
          <button onClick={uploadImages} style={{ backgroundColor: '#2196F3', color: 'white', padding: '10px', borderRadius: '5px', width: '100%' }}>
            <FaImage /> Upload
          </button>
        </Modal>
      )}

      {/* Image Display */}
      {selectedFolder && (
        <div>
          {images.length === 0 ? <p>No images in this folder.</p> : (
            images.map((image) => {
              const imageUrl = `/images/${image.location.replace(/^\/image\//, '')}`;
              return (
                <div key={image._id} style={{ display: 'inline-block', margin: '10px' }}>
                  <img
                    src={imageUrl}
                    alt={image.name}
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    onError={() => console.error('Image failed to load:', imageUrl)}  // Error logging
                  />
                  <div>{image.name}</div>
                  <button onClick={() => copyImageLink(imageUrl)}><FaCopy /></button>
                  <button onClick={() => deleteImage(image._id)}><FaTrashAlt /></button>
                </div>
              );
            })
          )}
        </div>
      )}

    </div>
  );
}
