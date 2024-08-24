const db = require("../database/models");
const sequelize = db.sequelize;
require("dotenv").config();

//Otra forma de llamar a los modelos
const Orders = db.Orders; 
const OrderItems = db.OrderItems; 

const controller = {
  list: (req, res) => {
    const pageAsNumber = Number.parseInt(req.query.page);
    const sizeAsNumber = Number.parseInt(req.query.size);

    let page = 0;
    if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
      page = pageAsNumber;
    }

    let size = 16;
    if (
      !Number.isNaN(sizeAsNumber) &&
      sizeAsNumber > 0 /*&& sizeAsNumber < 16*/
    ) {
      size = sizeAsNumber;
    }

    Orders.findAndCountAll({
      limit: size,
      offset: page * size,
      include: [{association: 'orderItems'}]
    })
      .then((orders) => {
        let info = {
          meta: {
            status: 200,
            total: orders.count,
            totalPages: Math.ceil(orders.count / size),
            size: size,
            url: "/orders",
          },
          data: orders.rows,
        };
        return res.status(200).json(info);
      })
      .catch((error) => {
        console.log(error);
      });
  },

  create: (req, res) => {
    Orders.create(
      {
        user_id: req.id_users,
        total: req.body.total,
        shipping_method: req.body.shipping_method,  
      },
      
    )
      .then((order) => {
        req.body.orderItems.forEach(item => {
          OrderItems.create(
            {
              order_id: order.id_order,
              product_id: item.id_product,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            },
          )
        });
        let info = {
          meta: {
            status: 200,
            url: "/orders/create",
          },
          data: {
            order: order
          },
        };
        return res.status(200).json(info);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  // update: (req, res) => {
  //   Privileges.update(
  //     {
  //       name: req.body.name,
  //     },
  //     {
  //       where: { id_privileges: req.params.id },
  //     }
  //   )
  //     .then((result) => {
  //       Privileges.findOne({
  //         where: { id_privileges: req.params.id },
  //       }).then((privilegeEdited) => {
  //         let info = {
  //           meta: {
  //             status: 200,
  //             url: "/privileges/update/:id/",
  //           },
  //           data: privilegeEdited,
  //         };
  //         return res.status(200).json(info);
  //       });
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // },
  // destroy: (req, res) => {
  //   Privileges.destroy({
  //     where: { id_privileges: req.params.id },
  //   })
  //     .then((confirmDestroy) => {
  //       return res
  //         .status(200)
  //         .json({ message: "permiso de usuario eliminado con éxito" });
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // },
};

module.exports = controller;
