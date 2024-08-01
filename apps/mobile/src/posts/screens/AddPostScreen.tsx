import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {global} from '../../../assets/styles/global';
import {
  Button,
  Header,
  Icon,
  InfoItem,
  Row,
  TextInput,
} from '../../ui/components';
import {useScreenInsets} from '../../ui/constants/insets';
import {text} from '../../../assets/styles/text';
import {Colors} from '../../ui/constants/colors';
import React, {useState} from 'react';
import Animated, {
  Easing,
  FadeOutLeft,
  LinearTransition,
  SlideInLeft,
  SlideInRight,
} from 'react-native-reanimated';
import {usePostStore} from '../store';
import {useFormik} from 'formik';
import {CreatePostData} from '../types';
import {useNavigation} from '@react-navigation/native';
import {TagCheckbox} from '../components';
import {useUserStore} from '../../user/store';
import {AxiosError} from 'axios';
import {useMessage} from '../../lib';

const AnimatedButton = Animated.createAnimatedComponent(TouchableOpacity);

export const AddPostScreen = () => {
  const {insetsHorizontal, insetsBottom} = useScreenInsets();
  const [isLoading, setIsLoading] = useState(false);
  const [size, setSize] = useState(2);
  const {create, getPosts, postTags} = usePostStore();
  const {get: getUser} = useUserStore();
  const [selectedTag, setSelectedTag] = useState(postTags[0].id);

  const {headerHeight} = useScreenInsets();
  const navigation = useNavigation();
  const {showMessage} = useMessage();

  const initialValues: CreatePostData = {
    title: '',
    description: '',
    options: ['', ''] as never[],
    tagId: postTags[0].id,
  };

  const onSubmit = async (data: CreatePostData) => {
    setIsLoading(true);
    try {
      await create(data);
      await getUser();
      await getPosts({page: '1'});
      setIsLoading(false);
      navigation.goBack();
      showMessage({text: 'Poll successfully created', type: 'success'});
    } catch (error) {
      const message = (error as AxiosError<{error: string}>).response?.data
        ?.error;
      if (message) {
        navigation.goBack();
        showMessage({text: `Cannot create post - ${message}`, type: 'failure'});
      }

      setIsLoading(false);
    }
  };

  const {handleChange, setFieldValue, handleSubmit, values} = useFormik({
    initialValues,
    onSubmit,
  });

  const handleOptionChange = (index: number, value: string) => {
    setFieldValue(
      'options',
      values.options.map((option, i) => {
        if (i === index) {
          return value;
        }
        return option;
      }),
    );
  };

  const addOption = () => {
    setFieldValue('options', [...values.options, '']);
    setSize(size + 1);
  };

  const removeOption = () => {
    setFieldValue(
      'options',
      values.options.filter((_, index) => index !== values.options.length - 1),
    );
    setSize(size - 1);
  };
  return (
    <View
      style={[
        global.screen,
        styles.screen,
        {paddingHorizontal: insetsHorizontal},
        {paddingBottom: insetsBottom},
      ]}>
      <Header
        insetsTop={false}
        title="Add new post"
        leftText="Cancel"
        onLeftPress={() => navigation.goBack()}></Header>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {paddingBottom: insetsBottom},
          {paddingTop: headerHeight},
        ]}>
        <InfoItem>
          You will be charged for 30 coins to create a new post. Be careful with
          filling form ;)
        </InfoItem>
        <Text style={[text.xl, text.bold]}>Post info:</Text>
        <TextInput
          label="Title*"
          placeholder="Enter title..."
          value={values.title}
          onChangeText={handleChange('title')}
        />
        <TextInput
          label="Description*"
          placeholder="Enter description..."
          value={values.description}
          onChangeText={handleChange('description')}
        />
        <Animated.View style={styles.container}>
          <Text style={[text.xl, text.semiBold]}>Tag:</Text>
          <Row wrap alignCenter gap={10}>
            {postTags.map(tag => (
              <TagCheckbox
                onPress={id => {
                  setFieldValue('tagId', id);
                  setSelectedTag(id);
                }}
                key={`tag-checkbox-${tag.id}`}
                tag={tag}
                isSelected={selectedTag === tag.id}
              />
            ))}
          </Row>
        </Animated.View>
        <View style={styles.container}>
          <Text style={[text.xl, text.semiBold]}>Options:</Text>
          <View style={styles.options}>
            {[...Array(size)].map((_, index) => (
              <Animated.View
                key={`option-${index}`}
                entering={Platform.OS === 'web' ? undefined : SlideInLeft}
                exiting={Platform.OS === 'web' ? undefined : FadeOutLeft}
                layout={LinearTransition.easing(Easing.linear)}
                style={styles.inputRow}>
                <TextInput
                  value={values.options?.[index] || ''}
                  onChangeText={text => handleOptionChange(index, text)}
                  containerStyle={{flex: 1}}
                  label={`Option ${index + 1}${
                    [0, 1].includes(index) ? '*' : ''
                  }`}
                  placeholder={`Option ${index + 1} value goes here...`}
                />
                {index > 1 && index === size - 1 && (
                  <AnimatedButton
                    entering={Platform.OS === 'web' ? undefined : SlideInRight}
                    onPress={removeOption}
                    style={styles.removeButton}>
                    <Icon name="cross" size={20} color={Colors.dark}></Icon>
                  </AnimatedButton>
                )}
              </Animated.View>
            ))}
          </View>
        </View>
        <Animated.View
          layout={
            Platform.OS === 'web'
              ? undefined
              : LinearTransition.easing(Easing.linear)
          }>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.add}
            onPress={addOption}>
            <Text style={[text.l, text.primary, text.semiBold]}>
              Add one more option
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
      <Button loading={isLoading} onPress={handleSubmit}>
        Let's go!
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    paddingTop: 30,
    gap: 24,
  },
  scroll: {flex: 1},
  scrollContent: {flexGrow: 1, gap: 12},
  add: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.primaryTransparent,
  },
  container: {
    gap: 20,
    marginTop: 12,
  },
  options: {
    gap: 10,
  },
  removeButton: {
    height: 50,
    width: 50,
    backgroundColor: Colors.text,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 15,
  },
});
