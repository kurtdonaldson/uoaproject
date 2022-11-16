const SQL = require("sql-template-strings");
// const dbPromise = require("./databasepg.js");
const client = require("./databasepg.js");
const fs = require("fs");

//Add a new blog
async function newBlog(authorId, content, imageUrl, blogTitle) {
  const db = await client;

  const blog = await db.query(SQL`
            insert into public.blog (authorId, content, image_url, blog_title) values (${authorId}, ${content}, ${imageUrl}, ${blogTitle})`);

  return blog;
}

//Show a current users blogs
async function myBlogs(userId) {
  const db = await client;

  return await db.query(SQL`
        select blog.blog_title, blog.created_at,blog.content, blog.image_url, blog.id, users.name
        from public.blog
        left join users on blog.authorId = users.id
        where blog.authorId=${userId}
        order by created_at desc;`);
}

//Show all blogs. We do descending so blogs are shown in order they were created
async function allBlogs() {
  const db = await client;

  return await db.query(SQL`
        select blog.blog_title, blog.created_at, blog.content, blog.image_url, blog.id, blog.authorId, users.name
        from public.blog
        left join users on blog.authorId = users.id
        order by created_at desc`);
}

// Delete a blog
async function deleteBlog(blogId) {
  const db = await client;

  return await db.query(SQL`delete from public.blog where id = ${blogId};`);
}

//Find a single blog
async function findOneBlog(blogId) {
  const db = await client;

  return await db.query(SQL`
  select blog_title, image_url, content, id, authorId
  from public.blog
  where id = ${blogId};`);
}

//Edit a blog
async function editBlog(blogId, blogTitle, content, imageUrl) {
  const db = await client;

  return await db.query(SQL`
  update public.blog
  set blog_title = ${blogTitle}, image_url = ${imageUrl}, content = ${content}
  where id=${blogId};`);
}

//Remove uploaded documents
function removeUploadedDocument (fileName){
  const removeUploadExcel = './public/uploads/' + fileName;
  fs.unlink(removeUploadExcel, (err) => {
    if (err) {
      console.error(err)
      return
    }    
    //file removed
  });
}

module.exports = {
  newBlog,
  allBlogs,
  myBlogs,
  deleteBlog,
  findOneBlog,
  editBlog,
  removeUploadedDocument,
};
