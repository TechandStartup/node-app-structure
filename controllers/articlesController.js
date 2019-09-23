const Article = require('../models/article');
const createError = require('http-errors');
const { formErrors } = require('./controllerMethods');

// GET /articles
exports.list = (req, res, next) => {
  Article.find()
  // Article.find({published: true}) adds a condition
    .sort({'title': 'asc'})
    .limit(50)
    .select('_id title published createdAt')
    .exec((err, articles) => {
      if (err) { 
        next(err); 
      } else {
        res.render('articles/list', { title: 'Articles', articles: articles });
      }
    });
};

// GET /articles/:id
exports.details = (req, res, next) => { 
  Article.findById(req.params.id, (err, article) => {
    // if id not found mongoose throws CastError. 
    if (err || !article) {
      next(createError(404));
    } else {
      res.render('articles/details', { title: 'Article', article: article });
    }
  });
};

// GET /article/create
exports.createView = (req, res, next) => {
  res.render('articles/create', { title: 'Create Article' });
};

// POST /article/create
exports.create = async (req, res, next) => {
  try {
    const newArticle = await Article.create(req.body);
    res.redirect(`/articles/${newArticle._id}`);
  } catch (err) {
    if (err.name == 'ValidationError') {
      const errors = formErrors(err);
      res.render('articles/create', { article: req.body, errors: errors });
    } else {
      console.error(err);
      res.status(500).send(err);
    }
  }
};

// GET /articles/:id/update
exports.updateView = (req, res, next) => {
  Article.findById(req.params.id, (err, article) => {
    // if id not found throws CastError. 
    if (err || !article) { 
      next(createError(404));
    } else {
      res.render('articles/update', { title: 'Update Article', article: article });
    }
  });
};

// POST /articles/:id/update
exports.update = async (req, res, next) => {
  const article = {
    title: req.body.title,
    content: req.body.content,
    published: req.body.published || false,
    _id: req.params.id
  };
  try {
    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id, 
      article, 
      {new: true, runValidators: true}
    );
    res.redirect(`/articles/${article._id}`);
  } catch (err) {
    if (err.name == 'ValidationError') {
      const errors = formErrors(err);
      res.render('articles/update', { article: article, errors: errors });
    } else {
      res.status(500).send(err);
    }
  }
};

// GET /articles/:id/delete
exports.deleteView = (req, res, next) => {
  Article.findById(req.params.id, (err, article) => {
    // if id not found throws CastError. 
    if (err || !article) {
      next(createError(404));
    } else {
      res.render('articles/delete', { title: 'Delete Account', article: article });
    }
  });
};

// POST articles/:id/delete
exports.delete = (req, res, next) => {
  Article.findByIdAndRemove(req.body.id, (err) => {
    if (err) { 
      next(err); 
    } else {
      res.redirect('/articles');   
    }
  })
};