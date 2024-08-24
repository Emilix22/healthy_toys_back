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
      include: [{association: 'categories'}]
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
        let img1;
        let img2;
        let img3;
        let img4;

        if (req.files.image1) {
          img1 = req.files.image1[0].filename;
        } else {
          img1 = "logoHT.png";
        }
        if (req.files.image2) {
          img2 = req.files.image2[0].filename;
        } else {
          img2 = "logoHT.png";
        }
        if (req.files.image3) {
          img3 = req.files.image3[0].filename;
        } else {
          img3 = "logoHT.png";
        }
        if (req.files.image4) {
          img4 = req.files.image4[0].filename;
        } else {
          img4 = "logoHT.png";
        }
        Products.create({
          name: req.body.name,
          category_id: req.body.category,
          price: req.body.price,
          description: req.body.description,
          image1: img1,
          image2: img2,
          image3: img3,
          image4: img4,
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
      })  
  },

  detail: (req, res) => {
    Products.findOne({
      where: {
        id_product: req.params.id,
      },
      include: [{association: 'categories'}]
    })
    .then((product) => {
      let info = {
        meta: {
          status: 200,
          url: "/products/detail/:id",
        },
        data: product,
      };
      return res.status(200).json(info);
    })
    .catch((error) => {
      console.log(error);
    })
    //console.log(req.params.id)
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
