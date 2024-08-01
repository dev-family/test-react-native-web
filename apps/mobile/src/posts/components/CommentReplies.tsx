import {StyleSheet, View, Text} from 'react-native';
import {PostComment} from '../types';
import React from 'react';
import {Icon, Row} from '../../ui/components';
import {Colors} from '../../ui/constants';
import {text} from '../../../assets/styles/text';
import {global} from '../../../assets/styles/global';

type ReplyItemProps = {
  reply: PostComment;
};

export const ReplyItem: React.FC<ReplyItemProps> = ({reply}) => {
  return (
    <Row gap={10} style={styles.item} alignStart>
      <Icon name="profile-placeholder" size={14} containerStyle={styles.icon} />
      <View style={[global.flex, styles.itemText]}>
        <Text style={[text.s, text.medium]}>@{reply.user.username}</Text>
        <Text style={[text.s, text.secondary]}>{reply.comment}</Text>
      </View>
    </Row>
  );
};

type CommentRepliesProps = {
  replies: PostComment[];
};

export const CommentReplies: React.FC<CommentRepliesProps> = ({replies}) => {
  if (!replies.length) return null;
  return (
    <>
      <View style={styles.container}>
        {replies.map(reply => (
          <ReplyItem key={'reply-item=' + reply.id} reply={reply} />
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 30,
    paddingRight: 20,
  },
  item: {
    borderBottomWidth: 1,
    paddingVertical: 4,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  icon: {
    height: 25,
    width: 25,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    gap: 3,
  },
});
