import React, {useState} from 'react';
import Paragraph from '../components/Paragraph';
import {theme} from '../core/theme';
import CustomIcon from '../components/CustomIcon';
import CreatePostInput from '../components/CreatePostInput';
import Background from '../components/Background';
import {Button, Menu} from 'react-native-paper';
import {ImageBackground, StyleSheet, ScrollView} from 'react-native';
import {Card} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import {useQuery, useMutation} from '@apollo/client';
import {REQUEST_GET_POSTS} from '../graphql/query/getPosts';
import {REQUEST_CREATE_POST} from '../graphql/mutations/createPost';
import {POSTS_FRAGMENT} from '../graphql/fragments/postsFragment';
import {useAuth} from '../context/userContext';
import Loader from '../components/Loader';

const PostScreen = ({navigation}) => {
  const {state} = useAuth();
  const [newPost, setNewPost] = useState({
    memberid: state.memberId,
    content: '',
  });

  const memberIds = state.members.map((member) => member.id);

  const ActionButtons = ({memberId}) => {
    const [visible, setVisible] = React.useState(false);

    const openMenu = () => setVisible(true);

    const closeMenu = () => setVisible(false);
    if (state.role !== 'Admin' && memberId !== state.memberId) return null;
    if (memberId === state.memberId || state.role === 'Admin')
      return (
        <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={<Button mode="text" onPress={openMenu}><Icon name='more-vertical' size={24}/></Button>}
        >
          <Menu.Item onPress={()=>{}} icon="edit" title="Edit"/>
          <Menu.Item onPress={()=>{}} icon="trash-2" title="Delete"/>
          {/* <Button mode="text" compact={true}>
            
          </Button>
          <Button mode="text" compact={true}>
            
          </Button> */}
        </Menu>
      );
  };

  const GetPosts = () => {
    const {loading, error, data} = useQuery(REQUEST_GET_POSTS, {
      variables: {membersid: memberIds},
    });
    if (loading) return <Loader loading={loading} />;
    if (error) return null;
    return data.posts.map((post) => (
      <Card key={post.id} style={styles.container}>
        <Card.Title
          title={post.familyMember.user.name}
          subtitle={post.created_at}
          right={() => (
            <ActionButtons memberId={post.familyMember.id} />
          )}></Card.Title>
        <Card.Content>
          <Paragraph>{post.content}</Paragraph>
        </Card.Content>
      </Card>
    ));
  };

  const handlePostChange = (event) => {
    setNewPost((previousState) => {
      return {...previousState, content: event};
    });
  };

  //TODO: write update cache and debug
  const [
    requestCreatePostMutation,
    {loading: requestCreatePostLoading},
  ] = useMutation(REQUEST_CREATE_POST, {
    update(cache, {data: {createPost}}) {
      cache.modify({
        fields: {
          posts(existingPosts = []) {
            const newPostRef = cache.writeFragment({
              data: createPost,
              fragment: POSTS_FRAGMENT,
            });
            return [newPostRef, ...existingPosts];
          },
        },
      });
    },
    variables: newPost,
  });

  const requestCreatePost = async () => {
    try {
      await requestCreatePostMutation();
      setNewPost((previousState) => {
        return {
          ...previousState,
          content: '',
        };
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/background_dot.png')}
      resizeMode="repeat"
      style={{flex: 1, width: '100%', backgroundColor: theme.colors.secondary}}>
      <ScrollView>
        <Card style={styles.container}>
          <Card.Content>
            <CreatePostInput
              value={newPost.content}
              onChangeText={handlePostChange}
            />

            <Button
              mode="contained"
              style={{
                width: '50%',
                backgroundColor: theme.colors.accent,
                alignSelf: 'flex-end',
              }}
              disabled={newPost.content === '' ? true : false}
              loading={requestCreatePostLoading}
              onPress={requestCreatePost}>
              Create
            </Button>
          </Card.Content>
        </Card>
        <GetPosts />
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    marginVertical: 16,
    alignSelf: 'center',
    elevation: 6,
  },
});

export default PostScreen;
