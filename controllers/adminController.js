import Product from "../models/product.js";
import User from "../models/user.js";
import Order from "../models/order.js";
import { Contact } from "../models/contact.js";
import Review from "../models/review.js";
import Category from "../models/category.js";

// export const getAdminStats = async (req, res) => {
//   try {
//     if (!req.user || req.user.role !== "admin") {
//       return res.status(403).json({ message: "Unauthorized" });
//     }

//     const [totalUsers, totalProducts, totalOrders, totalContacts, totalReviews] = await Promise.all([
//       User.countDocuments(),
//       Product.countDocuments(),
//       Order.countDocuments(),
//       Contact.countDocuments(),
//       Review.countDocuments()
//     ]);

//     const newContactCount = await Contact.countDocuments({
//       createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // last 7 days
//     });

//     res.json({
//       totalUsers,
//       totalProducts,
//       totalOrders,
//       totalContacts,
//       newContactCount,
//       totalReviews,
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Failed to load stats", error: err.message });
//   }
// };

// GET: /api/stats/summary (Admin only)
export const getAdminDashboardStats = async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const [userCount, productCount, categoryCount, orderCount, contactCount, reviewCount] =
      await Promise.all([
        User.countDocuments(),
        Product.countDocuments(),
        Category.countDocuments(),
        Order.countDocuments(),
        Contact.countDocuments(),
        Review.countDocuments(),
      ]);

    res.json({
      users: userCount,
      products: productCount,
      categories: categoryCount,
      orders: orderCount,
      contacts: contactCount,
      reviews: reviewCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch summary", error: error.message });
  }
};
