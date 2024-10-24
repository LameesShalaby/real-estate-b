import Post from "../db/models/post.model.js";
import User from "../db/models/user.model.js";

// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("userId", "username");
    res.status(200).json(posts);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to retrieve posts", error: err.message });
  }
};

// Get post details by ID
export const getPostDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id)
      .populate("userId", "username")
      .populate("comments");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to retrieve post details", error: err.message });
  }
};

export const getAllFavourite = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate("favorites");

    res.status(200).json(user.favorites);
  } catch (err) {
    res.status(500).json({
      message: "Failed to retrieve favorite users",
      error: err.message,
    });
  }
};

export const addFavourites = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const user = await User.findById(userId);

    if (user?.favorites.includes(postId)) {
      return res.status(400).json({ message: "Post already in favorites." });
    }

    user?.favorites.push(postId);
    await user.save();

    res.status(200).json({ message: "Post added to favorites." });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

export const removeFavourites = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.body;

    const user = await User.findById(userId);

    // Check if the post is in the user's favorites
    if (!user?.favorites.includes(postId)) {
      return res.status(404).json({ message: "Post not found in favorites." });
    }

    // Remove the post from the favorites array
    user.favorites = user.favorites.filter(
      (favorite) => favorite.toString() !== postId
    );

    await user.save();

    res.status(200).json({ message: "Post removed from favorites." });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
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
    location,
    sqft,
    amenites,
    type,
    property,
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
      location,
      sqft,
      amenites,
      type,
      property,
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
      return res
        .status(404)
        .json({ message: "Post not found or no changes made" });
    }

    res.status(200).json({ message: "Post updated successfully", updatedPost });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Failed to update post", error: err.message });
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
    res
      .status(500)
      .json({ message: "Failed to delete post", error: err.message });
  }
};

// add comments

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;  // Extract comment text from the request body
    const postId = req.params.id;  // Extract postId from the request parameters
    console.log(req.user);
    
    const userId = req.user.id;  // Extract userId from the authenticated user
    // Validate that the comment text is not empty or null
    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment cannot be empty." });
    }

    // Create a new comment object
    const newComment = { user: userId, text };

    // Update the post by pushing the new comment into the comments array
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: newComment } }, // Use $push to add the new comment
      { new: true, runValidators: true } // Return the updated post and validate
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ message: "Comment added successfully", post: updatedPost });
    } catch (error) {
    console.error("Error adding comment:", error); // Log the entire error for more context
    res.status(500).json({ message: "Failed to add comment", error: error.message });
    }
};

// Filter Posts
export const getFilteredPosts = async (req, res) => {
  try {
    const {
      property,
      type,
      location,
      city,
      amenities,
      bedroom,
      bathroom,
      minPrice,
      maxPrice,
    } = req.query;
    console.log("Filters received:", req.query);

    const query = {};

    if (property) query.property = property;
    if (type) query.type = type;
    if (location) query.location = location;
    if (city) query.city = { $regex: new RegExp(city, "i") };
    if (bedroom) query.bedroom = Number(bedroom);
    if (bathroom) query.bathroom = Number(bathroom);

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (amenities) {
      const amenitiesArray = amenities.split(",").map((item) => item.trim());
      query.amenities = { $in: amenitiesArray };
    }

    console.log(query);

    const posts = await Post.find(query);
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Error fetching posts", error });
  }
};

// get User Reviews
export const getUserReviews = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from the authenticated user
    const posts = await Post.find({ 'comments.user': userId }) // Find posts with the user's comments
      .populate('comments.user', 'username') // Populate the username for each comment
      .exec();

    // Log posts to check their structure
    console.log('Posts:', posts);

    const userComments = posts.flatMap(post => {
      if (!post.comments) return []; // Check if comments exist
      return post.comments
        .filter(comment => comment.user && comment.user._id.toString() === userId) // Ensure comment.user exists
        .map(comment => ({
          postId: post._id,
          postTitle: post.title,
          comment: comment.text,
          commentDate: comment.createdAt,
        }));
    });

    if (userComments.length === 0) {
      return res.status(200).json({ message: 'No reviews found' });
    }

    res.status(200).json(userComments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};


// Delete a comment from a post
export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    // Find the post by postId
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Filter out the comment with the specified commentId
    const updatedComments = post.comments.filter(
      (comment) => comment._id.toString() !== commentId
    );

    // If no comment is found, return an error
    if (updatedComments.length === post.comments.length) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Update the post's comments array
    post.comments = updatedComments;

    // Save the updated post
    await post.save();

    return res.status(200).json({ message: 'Comment deleted successfully', post });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error });
  }
};