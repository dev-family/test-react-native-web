import React, {useState} from 'react';
import {
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';

import {useScreenInsets} from '../../ui/constants/insets';
import {Colors} from '../../ui/constants/colors';
import {Icon, Row} from '../../ui/components';
import {PostComment} from '../types';
import {text} from '../../../assets/styles/text';
import {SlideInLeft, SlideOutDown} from 'react-native-reanimated';

type CommentInputProps = {
  onSubmit?: (comment: string) => Promise<void>;
  commentToReply?: PostComment;
  onRemoveReply?: () => void;
  commentToReplyStyle?: StyleProp<ViewStyle>;
};

export const CommentInput: React.FC<CommentInputProps> = ({
  onSubmit,
  commentToReply,
  onRemoveReply,
  commentToReplyStyle,
}) => {
  const [comment, setComment] = useState('');
  const [bottom, setBottom] = useState(0);
  const {insetsHorizontal: paddingHorizontal, insetsBottom} = useScreenInsets();

  const sendComment = async () => {
    if (!comment) return;

    await onSubmit?.(comment);
    setComment('');
    onRemoveReply?.();
  };

  return (
    <>
      {!!commentToReply && (
        <Row
          alignCenter
          entering={Platform.OS === 'web' ? undefined : SlideInLeft}
          exiting={Platform.OS === 'web' ? undefined : SlideOutDown}
          style={[styles.replyContainer, {bottom}, commentToReplyStyle]}>
          <Icon
            name="comment.reply-user"
            size={30}
            color={Colors.primary}
            containerStyle={styles.replyIcon}
          />
          <View style={styles.replyContent}>
            <>
              <Text style={[text.medium, text.m, text.primary]}>
                @{commentToReply.user.username}
              </Text>
              <Text style={[text.s]} numberOfLines={1}>
                {commentToReply.comment}
              </Text>
            </>
          </View>
          <Icon
            name="cross"
            size={20}
            color={Colors.primary}
            onPress={onRemoveReply}
          />
        </Row>
      )}
      <Row
        gap={12}
        onLayout={e => setBottom(e.nativeEvent.layout.height)}
        style={[
          styles.inputContainer,
          {paddingBottom: insetsBottom, paddingHorizontal},
        ]}>
        <TextInput
          style={styles.input}
          placeholder="Text here..."
          placeholderTextColor={Colors.textSecondary}
          cursorColor={Colors.primaryTransparent}
          selectionColor={Colors.primary}
          value={comment}
          onChangeText={setComment}
          onKeyPress={e => {
            if (e.nativeEvent.key === 'Enter') {
              sendComment();
            }
          }}
        />
        <Icon
          name="arrow-up"
          size={19}
          color={Colors.dark}
          containerStyle={styles.sendButton}
          onPress={sendComment}
        />
      </Row>
    </>
  );
};
const styles = StyleSheet.create({
  inputContainer: {
    position: 'absolute',
    backgroundColor: Colors.dark,
    paddingTop: 15,
    right: 0,
    left: 0,
    zIndex: 9999,
    bottom: 0,
  },
  input: {
    height: 35,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Colors.border,
    padding: 0,
    paddingHorizontal: 10,
    flex: 1,
    color: Colors.text,
  },
  sendButton: {
    height: 35,
    width: 35,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  replyContainer: {
    width: '100%',
    backgroundColor: Colors.dark,
    position: 'absolute',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  replyIcon: {
    borderRightWidth: 1.5,
    paddingRight: 5,
    borderColor: Colors.primary,
  },
  replyContent: {flex: 1, gap: 3, paddingHorizontal: 10},
});
