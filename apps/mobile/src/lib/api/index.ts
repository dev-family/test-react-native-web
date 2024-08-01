import {
  deleteApiPostsId,
  deleteApiPostsPostIdCommentsCommentId,
  deleteApiPostsPostIdLike,
  deleteApiUser,
  getApiPosts,
  getApiPostsId,
  getApiPostsPostIdComments,
  getApiPostsPostIdCommentsCommentId,
  getApiTags,
  getApiUser,
  patchApiUser,
  postApiAuthLogin,
  postApiAuthLogout,
  postApiAuthRegister,
  postApiPosts,
  postApiPostsPostIdComments,
  postApiPostsPostIdCommentsCommentId,
  postApiPostsPostIdLike,
  postApiPostsPostIdVote,
} from './client';

export const createApi = () => {
  const routes = {
    auth: {
      login: postApiAuthLogin,
      logout: postApiAuthLogout,
      register: postApiAuthRegister,
    },
    posts: {
      create: postApiPosts,
      like: postApiPostsPostIdLike,
      removeLike: deleteApiPostsPostIdLike,
      get: getApiPosts,
      comment: postApiPostsPostIdComments,
      replyComment: postApiPostsPostIdCommentsCommentId,
      vote: postApiPostsPostIdVote,
      getTags: getApiTags,
      getById: getApiPostsId,
      delete: deleteApiPostsId,
      getCommentsByPost: getApiPostsPostIdComments,
      deleteComment: deleteApiPostsPostIdCommentsCommentId,
      getCommentReplies: getApiPostsPostIdCommentsCommentId,
    },
    user: {
      get: getApiUser,
      edit: patchApiUser,
      delete: deleteApiUser,
    },
  };
  return routes;
};
