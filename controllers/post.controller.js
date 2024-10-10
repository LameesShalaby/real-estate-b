import Post from "../db/models/post.model.js";

// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("userId", "username");
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve posts", error: err.message });
  }
};

// Add post
export const addPost = async (req, res) => {
  const {
    title,
    desc,
    price,
    images,
    address,
    city,
    bedroom,
    bathroom,
    latitude,
    longitude,
    type,
    property,
    postDetail,
  } = req.body;

  try {
    const newPost = new Post({
      title,
      desc,
      price,
      images,
      address,
      city,
      bedroom,
      bathroom,
      latitude,
      longitude,
      type,
      property,
      postDetail,
      userId: req.user.id,
    });

    await newPost.save();
    res.status(201).json({ message: "Post added successfully", post: newPost });
  } catch (err) {
    res.status(500).json({ message: "Failed to add post", error: err.message });
  }
};

// Update post
export const updatePost = async (req, res) => {
  const id = req.params.id;
  const updates = req.body;

  try {
    const updatedPost = await Post.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true, // Ensure validators are applied
    });

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found or no changes made" });
    }

    res.status(200).json({ message: "Post updated successfully", updatedPost });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update post", error: err.message });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  const id = req.params.id; 

  try {
    const post = await Post.findByIdAndDelete(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete post", error: err.message });
  }
};


// add comments

// export const addComment = async (req, res, next) => {
//   const { comment } = req.body;

//   try {
//     const postComment = await Post.findByIdAndUpdate(
//       req.params.id,
//       {
//         $push: { comments: { text: comment, postedBy: req.user._id } },
//       },
//       { new: true }
//     );
//     if (!postComment) {
//       return res.status(404).json({
//         success: false,
//         message: "Post not found",
//       });
//     }

//     const post = await Post.findById(postComment._id).populate(
//       "comments.postedBy",
//       "name email"
//     );

//     res.status(200).json({
//       success: true,
//       post,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const addComment = async (req, res, next) => {
//   const { comment } = req.body;

//   // Log the user
//   console.log('User:', req.user);

//   // Validate input
//   if (!comment || typeof comment !== 'string' || comment.trim() === '') {
//     return res.status(400).json({
//       success: false,
//       message: "Comment is required and should be a non-empty string",
//     });
//   }

//   try {
//     const postComment = await Post.findByIdAndUpdate(
//       req.params.id,
//       {
//         $push: { comments: { text: comment, postedBy: req.user._id } },
//       },
//       { new: true }
//     );

//     if (!postComment) {
//       return res.status(404).json({
//         success: false,
//         message: "Post not found",
//       });
//     }

//     const post = await Post.findById(postComment._id).populate(
//       "comments.postedBy",
//       "name email"
//     );

//     res.status(200).json({
//       success: true,
//       post,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
