const data = fetch('data.json')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        return data;
    })
    .catch(error => console.log(error));

const commentContainer = document.querySelector('.comment-container');

let lastPostId = 4;



const addNewComment = (data) => {

    let x = document.getElementById("new-comment-form");
    // console.log({x});
    let text = "";
    for(let i=0; i<x.length; i++) {
        text += x.elements[i].value;
    }
    // console.log({text});

    let newCommentObj = {
        id: ++lastPostId,
        content: text,
        createdAt: "seconds ago",
        score: 0,
        user: {
            image: data.currentUser.image,
            username: data.currentUser.username
        },
        replies: []
    }

    data.comments.push(newCommentObj);
    // console.log({data});
    loadComments(data);
    // initListeners(data);
    // loadData(data);
}

const spawnReplyInput = (data, postReplyingTo) => {

    // console.log({postReplyingTo});


    let commentId = postReplyingTo.getAttribute('data-post-id');
    let replyId
    let isReply
    if (postReplyingTo.hasAttribute('data-reply-id')) {
        replyId = postReplyingTo.getAttribute('data-reply-id');
        // console.log({replyId});
        isReply = true;
    } else {
        isReply = false;
    }
    // console.log(commentId);

    let parentCommentObj = data.comments.find(x => x.id == commentId);
    let parentUsername
    if (isReply) {
        // parentReplyObj = data.comments[parseInt(commentId)].find(x => x.id == replyId);
        let parentReplyObj = parentCommentObj.replies.find(x => x.id == replyId);
        // console.log({parentReplyObj});
        parentUsername = parentReplyObj.user.username;
    } else {
        parentUsername = parentCommentObj.user.username;

    }
    // console.log({parentCommentObj});
    // console.log({parentUsername});


    const replyFormText = 
    `<div class="reply-input-card grid-container" data-reply-input-card>
        <img src="./images/avatars/image-juliusomo.png" class="profile-img">
        <form class="form new-reply-form" method="dialog" id="new-reply-form">
            <textarea class="text-area post-reply" id="new-comment">@${parentUsername} </textarea>
            
        </form>
        <button class="send-button post-reply-button" type="submit" data-post-reply-button>REPLY</button>
    </div>`;

    let replyInputCard = document.createElement('div');
    replyInputCard.classList.add('reply-input-card');
    replyInputCard.innerHTML = replyFormText;

    postReplyingTo.parentNode.insertBefore(replyInputCard, postReplyingTo.nextSibling);


}

const addNewReply = ( data, postReplyingTo) => {
    let x = document.getElementById("new-reply-form");
    let text = "";
    for(let i=0; i<x.length; i++) {
        text += x.elements[i].value;
    }

    // console.log(text);

    let parentWrapper = postReplyingTo.querySelector('.comment-wrapper');
    let parentCommentId
    let parentReplyId
    let parentIsReply
    
    if (!parentWrapper) {
        parentWrapper = postReplyingTo.querySelector('.reply-wrapper');
        parentReplyId = parentWrapper.getAttribute('data-reply-id');
        parentIsReply = true;
    } else {
        parentIsReply = false;
    }
    parentCommentId = parentWrapper.getAttribute('data-post-id');

    // console.log({parentCommentId, parentReplyId});


    let parentCommentObj = data.comments.find(x => x.id == parentCommentId);


    let newReplyObj = {
        id: ++lastPostId,
        content: text.replace(`@${parentCommentObj.user.username}`, ''),
        createdAt: "seconds ago",
        score: 0,
        replyingTo: parentCommentObj.user.username,
        user: {
            image: data.currentUser.image,
            username: data.currentUser.username
        }
    }

    


    parentCommentObj.replies.push(newReplyObj);
    loadComments(data);



}   


