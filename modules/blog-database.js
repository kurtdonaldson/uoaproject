const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });
const SQL = require("sql-template-strings");
const { Client } = require("pg");

const conectionString = process.env.CONNECTION;

const execute = async (query) => {
  try {
    const client = new Client({
      connectionString: conectionString,
    });
    await client.connect();
    const result = await client.query(query);
    console.log(result);
    await client.end();
  } catch (error) {
    console.error(error.stack);
  }
};

const text = SQL`

DROP TABLE IF EXISTS public.blog CASCADE;
DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    id serial NOT NULL,
    username character varying(64) COLLATE pg_catalog."default" NOT NULL,
    password character varying(128) COLLATE pg_catalog."default" NOT NULL,
    name character varying(64) COLLATE pg_catalog."default",
    email character varying(64) COLLATE pg_catalog."default",
    dob character varying(64) COLLATE pg_catalog."default",
    avatariconurl character varying(256) COLLATE pg_catalog."default",
    description character varying(256) COLLATE pg_catalog."default",
    authtoken character varying(128) COLLATE pg_catalog."default",
    passwordtoken character varying(256) COLLATE pg_catalog."default" DEFAULT NULL::character varying,
    expiration timestamp with time zone,
    createdat timestamp with time zone,
    updateat timestamp with time zone,
    used character varying COLLATE pg_catalog."default" NOT NULL DEFAULT '0'::character varying,
    CONSTRAINT users_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.blog
(
    id serial NOT NULL,
    blog_title character varying(64) COLLATE pg_catalog."default",
    image_url character varying(256) COLLATE pg_catalog."default",
    content bytea,
    authorid integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT blog_pkey PRIMARY KEY (id),
    CONSTRAINT authorid FOREIGN KEY (authorid)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID
);

insert into users (id, username, password, name, email, dob, description, avatariconurl) values
    (1, 'Polly', '$2b$12$9jPtwJdf6zWxToOv7aJ8wugh4ZpmobIqyApS7K.j0zfALy9R1oCY2', 'Polly', 'polly@gmail.com', '1948-09-02', 'I am too old for this sheeee. This is just great', '/icons/pikachu.png'),
	(2, 'Kurt', '$2b$12$JYH5qlijnzGgpI4KaNA3A.OgIERg3Q8vWHv29taqVUGZwryPtzr2q', 'Kurt', 'kurt@gmail.com', '1988-01-08', 'I love to code', '/icons/dratini.png'),
	(3, 'Nicola', '$2b$12$Dz2FDAK9ZyrecQGtsm7xqOSHOvz1Ycy3k5C8SDlefrDqacN7mFRh.', 'Nicola', 'nic@gmail.com', '1982-04-08', 'I cannot think of what to say next', '/icons/bullbasaur.png');

insert into blog (created_at, blog_title, content, authorId, image_url) values
	(now(), 'My big story', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Id diam maecenas ultricies mi eget mauris pharetra et. Sagittis eu volutpat odio facilisis mauris sit.', 2, 'https://i.natgeofe.com/k/63b1a8a7-0081-493e-8b53-81d01261ab5d/red-panda-full-body_4x3.jpg'),
	(now(), 'My other big story', 'Et malesuada fames ac turpis egestas. Dolor magna eget est lorem ipsum dolor sit amet consectetur. Diam vulputate ut pharetra sit amet aliquam. Morbi tincidunt ornare massa eget. Id ornare arcu odio ut sem nulla pharetra diam. Nunc congue nisi vitae suscipit tellus mauris a diam maecenas. Integer feugiat scelerisque varius morbi enim nunc faucibus a pellentesque. ', 3, 'https://media.wired.com/photos/593261cab8eb31692072f129/master/pass/85120553.jpg'),
	(now(), 'My big OE', 'Blah blah blah', 2, 'https://i.natgeofe.com/k/c02b35d2-bfd7-4ed9-aad4-8e25627cd481/komodo-dragon-head-on_2x1.jpg'),
	(now(), 'My life story', 'Magna fermentum iaculis eu non diam phasellus vestibulum. Euismod elementum nisi quis eleifend quam adipiscing. Accumsan tortor posuere ac ut consequat semper. Sit amet facilisis magna etiam tempor orci eu lobortis elementum. Semper viverra nam libero justo laoreet sit amet. Mi ipsum faucibus vitae aliquet nec ullamcorper sit amet risus. Volutpat blandit aliquam etiam erat velit.', 2, 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/hippopotamus-extreme-animals-social-1642555668.jpg?crop=1.00xw:1.00xh;0,0&resize=1200:*'),
	(now(), 'Next Chapter in my life', 'rtyuertyretyretyerty', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Giant_Panda_2004-03-2.jpg/1200px-Giant_Panda_2004-03-2.jpg'),
	(now(), 'My second big story', 'That is bloody good! Thanks!', 1, 'https://a-z-animals.com/media/tiger_laying_hero_background.jpg');

    SELECT setval('users_id_seq', (SELECT MAX(id) FROM public.users));
`;

execute(text).then((result) => {
  if (result) {
    console.log("Table created");
  }
});

module.exports = {
  execute,
};

// Below is for desktop pgadmin4
// const execute = async (query) => {
//     try {
// 		// gets connection
//         const db = await client;
// 		// sends queries
//         const result = await db.query(query);
//         return true;
//     } catch (error) {
//         console.error(error.stack);
//         return false;
//     } finally {
// 		// closes connection
//         await client.end();
//     }
// };
