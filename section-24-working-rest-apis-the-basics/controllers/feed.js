exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [{title: 'This a dummy data'}]
    });
};

exports.createPost = (req, res, next) => {
    const { title, content } = req.body;
    res.status(201).json({
        message: 'Post created successfully!',
        post: {
            _id: new Date().toISOString(),
            title: title,
            content: content
        }
    });
};