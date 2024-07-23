const validationImage = (req, res, next) => {

    let acceptedExtensions = ['jpg', 'png', 'jpeg', 'webp'];

    if(req.file) {
        let fileExtension = req.file.mimetype.split('/').pop();

        if (!acceptedExtensions.includes(fileExtension)) {
            return res.status(401).json({error: `Las extensiones de archivo permitidas son ${acceptedExtensions.join(', ')}`});
        }
        next()
    }else{
        next();
    }
    
}

module.exports = validationImage;