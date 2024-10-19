import Joi from "joi";
import Post from "../db/models/post.model.js";
import User from "../db/models/user.model.js";

// Get All Posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// Add Post
export const addPost = async (req, res) => {

  const schema = Joi.object({
    title: Joi.string().required(),
    desc: Joi.string().required(),
    price: Joi.number().required(),
    images: Joi.array().items(Joi.string()).optional(), 
    address: Joi.string().required(),
    city: Joi.string().required(),
    bedroom: Joi.number().required(),
    bathroom: Joi.number().required(),
    latitude: Joi.number().min(-90).max(90).required(), 
    longitude: Joi.number().min(-180).max(180).required(), 
    sqft: Joi.number().required(),
    type: Joi.string().valid("buy", "rent").required(), 
    property: Joi.string()
      .valid("apartment", "house", "villa", "studio")
      .required(), 
    location: Joi.string().required(),
    status: Joi.string()
      .valid("published", "sold", "under review")
      .default("under review"), 
    amenities: Joi.array()
      .items(
        Joi.string().valid(
          "air condition",
          "heating",
          "floor",
          "elevator",
          "garden",
          "parking",
          "intercom",
          "security",
          "wifi",
          "window type",
          "pool",
          "shared gym",
          "shared spa",
          "fireplace",
          "cable tv"
        )
      )
      .required(), 
    featured: Joi.boolean().default(false), 
    comments: Joi.array()
      .items(
        Joi.object({
          user: Joi.string().required(),
          text: Joi.string().max(500).required(),
          createdAt: Joi.date().optional(),
        })
      )
      .optional(), 
    userId: Joi.string().optional(), 
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const post = new Post({ ...req.body, userId: req.user._id }); 
    await post.save();
    res.status(201).send("Post added successfully.");
  } catch (err) {
    console.error(err); 
    res.status(500).send("Server Error");
  }
};

// Update Post
export const updatePost = async (req, res) => {
  const { id } = req.params;

  const schema = Joi.object({
    title: Joi.string().optional(),
    desc: Joi.string().optional(),
    price: Joi.number().optional(),
    images: Joi.array().items(Joi.string()).optional(),
    address: Joi.string().optional(),
    city: Joi.string().optional(),
    bedroom: Joi.number().optional(),
    bathroom: Joi.number().optional(),
    latitude: Joi.number().min(-90).max(90).optional(),
    longitude: Joi.number().min(-180).max(180).optional(),
    sqft: Joi.number().optional(),
    type: Joi.string().valid("buy", "rent").optional(),
    property: Joi.string()
      .valid("apartment", "house", "villa", "studio")
      .optional(),
    location: Joi.string().optional(),
    status: Joi.string().valid("published", "sold", "under review").optional(),
    amenities: Joi.array()
      .items(
        Joi.string().valid(
          "air condition",
          "heating",
          "floor",
          "elevator",
          "garden",
          "parking",
          "intercom",
          "security",
          "wifi",
          "window type",
          "pool",
          "shared gym",
          "shared spa",
          "fireplace",
          "cable tv"
        )
      )
      .optional(),
    featured: Joi.boolean().optional(),
    comments: Joi.array()
      .items(
        Joi.object({
          user: Joi.string().required(),
          text: Joi.string().max(500).required(),
          createdAt: Joi.date().optional(),
        })
      )
      .optional(),
    userId: Joi.string().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).send("Post not found.");


    if (post.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .send("You do not have permission to update this post.");
    }

   
    Object.assign(post, req.body);

    await post.save();

    res.status(200).send("Post updated successfully.");
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// Delete Post
export const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);
    console.log(post); 

    if (!post) return res.status(404).send("Post not found.");


    console.log(
      `Post User ID: ${post.userId}, Logged In User ID: ${req.user._id}`
    );


    if (post.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .send("You do not have permission to delete this post.");
    }


    await Post.deleteOne({ _id: id });

    res.status(200).send("Post deleted successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Get Post Details
export const getPostDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id).populate("userId", "username email");
    if (!post) return res.status(404).send("Post not found.");

    res.json(post);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// Add Favorite
export const addFavorite = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).send("User not found.");
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).send("Post not found.");
    }

    if (!user.favorites.includes(id)) {
      user.favorites.push(id);
      await user.save();
      return res.status(200).send("Post added to favorites.");
    } else {
      return res.status(400).send("Post is already in favorites.");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Remove Favorite
export const removeFavorite = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(req.user._id);
    user.favorites = user.favorites.filter((fav) => fav.toString() !== id);
    await user.save();
    res.status(200).send("Post removed from favorites.");
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// Add Comment
export const addComment = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  console.log(`Post ID: ${id}`);

  const schema = Joi.object({
    text: Joi.string().required().max(500),
  });

  const { error } = schema.validate({ text });
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).send("Post not found.");

    const comment = {
      user: req.user._id,
      text,
    };

    post.comments.push(comment);
    await post.save();

    res.status(201).json({ message: "Comment added successfully.", comment });
  } catch (err) {
    console.error(err);
  }
};

export const getAllComments = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id).populate("comments.user", "username");
    if (!post) return res.status(404).send("Post not found.");

    res.json(post.comments);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

export const getFilteredPosts = async (req, res) => {
  const { price, type, property, location } = req.query;

  const filters = {};

  if (price) {
    filters.price = { $lte: Number(price) };
  }

  if (type) {
    filters.type = type;
  }

  if (property) {
    filters.property = property;
  }

  if (location) {
    filters.location = { $regex: location, $options: "i" };
  }

  try {
    const posts = await Post.find(filters).populate("userId", "username email");
    res.json(posts);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// Get All Favorites

// export const getAllFavorites = async (req, res) => {
//   console.log("fffffffff");

//   try {
//     if (!req.user || !req.user._id) {
//       return res
//         .status(400)
//         .send("User is not authenticated or ID is missing.");
//     }

//     const user = await User.findById(req.user._id).populate("favorites");

//     if (!user) {
//       console.error("User not found with ID:", req.user._id);
//       return res.status(404).send("User not found.");
//     }

//     res.json(user.favorites);
//   } catch (err) {
//     console.error("Error fetching favorites:", err);
//     res.status(500).send("Server Error");
//   }
// };
