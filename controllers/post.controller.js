import Post from "../db/models/post.model.js";

// get all posts


// add post


// update post


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