'use strict';
const pug = require('pug');
const Post = require('./post');
const util = require('./handler-util');

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

async function handle(req, res) {
  switch (req.method) {
    case 'GET':
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8'
      });
      const posts = await Post.findAll({order:[['id', 'DESC']]});
      posts.forEach((post) => {
        post.content = post.content.replace(/\n/g, '<br>');
        post.formattedCreatedAt = dayjs(post.createdAt).tz('Asia/Tokyo').format('YYYY年MM月DD日 HH時mm分ss秒');
      });
      res.end(pug.renderFile('./views/posts.pug', { posts, user: req.user }));
      console.info(
        `閲覧されました: user: ${req.user}, ` +
        `remoteAddress: ${req.socket.remoteAddress}, ` +
        `userAgent: ${req.headers['user-agent']} `
      );
      break;
    case 'POST':
      let body = [];
      req.on('data', (chunk) => {
        body.push(chunk);
      }).on('end', async () => {
        body = Buffer.concat(body).toString();
        const params = new URLSearchParams(body);
        const content = params.get('content');
        console.info(`送信されました: ${content}`);
        await Post.create({
          content,
          postedBy: req.user
        });
        handleRedirectPosts(req, res);
      });
      break;
    default:
      util.handleBadRequest(req, res);
      break;
  }
}

function handleRedirectPosts(req, res) {
  res.writeHead(303, {
    'Location': '/posts'
  });
  res.end();
}

function handleDelete(req, res) {
  switch (req.method) {
    case 'POST':
      let body = [];
      req.on('data', (chunk) => {
        body.push(chunk);
      }).on('end', async () => {
        body = Buffer.concat(body).toString();
        const params = new URLSearchParams(body);
        const id = params.get('id');
        const post = await Post.findByPk(id);
        if (req.user === post.postedBy || req.user === 'admin') {
          await post.destroy();
          console.info(
            `削除されました: user: ${req.user}, ` +
            `remoteAddress: ${req.socket.remoteAddress}, ` +
            `userAgent: ${req.headers['user-agent']} `
          );
          handleRedirectPosts(req, res);
        }
      });
      break;
    default:
      util.handleBadRequest(req, res);
      break;
  }
}

module.exports = {
  handle,
  handleDelete
};