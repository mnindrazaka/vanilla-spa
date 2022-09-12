const Root = {
  state: {
    items: [],
    inputValue: "",
    error: null,
    loading: false,
  },

  didUpdate(prevState, nextState) {
    if (prevState.inputValue !== nextState.inputValue) {
      if (nextState.inputValue === "") {
        this.setState({ items: [] });
      } else {
        this.send({ type: "FETCH" });
        fetch(
          `https://api.github.com/search/repositories?q=${this.state.inputValue}`
        )
          .then((res) => res.json())
          .then((res) =>
            this.send({ type: "FETCH_SUCCESS", payload: { items: res.items } })
          )
          .catch(() =>
            this.send({
              type: "FETCH_ERROR",
              payload: { error: "Something went wrong" },
            })
          );
      }
    }
  },

  reducer(prevState, action) {
    switch (action.type) {
      case "FETCH": {
        return {
          ...prevState,
          loading: true,
        };
      }
      case "FETCH_SUCCESS": {
        return {
          ...prevState,
          error: null,
          items: action.payload.items,
          loading: false,
        };
      }
      case "FETCH_ERROR": {
        return {
          ...prevState,
          error: action.payload.error,
          items: [],
          loading: false,
        };
      }
      case "CHANGE_INPUT": {
        return {
          ...prevState,
          inputValue: action.payload.inputValue,
        };
      }
      default: {
        return prevState;
      }
    }
  },

  send(action) {
    const newState = this.reducer(this.state, action);
    this.setState(newState);
  },

  setState(newState) {
    const prevState = { ...this.state };
    const nextState = { ...prevState, ...newState };
    this.state = nextState;

    this.render(App);

    this.didUpdate(prevState, nextState);
  },

  render(App) {
    const root = document.getElementById("root");
    const app = App();

    const focusedElementId = document.activeElement.id;
    const focusedElementSelectionStart = document.activeElement.selectionStart;
    const focusedElementSelectionEnd = document.activeElement.selectionEnd;

    root.innerHTML = "";
    root.append(app);

    if (focusedElementId) {
      const focusedElement = document.getElementById(focusedElementId);
      focusedElement.focus();
      focusedElement.selectionStart = focusedElementSelectionStart;
      focusedElement.selectionEnd = focusedElementSelectionEnd;
    }
  },
};

function Input() {
  const handleInput = (event) => {
    Root.send({
      type: "CHANGE_INPUT",
      payload: { inputValue: event.target.value },
    });
  };

  const inputElement = document.createElement("input");
  inputElement.id = "input";
  inputElement.type = "text";
  inputElement.value = Root.state.inputValue;
  inputElement.oninput = handleInput;

  const labelElement = document.createElement("label");
  labelElement.append("Enter Repo Name :");
  labelElement.append(inputElement);

  return labelElement;
}

function TextPreview() {
  const paragraphElement = document.createElement("p");
  paragraphElement.textContent = Root.state.inputValue;
  return paragraphElement;
}

function Items() {
  const children = Root.state.items.map((item) => {
    const paragraphElement = document.createElement("p");
    paragraphElement.textContent = item.full_name;
    return paragraphElement;
  });

  const container = document.createElement("div");
  container.append(...children);
  return container;
}

function Loading() {
  const paragraphElement = document.createElement("p");
  paragraphElement.textContent = "Loading...";
  return paragraphElement;
}

function EmptyItems() {
  const paragraphElement = document.createElement("p");
  paragraphElement.textContent = "You don't have any items";
  return paragraphElement;
}

function App() {
  const input = Input();
  const text = TextPreview();
  const items = Items();
  const emptyItems = EmptyItems();
  const loading = Loading();
  const container = document.createElement("div");
  container.append(input);
  container.append(text);
  container.append(
    Root.state.loading
      ? loading
      : Root.state.items.length > 0
      ? items
      : emptyItems
  );
  return container;
}

Root.render(App);
