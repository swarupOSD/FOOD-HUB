import Food from '../models/Food.js';
import Review from '../models/Review.js';

// @desc    Get all foods
// @route   GET /api/foods
// @access  Public
const getFoods = async (req, res) => {
  try {
    const foods = await Food.find({});
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single food
// @route   GET /api/foods/:id
// @access  Public
const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (food) {
      res.json(food);
    } else {
      res.status(404).json({ message: 'Food not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a food item
// @route   POST /api/foods
// @access  Private/Admin
const createFood = async (req, res) => {
  try {
    const { title, description, category, price, restaurantName } = req.body;
    let imageUrl = '';

    if (req.file) {
      // multer-storage-cloudinary stores the URL in req.file.path
      imageUrl = req.file.path;
    } else if (req.body.image) {
      // Fallback for base64 or URL provided as string
      imageUrl = req.body.image;
    } else {
      return res.status(400).json({ message: 'Image is required' });
    }

    const food = new Food({
      title,
      description,
      category,
      price,
      restaurantName,
      image: imageUrl,
    });

    const createdFood = await food.save();
    res.status(201).json(createdFood);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a food item
// @route   PUT /api/foods/:id
// @access  Private/Admin
const updateFood = async (req, res) => {
  try {
    const { title, description, category, price, restaurantName } = req.body;
    
    const food = await Food.findById(req.params.id);

    if (food) {
      food.title = title || food.title;
      food.description = description || food.description;
      food.category = category || food.category;
      food.price = price || food.price;
      food.restaurantName = restaurantName || food.restaurantName;

      if (req.file) {
        food.image = req.file.path;
      } else if (req.body.image) {
         food.image = req.body.image;
      }

      const updatedFood = await food.save();
      res.json(updatedFood);
    } else {
      res.status(404).json({ message: 'Food not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a food item
// @route   DELETE /api/foods/:id
// @access  Private/Admin
const deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (food) {
      await Food.deleteOne({ _id: food._id });
      res.json({ message: 'Food removed' });
    } else {
      res.status(404).json({ message: 'Food not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a review for a food item
// @route   POST /api/foods/:id/reviews
// @access  Private
const createFoodReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    // Check if the user already reviewed this food
    const existingReview = await Review.findOne({
      userId: req.user._id,
      foodId: req.params.id,
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this food' });
    }

    const review = new Review({
      userId: req.user._id,
      foodId: req.params.id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    });

    await review.save();

    // Recalculate average rating and count
    const allReviews = await Review.find({ foodId: req.params.id });
    food.numReviews = allReviews.length;
    food.rating = Number(
      (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
    );
    await food.save();

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reviews for a food item
// @route   GET /api/foods/:id/reviews
// @access  Public
const getFoodReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ foodId: req.params.id }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle helpful vote on a review
// @route   PUT /api/foods/:id/reviews/:reviewId/helpful
// @access  Private
const toggleHelpful = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.helpful += 1;
    await review.save();

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getFoods, getFoodById, createFood, updateFood, deleteFood, createFoodReview, getFoodReviews, toggleHelpful };
