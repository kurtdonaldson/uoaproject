-- Run this script to create or re-initialize the database.
drop table if exists blog;
drop table if exists users;



create table users (
    id integer not null primary key,
    username varchar(64) unique not null,
    password varchar(64) not null,
    name varchar(64),
	email varchar(64),
	dob varchar(64),
	avatarIconUrl varchar(256),
	description varchar(256),
    authToken varchar(128),
	passwordToken varchar(256) DEFAULT NULL,
	expiration datetime DEFAULT NULL,
	createdAt datetime DEFAULT NULL,
	updateAt datetime DEFAULT NULL,
	used int(11) NOT NULL DEFAULT '0'
);

CREATE TABLE blog (
	id INTEGER NOT NULL PRIMARY KEY,
	blog_title VARCHAR(64),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	image_url VARCHAR(256),
	content BLOB,
	authorId INTEGER NOT NULL,
	FOREIGN KEY (authorId) REFERENCES users(id)
);

insert into users (id, username, password, name, email, dob, description, avatarIconUrl) values
    (1, 'Polly', '$2b$12$9jPtwJdf6zWxToOv7aJ8wugh4ZpmobIqyApS7K.j0zfALy9R1oCY2', 'Polly', 'polly@gmail.com', '1948-09-02', 'I am too old for this sheeee. This is just great', '/icons/pikachu.png'),
	(2, 'Kurt', '$2b$12$JYH5qlijnzGgpI4KaNA3A.OgIERg3Q8vWHv29taqVUGZwryPtzr2q', 'Kurt', 'kurt@gmail.com', '1988-01-08', 'I love to code', '/icons/dratini.png'),
	(3, 'Nicola', '$2b$12$Dz2FDAK9ZyrecQGtsm7xqOSHOvz1Ycy3k5C8SDlefrDqacN7mFRh.', 'Nicola', 'nic@gmail.com', '1982-04-08', 'I cannot think of what to say next', '/icons/bullbasaur.png');
	
insert into blog (created_at, blog_title, content, authorId, image_url) values
	(datetime('now'), 'My big story', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Id diam maecenas ultricies mi eget mauris pharetra et. Sagittis eu volutpat odio facilisis mauris sit.', 2, "https://i.natgeofe.com/k/63b1a8a7-0081-493e-8b53-81d01261ab5d/red-panda-full-body_4x3.jpg"),
	(datetime('now'), 'My other big story', 'Et malesuada fames ac turpis egestas. Dolor magna eget est lorem ipsum dolor sit amet consectetur. Diam vulputate ut pharetra sit amet aliquam. Morbi tincidunt ornare massa eget. Id ornare arcu odio ut sem nulla pharetra diam. Nunc congue nisi vitae suscipit tellus mauris a diam maecenas. Integer feugiat scelerisque varius morbi enim nunc faucibus a pellentesque. ', 3, "https://media.wired.com/photos/593261cab8eb31692072f129/master/pass/85120553.jpg"),
	(datetime('now'), 'My big OE', 'Blah blah blah', 2, "https://i.natgeofe.com/k/c02b35d2-bfd7-4ed9-aad4-8e25627cd481/komodo-dragon-head-on_2x1.jpg"),
	(datetime('now'), 'My life story', 'Magna fermentum iaculis eu non diam phasellus vestibulum. Euismod elementum nisi quis eleifend quam adipiscing. Accumsan tortor posuere ac ut consequat semper. Sit amet facilisis magna etiam tempor orci eu lobortis elementum. Semper viverra nam libero justo laoreet sit amet. Mi ipsum faucibus vitae aliquet nec ullamcorper sit amet risus. Volutpat blandit aliquam etiam erat velit.', 2, "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/hippopotamus-extreme-animals-social-1642555668.jpg?crop=1.00xw:1.00xh;0,0&resize=1200:*"),
	(datetime('now'), 'Next Chapter in my life', 'rtyuertyretyretyerty', 1, "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Giant_Panda_2004-03-2.jpg/1200px-Giant_Panda_2004-03-2.jpg"),
	(datetime('now'), 'My second big story', 'That is bloody good! Thanks!', 1, "https://a-z-animals.com/media/tiger_laying_hero_background.jpg");