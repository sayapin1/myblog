const express = require('express');
const router = express.Router();
const Posts = require("../schemas/post");
const Comments = require("../schemas/comment");

// const comments = [
//     {
//         commentsId: 1,
//         name: "test1",
//         password: "1234",
//         content: "test",
//         postsId: 1
//     }
// ]

router.get("/comments/:postsId", async (req, res) => {
    const {postsId} = req.params
    try {
        const comments = await Comments.find({postsId: postsId}).sort({"createdAt": -1});
        const results = comments.map((comment) => {
            return {
                postsId: comment.postsId,
                commentsId: comment.commentsId,
                user: comment.user,
                content: comment.content,
                // posts: posts.find((item) => item.postsId === comment.postsId) //comment의 postsId와 같은 postId인 것을 posts에서 가져온다.
            };
        });
        res.json({data: results});
    } catch(err) {
        return res.status(400).json({
            success: false,
            errorMessage: "데이터 형식이 올바르지 않습니다."
        })
    }

});

router.post("/comments/:postsId/", async (req, res) => {
    const {postsId} = req.params;
    const {commentsId, user, password, content} = req.body;

    const comments = await Comments.find({commentsId});
    if (comments.length) {
        return res.status(400).json({
            success: false,
            errorMessage: "이미 존재하는 CommentsId입니다."
        })
    }

    try {
        if (content.length === 0) {
            return res.status(400).json({
                success: false,
                errorMessage: "댓글 내용을 입력해주세요."
            })
        } else {
            await Comments.create({commentsId, user, password, content, postsId});
            return res.json({"message": "댓글을 생성하였습니다."});
        }
    } catch(err) {
        return res.status(400).json({
            success: false,
            errorMessage: "데이터 형식이 올바르지 않습니다."
        })
    }


})

router.delete("/comments/:commentsId", async (req, res) => {
    const {commentsId} = req.params;
    const {password} = req.body;

    const existComments = await Comments.find({commentsId});
    try {
        if (existComments.length) {
            if (existComments[0].password === password) {
                await Comments.deleteOne({commentsId})
                return res.status(200).json({"message": "댓글을 삭제하였습니다."});
            } else {
                return res.status(400).json({"message": "비밀번호가 틀렸습니다."})
            }
        } else {
            return res.status(404).json({"message": "댓글 조회에 실패했습니다."})
        }
    } catch(err) {
        return res.status(400).json({
            success: false,
            errorMessage: "데이터 형식이 올바르지 않습니다."
        })
    }

})

router.put("/comments/:commentsId", async (req, res) => {
    const {commentsId} = req.params;
    const {password, content} = req.body;

    const existComments = await Comments.find({commentsId});
    try {
        if (existComments.length) {
            if (existComments[0].password === password) {
                await Comments.updateOne(
                    {commentsId: commentsId},
                    {$set: {content: content}})
                return res.status(200).json({"message": "댓글을 수정하였습니다."});
            } else {
                return res.status(400).json({"message": "비밀번호가 틀렸습니다."})
            }
            return
        } else if (content.length === 0) {
            return res.status(400).json({
                success: false,
                errorMessage: "댓글 내용을 입력해주세요."
            })
        } else {
            return res.status(404).json({"message": "댓글 조회에 실패했습니다."})
        }
    } catch(err) {
        return res.status(400).json({
            success: false,
            errorMessage: "데이터 형식이 올바르지 않습니다."
        })
    }


})


module.exports = router;