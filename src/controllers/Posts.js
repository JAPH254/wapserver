import sql from 'mssql';
import config from '../dbase/config.js';
// fetching all my posts
export const fetchPosts = async (req, res) => {
    try {
        let connectionstate = await sql.connect(config.sql);
        const result = await connectionstate.request().query("SELECT * FROM Posts");
        res.status(200).json(result.recordset);
        
    } catch (error) {
        res.status(201).json({ error: 'Error while Posting' });
    } finally {
        sql.close(); 
    }
};

//fetch a single post
export const fetchPost = async (req, res) => {
    try {
        const {PostID} = req.params;
        let connectionstate = await sql.connect(config.sql);
        const result = await connectionstate.request()
            .input("PostID", sql.Int, PostID)
            .query("SELECT * FROM Posts WHERE PostID=@PostID");
        res.status(200).json(result.recordset[0]);
    } catch (error) {
        res.status(500).json({ error: 'error while retrieving a post' });
    } finally {
        sql.close();
    }
};

// creating a new post
export const createPost = async (req, res) => {
    try {
        const {Content} = req.body;
        let connectionstate = await sql.connect(config.sql);
        let addPost = await connectionstate.request()
            .input("Content",sql.Text, Content) // Insert the content into the query
            .query("INSERT INTO Posts (Content) VALUES (@Content)"); // Execute the SQL query
        res.status(201).json({ message: 'Posted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error while posting' });
    } finally {
        sql.close();   // Close the SQL connection
    }
};
// update your post
export const updatePost = async (req, res) => {
    try {
        const {PostID} = req.params;
        const {Content} = req.body;
        let connectionstate = await sql.connect(config.sql);
        await connectionstate.request()
            .input("PostID", sql.Int, PostID)
            .input("Content", sql.Text, Content)
            .query("UPDATE Posts SET Content = @Content WHERE PostID = @PostID");
        res.status(200).json({ message: 'Post updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the post' });
    } finally {
        sql.close();
    }
};
// // Delete a post
export const deletePost = async (req, res) => {
    try {
        const {PostID} = req.params;
        await sql.connect(config.sql);
        await sql.query`DELETE FROM Posts WHERE PostID = ${PostID}`;
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error while deleting Post' });
    } finally {
        sql.close();
    }
};