const spawnEditInputCard = (data, postToEdit) => {

    // console.log({postToEdit});

    let postIsReply
    let postId
    let parentCommentId
    let textContent
    let replyingTo
    let postToEditScore
    if (postToEdit.hasAttribute('data-reply-id')) {
        postIsReply = true;
        postId = postToEdit.getAttribute('data-reply-id');
        parentCommentId = postToEdit.getAttribute('data-post-id');
        let parentCommentObj = data.comments.find(x => x.id == parentCommentId);

        let replyObj = parentCommentObj.replies.find(x => x.id == postId);
        textContent = replyObj.content;
        replyingTo = replyObj.replyingTo;
        postToEditScore = replyObj.score;

    } else {
        postIsReply = false;
        postId = postToEdit.getAttribute('data-post-id');

        // console.log({data});
        let commentObj = data.comments.find(x => x.id == postId);
        textContent = commentObj.content;
        postToEditScore = commentObj.score;
    }


    let editCard = document.createElement('div');
    editCard.classList.add('edit-card');

    let editFormText
    if (postIsReply) {
        editFormText = 
        `<div class="reply-wrapper box grid-container current-user-post" data-current-user-post data-post-id=${parentCommentId} data-reply-id=${postId}>
            <div class="user-info">
                <img src="${data.currentUser.image.png}" class="user-image">
                <div class="user-info__text">
                    <div class="reply-id"></div>
                    <div class="user-name">${data.currentUser.username}</div>
                    <div class="you-tag">you</div>
                    <div class="time-posted">seconds ago</div>
                </div>
            </div>
            <div class="edit-comment">
                <form class="form edit-form update-comment-form" method="dialog" id="update-comment-form">
                    <textarea id="new-comment">@${replyingTo} ${textContent}</textarea>
                    <button class="update-button active" type="submit" data-update-button>UPDATE</button>
                </form>
            </div>
            <div class="score-container">
                <button class="score-upvote score-item active">
                    
                </button>
                <div class="score-number score-item">${postToEditScore}</div>
                <button class="score-downvote score-item active">
                    
                </button>
            </div>
            <div class="interact-buttons">
                <button class="delete-button open-modal-button active">
                    <img src="./images/icon-delete.svg" class="delete-icon">
                    Delete
                </button>
                <button class="edit-button active">
                    <img src="./images/icon-edit.svg" class="edit-icon">
                    Edit
                </button>
            </div>
        </div>`;
    } else {
        editFormText = 
        `<div class="comment-wrapper box grid-container current-user-post" data-current-user-post data-post-id=${postId}>
            <div class="user-info">
                <img src="${data.currentUser.image.png}" class="user-image">
                <div class="user-info__text">
                    <div class="comment-id"></div>
                    <div class="user-name">${data.currentUser.username}</div>
                    <div class="you-tag">you</div>
                    <div class="time-posted">seconds ago</div>
                </div>
            </div>
            <div class="edit-comment">
                <form class="form edit-form update-comment-form" method="dialog" id="update-comment-form">
                    <textarea id="new-comment">${textContent}</textarea>
                    <button class="update-button active" type="submit" data-update-button>UPDATE</button>
                </form>
            </div>
            <div class="score-container">
                <button class="score-upvote score-item active">
                    
                </button>
                <div class="score-number score-item active">${postToEditScore}</div>
                <button class="score-downvote score-item">
                    
                </button>
            </div>
            <div class="interact-buttons">
                <button class="delete-button open-modal-button active">
                    <img src="./images/icon-delete.svg" class="delete-icon">
                    Delete
                </button>
                <button class="edit-button active">
                    <img src="./images/icon-edit.svg" class="edit-icon">
                    Edit
                </button>
            </div>
        </div>`;
    }
    
    editCard.innerHTML = editFormText;
    let parentDiv = postToEdit.parentNode;

    // console.log({parentDiv});

    parentDiv.replaceChild(editCard, postToEdit);
    // console.log({data});

}

