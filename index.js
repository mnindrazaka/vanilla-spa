const Root = {
  state: {
    tag: "empty",
    items: [],
    inputValue: "",
    error: null,
  },

  didUpdate(prevState, nextState) {
    switch (nextState.tag) {
      case "loading": {
        if (nextState.inputValue === "") {
          this.send({ type: "FETCH_EMPTY" });
        } else {
          fetch(
            `https://api.github.com/search/repositories?q=${this.state.inputValue}`
          )
            .then((res) => res.json())
            .then((res) => {
              if (res.items.length > 0) {
                this.send({
                  type: "FETCH_SUCCESS",
                  payload: { items: res.items },
                });
              } else {
                this.send({ type: "FETCH_EMPTY" });
              }
            })
            .catch(() =>
              this.send({
                type: "FETCH_ERROR",
                payload: { error: "Something went wrong" },
              })
            );
        }
      }
      case "empty":
      case "loaded":
      case "error":
      default: {
      }
    }
  },

  reducer(prevState, action) {
    switch (prevState.tag) {
      case "empty": {
        switch (action.type) {
          case "CHANGE_INPUT":
            return {
              ...prevState,
              tag: "loading",
              inputValue: action.payload.inputValue,
            };
          default:
            return prevState;
        }
      }
      case "loaded": {
        switch (action.type) {
          case "CHANGE_INPUT":
            return {
              ...prevState,
              tag: "loading",
              inputValue: action.payload.inputValue,
            };
          default:
            return prevState;
        }
      }
      case "loading": {
        switch (action.type) {
          case "FETCH_EMPTY": {
            return {
              ...prevState,
              tag: "empty",
              items: [],
              error: null,
            };
          }
          case "FETCH_SUCCESS":
            return {
              ...prevState,
              tag: "loaded",
              items: action.payload.items,
              error: null,
            };
          case "FETCH_ERROR":
            return {
              ...prevState,
              tag: "error",
              items: [],
              error: action.payload.error,
            };
          case "CHANGE_INPUT":
            return {
              ...prevState,
              tag: "loading",
              inputValue: action.payload.inputValue,
            };
          default:
            return prevState;
        }
      }
      case "error": {
        switch (action.type) {
          case "CHANGE_INPUT":
            return {
              ...prevState,
              tag: "loading",
              inputValue: action.payload.inputValue,
            };
          default:
            return prevState;
        }
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

function ErrorView() {
  const paragraphElement = document.createElement("p");
  paragraphElement.textContent = Root.state.error;
  return paragraphElement;
}

function App() {
  const input = Input();
  const text = TextPreview();
  const items = Items();
  const emptyItems = EmptyItems();
  const errorView = ErrorView();
  const loading = Loading();
  const container = document.createElement("div");
  container.append(input);
  container.append(text);

  switch (Root.state.tag) {
    case "loading":
      container.append(loading);
      break;
    case "loaded":
      container.append(items);
      break;
    case "empty":
      container.append(emptyItems);
      break;
    case "error":
      container.append(errorView);
      break;
    default: {
    }
  }

  return container;
}

Root.render(App);
