import {StyleProp, Text, View, ViewStyle} from 'react-native';
import {Colors} from '../../ui/constants/colors';
import {text} from '../../../assets/styles/text';
import {Row} from '../../ui/components/Row';
import {Icon} from '../../ui/components';
import {global} from '../../../assets/styles/global';
import React from 'react';
import Animated from 'react-native-reanimated';

type PostCardFooterProps = {
  likes: number;
  dislikes: number;
  comments?: number;
  onLikePress?: () => void;
  onDislikePress?: () => void;
  onCommentsPress?: () => void;
  onRemoveReaction?: () => void;
  like?: boolean | undefined;
  completed: boolean;
  likeStyle: StyleProp<ViewStyle>;
  dislikeStyle: StyleProp<ViewStyle>;
};

export const PostCardFooter: React.FC<PostCardFooterProps> = ({
  likes,
  dislikes,
  completed,
  onLikePress,
  onDislikePress,
  onRemoveReaction,
  onCommentsPress,
  like,
  likeStyle,
  dislikeStyle,
}) => {
  const handleLikePress = () => {
    if (like) {
      onRemoveReaction?.();
      return;
    }
    onLikePress?.();
  };

  const handleDislikePress = () => {
    if (like === false) {
      onRemoveReaction?.();
      return;
    }

    onDislikePress?.();
  };

  return (
    <Row alignCenter gap={20}>
      <Row alignCenter gap={4}>
        <Animated.View style={likeStyle}>
          <Icon
            onPress={handleLikePress}
            size={20}
            name={like ? 'post.like-filled' : 'post.like'}
            color={Colors.green}
          />
        </Animated.View>
        <Text style={[text.m, text.green]}>{likes}</Text>
      </Row>

      <Row alignCenter gap={4}>
        <Animated.View style={dislikeStyle}>
          <Icon
            onPress={handleDislikePress}
            size={20}
            name={like === false ? 'post.dislike-filled' : 'post.dislike'}
            color={Colors.red}
          />
        </Animated.View>
        <Text style={[text.m, text.red]}>{dislikes}</Text>
      </Row>
      <Icon
        size={20}
        color={completed ? Colors.text : Colors.border}
        name="post.comments"
        onPress={onCommentsPress}
      />
      <View style={global.flex}></View>
      <Icon size={20} name="post.share" color={Colors.primary} />
    </Row>
  );
};
