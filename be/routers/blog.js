const express = require(`express`);

const router = express.Router();
const blog = require(`../controllers/blog`);
const { auth } = require(`../middleware/jwt`);

router.route(`/getblog`).get(auth, blog.getBlogC);
router.route(`/addblog`).post(auth, blog.addBlogC);
router.route(`/updateblog/:blog_id`).patch(auth, blog.updateBlogC);
router.route(`/deleteblog/:blog_id`).delete(auth, blog.deleteBlogC);

module.exports = router;
