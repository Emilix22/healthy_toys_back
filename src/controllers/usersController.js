const db = require("../database/models")
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { validationResult } = require('express-validator');
require('dotenv').config();

//Otra forma de llamar a los modelos
const Users = db.Users; //Users
const Privileges = db.Privileges //Levels

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

        Users.findAndCountAll({
          order: [["name"]],
          limit: size,
          offset: page * size
        })
          .then((users) => {
            
            let info = {
              meta: {
                status: 200,
                total: users.count,
                totalPages: Math.ceil(users.count / size),
                size: size,
                url: "/users",
              },
              data: users.rows,
            };
            return res.status(200).json(info);
          })
          .catch((error) => {
            console.log(error);
          });
      },

    getUserData: (req, res) => {
        Users.findOne({
            where: {id_users: req.id_users}
        })
        .then(user => {
            let info = {
                meta: {
                    status : 200,
                    url: '/users/dataLoged'
                },
                data: {
                    name: user.name,
                    surname: user.surname,
                    avatar: user.avatar
                }
            }
            return res.status(200).json(info)
        })
        .catch(error => {console.log(error)});
    },

    create: (req, res) => {
        
        const errors = validationResult(req);
        
        if(errors.errors.length > 0){

            return res.status(401).json({error: errors.mapped()});
            
        }else{

            Users.findOne({
                where: {email: req.body.email}
            })
            .then(userInDB => {
                if(userInDB){
                return res.status(401).json({error: {userInDB: `Ya existe un usuario registrado con el Email: ${req.body.email}`}});
                }

                let img;

                if(req.file != undefined){
                    img = req.file.filename
                } else {
                    img = 'genericAvatar.png'
                }

                Users.create({
                    // dni: req.body.dni,
                    name: req.body.name,
                    surname: req.body.surname,
                    email: req.body.email,
                    password: bcrypt.hashSync(req.body.password, 10),
                    avatar: img,
                    // street: "must",
                    // door: "must",
                    // floor: "must",
                    // department: "must",
                    // locality: "must",
                    // state: "must",
                    // cp: "must",
                    // country: "must",
                    // phone: "must",
                    privileges_id: 2
                })
                .then(user => {

                    let info = {
                        meta: {
                            status : 200,
                            url: '/users/create'
                        },
                        data: {
                            name: user.name,
                            surname: user.surname
                        }
                    }
                    return res.status(200).json(info)
                })
            })
            .catch(error => {console.log(error)});
        }
 	},
                          
    login: (req, res) => {

        const errors = validationResult(req);
        
        if(errors.errors.length > 0){

            return res.status(401).json({error: errors.mapped()});
            
        }else{
          
            Users.findOne({
                where: {email: req.body.email},
                include: [{association: 'privileges'}]
            })
            .then(userToLogin => {
                if(userToLogin && bcrypt.compareSync(req.body.password, userToLogin.password)) {
                    
                    const userForToken = {
                        id_users: userToLogin.id_users,
                        name: userToLogin.name,
                        surname: userToLogin.surname,
                        dni: userToLogin.dni,
                        email: userToLogin.email,
                        avatar: userToLogin.avatar,
                    }
                    
                    const token = jwt.sign(
                        userForToken,
                        process.env.SECRET_TOKEN,
                        {
                            expiresIn: 60 * 60 * 24 * 7
                        }
                    )
                    
                    return res.status(200).json({
                        token: token
                    })
                }else {
                    return res.status(401).json({error: 'Email o contraseña inválido'})
                }
            })
            .catch(error => {console.log(error)});
        } 
    }

    // removed: (req, res) => {
    //     Users.findAll({
    //         where: {
    //             deletedAt: {
    //                 [Op.not]: null
    //               }
    //             },
    //         paranoid: false      
    //     })
    //     .then(users => {
    //         let info = {
    //             meta: {
    //                 status : 200,
    //                 total: users.length,
    //                 url: '/api/users/removed'
    //             },
    //             data: users
    //         }
    //         return res.status(200).json(info)
    //     })
    //     .catch(error => {console.log(error)})
    // },

    // restore: (req, res) => {
    //     Users.restore({
    //         where: {id: req.params.id}    
    //     })
    //     .then(user => {
    //         let info = {
    //             meta: {
    //                 status : 200,
    //                 url: '/api/users/restore/:id/'
    //             },
    //             data: user
    //         }
    //         return res.status(200).json(info);
    //     })
    //     .catch(error => {console.log(error)})
    // },

    // update: (req, res) => {
    //     let userToEdit  = Users.findByPk(req.params.id);

    //     let img;

	// 	if(req.file != undefined){
	// 		img = req.file.filename
	// 	} else {
	// 		img = userToEdit.image
	// 	}

    //     Users.update(
    //         {
    //             name: req.body.name,
    //             surname: req.body.surname,
    //             email: req.body.email,
    //             image: img
    //         },
    //         {
    //             where: {id: req.params.id},
    //         }
    //     )
    //     .then(result => {
    //         Users.findOne({
    //             where: {id: req.params.id},
    //             include: [{association: 'level'}],
    //             attributes: { exclude: ['password'] }
    //         })
    //         .then(userEdited => {
    //             let info = {
    //                 meta: {
    //                     status : 200,
    //                     url: '/api/users/update/:id/'
    //                 },
    //                 data: userEdited
    //             }
    //             return res.status(200).json(info)
    //         })
            
    //     })
    //     .catch(error => {console.log(error)});
    // },

    // profile: (req, res) => {
    //     Users.findByPk(req.params.id, {attributes: { exclude: ['password'] }})
    //     .then(user => {
    //         let info = {
    //             meta: {
    //                 status : 200,
    //                 url: '/api/users/profile/:id/'
    //             },
    //             data: user
    //         }
    //         return res.status(200).json(info)
    //     })
    //     .catch(error => {console.log(error)});
    // },

    // changeLevel: (req, res) => {
        
    //     Users.update(
    //         {
    //             level_id: req.body.level,
    //         },
    //         {
    //             where: {id: req.params.id},
    //             // include: [{association: 'level'}]
    //         }
    //     )
    //     .then(user => {

    //         return res.status(200).json({message: 'Permisos modificados con éxito'})
    //     })
    //     .catch(error => {console.log(error)});
    // },

    // destroy: (req, res) => {
    //     Users.destroy({
    //         where: {id: req.params.id}
    //     })
    //     .then(user => {
    //         return res.status(200).json({message: 'Usuario eliminado con éxito'})
    //     })
    //     .catch(error => {console.log(error)});    
    // },

    // logout: (req, res) => {
    //     res.clearCookie('dniUsuario');
    //     req.session.destroy();      
    // }

}

module.exports = controller;