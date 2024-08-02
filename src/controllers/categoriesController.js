const db = require("../database/models");
const sequelize = db.sequelize;

const Categories = db.Categories;

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

    Categories.findAndCountAll({
      order: [["name"]],
      limit: size,
      offset: page * size,
    })
      .then((categories) => {
        let info = {
          meta: {
            status: 200,
            total: categories.count,
            totalPages: Math.ceil(categories.count / size),
            size: size,
            url: "/categories",
          },
          data: categories.rows,
        };
        return res.status(200).json(info);
      })
      .catch((error) => {
        console.log(error);
      });
  },

  create: (req, res) => {
    Categories.findOne({
      where: {
        name: req.body.name,
      },
    })
      .then((categoryInDB) => {
        if (categoryInDB) {
          return res.status(401).json({
            error: {
              categoryInDB: `Ya existe una categoría registrada con el nombre: ${req.body.name}`,
            },
          });
        }
        Categories.create({
          name: req.body.name,
        }).then((category) => {
          let info = {
            meta: {
              status: 200,
              url: "/categories/create",
            },
            data: {
              name: category.name,
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
    Categories.update(
      {
        name: req.body.name,
      },
      {
        where: { id_category: req.params.id },
      }
    )
      .then((result) => {
        Categories.findOne({
          where: { id_category: req.params.id },
        }).then((categoryEdited) => {
          let info = {
            meta: {
              status: 200,
              url: "/categories/update/:id/",
            },
            data: categoryEdited,
          };
          return res.status(200).json(info);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  },
  destroy: (req, res) => {
    Categories.destroy({
      where: { id_category: req.params.id },
    })
      .then((confirmDestroy) => {
        return res
          .status(200)
          .json({ message: "categoría eliminada con éxito" });
      })
      .catch((error) => {
        console.log(error);
      });
  },
};

module.exports = controller;
