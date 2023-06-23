import { fetchPosts,createPost, fetchPost, updatePost, deletePost } from "../controllers/Posts.js";
import { login,register,loginRequired } from "../controllers/auth.js";

const routes=(app)=>{
   //posts routes  
   app.route('/posts')
      .get(loginRequired,fetchPosts)
      .post(loginRequired,createPost);
   //posts with id
   app.route('/posts/:PostID')
      .put(loginRequired,updatePost)
      .get(loginRequired,fetchPost)
      .delete(loginRequired,deletePost)
    // auth routes
    app.route('/auth/register')
       .post(register);

    app.route('/auth/login')
       .post(login);
};
export default routes;