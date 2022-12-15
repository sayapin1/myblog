const express = require('express');
const router = express.Router();
const Posts = require("../schemas/post");
const Comments = require("../schemas/comment");

// const posts = [
//     {
//         postsId: 1,
//         user: "test1",
//         password: "1234",
//         title: "test",
//         content: "test"
//     }
// ];

router.get("/posts", async (req, res) => {
    const posts = await Posts.find({}).sort({"createdAt": -1});
    res.status(200).json({posts})
});

router.get("/posts/:postsId", async (req, res) => {
    const {postsId} = req.params;

    try {
        const [posts] = await Posts.find({postsId: postsId});
        return res.status(200).json({posts});
    } catch (err) {
        return res.status(400).json({
            success: false,
            errorMessage: "데이터 형식이 올바르지 않습니다."
        })
    }
})

router.post("/posts/", async (req, res) => {
    const {postsId, user, password, title, content} = req.body;

    const posts = await Posts.find({postsId});//만약 db에 있는 postsId와 내가 쓴 postsId가 일치하면 posts에 추가
    if (posts.length) { //posts에 추가됐다는 건 postsId가 중복됐다는 뜻이므로 오류 발생
        return res.status(400).json({
            success: false,
            errorMessage: "이미 존재하는 PostsId입니다."
        });
    }

    try {
        await Posts.create({postsId, user, password, title, content});
        res.status(200).json({"message": "게시글을 생성하였습니다."})
    } catch (err) {
        if (!user || !password || !title || !content) {
            return res.status(400).json({
                success: false,
                errorMessage: "데이터 형식이 올바르지 않습니다."
            })
        }
    }
})

router.put("/posts/:postsId", async (req, res) => {
    const {postsId} = req.params;
    const {title, content, password} = req.body;

    const existPosts = await Posts.find({postsId});
    try {
        if (existPosts.length) {
            if (existPosts[0].password === password) {
                await Posts.updateOne(
                    {postsId: postsId},
                    {$set: {title: title, content: content}})
                return res.status(200).json({"message": "게시글을 수정하였습니다."});
            } else {
                return res.status(400).json({"message": "비밀번호가 틀렸습니다."})
            }
            return
        } else {
            return res.status(404).json({"message": "게시글 조회에 실패했습니다."})
        }
    } catch (err) {
        if (!title || !content) {
            return res.status(400).json({
                success: false,
                errorMessage: "데이터 형식이 올바르지 않습니다."
            })
        }
    }
})

router.delete("/posts/:postsId/", async (req, res) => {
    const {postsId} = req.params;
    const {password} = req.body;

    const existsPosts = await Posts.find({postsId});
    try {
        if (existsPosts.length) {
            if (existsPosts[0].password === password) {
                await Posts.deleteOne(
                    {postId: postsId});
                return res.json({"message": "게시글을 삭제하였습니다."});
            } else {
                return res.status(400).json({"message": "비밀번호가 틀렸습니다."})
            }
            return
        } else {
            return res.status(404).json({"message": "게시글 조회에 실패했습니다."})
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            errorMessage: "데이터 형식이 올바르지 않습니다."
        })
    }


})

module.exports = router;