import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {DateTime} from 'luxon';
import {Colors} from '../../ui/constants/colors';
import {text} from '../../../assets/styles/text';
import {Row} from '../../ui/components/Row';
import {VoteItem, PostCardFooter} from '../features';
import React, {useEffect, useState} from 'react';
import {Post} from '../types';
import Animated, {
  FadeIn,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {usePostStore} from '../store';
import {Icon, Menu, MenuAction} from '../../ui/components';
import {useUserStore} from '../../user/store';
import {IconsType} from '../../ui/constants/icons';
type PostCardProps = {
  post: Post;
  onPress: (post: Post) => void;
};

const AnimatedButton = Animated.createAnimatedComponent(TouchableOpacity);

export const PostCard: React.FC<PostCardProps> = React.memo(
  ({post: postData, onPress}) => {
    const [post, setPost] = useState(postData);

    const [like, setLike] = useState<boolean | undefined>(
      post.isLiked as boolean | undefined,
    );
    const [showOptions, setShowOptions] = useState(false);
    const {options, description, title, likes, dislikes, answer} = post;
    const liked = useSharedValue(0);
    const disliked = useSharedValue(0);
    const pressed = useSharedValue(0);

    const handlePressIn = () => {
      if (!post.answer) return;
      pressed.value = 1;
    };

    const handlePressOut = () => {
      if (!post.answer) return;
      pressed.value = 0;
    };

    useEffect(() => {
      if (postData && JSON.stringify(postData) !== JSON.stringify(post)) {
        setPost(postData);
        setLike(postData.isLiked as boolean);
      }
    }, [postData]);

    const buttonStyle = useAnimatedStyle(
      () => ({
        transform: [
          {
            scale: withTiming(interpolate(pressed.value, [0, 1], [1, 0.94]), {
              duration: 170,
            }),
          },
        ],
      }),
      [],
    );

    const likeStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            scale: interpolate(
              liked.value,
              [0, 0.2, 0.4, 0.6, 0.8, 1],
              [1, 1.2, 1.3, 1.5, 1.2, 1],
            ),
          },
        ],
      };
    }, [like]);

    const dislikeStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            scale: interpolate(
              disliked.value,
              [0, 0.2, 0.4, 0.6, 0.8, 1],
              [1, 1.2, 1.3, 1.5, 1.2, 1],
            ),
          },
        ],
      };
    }, [like]);

    const {react, vote, removeReaction, deleteById} = usePostStore();
    const {user} = useUserStore();

    const handleSubmitOption = async (id: number) => {
      const result = await vote(`${post.id}`, `${id}`);
      if (!result) {
        console.error('Smth went wrong while voting');
        return;
      }
      setPost(result);
    };

    const setReaction = async (reaction: boolean | undefined) => {
      let data: Post | undefined;
      if (reaction === undefined) {
        liked.value = 0;
        disliked.value = 0;
        setLike(undefined);
        data = await removeReaction(post.id.toString());
      } else {
        setLike(reaction);
        if (reaction) {
          liked.value = withTiming(1, {duration: 500});
          disliked.value = 0;
        } else {
          disliked.value = withTiming(1, {duration: 500});
          liked.value = 0;
        }
        data = await react(post.id.toString(), reaction);
      }
      if (data) {
        setPost(data);
      }
    };

    const date = DateTime.fromISO(post.createdAt).toFormat('DDD');

    const deletePost = async () => {
      await deleteById(`${post.id}`);
    };

    const editPost = () => {};

    const sharePost = () => {};

    const actions = (): MenuAction[] => {
      const base = [
        {
          id: 'edit-sdsdfc32413',
          title: 'Edit',
          icon: 'menu.edit' as IconsType,
          onPress: editPost,
        },
        {
          id: 'share-sdfv3f43f43f',
          title: 'Share',
          icon: 'menu.share' as IconsType,
          onPress: sharePost,
        },
      ];
      if (user?.username === post.user.username) {
        return [
          ...base,
          {
            id: 'delete-asdac43',
            title: 'Delete',
            icon: 'menu.delete',
            onPress: deletePost,
            destructive: true,
          },
        ];
      }
      return base;
    };

    return (
      <AnimatedButton
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => {
          setShowOptions(false);
          onPress?.(post);
        }}
        style={[styles.post, buttonStyle]}>
        {showOptions && (
          <Menu
            type="dark"
            style={styles.menu}
            actions={actions()}
            title="Options"></Menu>
        )}
        <Row spaceBetween alignCenter>
          <Row alignCenter gap={5}>
            <Text style={[text.m, text.semiBold]}>@{post.user.username}</Text>
            <Text style={[text.m, text.semiBold]}>•</Text>
            <Text style={[text.m, text.secondary]}>{date}</Text>
          </Row>
          <Icon
            name="dots"
            size={20}
            color={Colors.text}
            hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}
            onPress={() => setShowOptions(!showOptions)}
          />
        </Row>
        <View style={styles.title}>
          <Text style={[text.xxl, text.center, text.bold]}>{title}</Text>
          <Text
            style={[
              text.l,
              text.center,
              text.medium,
              {color: Colors.textSecondary},
            ]}>
            {description}
          </Text>
        </View>
        <View style={styles.poll}>
          {options.map(vote => (
            <VoteItem
              key={`${vote.option}-${vote.id}`}
              vote={{
                amount: vote.total!,
                percent: (+vote.total! / +(post.total || 1)) * 100,
                id: vote.id!,
                option: vote.option!,
              }}
              completed={!!answer}
              onSubmitOption={handleSubmitOption}
              selected={vote.id === answer}
            />
          ))}
        </View>
        {!!answer && (
          <Animated.Text
            entering={Platform.OS === 'web' ? undefined : FadeIn}
            style={[text.center, text.l, text.secondary]}>
            Total votes: {post.total}
          </Animated.Text>
        )}
        <PostCardFooter
          likes={likes.length}
          dislikes={dislikes.length}
          completed={!!answer}
          onLikePress={() => setReaction(true)}
          onDislikePress={() => setReaction(false)}
          onRemoveReaction={() => setReaction(undefined)}
          like={like}
          likeStyle={likeStyle}
          dislikeStyle={dislikeStyle}
        />
      </AnimatedButton>
    );
  },
);

const styles = StyleSheet.create({
  post: {
    padding: 12,
    borderWidth: 1,
    backgroundColor: Colors.dark,
    borderColor: Colors.border,
    borderRadius: 12,
    gap: 20,
    overflow: 'hidden',
  },
  title: {
    gap: 8,
  },
  poll: {
    flex: 1,
    gap: 16,
  },
  menu: {
    position: 'absolute',
    overflow: 'hidden',
    top: 30,
    zIndex: 999999,
    right: 10,
  },
});
