const { validationResult, body } = require('express-validator');

exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [{
            _id: 1,
            title: 'This a dummy data', 
            content: 'dummy', 
            creator: { name: 'dummy' }, 
            imageUrl: 'images/sun.jpeg',
            createdAt: new Date()
        }]
    });
};

exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: 'Validation failed, entered data is incorrect.',
            errors: errors.array()
        })
    }
    const { title, content } = req.body;
    const imageUrl = 'images/sun.jpeg';
    const creator = { name: 'dummy' }
    res.status(201).json({
        message: 'Post created successfully!',
        post: {
            _id: new Date().toISOString(),
            title: title,
            content: content,
            imageUrl: imageUrl,
            creator: creator,
            createdAt: new Date()
        }
    });
};

exports.createPostValidator = () => {
    return [
      body('title', 'title invalid')
        .isString()
        .isLength({ min: 5})
        .trim(),
      body('content', 'Content invalid')
        .isString()
        .isLength({ min: 5})
        .trim()
    ];
  }