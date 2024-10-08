export const uploadImage = (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    res.status(200).json({ message: "Image uploaded successfully", file: req.file });
  };