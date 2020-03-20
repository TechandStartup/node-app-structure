const { body, validationResult } = require('express-validator');
const createError = require('http-errors');
const Article = require('../models/article');

exports.validateForm = [
  // Validate the title and content fields.
  body('title').trim().not().isEmpty().withMessage('Title is required.')
  .isLength({ max: 200 }).withMessage('Title should not exceed 200 characters.')
  .matches(/^[\w'",.!?\- ]+$/).withMessage(`Title should only contain letters, numbers, spaces, and '",.!?- characters.`),
  body('content').trim().escape()
  .isLength({ min: 3 }).withMessage('Article content must be at least 3 characters.')
  .isLength({ max: 5000 }).withMessage('Article content should not exceed 5000 characters.'),
]

// GET /articles
exports.list = (req, res, next) => {
  Article.find()
    .sort({'title': 'asc'})
    .limit(50)
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

// GET /articles/create
exports.createView = (req, res, next) => {
  res.render('articles/create', { title: 'Create Article' });
};

// POST /articles/create
exports.create = (req, res, next) => {
  // Check request's validation result. Wrap errors in an object with useful functions.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('articles/create', { article: req.body, errors: errors.array() });
  }
  Article.create(req.body, (err, article) => {
    if (err) { return next(err); }
    res.redirect(`/articles/${article.id}`);
  });
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
  // Specify the fields that can be updated. Assign id from the request route's id parameter.
  const article = {
    title: req.body.title,
    content: req.body.content,
    published: req.body.published,
    _id: req.params.id
  };
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('articles/update', { article: article, errors: errors.array() });
  }    
  Article.findByIdAndUpdate(req.params.id, article, {new: true}, (err) => {
    if (err) { return next(err); }
    res.redirect(`/articles/${article._id}`);
  });
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