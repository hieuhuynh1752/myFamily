import React, {useState} from 'react';
import Paragraph from '../components/Paragraph';
import {theme} from '../core/theme';
import CustomIcon from '../components/CustomIcon';
import CreatePostInput from '../components/CreatePostInput';
import Background from '../components/Background';
import {Button, Menu} from 'react-native-paper';
import {ImageBackground, StyleSheet, ScrollView} from 'react-native';
import {Portal, Modal, Card, Divider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import {useQuery, useMutation} from '@apollo/client';
import {REQUEST_GET_POSTS} from '../graphql/query/getPosts';
import {REQUEST_CREATE_POST} from '../graphql/mutations/posts/createPost';
import {REQUEST_UPDATE_POST} from '../graphql/mutations/posts/updatePost';
import {REQUEST_DELETE_POST} from '../graphql/mutations/posts/deletePost';
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
            console.log(newPostRef)
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
  
  const GetPosts = () => {
    const {loading, error, data} = useQuery(REQUEST_GET_POSTS, {
      variables: {membersid: memberIds},
    });
    if (loading) return <Loader loading={loading} />;
    if (error) return null;
    const ActionButtons = ({memberId, postId, content}) => {
      if (state.role !== 'Admin' && memberId !== state.memberId) return null;
      const [visible, setVisible] = useState(false);
      const [editVisible, setEditVisible] = useState(false);
      const [deleteVisible, setDeleteVisible] = useState(false);
      const [editPost, setEditPost] = useState({
        id: parseInt(postId),
        content: content,
      });
      const [deletePostId] = useState({
        id: parseInt(postId)
      })
  
      const openMenu = () => setVisible(true);
      const closeMenu = () => setVisible(false);
      const openEdit = () => setEditVisible(true);
      const closeEdit = () => setEditVisible(false);
      const openDelete = () => setDeleteVisible(true);
      const closeDelete = () => setDeleteVisible(false)
  
      const handleEditPost = (event) => {
        setEditPost((previousState) => {
          return {...previousState, content: event};
        });
      };
  
      const [
        requestUpdatePostMutation,
        {loading: requestUpdatePostLoading},
      ] = useMutation(REQUEST_UPDATE_POST, {
        variables: editPost,
      });
  
      const [
        requestDeletePostMutation,
        {loading: requestDeletePostLoading},
      ] = useMutation(REQUEST_DELETE_POST, {
        update(cache, {data: {deletePost}}) {
          cache.modify({
            fields: {
              posts(existingPosts, {readField}) {
                 const newPosts = existingPosts.filter(postRef=>readField('id',postRef)!==deletePost.id);
                 console.log(newPosts);
                 return newPosts
              },
            },
          });
        },
        variables: deletePostId,
      });
  
      const requestUpdatePost = async () => {
        try {
          await requestUpdatePostMutation();
          closeEdit();
        } catch (error) {
          console.log(error);
        }
      };
  
      const requestDeletePost = async () => {
        try {
          await requestDeletePostMutation();
          closeDelete();
        } catch (error) {
          console.log(error);
        }
      };
  
      if (memberId === state.memberId || state.role === 'Admin')
        return (
          <>
            <Menu
              visible={visible}
              onDismiss={closeMenu}
              anchor={
                <Button mode="text" onPress={openMenu}>
                  <Icon name="more-vertical" size={24} />
                </Button>
              }>
              <Menu.Item
                onPress={() => {
                  openEdit();
                  closeMenu();
                }}
                icon="edit"
                titleStyle={{color: 'green'}}
                title="Edit"
              />
              <Divider />
              <Menu.Item
                onPress={() => {
                  openDelete();
                  closeMenu();
                }}
                icon="trash-2"
                titleStyle={{color: 'red'}}
                title="Delete"
              />
            </Menu>
            <Portal>
              <Modal
                visible={editVisible}
                onDismiss={closeEdit}
                contentContainerStyle={{
                  backgroundColor: 'white',
                  padding: 20,
                  width: '80%',
                  alignSelf: 'center',
                }}>
                <Card>
                  <Card.Title title="Edit post" style={{alignSelf: 'center'}} />
                  <Card.Content>
                    <CreatePostInput
                      value={editPost.content}
                      onChangeText={handleEditPost}
                    />
                    <Button
                      mode="contained"
                      color={theme.colors.background}
                      disabled={requestUpdatePostLoading}
                      onPress={() => {
                        setEditPost({id: parseInt(postId), content: content});
                        closeEdit();
                      }}>
                      Cancel
                    </Button>
                    <Button
                      mode="contained"
                      color={theme.colors.accent}
                      loading={requestUpdatePostLoading}
                      onPress={requestUpdatePost}>
                      Update
                    </Button>
                  </Card.Content>
                </Card>
              </Modal>
              <Modal
                visible={deleteVisible}
                onDismiss={closeDelete}
                contentContainerStyle={{
                  backgroundColor: 'white',
                  padding: 20,
                  width: '80%',
                  alignSelf: 'center',
                }}>
                <Card>
                  <Card.Title title="Delete post" style={{alignSelf: 'center'}} />
                  <Card.Content>
                    <Paragraph>Are you sure you want to delete this post?</Paragraph>
                    <Button
                      mode="contained"
                      color={theme.colors.background}
                      disabled={requestDeletePostLoading}
                      onPress={() => {
                        closeDelete();
                      }}>
                      Cancel
                    </Button>
                    <Button
                      mode="contained"
                      color={theme.colors.notification}
                      loading={requestDeletePostLoading}
                      onPress={requestDeletePost}>
                      Delete
                    </Button>
                  </Card.Content>
                </Card>
              </Modal>
            </Portal>
          </>
        );
    };  
    return data.posts.map((post) => (
      <Card key={post.id} style={styles.container}>
        <Card.Title
          title={post.familyMember.user.name}
          subtitle={post.created_at}
          right={() => (
            <ActionButtons
              memberId={post.familyMember.id}
              postId={post.id}
              content={post.content}
            />
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
