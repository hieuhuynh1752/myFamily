import React, {useState, useEffect} from 'react';

//import UI components
import Loader from '../components/Loader';
import Paragraph from '../components/Paragraph';
import CreatePostInput from '../components/CreatePostInput';
import {IconButton, Button, Menu, TextInput} from 'react-native-paper';
import {ImageBackground, StyleSheet, ScrollView, Keyboard} from 'react-native';
import {Portal, Modal, Card, Divider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
//end of UI components imports

//import theme
import {theme} from '../core/theme';

//import graphql queries, mutations & fragments
import {useMutation} from '@apollo/client';
import {REQUEST_UPDATE_POST} from '../graphql/mutations/posts/updatePost';
import {REQUEST_DELETE_POST} from '../graphql/mutations/posts/deletePost';

import {REQUEST_CREATE_COMMENT} from '../graphql/mutations/posts/createComment';
import {REQUEST_DELETE_COMMENT} from '../graphql/mutations/posts/deleteComment';
import {REQUEST_CREATE_LIKE} from '../graphql/mutations/posts/createLike';
import {REQUEST_DELETE_LIKE} from '../graphql/mutations/posts/deleteLike';
import {
  NEW_LIKE_FRAGMENT,
  NEW_COMMENT_FRAGMENT,
} from '../graphql/fragments/postsFragment';
//end of graphql imports

//import user context
import {useAuth} from '../context/userContext';
import BackButton from '../components/BackButton';

const PostDetailsScreen = ({route, navigation}) => {
  const {state} = useAuth();
  const {post} = route.params;

  const [content, setContent] = useState(post.content);
  const [comments, setComments] = useState(post.comment);

  const CommentList = () => {
    const CommentButton = ({commentId, memberId}) => {
      if (state.role !== 'Admin' && memberId !== state.memberId) return null;
      const [requestDeleteComment] = useMutation(REQUEST_DELETE_COMMENT, {
        update(cache, {data: {deleteComment}}) {
          cache.modify({
            id: cache.identify(post),
            fields: {
              comment(existingComments = [], {readField}) {
                const newComments = existingComments.filter(
                  (commentRef) =>
                    readField('id', commentRef) !== deleteComment.id,
                );
                
                setComments(comments.filter((comment)=> comment.id !== deleteComment.id));
                return newComments;
              },
            },
          });
        },
      });
      return (
        <Button
          mode="text"
          onPress={() => {
            requestDeleteComment({variables: {commentid: parseInt(commentId)}});
          }}>
          <Icon name="trash-2" size={20} color={theme.colors.error} />
        </Button>
      );
    };

    return (
      <>
        {comments.map((comment) => (
          <Card key={comment.id} style={{marginVertical: 4}}>
            <Divider />
            <Card>
              <Card.Title
                title={comment.familyMember.user.name}
                titleStyle={{fontSize: 16}}
                right={() => (
                  <CommentButton
                    commentId={comment.id}
                    memberId={comment.familyMember.id}
                  />
                )}
              />
              <Card.Content>
                <Paragraph>{comment.content}</Paragraph>
              </Card.Content>
            </Card>
          </Card>
        ))}
      </>
    );
  };

  const CommentSection = () => {
    const [newComment, setNewComment] = useState('');

    const [requestCreateCommentMutation] = useMutation(REQUEST_CREATE_COMMENT, {
      update(cache, {data: {createComment}}) {
        cache.modify({
          id: cache.identify(post),
          fields: {
            comment(existingComments = [], {readField}) {
              const newCommentRef = cache.writeFragment({
                data: createComment,
                fragment: NEW_COMMENT_FRAGMENT,
              });
              setComments((previousState) => {
                return [...previousState, createComment];
              });
              return [...existingComments, newCommentRef];
            },
          },
        });
      },
    });

    return (
      <Card>
        <Card.Actions>
          <TextInput
            style={{width: '85%', height: 48}}
            value={newComment}
            onChangeText={setNewComment}
          />
          <IconButton
            style={{width: '15%'}}
            icon="send"
            disabled={newComment === ''}
            size={25}
            onPress={() => {
              requestCreateCommentMutation({
                variables: {
                  memberid: state.memberId,
                  postid: post.id,
                  content: newComment,
                },
              });
              setNewComment('');
              Keyboard.dismiss();
            }}
            color={theme.colors.primary}
          />
        </Card.Actions>
      </Card>
    );
  };

  const GetPost = () => {
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
        id: parseInt(postId),
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
        variables: deletePostId,
      });

      const requestUpdatePost = async () => {
        try {
          await requestUpdatePostMutation();
          setContent(editPost.content);
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
                  <Card.Title
                    title="Delete post"
                    style={{alignSelf: 'center'}}
                  />
                  <Card.Content>
                    <Paragraph>
                      Are you sure you want to delete this post?
                    </Paragraph>
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
    return (
      <Card key={post.id} style={styles.container}>
        <Card.Title
          title={post.familyMember.user.name}
          subtitle={post.created_at}
          right={() => (
            <ActionButtons
              memberId={post.familyMember.id}
              postId={post.id}
              content={content}
            />
          )}></Card.Title>
        <Card.Content style={{marginBottom: 15}}>
          <Paragraph>{content}</Paragraph>
        </Card.Content>
        <Divider style={{height: 2}} />
        <Card.Actions>
          <LikeButton like={post.like} postId={post.id} post={post} />
          <Divider style={{width: 1, height: '100%'}} />
          <Button
            style={{width: '50%'}}
            onPress={() => {}}
            color={theme.colors.text}>
            <Icon name="message-circle" size={20} color={theme.colors.text} />{' '}
            Comment
          </Button>
        </Card.Actions>
        <Divider style={{height: 2}} />
        <Card.Content style={{marginTop: 15}}>
          <CommentList />
        </Card.Content>
      </Card>
    );
  };

  return (
    <ImageBackground
      source={require('../assets/background_dot.png')}
      resizeMode="repeat"
      style={{flex: 1, width: '100%', backgroundColor: theme.colors.secondary}}>
      <BackButton goBack={() => navigation.navigate('PostScreen')} />
      <ScrollView>
        <GetPost />
      </ScrollView>
      <CommentSection />
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

export default PostDetailsScreen;