const updatePost = (data, postToUpdate) => {
    let x = document.getElementById("update-comment-form");
    let text = "";

    for(let i=0; i<x.length; i++) {
        text += x.elements[i].value;
    }
    // console.log(text);

    let postIsReply
    let postId
    let parentCommentId
    let textContent
    let replyingTo
    let postToEditScore
    if (postToUpdate.hasAttribute('data-reply-id')) {
        postIsReply = true;

        
        parentCommentId = postToUpdate.getAttribute('data-post-id');
        postId = postToUpdate.getAttribute('data-reply-id');

        let parentCommentObj = data.comments.find(x => x.id == parentCommentId);
        let replyObj = parentCommentObj.replies.find(x => x.id == postId);

        replyingTo = replyObj.replyingTo;

        let textContent = text.replace(`@${replyingTo}`, '');

        replyObj.content = textContent;



    } else {
        postIsReply = false;
        postId = postToUpdate.getAttribute('data-post-id');

        let commentObj = data.comments.find(x => x.id == postId);
        commentObj.content = text;


    }

    // console.log({postIsReply});
    // console.log({data});

    loadComments(data);

    

}


const deletePost = (data, postToDelete) => {
    // console.log({postToDelete});




    let postCommentId = postToDelete.getAttribute('data-post-id');
    // console.log({postCommentId});
    let postIsReply = postToDelete.hasAttribute('data-reply-id');
    // console.log({postIsReply});

    let postReplyId
    if (postIsReply) {
        postReplyId = postToDelete.getAttribute('data-reply-id');
    }
    

    let postIndex
    if (postIsReply) {
        let parentCommentObj = data.comments.find(x => x.id == postCommentId);

        postIndex = parentCommentObj.replies.findIndex(x => x.id == postReplyId);
        parentCommentObj.replies.splice(postIndex, 1);
        loadComments(data);

        
    } else {

        postIndex = data.comments.findIndex(x => x.id == postCommentId);
        data.comments.splice(postIndex, 1);
        loadComments(data);

    }

}

const loadComments = ( data ) => {

    commentContainer.innerHTML = "";
    const currentUser = data.currentUser;

    data.comments.forEach(comment => {
        let commentCard = document.createElement('div');
        let userName = comment.user.username;
        let userImage = comment.user.image.png;

        
        commentCard.classList.add('comment-card');

        if (currentUser.username === comment.user.username) {
            // console.log('comment card user= currentuser');
            commentCard.innerHTML =
            `<div class="comment-wrapper box grid-container" id="post" data-post data-post-id=${comment.id} data-current-user-post>
                <div class="user-info">
                    <img src="${comment.user.image.png}" class="user-image">
                    <div class="user-info__text">
                        <div class="comment-id"></div>
                        <div class="user-name">${comment.user.username}</div>
                        <div class="you-tag">you</div>
                        <div class="time-posted">${comment.createdAt}</div>
                    </div>
                </div>
                <div class="message-content">${comment.content}</div>
                <div class="score-container" data-score-container>
                    <button class="score-upvote score-item active" data-upvote>
                        
                    </button>
                    <div class="score-number score-item" data-score-number>${comment.score}</div>
                    <button class="score-downvote score-item active" data-downvote>
                        
                    </button>
                </div>
                <div class="interact-buttons">
                    <button class="delete-button open-modal-button active">
                        <img src="./images/icon-delete.svg" class="delete-icon">
                        Delete
                    </button>
                    <button class="edit-button active" data-edit-button>
                        <img src="./images/icon-edit.svg" class="edit-icon">
                        Edit
                    </button>
                </div>
            </div>`;


        } else {

            commentCard.innerHTML =
            `<div class="comment-wrapper box grid-container" id="post" data-post data-post-id=${comment.id}>
                <div class="user-info">
                    <img src="${comment.user.image.png}" class="user-image">
                    <div class="user-info__text">
                        <div class="comment-id"></div>
                        <div class="user-name">${comment.user.username}</div>
                        <div class="time-posted">${comment.createdAt}</div>
                    </div>
                </div>
                <div class="message-content">${comment.content}</div>
                <div class="score-container" data-score-container>
                    <button class="score-upvote score-item active" data-upvote>
                        
                    </button>
                    <div class="score-number score-item" data-score-number>${comment.score}</div>
                    <button class="score-downvote score-item active" data-downvote>
                        
                    </button>
                </div>
                <button class="reply-button active" data-reply-button>
                    <img src="./images/icon-reply.svg" class="reply-icon">
                    Reply
                </button>
            </div>`;

        }
        
        commentContainer.appendChild(commentCard);

        loadReplies(comment, currentUser);
    })
}

