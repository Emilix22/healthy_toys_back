const db = require("../database/models");
const sequelize = db.sequelize;

const Products = db.Products;

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

    Products.findAndCountAll({
      order: [["name"]],
      limit: size,
      offset: page * size,
    })
      .then((products) => {
        let info = {
          meta: {
            status: 200,
            total: products.count,
            totalPages: Math.ceil(products.count / size),
            size: size,
            url: "/products",
          },
          data: products.rows,
        };
        return res.status(200).json(info);
      })
      .catch((error) => {
        console.log(error);
      });
  },

  create: (req, res) => {
    Products.findOne({
      where: {
        name: req.body.name,
      },
    })
      .then((productInDB) => {
        if (productInDB) {
          return res.status(401).json({
            error: {
              productInDB: `Ya existe un producto registrado con el nombre: ${req.body.name}`,
            },
          });
        }
        let img;

        if (req.file != undefined) {
          img = req.file.filename;
        } else {
          img = "logoHT.png";
        }
        Products.create({
          name: req.body.name,
          category_id: req.body.category,
          price: req.body.price,
          description: req.body.description,
          image: img,
          quantity: req.body.quantity,
          promotion: req.body.promotion,
        }).then((product) => {
          let info = {
            meta: {
              status: 200,
              url: "/products/create",
            },
            data: {
              name: product.name,
            },
          };
          return res.status(200).json(info);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  },

  update: (req, res) => {
    Products.update(
      {
        name: req.body.name,
      },
      {
        where: { id_product: req.params.id },
      }
    )
      .then((result) => {
        Products.findOne({
          where: { id_product: req.params.id },
        }).then((productEdited) => {
          let info = {
            meta: {
              status: 200,
              url: "/products/update/:id/",
            },
            data: productEdited,
          };
          return res.status(200).json(info);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  },
  destroy: (req, res) => {
    Products.destroy({
      where: { id_product: req.params.id },
    })
      .then((confirmDestroy) => {
        return res
          .status(200)
          .json({ message: "producto eliminado con éxito" });
      })
      .catch((error) => {
        console.log(error);
      });
  },
};

module.exports = controller;
