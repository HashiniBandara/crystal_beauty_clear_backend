import Order from "../models/order.js";
import Product from "../models/product.js";

export async function createOrder(req, res) {
  if (req.user == null) {
    res.status(401).json({
      message: "Unathorized",
    });
    return;
  }

  const body = req.body;

  const orderData = {
    orderId: "",
    email: req.user.email,
    name: body.name,
    address: body.address,
    phoneNumber: body.phoneNumber,
    billItems: [],
    total: 0,
  };

  Order.find()
    .sort({
      date: -1,
    })
    .limit(1)
    .then(async (lastBills) => {
      if (lastBills.length == 0) {
        orderData.orderId = "ORD0001";
      } else {
        const lastBill = lastBills[0];
        const lastOrderId = lastBill.orderId; //"ORD0061"
        const lastOrderNumber = lastOrderId.replace("ORD", ""); //"0061"
        const lastOrderNumberInt = parseInt(lastOrderNumber); //61
        const newOrderNumberInt = lastOrderNumberInt + 1; //62
        const newOrderNumberStr = newOrderNumberInt.toString().padStart(4, "0"); //0062
        orderData.orderId = "ORD" + newOrderNumberStr;
      }

      for (let i = 0; i < body.billItems.length; i++) {
        // const billItem = body.billItems[i];

        const product = await Product.findOne({
          productId: body.billItems[i].productId,
        });

        if (product == null) {
          res.status(404).json({
            message:
              "Product with product id " +
              body.billItems[i].productId +
              " not found",
          });
          return;
        }

        //  {
        //         productId: String,
        //         productName: String,
        //         image: String,
        //         quantity: Number,
        //         price: Number
        //     }

        orderData.billItems[i] = {
          productId: product.productId,
          productName: product.name,
          image: product.images[0],
          quantity: body.billItems[i].quantity,
          price: product.price,
        };
        orderData.total =
          orderData.total + product.price * body.billItems[i].quantity;
      }

      const order = new Order(orderData);
      order
        .save()
        .then(() => {
          res.json({
            message: "Order saved successfully",
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            message: "Order not saved",
          });
        });
    });
}


export function getOrders(req, res) {
  if (req.user == null) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  if (req.user.role === "admin") {
    // Admin: show all orders sorted from latest to oldest
    Order.find()
      .sort({ date: -1 })
      .then((orders) => res.json(orders))
      .catch((err) => res.status(500).json({ message: "Orders not found" }));
  } else {
    // Non-admin: show only user's orders
    Order.find({ email: req.user.email })
      .sort({ date: -1 })
      .then((orders) => res.json(orders))
      .catch((err) => res.status(500).json({ message: "Orders not found" }));
  }
}


// export async function updateOrder(req, res) {
//   try {
//     if (req.user == null) {
//       res.status(401).json({
//         message: "Unathorized",
//       });
//       return;
//     }

//     if (req.user.role != "admin") {
//       res.status(403).json({
//         message: "You are not authorized to update an order",
//       });
//       return;
//     }

//     const orderId = req.params.orderId;
//     const order = await Order.findOneAndUpdate(
//       {
//         orderId: orderId,
//       },
//       req.body
//     );
//     res.json({
//       message: "Order updated successfully",
//     });
//   } catch (err) {
//     // console.log(err);
//     res.status(500).json({
//       message: "Order not updated",
//     });
//   }
// }
export async function updateOrder(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "You are not authorized to update an order" });
    }

    const orderId = req.params.orderId;
    const newStatus = req.body.status;

    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const previousStatus = order.status;

    // Allowed status transitions that require stock deduction
    const shouldDeductStock =
      ["Accepted", "Processing", "Delivered"].includes(newStatus) &&
      !["Accepted", "Processing", "Delivered"].includes(previousStatus);

    if (shouldDeductStock) {
      for (const item of order.billItems) {
        const product = await Product.findOne({ productId: item.productId });

        if (!product) {
          return res.status(404).json({
            message: `Product with ID ${item.productId} not found`,
          });
        }

        // Check if enough stock is available
        if (product.stock < item.quantity) {
          return res.status(400).json({
            message: `Insufficient stock for product: ${product.name}`,
          });
        }

        product.stock -= item.quantity;
        await product.save();
      }
    }

    // Update the order status
    order.status = newStatus;
    await order.save();

    return res.json({ message: "Order updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Order not updated" });
  }
}
