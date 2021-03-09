//React import
import React, {useState, useEffect} from 'react';
//End of React import

//import UI components
import Loader from '../components/Loader';
import Paragraph from '../components/Paragraph';
import CreatePostInput from '../components/CreatePostInput';
import {Button, Menu} from 'react-native-paper';
import {ImageBackground, StyleSheet, ScrollView, View} from 'react-native';
import {Portal, Modal, Card, Divider, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import {theme} from '../core/theme';
//end of UI components imports


//import graphql queries, mutations & fragments
import {useQuery, useMutation} from '@apollo/client';
import {REQUEST_GET_POSTS} from '../graphql/query/getPosts';
import {REQUEST_CREATE_POST} from '../graphql/mutations/posts/createPost';
import {REQUEST_UPDATE_POST} from '../graphql/mutations/posts/updatePost';
import {REQUEST_DELETE_POST} from '../graphql/mutations/posts/deletePost';
import {REQUEST_CREATE_LIKE} from '../graphql/mutations/posts/createLike';
import {REQUEST_DELETE_LIKE} from '../graphql/mutations/posts/deleteLike';
import {
  POSTS_FRAGMENT,
  NEW_LIKE_FRAGMENT,
} from '../graphql/fragments/postsFragment';
//end of graphql imports

//React Context import
import {useAuth} from '../context/userContext';
//end of React Context import

const PostScreen = ({navigation}) => {
  //Core States declaration
  const {state} = useAuth();
  const [newPost, setNewPost] = useState({
    memberid: state.memberId,
    content: '',
  });

  const memberIds = state.members.map((member) => member.id);
  //End of Core States declaration

  //Core GraphQL Mutations declaration
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
  //End of Core GraphQL Mutations declaration

  //Post handlers declaration
  const handlePostChange = (event) => {
    setNewPost((previousState) => {
      return {...previousState, content: event};
    });
  };

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
  //End of Post handlers declaration

  //Get All Posts based on useQuery GraphQL Component
  const GetPosts = () => {
    const {loading, error, data} = useQuery(REQUEST_GET_POSTS, {
      variables: {membersid: memberIds},
    });
    if (loading) return <Loader loading={loading} />;
    if (error) return null;
    
    //Like Button Component for Post Component
    const LikeButton = ({like, postId, post}) => {
      const [isLiked, setIsLiked] = useState(false);
      const [likeId, setLikeId] = useState(0);
      const [requestCreateLikeMutation] = useMutation(REQUEST_CREATE_LIKE, {
        update(cache, {data: {createLike}}) {
          setLikeId(parseInt(createLike.id));
          cache.modify({
            id: cache.identify(post),
            fields: {
              like(existingLikes = [], {readField}) {
                const newLikeRef = cache.writeFragment({
                  data: createLike,
                  fragment: NEW_LIKE_FRAGMENT,
                });
                return [...existingLikes, newLikeRef];
              },
            },
          });
        },
      });

      const [requestDeleteLikeMutation] = useMutation(REQUEST_DELETE_LIKE, {
        update(cache, {data: {unLike}}) {
          cache.modify({
            id: cache.identify(post),
            fields: {
              like(existingLikes = [], {readField}) {
                const newLikes = existingLikes.filter(
                  (likeRef) => readField('id', likeRef) !== unLike.id,
                );
                return newLikes;
              },
            },
          });
        },
      });

      const likeButton = isLiked ? (
        <Button
          style={{width: '50%'}}
          onPress={() => {
            requestDeleteLikeMutation({
              variables: {likeid: likeId},
            });
            setIsLiked(false);
          }}
          color={theme.colors.notification}>
          <Icon name="heart" size={20} color={theme.colors.notification} />{' '}
          Liked
        </Button>
      ) : (
        <Button
          style={{width: '50%'}}
          onPress={() => {
            requestCreateLikeMutation({
              variables: {memberid: state.memberId, postid: postId},
            });
            setIsLiked(true);
          }}
          color={theme.colors.text}>
          <Icon name="heart" size={20} color={theme.colors.text} /> Like
        </Button>
      );

      useEffect(() => {
        if (
          like.find((like) => like.familyMember.id == state.memberId) !==
          undefined
        ) {
          setLikeId(
            parseInt(
              like.find((like) => like.familyMember.id == state.memberId).id,
            ),
          );
          setIsLiked(true);
        }
      }, [like]);

      return likeButton;
    };
    //End of Like Button Component for Post Component

    //Action Buttons Component for Post Component
    const ActionButtons = ({memberId, postId, content}) => {
      if (state.role !== 'Admin' && memberId !== state.memberId) return null;
      const [visible, setVisible] = useState(false);
      const [editVisible, setEditVisible] = useState(false);
      const [deleteVisible, setDeleteVisible] = useState(false);
      const [editPost, setEditPost] = useState({
        id: parseInt(postId),
        content: content,
      });

      const openMenu = () => setVisible(true);
      const closeMenu = () => setVisible(false);
      const openEdit = () => setEditVisible(true);
      const closeEdit = () => setEditVisible(false);
      const openDelete = () => setDeleteVisible(true);
      const closeDelete = () => setDeleteVisible(false);

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
                const newPosts = existingPosts.filter(
                  (postRef) => readField('id', postRef) !== deletePost.id,
                );
                return newPosts;
              },
            },
          });
        },
        variables: {
          id: parseInt(postId),
        },
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
      return (
        <>
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <Button mode="text" onPress={openMenu}>
                <Icon
                  name="more-vertical"
                  size={24}
                  color={theme.colors.text}
                />
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
              <Text
                style={{
                  fontSize: 19,
                  fontWeight: '900',
                }}>
                Edit Post
              </Text>
              <Divider style={{marginVertical: 9}} />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '500',
                }}>
                Post content
              </Text>
              <CreatePostInput
                value={editPost.content}
                onChangeText={handleEditPost}
              />
              <View style={styles.row}>
                <Button
                  mode="contained"
                  color={theme.colors.background}
                  style={{width: '50%'}}
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
                  style={{width: '50%'}}
                  loading={requestUpdatePostLoading}
                  onPress={requestUpdatePost}>
                  Update
                </Button>
              </View>
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
              <Text
                style={{
                  fontSize: 19,
                  fontWeight: '900',
                }}>
                Delete post
              </Text>
              <Divider style={{marginVertical: 9}} />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '500',
                  marginVertical: 9,
                }}>
                Are you sure you want to delete this post?
              </Text>
              <Divider style={{marginVertical: 9}} />
              <View style={styles.row}>
                <Button
                  mode="contained"
                  color={theme.colors.background}
                  style={{width: '50%'}}
                  disabled={requestDeletePostLoading}
                  onPress={() => {
                    closeDelete();
                  }}>
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  color={theme.colors.notification}
                  style={{width: '50%'}}
                  loading={requestDeletePostLoading}
                  onPress={requestDeletePost}>
                  Delete
                </Button>
              </View>
            </Modal>
          </Portal>
        </>
      );
    };
    //End of Action Buttons Component for Post Component

    return data.posts.map((post) => (
      <Card key={post.id} style={styles.container}>
        <Card.Title
          title={post.familyMember.user.name}
          subtitle={new Date(post.created_at.replace(/\s/g, 'T'))
            .toString()
            .slice(0, 21)}
          right={() => (
            <ActionButtons
              memberId={post.familyMember.id}
              postId={post.id}
              content={post.content}
            />
          )}></Card.Title>
        <Card.Content style={{marginBottom: 15}}>
          <Paragraph>{post.content}</Paragraph>
        </Card.Content>
        <Divider style={{height: 2}} />
        <Card.Actions>
          <LikeButton like={post.like} postId={post.id} post={post} />
          <Divider style={{width: 1, height: '100%'}} />
          <Button
            style={{width: '50%'}}
            onPress={() => {
              navigation.navigate('PostDetails', {
                post: post,
              });
            }}
            color={theme.colors.text}>
            <Icon name="message-circle" size={20} color={theme.colors.text} />{' '}
            Comment
          </Button>
        </Card.Actions>
      </Card>
    ));
  };
  //End of Get All Post based on useQuery GraphQL Component
  

  return (
    <ImageBackground
      source={require('../assets/background_dot.png')}
      resizeMode="repeat"
      style={{flex: 1, width: '100%', backgroundColor: theme.colors.primary}}>
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
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default PostScreen;
