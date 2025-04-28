import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaTimes, FaImage, FaTrashAlt, FaFolder, FaCopy, FaDownload, FaFolderOpen, FaEdit } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BsSearch } from 'react-icons/bs';
import DeleteModal from './modals/DeleteModal';


export default function ImageManager() {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFileNames, setSelectedFileNames] = useState([]);
  const [openFolders, setOpenFolders] = useState(new Set());
  const [editingImage, setEditingImage] = useState(null);
  const [newImageName, setNewImageName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState(""); // "folder" or "image"
  const [deleteId, setDeleteId] = useState(null);
  const [folderId, setFolderId] = useState(null);

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/folders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setFolders(organizeFolders(response.data));
    } catch (error) {
      toast.error('Error fetching folders');
    }
  };
  
  const createFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error('Folder name cannot be empty.');
      return;
    }

    try {
      const response = await axios.post('/api/folders/create-folder', {
        name: newFolderName,
        pfolder: selectedFolder ? selectedFolder._id : null, // ✅ Ensure null for top-level
      });

      setFolders(organizeFolders([...folders, response.data]));
      setNewFolderName('');
      setIsFolderModalOpen(false);
      toast.success('Folder created successfully.');

      fetchFolders(); // Refresh the list
      setSelectedFolder(null); // ✅ Reset after creation
    } catch (error) {
      console.error(error.response?.data?.message || 'Error creating folder');
    }
  };


  const deleteFolder = async (folderId) => {
    try {
      await axios.delete(`/api/folders/${folderId}`);
      setFolders(folders.filter(folder => folder._id !== folderId));
      toast.success('Folder deleted successfully.');
      fetchFolders();
    } catch (error) {
      console.error('Error deleting folder');
    }
  };

  const handleDeleteFolder = (folderId) => {
    setDeleteId(folderId);
    setDeleteType("folder");
    setShowDeleteModal(true);
  };

  const handleDeleteImage = (imageId, folderId) => {
    setDeleteId(imageId);
    setFolderId(folderId);
    setDeleteType("image");
    setShowDeleteModal(true);
  };

  const confirmDelete = async (password) => {
    try {
      if (deleteType === "folder") {
        // Delete Folder
        await axios.delete(`/api/folders/${deleteId}`, {
          data: { password },
        });
        toast.success("Folder deleted successfully.");
        setShowDeleteModal(false);
        fetchFolders();
      } else if (deleteType === "image") {
        // Delete Image
        await axios.delete(`/api/folders/images/${deleteId}`, {
          data: { password, folderId },
        });
        toast.success("Image deleted successfully.");
        setShowDeleteModal(false);
        fetchFolders();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting");
    } finally {
      
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setSelectedFileNames(files.map(file => file.name));
  };

  const fetchImages = async (folderId) => {
    try {
      const token = localStorage.getItem('token'); // Get the token from localStorage
  
      const response = await axios.get(`/api/folders/${folderId}/images`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token in the Authorization header
        },
      });
  
      setImages((prev) => ({
        ...prev,
        [folderId]: response.data, // ✅ Store images under folderId
      }));
  
      console.log("Fetched images:", response.data); // ✅ Debugging
    } catch (error) {
      console.error("Error fetching images:", error);
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

  const organizeFolders = (folders) => {
    const folderMap = new Map();

    // Create a map of folders with their ID as keys
    folders.forEach(folder => folderMap.set(folder._id, { ...folder, subfolders: [] }));

    const rootFolders = [];

    // Assign subfolders to their parent
    folderMap.forEach(folder => {
      if (folder.pfolder) {
        folderMap.get(folder.pfolder)?.subfolders.push(folder);
      } else {
        rootFolders.push(folder);
      }
    });

    return rootFolders;
  };

  const uploadImages = async () => {
    if (!selectedFolder) {
      console.error("Please select a folder first.");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("images", file));
    formData.append("folderId", selectedFolder._id); // Ensure folder ID is sent

    try {
      const response = await axios.post(
        `/api/folders/${selectedFolder._id}/upload-images`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Update images state only for the selected folder
      setImages((prevImages) => ({
        ...prevImages,
        [selectedFolder._id]: [...(prevImages[selectedFolder._id] || []), ...response.data],
      }));

      setIsImageModalOpen(false);
      setSelectedFiles([]);
      toast.success("Images uploaded successfully.");
    } catch (error) {
      console.error("Error uploading images");
    }
  };

  const deleteImage = async (imageId, folderId) => {
    try {
      await axios.delete(`/api/folders/images/${imageId}`);
      setImages((prevImages) => ({
        ...prevImages,
        [folderId]: prevImages[folderId].filter((image) => image._id !== imageId),
      }));
      toast.success('Image deleted successfully.');
      fetchFolders();
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
      const token = localStorage.getItem('token'); // Get the token from localStorage
      const response = await axios.get('/api/folders/download/all', {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token in the Authorization header
        },
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
  
  const downloadFolder = async (folderId) => {
    try {
      const token = localStorage.getItem('token'); // Get the token from localStorage
      const response = await axios.get(`/api/folders/download/${folderId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token in the Authorization header
        },
        responseType: 'blob',
      });
  
      // Extract filename from Content-Disposition header (fallback to folderId)
      const contentDisposition = response.headers['content-disposition'];
      const match = contentDisposition && contentDisposition.match(/filename="(.+)"/);
      const filename = match ? match[1] : `folder_${folderId}.zip`;
  
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(new Blob([response.data]));
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading folder:', error);
      toast.error('Folder is empty');
    }
  };
  
  const handleEditClick = (image) => {
    // Extract name without extension
    const nameWithoutExtension = image.name.replace(/\.[^/.]+$/, "");
    setEditingImage(image._id);
    setNewImageName(nameWithoutExtension);
  };

  const handleSaveEdit = async (image) => {
    if (!newImageName.trim() || newImageName === image.name.replace(/\.[^/.]+$/, "")) return;

    try {
      const updatedName = newImageName + image.name.match(/\.[^/.]+$/)[0]; // Append original extension
      const response = await axios.put(`/api/folders/update-image/${image._id}`, { newName: updatedName });

      if (response.status === 200) {
        setImages((prevImages) => ({
          ...prevImages,
          [image.folder]: prevImages[image.folder].map((img) =>
            img._id === image._id ? { ...img, name: updatedName } : img
          ),
        }));

        // Reset the input after updating
        fetchFolders();
        setEditingImage(null);
        setNewImageName("");
      }
    } catch (error) {
      console.error("Error updating image name:", error);
    }
  };

  const toggleFolder = (folderId) => {
    setOpenFolders((prev) => {
      const newOpenFolders = new Set(prev);
      if (newOpenFolders.has(folderId)) {
        newOpenFolders.delete(folderId); // Close folder
      } else {
        newOpenFolders.add(folderId); // Open folder
        fetchImages(folderId); // ✅ Fetch images when opening the folder
      }
      return newOpenFolders;
    });
  };

  const renderFolders = (folders) => {
    return folders.map((folder) => (
      <div key={folder._id}>
        {/* Parent Folder */}
        <div
          className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded"
          style={{ cursor: "pointer" }}
          onClick={() => toggleFolder(folder._id)}
        >
          <div className="d-flex align-items-center">
            <FontAwesomeIcon
              icon={openFolders.has(folder._id) ? faMinus : faPlus}
              style={{ color: '#100B5C', cursor: 'pointer', fontSize: '20px' }}
            />
            {openFolders.has(folder._id) ? <FaFolderOpen fontSize={26} className="me-2" /> : <FaFolder fontSize={26} className="me-2" />}
            {folder.name}
          </div>
          <div>
            {folder.pfolder && (
              <FaDownload
                onClick={(e) => {
                  e.stopPropagation();
                  downloadFolder(folder._id);
                }}
                className="text-success me-3"
                style={{ cursor: "pointer" }}
              />
            )}

            <FaTrashAlt
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteFolder(folder._id);
              }}
              className="text-danger"
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>

        {/* Show "Create New Folder" for parent folders */}
        {openFolders.has(folder._id) && !folder.pfolder && (
          <div className="text-center mb-2">
            <Button variant="primary" onClick={() => {
              setIsFolderModalOpen(true)
              setSelectedFolder(folder)
            }}>
              <FaFolder className="me-2" /> Create New Folder
            </Button>
          </div>
        )}

        {/* Show "Upload Images" inside subfolders */}
        {openFolders.has(folder._id) && folder.pfolder && (
          <div className="text-center mb-2">
            <Button variant="primary"
              onClick={() => {
                setSelectedFolder(folder);
                setIsImageModalOpen(true);
              }}>
              <FaImage className="me-2" /> Upload Images
            </Button>
          </div>
        )}

        {openFolders.has(folder._id) && images[folder._id]?.length > 0 && (
          <div className="d-flex flex-wrap">
            {images[folder._id].map((image) => {
              const imageUrl = `/images/${image.location.replace(/^\/image\//, "")}`;

              return (
                <div key={image._id} className="p-2">
                  {/* Image Preview */}
                  <img
                    src={imageUrl}
                    alt={image.name}
                    className="img-fluid"
                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                  />

                  {/* Editable Image Name */}
                  {editingImage === image._id ? (
                    <input
                      type="text"
                      value={newImageName}
                      onChange={(e) => setNewImageName(e.target.value)}
                      className="form-control"
                      onBlur={() => handleSaveEdit(image)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveEdit(image);
                        if (e.key === "Escape") setEditingImage(null);
                      }}
                      autoFocus
                    />
                  ) : (
                    <div onClick={() => handleEditClick(image)} style={{ cursor: "pointer" }}>
                      {image.name} <FaEdit className="ms-2" />
                    </div>
                  )}

                  {/* Copy Image Link */}
                  <Button variant="link" onClick={() => copyImageLink(imageUrl)}>
                    <FaCopy />
                  </Button>

                  {/* Save or Edit Button */}
                  {editingImage === image._id ? (
                    <Button variant="link" onClick={() => handleSaveEdit(image)}>
                      ✅
                    </Button>
                  ) : (
                    <Button variant="link" onClick={() => handleEditClick(image)}>
                      <FaEdit />
                    </Button>
                  )}

                  {/* Delete Image */}
                  <Button variant="link" onClick={() => handleDeleteImage(image._id, folder._id)} className="text-danger">
                    <FaTrashAlt />
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {/* Recursively Render Subfolders if Opened */}
        {openFolders.has(folder._id) && folder.subfolders.length > 0 && (
          <div className="ms-4">{renderFolders(folder.subfolders)}</div>
        )}
      </div>
    ));
  };


  const filteredFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container" style={{ padding: '30px', backgroundColor: '#f4f4f4' }}>
      <ToastContainer />
      <h1 className="text-center mb-4">
        <FaImage className="me-2" />
        Image Management
      </h1>

      <div className="d-flex justify-content-center mb-3">
        <Button variant="warning" onClick={() => {
          setIsFolderModalOpen(true);
          setSelectedFolder(null); // ✅ Reset to make it a top-level folder
        }}
          className="me-2">
          <FaPlus className="me-2" /> Add New Folder
        </Button>
        <Button variant="success" onClick={downloadAllFolders}>
          <FaDownload className="me-2" /> Download All Folders
        </Button>
      </div>

      <div className="mt-3">
        <InputGroup className="mb-3">
          <InputGroup.Text>
            <BsSearch />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search by Subject Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </div>

      <div className="mb-3">
        <h3>Folders</h3>
        {filteredFolders.length === 0 ? <p>No folders found.</p> : renderFolders(filteredFolders)}
      </div>

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

      <DeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />

    </div>
  );
}
