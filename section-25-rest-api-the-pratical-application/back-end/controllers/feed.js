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
    const { title, content } = req.body;
    const imageUrl = 'images/sun.jpeg';
    res.status(201).json({
        message: 'Post created successfully!',
        post: {
            _id: new Date().toISOString(),
            title: title,
            content: content,
            imageUrl: imageUrl,
            author: author
        }
    });
};