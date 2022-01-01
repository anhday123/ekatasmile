const moment = require(`moment-timezone`);
const TIMEZONE = process.env.TIMEZONE;
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;

const blogService = require(`../services/blog`);

module.exports._get = async (req, res, next) => {
    try {
        await blogService.getBlogS(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports._create = async (req, res, next) => {
    try {
        ['title', 'content'].map((e) => {
            if (!req.body[e]) {
                throw new Error(`400: Thiếu thuộc tính ${e}!`);
            }
        });
        req.body.title = String(req.body.title).trim().toUpperCase();
        let blog = await client.db(DB).collection(`Blogs`).findOne({
            title: req.body.title,
        });
        if (blog) {
            throw new Error(`400: Bài viết đã tồn tại!`);
        }
        let blog_id = await client
            .db(DB)
            .collection('AppSetting')
            .findOne({ name: 'Blogs' })
            .then((doc) => {
                if (doc) {
                    if (doc.value) {
                        return Number(doc.value);
                    }
                }
                return 0;
            });

        blog_id++;
        let _blog = {
            business_id: req.user.business_id,
            blog_id: blog_id,
            code: String(blog_id).padStart(6, '0'),
            title: req.body.title,
            blog_category_id: req.body.blog_category_id,
            image: req.body.image,
            content: req.body.content,
            tags: req.body.tags || [],
        };
        await client
            .db(DB)
            .collection('AppSetting')
            .updateOne({ name: 'Blogs' }, { $set: { name: 'Blogs', value: blog_id } }, { upsert: true });
        req[`_insert`] = _blog;
        await blogService.createBlogS(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports._update = async (req, res, next) => {
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

module.exports._delete = async (req, res, next) => {
    try {
        await client
            .db(DB)
            .collection(`Blogs`)
            .deleteMany({ blog_id: { $in: req.body.blog_id } });
        res.send({
            success: true,
            message: 'Xóa bài viết thành công!',
        });
    } catch (err) {
        next(err);
    }
};
