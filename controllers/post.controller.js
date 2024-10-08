import Post from "../db/models/post.model.js";

// get all posts
export const getAllPosts = async (req, res) => {
  const posts = await Post.find();
  res.status(200).json(posts);
}

// add post
export const addPost = async (req, res) => {
  try {
    const newPost = await Post.create(req.body)
    return res.status(201).json(newPost) 
  } catch (error) {
    res.status(400).json({message:'Failed to add Post', error})
  }
}

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