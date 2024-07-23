const db = require("../database/models");
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const { validationResult } = require("express-validator");


//Otra forma de llamar a los modelos
const Privileges = db.Privileges; //permisos de usuario

const controller = {

  list: (req, res) => {

    const pageAsNumber = Number.parseInt(req.query.page);
    const sizeAsNumber = Number.parseInt(req.query.size);

    let page = 0;
    if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
      page = pageAsNumber;
    }

    let size = 16;
    if (!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 /*&& sizeAsNumber < 16*/) {
      size = sizeAsNumber;
    }

    Privileges.findAndCountAll({
      where: { user_id: req.id_users },
      order: [["name"]],
      limit: size,
      offset: page * size
    })
      .then((privileges) => {
        
        let info = {
          meta: {
            status: 200,
            total: privileges.count,
            totalPages: Math.ceil(privileges.count / size),
            size: size,
            url: "/privileges",
          },
          data: privileges.rows,
        };
        return res.status(200).json(info);
      })
      .catch((error) => {
        console.log(error);
      });
  },

  search: (req, res) => {
    // return console.log(req.body)
    Privileges.findAll({
      where: { name: req.body.name, user_id: req.id_users },
    })
    .then((privileges) => {
      if (privileges.length > 0) {
        let info = {
          meta: {
            status: 200,
            url: "/privileges/search",
          },
          data: privileges,
        };
        return res.status(200).json(info);
      } else {
        return res
          .status(401)
          .json({
            error: `Lo siento, no existe ningún registro de permiso de usuario con el nombre: ${req.body.name}`,
          });
      }
    })
    .catch((error) => {
      console.log(error);
    });
  },

  create: (req, res) => {
    const errors = validationResult(req);

    if (errors.errors.length > 0) {
      return res.status(401).json({ error: errors.mapped() });
    } else {
      Privileges.findOne({
        where: {
          name: req.body.name,
          user_id: req.id_users,
        },
      })
        .then((privilegeInDB) => {
          if (privilegeInDB) {
            return res
              .status(401)
              .json({
                error: {
                  privilegeInDB: `Ya existe un permiso de usuario registrado con el nombre: ${req.body.name}`,
                },
              });
          }
          Privileges.create({
            name: req.body.name,
            user_id: req.id_users,
          }).then((privilege) => {
            let info = {
              meta: {
                status: 200,
                url: "/privileges/create",
              },
              data: {
                name: privilege.name,
              },
            };
            return res.status(200).json(info);
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  },

  update: (req, res) => {
    Privileges.update(
      {
        name: req.body.name,
      },
      {
        where: { id_privileges: req.params.id },
      }
    )
      .then((result) => {
        Privileges.findOne({
          where: { id_privileges: req.params.id },
        }).then((privilegeEdited) => {
          let info = {
            meta: {
              status: 200,
              url: "/privileges/update/:id/",
            },
            data: privilegeEdited,
          };
          return res.status(200).json(info);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  },
  destroy: (req, res) => {
    Privileges.destroy({
      where: { id_privileges: req.params.id },
    })
      .then((confirmDestroy) => {
        return res.status(200).json({ message: "permiso de usuario eliminado con éxito" });
      })
      .catch((error) => {
        console.log(error);
      });
  },
};

module.exports = controller;
