import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Food from './models/Food.js';

dotenv.config();

const realisticFoods = [
  {
    title: 'Classic Margherita Pizza',
    description: 'Traditional Italian pizza with San Marzano tomato sauce, fresh mozzarella, and basil leaves.',
    category: 'Pizza',
    price: 14.99,
    rating: 4.8,
    restaurantName: 'Luigi\'s Pizzeria',
    image: 'https://images.pexels.com/photos/1049620/pexels-photo-1049620.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Pepperoni Feast',
    description: 'Loaded with double pepperoni, signature tomato sauce, and a blend of three cheeses.',
    category: 'Pizza',
    price: 18.99,
    rating: 4.6,
    restaurantName: 'Luigi\'s Pizzeria',
    image: 'https://images.pexels.com/photos/803290/pexels-photo-803290.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Double Smash Burger',
    description: 'Two smashed beef patties, American cheese, caramelized onions, pickles, and secret sauce on a brioche bun.',
    category: 'Burger',
    price: 12.99,
    rating: 4.9,
    restaurantName: 'Burger Joint',
    image: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Spicy Chicken Sandwich',
    description: 'Crispy buttermilk fried chicken breast, spicy mayo, pickles, and slaw on a toasted bun.',
    category: 'Burger',
    price: 11.50,
    rating: 4.7,
    restaurantName: 'Burger Joint',
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Salmon Avocado Roll',
    description: 'Fresh Atlantic salmon, ripe avocado, cucumber, and toasted sesame seeds.',
    category: 'Sushi',
    price: 16.00,
    rating: 4.8,
    restaurantName: 'Sakura Sushi House',
    image: 'https://images.pexels.com/photos/1148086/pexels-photo-1148086.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Spicy Tuna Crunch',
    description: 'Spicy tuna mix, cucumber, topped with tempura flakes and spicy mayo.',
    category: 'Sushi',
    price: 15.50,
    rating: 4.5,
    restaurantName: 'Sakura Sushi House',
    image: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Dragon Roll',
    description: 'Eel and cucumber topped with thin slices of avocado and eel sauce.',
    category: 'Sushi',
    price: 18.00,
    rating: 4.9,
    restaurantName: 'Sakura Sushi House',
    image: 'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Chicken Tikka Masala',
    description: 'Tender chicken pieces roasted in a tandoor then simmered in a rich, creamy tomato sauce.',
    category: 'Indian',
    price: 17.50,
    rating: 4.7,
    restaurantName: 'Taj Mahal Indian Cuisine',
    image: 'https://images.pexels.com/photos/2418264/pexels-photo-2418264.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Garlic Naan',
    description: 'Freshly baked traditional Indian bread infused with fresh garlic and cilantro.',
    category: 'Indian',
    price: 4.99,
    rating: 4.8,
    restaurantName: 'Taj Mahal Indian Cuisine',
    image: 'https://images.pexels.com/photos/3780132/pexels-photo-3780132.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Vegetable Biryani',
    description: 'Aromatic basmati rice cooked with mixed vegetables, saffron, and exotic spices.',
    category: 'Indian',
    price: 14.99,
    rating: 4.4,
    restaurantName: 'Taj Mahal Indian Cuisine',
    image: 'https://images.pexels.com/photos/7394819/pexels-photo-7394819.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Classic Cheeseburger',
    description: 'Beef patty with melted cheddar, lettuce, tomato, onion, and house sauce.',
    category: 'Burger',
    price: 10.99,
    rating: 4.5,
    restaurantName: 'American Diner',
    image: 'https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'BBQ Bacon Burger',
    description: 'Smoked bacon, cheddar cheese, crispy onion rings, and sweet BBQ sauce.',
    category: 'Burger',
    price: 14.50,
    rating: 4.6,
    restaurantName: 'American Diner',
    image: 'https://images.pexels.com/photos/1556688/pexels-photo-1556688.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Vegetarian Pizza',
    description: 'Mushrooms, bell peppers, onions, black olives, and fresh tomatoes.',
    category: 'Pizza',
    price: 15.99,
    rating: 4.3,
    restaurantName: 'Luigi\'s Pizzeria',
    image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Hawaiian Pizza',
    description: 'Classic combination of sweet pineapple, savory ham, and extra cheese.',
    category: 'Pizza',
    price: 16.50,
    rating: 4.2,
    restaurantName: 'Luigi\'s Pizzeria',
    image: 'https://images.pexels.com/photos/2271196/pexels-photo-2271196.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Chocolate Lava Cake',
    description: 'Decadent chocolate cake with a warm, gooey molten center. Served with vanilla bean ice cream.',
    category: 'Dessert',
    price: 8.99,
    rating: 4.9,
    restaurantName: 'Sweet Tooth Bakery',
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'New York Cheesecake',
    description: 'Classic creamy cheesecake with a graham cracker crust and strawberry compote.',
    category: 'Dessert',
    price: 7.50,
    rating: 4.7,
    restaurantName: 'Sweet Tooth Bakery',
    image: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Pad Thai',
    description: 'Stir-fried rice noodles with eggs, peanuts, bean sprouts, and tamarind sauce.',
    category: 'Asian',
    price: 13.99,
    rating: 4.6,
    restaurantName: 'Thai Orchid',
    image: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Green Curry',
    description: 'Spicy green curry with bamboo shoots, basil, bell peppers, and coconut milk.',
    category: 'Asian',
    price: 14.50,
    rating: 4.5,
    restaurantName: 'Thai Orchid',
    image: '/images/green-curry.png',
  },
  {
    title: 'Caesar Salad',
    description: 'Crisp romaine lettuce, parmesan cheese, croutons, and creamy Caesar dressing.',
    category: 'Healthy',
    price: 9.99,
    rating: 4.4,
    restaurantName: 'Green Bowl',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Quinoa Power Bowl',
    description: 'Quinoa, roasted sweet potatoes, black beans, avocado, and lime dressing.',
    category: 'Healthy',
    price: 12.50,
    rating: 4.8,
    restaurantName: 'Green Bowl',
    image: '/images/quinoa-bowl.png',
  }
];

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing foods...');
    await Food.deleteMany(); // Only clear foods, keep users/orders for now (or clear orders too if you want)

    console.log('Inserting realistic foods...');
    await Food.insertMany(realisticFoods);

    console.log('Data Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
