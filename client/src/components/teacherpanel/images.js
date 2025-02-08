import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaTimes, FaImage, FaTrashAlt, FaFolder, FaCopy, FaDownload } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


export default function ImageManager() {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFileNames, setSelectedFileNames] = useState([]);

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
  }, []);

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

  const deleteFolder = async (folderId) => {
    try {
      await axios.delete(`/api/folders/${folderId}`);
      setFolders(folders.filter(folder => folder._id !== folderId));
      toast.success('Folder deleted successfully.');
    } catch (error) {
      console.error('Error deleting folder');
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setSelectedFileNames(files.map(file => file.name));
  };

  const fetchImages = async (folderId) => {
    try {
      const response = await axios.get(`/api/folders/${folderId}/images`);
      setImages(response.data);
    } catch (error) {
      console.error('Error fetching images');
    }
  };

  const selectFolder = (folder) => {
    if (selectedFolder === folder._id) {
      setSelectedFolder(null);
      setImages([]);
    } else {
      setSelectedFolder(folder._id);
      fetchImages(folder._id);
    }
  };

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
  
      setImages([...images, ...response.data]);
      setIsImageModalOpen(false);
      setSelectedFiles([]);
      toast.success('Images uploaded successfully.');
    } catch (error) {
      console.error('Error uploading images');
    }
  };

  const deleteImage = async (imageId) => {
    try {
      await axios.delete(`/api/folders/images/${imageId}`);
      setImages(images.filter(image => image._id !== imageId));
      toast.success('Image deleted successfully.');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Error deleting image.');
    }
  };

  const copyImageLink = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('Image link copied to clipboard!');
  };

  const downloadAllFolders = async () => {
    try {
      const response = await axios.get('/api/folders/download/all', {
        responseType: 'blob',
      });
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(new Blob([response.data]));
      link.href = url;
      link.setAttribute('download', 'all_folders.zip');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading all folders:', error);
      toast.error('Error downloading all folders');
    }
  };

  return (
    <div className="container" style={{ padding: '30px', backgroundColor: '#f4f4f4' }}>
      <ToastContainer />
      <h1 className="text-center mb-4">
        <FaImage className="me-2" />
        Image Management
      </h1>

      <div className="d-flex justify-content-center mb-3">
        <Button variant="warning" onClick={() => setIsFolderModalOpen(true)} className="me-2">
          <FaPlus className="me-2" /> Add New Folder
        </Button>
        <Button variant="success" onClick={downloadAllFolders}>
          <FaDownload className="me-2" /> Download All Folders
        </Button>
      </div>

      <div className="mb-3">
        <h3>Folders</h3>
        {folders.length === 0 ? (
          <p>No folders available.</p>
        ) : (
          folders.map((folder) => (
            <div key={folder._id} className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
              <div className="d-flex align-items-center" style={{ cursor: 'pointer' }} onClick={() => selectFolder(folder)}>
                <FaFolder className="me-2" />
                {folder.name}
              </div>
              <div>
                <FaTrashAlt
                  onClick={() => deleteFolder(folder._id)}
                  className="text-danger"
                  style={{ cursor: 'pointer' }}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {selectedFolder && (
        <div className="text-center mb-4">
          <Button variant="primary" onClick={() => setIsImageModalOpen(true)}>
            <FaImage className="me-2" /> Upload Images
          </Button>
        </div>
      )}

      {selectedFolder && images.length > 0 && (
        <div className="d-flex flex-wrap">
          {images.map((image) => {
            const imageUrl = `/images/${image.location.replace(/^\/image\//, '')}`;
            return (
              <div key={image._id} className="p-2">
                <img src={imageUrl} alt={image.name} className="img-fluid" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                <div>{image.name}</div>
                <Button variant="link" onClick={() => copyImageLink(imageUrl)}>
                  <FaCopy />
                </Button>
                <Button variant="link" onClick={() => deleteImage(image._id)} className="text-danger">
                  <FaTrashAlt />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      <Modal show={isFolderModalOpen} onHide={() => setIsFolderModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Folder</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Folder Name"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsFolderModalOpen(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={createFolder}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={isImageModalOpen} onHide={() => setIsImageModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Images</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control type="file" multiple onChange={handleFileChange} />
          {selectedFileNames.length > 0 && (
            <div className="mt-2">
              <strong>Selected Files:</strong>
              <ul>
                {selectedFileNames.map((fileName, index) => (
                  <li key={index}>{fileName}</li>
                ))}
              </ul>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsImageModalOpen(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={uploadImages}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