const loadReplies = (comment, currentUser) => {
    console.log('in loadReplies')
    comment.replies.forEach(reply => {
        let replyCard = document.createElement('div');

        replyCard.classList.add('reply-card');

        if (currentUser.username === reply.user.username) {
            replyCard.innerHTML = 
            `<div class="reply-wrapper box grid-container current-user-post" data-current-user-post data-post-id=${comment.id} data-reply-id=${reply.id}>
                <div class="user-info">
                    <img src="${reply.user.image.png}" class="user-image">
                    <div class="user-info__text">
                        <div class="reply-id"></div>
                        <div class="user-name">${reply.user.username}</div>
                        <div class="you-tag">you</div>
                        <div class="time-posted">${reply.createdAt}</div>
                    </div>
                </div>
                <div class="message-content">
                    <span class="replying-to">@${reply.replyingTo}</span>
                    <span class="reply-content">${reply.content}</span>
                </div>
                <div class="score-container">
                    <button class="score-upvote score-item active">
                        
                    </button>
                    <div class="score-number score-item">${reply.score}</div>
                    <button class="score-downvote score-item active">
                        
                    </button>
                </div>
                <div class="interact-buttons">
                    <button class="delete-button open-modal-button active" data-post-id=${comment.id} data-reply-id=${reply.id}>
                        <img src="./images/icon-delete.svg" class="delete-icon">
                        Delete
                    </button>
                    <button class="edit-button active" data-edit-button>
                        <img src="./images/icon-edit.svg" class="edit-icon">
                        Edit
                    </button>
                </div>
            </div>`;
        } else {
            replyCard.innerHTML = 
            `<div class="reply-wrapper box grid-container" data-post data-post-id=${comment.id} data-reply-id=${reply.id}>
                <div class="user-info">
                    <img src="${reply.user.image.png}" class="user-image">
                    <div class="user-info__text">
                        <div class="reply-id"></div>
                        <div class="user-name">${reply.user.username}</div>
                        <div class="time-posted">${reply.createdAt}</div>
                    </div>
                </div>
                <div class="message-content">
                    <span class="replying-to">@${reply.replyingTo}</span>
                    <span class="reply-content">${reply.content}</span>
                </div>
                <div class="score-container" data-score-container>
                    <button class="score-upvote score-item active" data-upvote>
                        
                    </button>
                    <div class="score-number score-item" data-score-number>${reply.score}</div>
                    <button class="score-downvote score-item active" data-downvote>
                        
                    </button>
                </div>
                <button class="reply-button active" data-reply-button>
                    <img src="./images/icon-reply.svg" class="reply-icon">
                    Reply
                </button>
            </div>`;
        }
        commentContainer.appendChild(replyCard);
    })
}




