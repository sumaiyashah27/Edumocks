const express = require('express');
const Folder = require('../models/folder-model'); // Ensure this path is correct
const path = require('path');
const fs = require('fs-extra');
const router = express.Router();
const multer = require('multer');
const archiver = require('archiver');
const Image = require('../models/image-model'); 

// Define the folder where images will be stored
const uploadFolder = path.join(__dirname, '../image'); // Ensure this folder exists
fs.ensureDirSync(uploadFolder); // Ensure the folder exists

// Set up storage for uploaded images
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const folderId = req.params.folderId;
    const folder = await Folder.findById(folderId);
    console.log('Folder ID received:', folderId);
    if (!folder) {
      return cb(new Error('Folder not found'), false);
    }

    const folderPath = path.join(uploadFolder, folder.name);
    fs.ensureDirSync(folderPath); // Ensure folder exists before storing images
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Route to create a folder
router.post('/create-folder', async (req, res) => {
  try {
    const { name, pfolder } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Folder name is required.' });
    }

    // Check if folder already exists under the same parent
    const existingFolder = await Folder.findOne({ name, pfolder });
    if (existingFolder) {
      return res.status(400).json({ message: 'Folder already exists.' });
    }

    // Create folder in database
    const newFolder = new Folder({ name, pfolder });
    await newFolder.save();

    res.status(201).json(newFolder);
  } catch (error) {
    console.error('Error creating folder:', error);
    res.status(500).json({ message: 'Error creating folder' });
  }
});

// Edit image name
router.put('/update-image/:imageId', async (req, res) => {
  try {
    const { imageId } = req.params;
    const { newName } = req.body;

    if (!newName) {
      return res.status(400).json({ message: 'New name is required.' });
    }

    const image = await Image.findById(imageId);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Update image name
    image.name = newName;
    await image.save();

    res.json({ message: 'Image name updated successfully', image });
  } catch (error) {
    console.error('Error updating image name:', error);
    res.status(500).json({ message: 'Error updating image name' });
  }
});

//Fetch Folders Exists
router.get('/', async (req, res) => {
  try {
    const folders = await Folder.find();
    res.json(folders);
  } catch (error) {
    console.error('Error fetching folders:', error);
    res.status(500).json({ message: 'Error fetching folders' });
  }
});
// Delete a folder
router.delete('/:folderId', async (req, res) => {
  try {
    const { folderId } = req.params;
    const folder = await Folder.findById(folderId);

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    const folderPath = path.join(uploadFolder, folder.name);
    if (fs.existsSync(folderPath)) {
      fs.removeSync(folderPath);
    }

    await Folder.findByIdAndDelete(folderId);

    res.json({ message: 'Folder deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting folder' });
  }
});

// Upload images to a folder
router.post('/:folderId/upload-images', upload.array('images', 10), async (req, res) => {
  try {
    const { folderId } = req.params; // Get folderId from URL parameters
    console.log('Received folderId:', folderId); 
    const folder = await Folder.findById(folderId);

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    // Prepare the image data for database insertion
    const images = req.files.map(file => ({
      name: file.filename,
      location: `/image/${folder.name}/${file.filename}`, // Relative location (for URLs)
      folder: folderId
    }));

    // Save the image metadata to the database
    const uploadedImages = await Image.insertMany(images);

    // Add image references to the folder's image array
    folder.images.push(...uploadedImages.map(img => img._id));
    await folder.save();

    // Respond with the uploaded images metadata
    res.status(201).json(uploadedImages);
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ message: 'Error uploading images' });
  }
});

// Delete an image
router.delete('/images/:imageId', async (req, res) => {
  try {
    const { imageId } = req.params;
    const image = await Image.findById(imageId);

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Remove the image file from the file system
    const imagePath = path.join(uploadFolder, image.location);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath); // Delete the image file
    }

    // Remove the image from the database
    await Image.findByIdAndDelete(imageId);

    // Also remove the image reference from the associated folder
    const folder = await Folder.findById(image.folder);
    if (folder) {
      folder.images.pull(imageId);  // Remove the image from the folder's images array
      await folder.save();  // Save the updated folder
    }

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: 'Error deleting image' });
  }
});

// Fetch images in a folder
router.get('/:folderId/images', async (req, res) => {
  try {
    const { folderId } = req.params;
    const folder = await Folder.findById(folderId).populate('images');

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    res.json(folder.images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ message: 'Error fetching images' });
  }
});

// Backend route to download all folders as a zip file
router.get('/download/all', async (req, res) => {
  try {
    // Root folder where all folders are stored
    const rootFolderPath = path.join(__dirname, '..', 'image');

    // Check if the images directory exists
    if (!fs.existsSync(rootFolderPath)) {
      return res.status(404).json({ message: 'Images directory not found' });
    }

    // Create a zip stream
    const zip = archiver('zip', { zlib: { level: 9 } });

    // Set the headers to trigger a download of the zip file
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=all_folders.zip');

    // Pipe the zip data to the response object
    zip.pipe(res);

    // Get all folders inside the 'images' directory
    const folders = fs.readdirSync(rootFolderPath);

    // Loop through each folder and add them to the zip
    folders.forEach((folder) => {
      const folderPath = path.join(rootFolderPath, folder);
      console.log("Checking folder path all:", folderPath);
      // Check if it's a directory (folder)
      if (fs.lstatSync(folderPath).isDirectory()) {
        zip.directory(folderPath, folder); // Add the folder to the zip with its name
      }
    });

    // Finalize the zip creation process
    zip.finalize();
  } catch (error) {
    console.error('Error downloading all folders:', error);
    res.status(500).json({ message: 'Error downloading all folders' });
  }
});

router.get('/download/:folderId', async (req, res) => {
  try {
    const { folderId } = req.params;
    const folder = await Folder.findById(folderId);

    if (!folder) {
      console.log("Folder not found in DB:", folderId);
      return res.status(404).json({ message: "Folder not found in database" });
    }

    const rootFolderPath = path.join(__dirname, '..', 'image');
    const folderPath = path.join(rootFolderPath, folder.name);

    console.log("Checking folder path:", folderPath);

    if (!fs.existsSync(folderPath)) {
      console.log("Folder does NOT exist:", folderPath);
      return res.status(404).json({ message: "Folder directory not found" });
    }

    const zip = archiver('zip', { zlib: { level: 9 } });

    // Fix filename issue (use folder name)
    console.log('folder',folder);
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename=${folder.name}.zip`);

    zip.pipe(res);

    // Include the entire folder (parent + subfolders)
    zip.directory(folderPath, folder.name);

    // Fix: Ensure zip is finalized properly
    zip.finalize();
  } catch (error) {
    console.error("Error downloading folder:", error);
    res.status(500).json({ message: "Error downloading folder" });
  }
});

module.exports = router;