import {create} from 'zustand';
import {createApi} from '../lib/api';
import {
  CreatePostData,
  LeaveCommentData,
  Post,
  PostComment,
  PostTag,
} from './types';

type PostsState = {
  posts: Post[];
  loading: boolean;
  postTags: PostTag[];
};

type PostActions = {
  getPosts: (option: {tagId?: string; page?: string}) => Promise<Post[]>;
  create: (data: CreatePostData) => Promise<void>;
  react: (postId: string, reaction: boolean) => Promise<Post | undefined>;
  vote: (postId: string, optionId: string) => Promise<Post | undefined>;
  getTags: () => Promise<void>;
  removeReaction: (postId: string) => Promise<Post | undefined>;
  getPostById: (postId: string) => Promise<Post | undefined>;
  update: (posts: Post[]) => void;
  deleteById: (id: string) => Promise<void>;
  leaveComment: (
    id: string,
    data: LeaveCommentData,
  ) => Promise<PostComment | undefined>;
  getCommentsByPost: (
    id: string,
    options?: {page?: string},
  ) => Promise<PostComment[]>;
  deleteComment: (
    id: number,
    commentId: number,
  ) => Promise<PostComment | undefined>;
  replyToComment: (
    postId: number,
    commentId: number,
    data: LeaveCommentData,
  ) => Promise<void>;
  getReplies: (postId: number, commentId: number) => Promise<PostComment[]>;
};

const api = createApi();

export const usePostStore = create<PostsState & PostActions>()((set, get) => ({
  posts: [],
  loading: false,
  postTags: [],
  getPosts: async ({tagId, page}) => {
    set({loading: true});
    try {
      const response = await api.posts.get({tagId, page});
      if (page && +page > 1) {
        const posts = get().posts;
        set({posts: [...posts, ...(response.data.data as Post[])]});
        return response.data.data as Post[];
      }
      set({posts: response.data.data as Post[], loading: false});
      return response.data.data as Post[];
    } catch (error) {
      console.error('[Fetch posts]: ', error);
      set({posts: [], loading: false});
      return [];
    }
  },
  update: posts => set({posts}),
  create: async data => {
    try {
      await api.posts.create(data);
    } catch (error) {
      throw error;
    }
  },
  vote: async (postId, optionId) => {
    try {
      const response = await api.posts.vote(postId, {optionId});
      return response.data as Post;
    } catch (error) {
      console.error('[Vote]: ', error);
    }
  },
  getTags: async () => {
    try {
      const response = await api.posts.getTags();
      set({postTags: response.data as PostTag[]});
    } catch (error) {
      console.error('[Fetch tags]: ', error);
    }
  },
  react: async (postId, like) => {
    try {
      const response = await api.posts.like(postId, {like});
      return response.data as Post;
    } catch (error) {
      console.error('[Like post]: ', error);
    }
  },
  removeReaction: async postId => {
    try {
      const response = await api.posts.removeLike(postId);
      return response.data as Post;
    } catch (error) {
      console.error('[Remove reaction]: ', error);
    }
  },
  getPostById: async id => {
    try {
      const response = await api.posts.getById(id);
      return response.data as Post;
    } catch (error) {
      console.error('[Get post by ID]: ', error);
    }
  },
  getCommentsByPost: async (id, options) => {
    try {
      const response = await api.posts.getCommentsByPost(id, options);
      return response.data.data as PostComment[];
    } catch (error) {
      console.error('[Get comments]: ', error);
      return [];
    }
  },
  leaveComment: async (id, data) => {
    try {
      const response = await api.posts.comment(id, data);
      return response.data as PostComment;
    } catch (error) {
      console.error('[Leave comment]: ', error);
    }
  },

  deleteComment: async (postId, commentId) => {
    try {
      const response = await api.posts.deleteComment(
        postId.toString(),
        commentId.toString(),
      );
      return response.data as PostComment;
    } catch (error) {
      console.error('[Delete comment]: ', error);
      throw error;
    }
  },
  deleteById: async id => {
    try {
      await api.posts.delete(id);
      const {posts} = get();
      set({posts: posts.filter(post => post.id != +id)});
    } catch (error) {
      console.error('[Delete post]: ', error);
    }
  },
  replyToComment: async (postId, commentId, data) => {
    try {
      await api.posts.replyComment(
        postId.toString(),
        commentId.toString(),
        data,
      );
    } catch (error) {
      console.error('[Reply comment]:', error);
    }
  },
  getReplies: async (postId, commentId) => {
    try {
      const response = await api.posts.getCommentReplies(
        postId.toString(),
        commentId.toString(),
      );
      return response.data as PostComment[];
    } catch (error) {
      console.error('[Get comment replies]: ', error);
      return [];
    }
  },
}));
