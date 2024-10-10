export const uploadImages = (req, res) => {
  
    if (!req.files) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    res.status(200).json({ message: "Image uploaded successfully", file: req.file });
  };