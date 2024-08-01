import React, {Dispatch, SetStateAction, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {Icon, Row} from '../../ui/components';
import {usePostStore} from '../store';
import {Post} from '../types';
import {DateTime} from 'luxon';
import {text} from '../../../assets/styles/text';
import {Colors} from '../../ui/constants/colors';
import {useScreenInsets} from '../../ui/constants/insets';
import {VoteItem} from '../features';
import {global} from '../../../assets/styles/global';

type PostInfoProps = {
  post: Post;
  setPost: Dispatch<SetStateAction<Post | undefined>>;
};
export const PostInfo: React.FC<PostInfoProps> = ({post, setPost}) => {
  const {vote, removeReaction, react, posts, update} = usePostStore();

  const [like, setLike] = useState<boolean | undefined>(
    post?.isLiked as boolean,
  );

  const updatePost = (post: Post) => {
    const data = posts.map(p => {
      if (p.id === post.id) {
        return post;
      }
      return p;
    });

    update(data);
  };

  const {user, createdAt, options, answer} = post;

  const {insetsHorizontal: paddingHorizontal} = useScreenInsets();

  const handleSubmitOption = async (id: number) => {
    const result = await vote(`${post.id}`, `${id}`);
    if (!result) {
      console.error('Smth went wrong while voting');
      return;
    }
    setPost(result);
    updatePost(result);
  };

  const setReaction = async (reaction: boolean | undefined) => {
    let data: Post | undefined;

    if (reaction === undefined) {
      setLike(undefined);

      data = await removeReaction(post.id.toString());
    } else {
      setLike(reaction);

      data = await react(post.id.toString(), reaction);
    }

    if (data) {
      setPost(data);
      updatePost(data);
    }
  };

  const handleLikePress = () => {
    if (like) {
      setReaction(undefined);
      return;
    }
    setReaction(true);
  };

  const handleDislikePress = () => {
    if (like === false) {
      setReaction(undefined);
      return;
    }

    setReaction(false);
  };

  return (
    <View style={styles.postContainer}>
      <Row spaceBetween style={{paddingHorizontal}}>
        <Text style={[text.l, text.semiBold]}>@{user.username}</Text>
        <Text style={[text.m, text.medium, text.secondary]}>
          {DateTime.fromISO(createdAt).toFormat('DDD')}
        </Text>
      </Row>

      <View style={styles.postInfoContainer}>
        <Text style={[text.center, text.xxl, text.bold]}>{post.title}</Text>
        <Text style={[text.center, text.l, text.tertiary, text.medium]}>
          {post.description}
        </Text>
      </View>

      <View style={[styles.postOptionsContainer, {paddingHorizontal}]}>
        {options.map(vote => (
          <VoteItem
            key={`post-option-${vote.id}`}
            vote={{
              amount: vote.total!,
              percent: (+vote.total! / +(post.total || 1)) * 100,
              id: vote.id!,
              option: vote.option!,
            }}
            completed={!!answer}
            onSubmitOption={handleSubmitOption}
            selected={vote.id === answer}></VoteItem>
        ))}
      </View>

      <Row spaceBetween style={[styles.postFooter, {paddingHorizontal}]}>
        <Row gap={7} alignCenter>
          <Icon
            onPress={handleLikePress}
            size={25}
            color={Colors.green}
            name={like ? 'post.like-filled' : 'post.like'}
          />
          <Text style={[text.l, text.medium, text.green]}>
            {post.likes.length}
          </Text>
        </Row>
        <Row gap={7} alignCenter>
          <Text style={[text.l, text.medium, text.red]}>
            {post.dislikes.length}
          </Text>
          <Icon
            onPress={handleDislikePress}
            color={Colors.red}
            size={25}
            name={like === false ? 'post.dislike-filled' : 'post.dislike'}
          />
        </Row>
      </Row>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    gap: 10,
  },
  postContainer: {
    paddingTop: 15,
    gap: 24,
    borderColor: Colors.border,
  },
  postInfoContainer: {
    gap: 10,
  },
  postOptionsContainer: {
    gap: 10,
  },
  postFooter: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 10,
    borderColor: Colors.border,
  },
});
