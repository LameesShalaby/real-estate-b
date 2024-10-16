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
  const { comment } = req.body;

  try {
    const post = await Post.findById(req.params.id);
    post.comments.push(comment);
    const newpost = await Post.findByIdAndUpdate(req.params.id, post);

    res.status(200).json({
      success: true,
      newpost,
    });
  } catch (error) {
    console.log(error);
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
    if (city) query.city = city;
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
