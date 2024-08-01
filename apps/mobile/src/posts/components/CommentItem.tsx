import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Icon, Row} from '../../ui/components';
import {Colors} from '../../ui/constants/colors';
import {text} from '../../../assets/styles/text';
import {DateTime} from 'luxon';
import {global} from '../../../assets/styles/global';
import {PostComment} from '../types';
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import {Swipeable} from 'react-native-gesture-handler';
import {usePostStore} from '../store';
import {useMessage, useSocket} from '../../lib';
import {useUserStore} from '../../user/store';
import {AxiosError} from 'axios';
import {CommentReplies} from './CommentReplies';

type CommentItemProps = {
  comment: PostComment;
  onReply?: (comment: PostComment) => void;
  opened?: boolean;
  setOpened?: Dispatch<SetStateAction<number | undefined>>;
  setCommentToReply?: Dispatch<SetStateAction<PostComment | undefined>>;
};

export const CommentItem: React.FC<CommentItemProps> = React.memo(
  ({comment, onReply, opened, setOpened}) => {
    const [data, setData] = useState(comment);
    const [repliesAmount, setRepliesAmount] = useState<number>(
      comment.repliesAmount || 0,
    );
    const [replies, setReplies] = useState<PostComment[]>([]);

    const swipeableRef = useRef<Swipeable>(null);

    const {deleteComment, getReplies} = usePostStore();
    const {comment: commentText, createdAt} = data;
    const {user} = useUserStore();
    const {showMessage} = useMessage();
    const socket = useSocket();

    const isUserComment = data.user.id === user?.id;

    useEffect(() => {
      if (opened) return;
      swipeableRef.current?.close();
    }, [opened]);

    useEffect(() => {
      socket.on('message:reply', (reply: PostComment) => {
        if (reply.replyId !== data.id) return;

        if (reply.user.id === user?.id) {
          setReplies(prev => {
            if (prev.find(i => i.id === reply.id)) return prev;
            return [...prev, reply];
          });
        } else {
          setRepliesAmount(prev => prev + 1);
        }
      });
    }, []);

    const handleDeleteComment = async () => {
      try {
        const res = await deleteComment(data.postId, data.id);
        if (res) {
          setData(res);
          setRepliesAmount(res.repliesAmount || 0);
          showMessage({text: 'Comment deleted', type: 'success'});
          return;
        }
      } catch (error) {
        const text =
          (error as AxiosError<{error: string}>).response?.data?.error ||
          'Smth went wrong';

        showMessage({text, type: 'failure'});
      }
    };

    const loadReplies = async () => {
      const data = await getReplies(comment.postId, comment.id);
      setReplies(data);
      setRepliesAmount(0);
    };

    const renderRightAction = () => {
      return (
        <Row style={{height: '100%'}}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              swipeableRef.current?.close();
              onReply?.(comment);
            }}
            style={[styles.actionButton, styles.replyAction]}>
            <Icon size={30} color={Colors.white} name="comment.reply" />
            <Text style={[text.xs]}>Reply</Text>
          </TouchableOpacity>
          {isUserComment && (
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={handleDeleteComment}
              style={[styles.actionButton, styles.deleteAction]}>
              <Icon size={30} color={Colors.white} name="comment.delete" />
              <Text style={[text.xs]}>Delete</Text>
            </TouchableOpacity>
          )}
        </Row>
      );
    };

    const renderReplies = () => {
      return (
        <>
          <CommentReplies replies={replies} />
          {!!repliesAmount && (
            <TouchableOpacity
              activeOpacity={0.5}
              hitSlop={{top: 10, bottom: 10}}
              onPress={loadReplies}>
              <Row alignCenter gap={12} style={styles.repliesButton}>
                <Icon name="comment.reply-user" size={15} color={Colors.text} />
                <Text style={[text.xs]}>
                  {replies.length
                    ? 'Load more'
                    : `Show ${repliesAmount} ${
                        repliesAmount === 1 ? 'reply' : 'replies'
                      }`}
                </Text>
              </Row>
            </TouchableOpacity>
          )}
        </>
      );
    };

   

    if (data.deletedAt) {
      if (repliesAmount || replies.length) {
        return (
          <>
            <Row style={styles.comment}>
              <Text style={[text.m, text.medium, text.secondary]}>
                Comment was delete by user @{comment.user.username}
              </Text>
            </Row>
            {renderReplies()}
          </>
        );
      }

      return null;
    }

    return (
      <>
        <Swipeable
          ref={swipeableRef}
          onSwipeableWillOpen={() => {
            setOpened?.(comment.id);
          }}
          renderRightActions={renderRightAction}>
          <Row gap={12} alignCenter style={styles.comment}>
            <Icon
              size={20}
              color={Colors.dark}
              name="profile-placeholder"
              containerStyle={styles.commentImage}></Icon>
            <View style={styles.commentText}>
              <Row alignCenter gap={10} style={global.flex}>
                <Text
                  numberOfLines={1}
                  style={[text.m, text.semiBold, global.flex]}>
                  @{data.user.username}
                </Text>
                <Text
                  numberOfLines={1}
                  style={[text.m, text.medium, text.secondary]}>
                  {DateTime.fromISO(createdAt).toFormat('DDD')}
                </Text>
              </Row>
              <Text style={[text.l, text.tertiary]}>{commentText}</Text>
            </View>
          </Row>
        </Swipeable>
        {renderReplies()}
      </>
    );
  },
);

const styles = StyleSheet.create({
  comment: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background,
  },
  commentImage: {
    height: 35,
    width: 35,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentText: {
    gap: 5,
    flex: 1,
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: 60,
  },
  deleteAction: {
    backgroundColor: Colors.red,
  },
  replyAction: {
    backgroundColor: Colors.tertiary,
  },
  repliesButton: {
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 30,
    paddingVertical: 4,
  },
});
