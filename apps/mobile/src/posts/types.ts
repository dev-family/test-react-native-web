import {
  CommentInterface,
  CreatePostCommentValidator,
  CreatePostValidator,
  PostInterface,
  PostTagInterface,
} from '../lib/api/client.schemas';

export type Post = Required<PostInterface>;
export type PostComment = Required<CommentInterface>;



export type PostTag = Required<PostTagInterface>;
export type CreatePostData = Required<CreatePostValidator> & {
  options: string[];
};

export type Vote = {
  id: number;
  amount: number;
  option: string;
  percent: number;
};

export type LeaveCommentData = Required<CreatePostCommentValidator>;