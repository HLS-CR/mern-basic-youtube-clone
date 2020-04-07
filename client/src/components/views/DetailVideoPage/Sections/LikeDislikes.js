import React, { Fragment, useEffect, useState } from 'react';
import { Tooltip, Icon } from 'antd';
import axios from "axios";

function LikeDislikes(props) {

  const [Likes, setLikes] = useState(0)
  const [Dislikes, setDislikes] = useState(0)
  const [LikeAction, setLikeAction] = useState(null)
  const [DislikeAction, setDislikeAction] = useState(null)

  let variable = {};

  if (props.video) {
    variable = { videoId: props.videoId, userId: props.userId }
  } else {
    variable = { commentId: props.commentId, userId: props.userId }
  }

  useEffect(() => {

    // Likes
    axios.post("/api/like/getLikes", variable)
      .then(response => {
        if (response.data.success) {
          // Amount of likes
          setLikes(response.data.likes.length)

          // Already clicked or not
          response.data.likes.map(like => {
            if (like.userId === props.userId) {
              setLikeAction("liked")
            }
          })
        } else {
          alert("Failed to get likes.")
        }
      })

    // Dislikes
    axios.post("/api/like/getDislikes", variable)
      .then(response => {
        if (response.data.success) {
          // Amount of dislikes
          setDislikes(response.data.dislikes.length)

          // Already clicked or not
          response.data.dislikes.map(like => {
            if (like.userId === props.userId) {
              setDislikeAction("disliked")
            }
          })
        } else {
          alert("Failed to get dislikes.")
        }
      })
  }, [])

  const onLike = () => {

    if (LikeAction === null) {
      axios.post("/api/like/upLike", variable)
        .then(response => {
          if (response.data.success) {

            setLikes(Likes + 1)
            setLikeAction("liked")

            // If dislike is already clicked
            if (DislikeAction !== null) {
              setDislikeAction(null)
              setDislikes(Dislikes - 1)
            }

          } else {
            alert("Failed to increase likes.")
          }
        })
    } else {
      axios.post("/api/like/unLike", variable)
        .then(response => {
          if (response.data.success) {

            setLikes(Likes - 1)
            setLikeAction(null)

          } else {
            alert("Failed to decrease likes.")
          }
        })
    }
  }

  const onDisLike = () => {
    if (DislikeAction !== null) {

      axios.post("/api/like/unDislike", variable)
        .then(response => {
          if (response.data.success) {

            setDislikes(Dislikes - 1)
            setDislikeAction(null)

          } else {
            alert("Failed to decrease dislike.")
          }
        })
    } else {

      axios.post("/api/like/upDislike", variable)
        .then(response => {
          if (response.data.success) {

            setDislikes(Dislikes + 1)
            setDislikeAction("disliked")

            // If dislike is already clicked
            if (LikeAction !== null) {
              setLikeAction(null)
              setLikes(Likes - 1)
            }

          } else {
            alert("Failed to increase dislike.")
          }
        })
    }
  }

  return (
    <Fragment>
      <span key="comment-basic-like">
        <Tooltip title="Like">
          <Icon
            type="like"
            theme={LikeAction === 'liked' ? 'filled' : 'outlined'}
            onClick={onLike}
          />
        </Tooltip>
        <span style={{ paddingLeft: '8px', cursor: 'auto' }}>{Likes}</span>
      </span>&nbsp;&nbsp;
      <span key="comment-basic-dislike">
        <Tooltip title="Dislike">
          <Icon
            type="dislike"
            theme={DislikeAction === 'disliked' ? 'filled' : 'outlined'}
            onClick={onDisLike}
          />
        </Tooltip>
        <span style={{ paddingLeft: '8px', cursor: 'auto' }}>{Dislikes}</span>
      </span>
    </Fragment>
  )
}

export default LikeDislikes
