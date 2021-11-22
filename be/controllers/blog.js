const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;

const blogService = require(`../services/blog`);
const { Blog } = require('../models/blog');

let getBlogC = async (req, res, next) => {
    try {
        await blogService.getBlogS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addBlogC = async (req, res, next) => {
    try {
        let _blog = new Blog();
        _blog.validateInput(req.body);
        req.body.title = String(req.body.title).trim().toUpperCase();
        let blog = await client.db(DB).collection(`Blogs`).findOne({
            title: req.body.title,
        });
        let blogMaxId = await client.db(DB).collection('AppSetting').findOne({ name: 'Blogs' });
        if (blog) {
            throw new Error(`400: Bài viết đã tồn tại!`);
        }
        let blog_id = (() => {
            if (blogMaxId) {
                if (blogMaxId.value) {
                    return Number(blogMaxId.value);
                }
            }
            return 0;
        })();
        blog_id++;
        _blog.create({
            ...req.body,
            ...{
                blog_id: Number(blog_id),
                business_id: Number(req.user.business_id),
                create_date: new Date(),
                creator_id: Number(req.user.user_id),
                active: true,
            },
        });
        await client
            .db(DB)
            .collection('AppSetting')
            .updateOne({ name: 'Blogs' }, { $set: { name: 'Blogs', value: blog_id } }, { upsert: true });
        req[`_insert`] = _blog;
        await blogService.addBlogS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let updateBlogC = async (req, res, next) => {
    try {
        req.params.blog_id = Number(req.params.blog_id);
        let _blog = new Blog();
        req.body.title = String(req.body.title).trim().toUpperCase();
        let blog = await client.db(DB).collection(`Blogs`).findOne(req.params);
        if (!blog) {
            throw new Error(`400: Bài viết không tồn tại!`);
        }
        if (req.body.title) {
            let check = await client
                .db(DB)
                .collection(`Blogs`)
                .findOne({
                    business_id: Number(req.user.business_id),
                    blog_id: { $ne: Number(blog.blog_id) },
                    title: req.body.title,
                });
            if (check) {
                throw new Error(`400: Bài viết đã tồn tại!`);
            }
        }
        _blog.create(blog);
        _blog.update(req.body);
        req['_update'] = _blog;
        await blogService.updateBlogS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let deleteBlogC = async (req, res, next) => {
    try {
        let blogIds = req.query.blog_id;
        await client
            .db(DB)
            .collection('Blogs')
            .deleteMany({ blog_id: { $in: blogIds } });
        res.send({
            success: true,
            message: 'Xóa bài viết thành công!',
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getBlogC,
    addBlogC,
    updateBlogC,
    deleteBlogC,
};
