import {
  ActivityIndicator,
  ListRenderItem,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {global} from '../../../assets/styles/global';
import {useScreenInsets} from '../../ui/constants/insets';
import {PostCard, PostsFilter} from '../components';
import {Post, PostTag} from '../types';
import {usePostStore} from '../store';
import React, {useCallback, useState} from 'react';
import {
  AppRoutes,
  TabRoutes,
  TabStackScreenProps,
} from '../../ui/navigation/types';
import {Header, Icon} from '../../ui/components';
import {FullScreenLoader} from '../../ui/components/FullScreenLoader';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';
import {Colors} from '../../ui/constants';
import {text} from '../../../assets/styles/text';
import {useUserStore} from '../../user/store';

export const PostsScreen: React.FC<TabStackScreenProps<TabRoutes.POSTS>> = ({
  navigation,
}) => {
  const [selectedTag, setSelectedTag] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const {posts, postTags, getPosts} = usePostStore();
  const {user} = useUserStore();

  const handlePostPress = (post: Post) => {
    if (!post.answer) return;

    navigation.navigate(AppRoutes.POST, {id: `${post.id}`});
  };

  const renderItem: ListRenderItem<Post> = useCallback(
    ({item}) => <PostCard onPress={handlePostPress} post={item} />,
    [posts],
  );

  const handleFilter = async (tag: PostTag) => {
    setLoading(true);
    setSelectedTag(tag.id);
    await getPosts({
      tagId: tag.value === 'All' ? undefined : `${tag.id}`,
      page: '1',
    });
    setPage(1);
    setLoading(false);
  };

  const {
    insetsHorizontal: paddingHorizontal,
    insetsTopHeader,
    insetsTabBar: paddingBottom,
  } = useScreenInsets();

  const paddingTop = insetsTopHeader + 20;

  const refresh = async () => {
    setRefreshing(true);
    await getPosts({
      tagId: selectedTag === 0 ? undefined : `${selectedTag}`,
      page: '1',
    });
    setPage(1);
    setRefreshing(false);
  };

  const loadExtraPosts = async () => {
    try {
      const tagId = selectedTag === 0 ? undefined : `${selectedTag}`;
      const data = await getPosts({tagId, page: page.toString()});
      if (data.length) setPage(page + 1);
    } catch (error) {}
  };

  return (
    <View style={[global.screen]}>
      {loading ? (
        <FullScreenLoader />
      ) : (
        <Animated.FlatList
          data={posts}
          refreshing={refreshing}
          onRefresh={refresh}
          scrollEnabled={!!posts.length}
          renderItem={renderItem}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="no-polls" size={200}></Icon>
              <Text
                style={[text.xxl, text.secondary, text.center, text.semiBold]}>
                There are no polls {'\n'}with this tag yet
              </Text>
            </View>
          }
          ListHeaderComponent={() => {
            if (refreshing)
              return (
                <Animated.View exiting={FadeOut} entering={FadeIn}>
                  <ActivityIndicator size="large" color={Colors.primary} />
                </Animated.View>
              );
            return <View style={{height: 30}}></View>;
          }}
          layout={LinearTransition}
          showsVerticalScrollIndicator={false}
          style={[global.screen]}
          contentContainerStyle={[
            styles.contentContainer,
            {paddingBottom, paddingHorizontal, paddingTop},
          ]}
          onEndReachedThreshold={0.8}
          onEndReached={loadExtraPosts}
          keyExtractor={i => `${i.id}-post`}
        />
      )}
      <Header
        title="Posts"
        leftIcon="coin"
        leftText={`${user?.balance}`}
        rightIcon="document"
        onRightPress={() => navigation.navigate(AppRoutes.ADD_POST)}>
        <PostsFilter
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          onPress={handleFilter}
          data={[{id: 0, value: 'All'}, ...postTags]}
        />
      </Header>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    gap: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 100,
  },
});
