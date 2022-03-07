const localStorageKey = 'isLightmode'
const bodyElement = document.body;
const textareaElement = document.querySelector('textarea');
const userPosts = document.getElementsByClassName('card my-3');

function getValue() {
  const result = localStorage.getItem(localStorageKey);
  return result === "true";
}

function updateUserPosts(isLightmode) {
  const darkmodeStyle = "card my-3 bg-secondary text-white";
  const lightmodeStyle = "card my-3"
  for (let i = 0; i < userPosts.length; i++) {
    if (userPosts[i].className === darkmodeStyle && isLightmode) {
      userPosts[i].className = lightmodeStyle;
    } else if (userPosts[i].className === lightmodeStyle && !isLightmode) {
      userPosts[i].className = darkmodeStyle;
    }
  }
}

function setDarkmode() {
  bodyElement.className = "container bg-dark text-white";
  textareaElement.className = "form-control bg-secondary text-white";
}

function setLightmode() {
  bodyElement.className = "container";
  textareaElement.className = "form-control";
}

function toggle() {
  const isLightmode = getValue();
  localStorage.setItem(localStorageKey, !isLightmode);
  if (isLightmode) {
    setDarkmode();
  } else {
    setLightmode();
  }
  updateUserPosts(!isLightmode);
}

function init() {
  if (!getValue()) {
    updateUserPosts(false);
    setDarkmode();
  }
}