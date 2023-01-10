const deleteBtn = document.querySelectorAll(".delete-btn-myblog");
const editBtn = document.querySelectorAll(".edit-btn-myblog");
const registerBtn = document.querySelector("#registerBtn");
const userName = document.querySelector("#registerUsername");
const userExistsValue = document.querySelector("#userExistsValue");
const registerUsernameInput = document.querySelector("#registerUsername");
const reEnterPasswordInput = document.querySelector("#reEnterPassword");
const registerPasswordInput = document.querySelector("#registerPassword");
const passwordExistsSpan = document.querySelector("#passwordExistsValue");
const blogTitles = document.querySelectorAll("#blogTitle");
const blogAuthors = document.querySelectorAll("#authors");
const blogContent = document.querySelectorAll("#content");

const modalFunction = document.querySelectorAll(".modal-button");
let modal = document.querySelectorAll("#my-modal");
const hAuthID = document.querySelector("#authID");
const hTitle = document.querySelector("#title");
const hDate = document.querySelector("#date");
let btn = document.querySelector(".button");
let hideModalBtn = document.querySelector("#close-modal");
let hideModalBottomBtn = document.querySelector("#modal-close-bottom");
const main = document.querySelector("main");
const blogs = document.querySelectorAll(".blogs");
const blogSearch = document.querySelector("#blogSearch");

const filterBlogsSelector = document.querySelector("#filterBlogs");

// Burger menu function
const burgerMenuContainer = document.querySelector(".burger-menu-container");
const burgerIcon = document.querySelector(".hamburger1");
const burgerIconChecked = document.querySelector("#toggle1");

burgerIcon.addEventListener("click", function () {
  if (burgerIconChecked.checked == false) {
    burgerMenuContainer.style.marginTop = "-20px";
  } else {
    burgerMenuContainer.style.marginTop = "-500px";
  }
});

// document.querySelector('#modalFunction').addEventListener("click",displa)
//I need to add and remove the event handler. Could do keydown keyp functions. keydown on, key up off. Remove event listner
//Function to check if username already exists. Using keyup function. Everytime a letter is typed, a fetch req is sent to server to see if usernames exists
//We remove and add the disabled attribute to the submit button to prevent client side submssion of a username that is already used
if (userName != null) {
  userName.addEventListener("keyup", async function () {
    await fetch("/usernames", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: userName.value }),
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (res) {
        userExistsValue.innerHTML = res.userExists;
        if (userExistsValue.innerHTML == "Username already exists") {
          registerUsernameInput.classList.add("error-input");
          registerBtn.setAttribute("disabled", "true");
        } else {
          registerUsernameInput.classList.remove("error-input");
          registerBtn.removeAttribute("disabled", "true");
        }
      });
  });
}

//Validation for re entering password. Check that input values in both inputs match. If not, submit button disabled
if (reEnterPasswordInput != null) {
  reEnterPasswordInput.addEventListener("keyup", function () {
    if (reEnterPasswordInput.value != registerPasswordInput.value) {
      passwordExistsSpan.innerHTML = "Password does not match";
      reEnterPasswordInput.classList.add("error-input");
      registerBtn.setAttribute("disabled", "true");
    } else {
      passwordExistsSpan.innerHTML = "Password matches";
      reEnterPasswordInput.classList.remove("error-input");
      registerBtn.removeAttribute("disabled", "true");
    }
  });
}

//Event listener to handle delete. We loop through all the delete buttons. The value of the delete buttons will equal the blogId of the blog they are on.
//We then send a fetch request to the back with that blogId to let the route handler and delete function know which blog to delete.
for (const button of deleteBtn) {
  button.addEventListener("click", function (e) {
    const confirmDelete = confirm(`Are you sure you want to delete this blog?`);
    if (confirmDelete) {
      fetch(`/deleteBlog`, {
        method: "delete",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blogId: e.target.value,
        }),
      })
        .then(function (res) {
          if (res.ok) return res.json();
        })
        .then(function () {
          window.location.reload();
        });
    }
  });
}

// MODAL FUNCTION

// Function to fetch the data for the modal popup - from readMore
async function fetchAndDisplayModal(event) {
  const response = await fetch(`/modal`, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      blogId: event.target.value,
    }),
  })
    .then(function (res) {
      if (res.ok) return res.json();
    })

    .then(function (res) {
      const hTitle = document.querySelector("#title");
      const hDate = document.querySelector("#date");
      const hImage = document.querySelector("#image");
      const hContent = document.querySelector("#content");
      const hIcon = document.querySelector("#icon");
      const hAuthor = document.querySelector("#author");

      hTitle.innerHTML = res.blog_title;
      hIcon.src = res.avatariconurl;
      hImage.src = res.image_url;
      hAuthor.innerHTML = res.name;
      hDate.innerHTML = res.created_at;
      hContent.innerHTML = res.content;
    });
}

// Funcion for the modal to pop-up when Read More is clicked.
async function showModal(event) {
  let x = event.target;
  fetchAndDisplayModal(event);
  let modal = document.querySelector(".modal");
  let btn = document.querySelector(".button");
  modal.style.display = "block";
  btn.style.display = "none";
}
// Funcion for the modal to close when x button is clicked.
async function hideModal(event) {
  let modal = document.querySelector(".modal");
  let btn = document.querySelector(".button");
  modal.style.display = "none";
  btn.style.display = "block";
}

//event listener for opening and closing modal by calling corresponding function
for (const button of modalFunction) {
  button.addEventListener("click", showModal);
  hideModalBtn.addEventListener("click", hideModal);
  hideModalBottomBtn.addEventListener("click", hideModal);
}

//LIVE SEARCHBAR
if (blogSearch) {
  blogSearch.addEventListener("keyup", function () {
    const filterValue = blogSearch.value.toLowerCase();
    blogs.forEach((blog) => {
      blog.style.display = "none";
      const blogDetails = blog.dataset.value.toLowerCase();
      const wordsArray = blogDetails.split(",");
      for (let i = 0; i < wordsArray.length; i++) {
        if (wordsArray[i].includes(filterValue)) {
          blog.style.display = "block";
        }
      }
    });
  });
}

// View my blogs button function
filterBlogsSelector.addEventListener("click", function () {
  // console.log(filterBlogsSelector.value);

  blogs.forEach((blog) => {
    const blogAuthorArray = blog.dataset.value.split(",");
    const blogAuthorName = blogAuthorArray[0];
    // console.log(blogAuthorName);
    if (filterBlogsSelector.value == "all") {
      blog.style.display = "block";
    } else if (filterBlogsSelector.value != blogAuthorName) {
      blog.style.display = "none";
    } else {
      blog.style.display = "block";
    }
  });
});

// Event listener for dark moode

var darkMode = false;

// default to system setting
if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  darkMode = true;
}

// preference from localStorage should overwrite
if (localStorage.getItem("theme") === "dark") {
  darkMode = true;
} else if (localStorage.getItem("theme") === "light") {
  darkMode = false;
}

if (darkMode) {
  document.body.classList.toggle("dark");
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("theme-toggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem(
      "theme",
      document.body.classList.contains("dark") ? "dark" : "light"
    );
  });
});
