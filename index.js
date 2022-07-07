const form = document.getElementById("form");
const formInput = document.getElementById("form__input");
const formMessage = document.getElementById("form__message");
const formResult = document.getElementById("form__result");

const onInputValueChange = () => {
  if (inputValue === "") {
    setItems([]);
  } else {
    fetch(`https://api.github.com/search/repositories?q=${inputValue}`)
      .then((res) => res.json())
      .then((res) => setItems(res.items));
  }
};

const render = () => {
  formInput.value = inputValue;
  formMessage.innerText = inputValue;
  formResult.innerHTML = items
    .map((item) => `<p>${item.full_name}</p>`)
    .join("");
};

let items = [];
const setItems = (newItems) => {
  items = newItems;
  render();
};

let inputValue = "";
const setInputValue = (newInputvalue) => {
  inputValue = newInputvalue;
  render();
  onInputValueChange();
};

formInput.addEventListener("input", (event) => {
  setInputValue(event.target.value);
});
