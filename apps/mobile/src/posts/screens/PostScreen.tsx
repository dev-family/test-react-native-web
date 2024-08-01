import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View, Text, ListRenderItem} from 'react-native';
import {global} from '../../../assets/styles/global';
import {AppRoutes, AppStackScreenProps} from '../../ui/navigation/types';
import {usePostStore} from '../store';
import {Post, PostComment} from '../types';
import {FullScreenLoader} from '../../ui/components/FullScreenLoader';
import {Layout, useScreenInsets} from '../../ui/constants/insets';
import {CommentItem, PostInfo} from '../components';
import {CommentInput} from '../features';

import {Button, Header} from '../../ui/components';
import {text} from '../../../assets/styles/text';
import Animated, {LinearTransition} from 'react-native-reanimated';
import {useSocket} from '../../lib';

export const PostScreen: React.FC<AppStackScreenProps<AppRoutes.POST>> = ({
  route,
  navigation,
}) => {
  const {getPostById, getCommentsByPost, replyToComment} = usePostStore();
  const {id} = route.params;
  const [post, setPost] = useState<Post | undefined>();
  const [notFound, setNotFound] = useState(false);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [commentsPage, setCommentsPage] = useState(1);
  const [selectedComment, setSelectedComment] = useState<number | undefined>(
    undefined,
  );

  const [commentToReply, setCommentToReply] = useState<PostComment | undefined>(
    undefined,
  );

  const socket = useSocket();

  useEffect(() => {
    socket.emit('join:post', {postId: id});

    socket.on('message:sent', (comment: PostComment) => {
      setComments(prev => [...prev, comment]);
    });

    return () => {
      socket.emit('leave:post');
    };
  }, []);

  const fetchPost = async () => {
    const data = await getPostById(id);

    if (data) {
      setPost(data);
      return;
    }
    setNotFound(true);
  };

  const fetchComments = async () => {
    const data = await getCommentsByPost(id, {page: '1'});
    setComments(data);
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, []);

  const {insetsTopHeader, insetsBottom} = useScreenInsets();
  const {leaveComment} = usePostStore();

  const paddingTop = insetsTopHeader;
  const paddingBottom = insetsBottom + 50;

  const handleReplyComment = (comment: PostComment) => {
    setCommentToReply(comment);
  };

  const handleSubmitComment = async (comment: string) => {
    if (commentToReply && post) {
      await replyToComment(post.id, commentToReply.id, {comment});
    } else {
      await leaveComment(id, {comment});
    }
  };

  const renderComment: ListRenderItem<PostComment> = useCallback(
    ({item}) => {
      return (
        <CommentItem
          comment={item}
          setOpened={setSelectedComment}
          opened={selectedComment === item.id}
          onReply={handleReplyComment}
        />
      );
    },
    [comments, selectedComment, commentToReply],
  );

  const loadMoreComments = async () => {
    try {
      const data = await getCommentsByPost(id, {
        page: (commentsPage + 1).toString(),
      });
      if (data.length) {
        setCommentsPage(prev => prev + 1);
      }
      if (
        data.length &&
        data[data.length - 1].id != comments[comments.length - 1]?.id
      ) {
        setComments(prev => [...prev, ...data]);
      }
    } catch (error) {}
  };

  if (notFound) {
    return (
      <View style={[global.screen, styles.error]}>
        <Text style={[text.xl]}>404: Post Not Found</Text>
        <Button onPress={navigation.goBack} style={styles.button}>
          Go Back
        </Button>
      </View>
    );
  }
  if (!post) {
    return <FullScreenLoader />;
  }

  return (
    <View style={[global.screen, {overflow: 'hidden'}]}>
      <Header
        title={post.title}
        leftText="Posts"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
      />

      <Animated.FlatList
        data={comments}
        ListHeaderComponent={<PostInfo post={post} setPost={setPost} />}
        showsVerticalScrollIndicator={false}
        keyExtractor={i => `comment-${i.id}=${i.createdAt}`}
        renderItem={renderComment}
        layout={LinearTransition}
        style={[global.flex]}
        contentContainerStyle={[{paddingTop, paddingBottom}]}
        onEndReached={loadMoreComments}
        onEndReachedThreshold={1}
      />

      <CommentInput
        onSubmit={handleSubmitComment}
        commentToReply={commentToReply}
        onRemoveReply={() => setCommentToReply(undefined)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    gap: 15,
  },
  error: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  button: {
    width: Layout.width / 2,
  },
});
