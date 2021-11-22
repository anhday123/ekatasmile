const express = require(`express`);

const router = express.Router();
const blog = require(`../controllers/blog`);
const { auth } = require(`../middleware/jwt`);

router.route(`/create`).post(auth, blog.createBlogC);
router.route(`/update/:blog_id`).patch(auth, blog.updateBlogC);
router.route(`/`).get(auth, blog.getBlogC);
router.route(`/delete`).delete(auth, blog.deleteBlogC);

module.exports = router;
