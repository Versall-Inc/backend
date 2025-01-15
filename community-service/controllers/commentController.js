const CommentModel = require("../models/commentModel");
const { v4: uuidv4 } = require("uuid");

// Create a new comment or reply
exports.createComment = async (req, res) => {
  try {
    const { postId, text, parentId } = req.body;

    // Validate input
    if (!postId || !text) {
      return res.status(400).json({ message: "Post ID and text are required" });
    }

    let level = 1;

    // Determine the comment level based on parentId
    if (parentId) {
      const parentComment = await CommentModel.findById(parentId);
      if (!parentComment) {
        return res
          .status(400)
          .json({ message: "Parent comment does not exist" });
      }

      level = parentComment.level + 1;

      if (level > 3) {
        return res
          .status(400)
          .json({ message: "Replies are limited to 3 levels" });
      }
    }

    const newComment = {
      id: uuidv4(),
      postId,
      userId: req.user.id,
      text,
      parentId: parentId || null,
      level,
      createdAt: new Date(),
    };

    await CommentModel.create(newComment);

    res
      .status(201)
      .json({ message: "Comment created successfully", comment: newComment });
  } catch (err) {
    console.error("Error creating comment:", err.message);
    res
      .status(500)
      .json({ message: "Error creating comment", error: err.message });
  }
};

// Get all comments for a post (with 3-level hierarchy)
exports.getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    // Fetch all comments for the post
    const comments = await CommentModel.findByPostId(postId);

    // Build the 3-level hierarchy
    const commentTree = comments
      .filter((c) => c.level === 1)
      .map((comment) => ({
        ...comment,
        replies: comments
          .filter(
            (reply) => reply.parent_id === comment.id && reply.level === 2
          )
          .map((reply) => ({
            ...reply,
            subReplies: comments.filter(
              (subReply) =>
                subReply.parent_id === reply.id && subReply.level === 3
            ),
          })),
      }));

    res.status(200).json({ comments: commentTree });
  } catch (err) {
    console.error("Error fetching comments:", err.message);
    res
      .status(500)
      .json({ message: "Error fetching comments", error: err.message });
  }
};

// Delete a comment and its replies
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Comment ID is required" });
    }

    // Recursively delete the comment and its child comments
    await CommentModel.deleteByIdWithReplies(id);

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Error deleting comment:", err.message);
    res
      .status(500)
      .json({ message: "Error deleting comment", error: err.message });
  }
};