data.then(data => {
    
    // console.log('at start of data.then');
    loadComments(data);


    const createNewComment = document.querySelector('.send-button');
    const modal = document.querySelector('#modal');

    const closeModal = document.querySelector('.button-cancel-delete');
    const confirmDelete = document.querySelector('.button-confirm-delete');

    let postToDelete

    document.addEventListener('click', e => {
        const isOpenModalButton = e.target.matches('.open-modal-button');
        if (!isOpenModalButton) return;
        postToDelete = e.target.closest("[data-current-user-post]");
        modal.showModal();
    })


    

    closeModal.addEventListener('click', () => {
        console.log('in closeModal');
        modal.close();
    })

    //confirm delete button
    document.addEventListener('click', e => {
        const isConfirmDeleteButton = e.target.matches('.button-confirm-delete');
        if (!isConfirmDeleteButton && e.target.closest(".current-user-post") != null) return;

        // console.log(postToDelete);
        if (isConfirmDeleteButton) {
            // postToDelete = e.target.closest(".current-user-post");
            console.log("isConfirmDeleteButton");
            deletePost(data, postToDelete);
            modal.close();
        }
        // modal.close();
    })


    
    createNewComment.addEventListener('click', () => {
        addNewComment(data);
    });

    //spawn replyForm
    document.addEventListener("click", e => {
        const isSpawnReplyButton = e.target.matches("[data-reply-button]");
        if (!isSpawnReplyButton && e.target.closest("[data-post]") != null) return;

        if (isSpawnReplyButton) {
            let postReplyingTo = e.target.closest("[data-post]");
            spawnReplyInput(data, postReplyingTo);
        }
    })

    //post reply 
    document.addEventListener("click", e => {
        const isPostReplyButton = e.target.matches("[data-post-reply-button");
        if (!isPostReplyButton && e.target.closest(["[data-reply-input-card]"]) != null) return;


        if (isPostReplyButton) {
            let replyCard = e.target.closest("[data-reply-input-card]");

            let postReplyingTo = e.target.closest(".comment-card");
            if (!postReplyingTo) {
                postReplyingTo = e.target.closest(".reply-card");
            }
            // console.log({postReplyingTo});

            addNewReply(data, postReplyingTo);

            // const postReplyButton = document.querySelector('.post-reply-button');

            // postReplyButton.addEventListener("click", () => {
            //     addNewReply(data);
            // })
        }
    })

    //upvote button
    document.addEventListener('click', e => {
        const isUpvoteButton = e.target.matches("[data-upvote]");
        if (!isUpvoteButton && e.target.closest("[data-score-container]") != null) return;

        let scoreContainer
        if (isUpvoteButton) {
            scoreContainer = e.target.closest("[data-score-container]");
            let scoreNumber = scoreContainer.querySelector('.score-number');

            let postScore = parseInt(scoreNumber.textContent);
            postScore += 1;
            scoreNumber.textContent = postScore;
        }
    })

    //downvote button
    document.addEventListener('click', e => {
        const isDownvoteButton = e.target.matches("[data-downvote]");
        if (!isDownvoteButton && e.target.closest("[data-score-container]") != null) return;

        let scoreContainer
        if (isDownvoteButton) {
            scoreContainer = e.target.closest("[data-score-container]");
            let scoreNumber = scoreContainer.querySelector('.score-number');

            let postScore = parseInt(scoreNumber.textContent);
            if (postScore > 0) {
                postScore -= 1;
            }
            
            scoreNumber.textContent = postScore;
        }
    })

    //edit button
    document.addEventListener("click", e => {
        const isEditButton = e.target.matches("[data-edit-button]");
        if (!isEditButton && e.target.closest("[data-current-user-post]") != null) return;

        let postToEdit
        if (isEditButton) {
            postToEdit = e.target.closest("[data-current-user-post]");

            

            spawnEditInputCard(data, postToEdit);

        }
    })

    // update button
    document.addEventListener("click", e => {
        const isUpdateButton = e.target.matches("[data-update-button]");
        if (!isUpdateButton && e.target.closest("[data-current-user-post]") != null) return;

        let postToUpdate
        if (isUpdateButton) {
            postToUpdate = e.target.closest("[data-current-user-post]");

            updatePost(data, postToUpdate);


        }
    })

})

