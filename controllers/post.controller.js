import Post from "../db/models/post.model.js";

// get all posts


// add post


// update post
export const updatePost = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    
    // Find the post by ID and update with the new data
    const updatedPost = await Post.findByIdAndUpdate(id, updatedData, { new: true });
    
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ message: "Post updated successfully", updatedPost });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
};
// delete post

export const deletePost = async (req, res) => {
    try {
      const id = req.params.id;
      const post = await Post.findByIdAndDelete(id);
      console.log(post);
      const postsAfterDelete = await Post.find();
      res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ err });
    }
  };
  

// add comment