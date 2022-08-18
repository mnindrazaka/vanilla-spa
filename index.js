const App = {
  state: {
    items: [],
    inputValue: "",
  },

  didUpdate(prevState, nextState) {
    if (prevState.inputValue !== nextState.inputValue) {
      if (nextState.inputValue === "") {
        this.setState("items", []);
      } else {
        fetch(
          `https://api.github.com/search/repositories?q=${this.state.inputValue}`
        )
          .then((res) => res.json())
          .then((res) => this.setState("items", res.items));
      }
    }
  },

  setState(key, value) {
    const prevState = { ...this.state };

    this.state[key] = value;
    this.render();

    const nextState = this.state;

    this.didUpdate(prevState, nextState);
  },

  render() {
    const root = document.getElementById("root");
    root.innerHTML = `
    <form id="form">
      <label>
        Enter Repo Name :
        <input type="text" id="form__input" value="${this.state.inputValue}" />
      </label>
      <p>${this.state.inputValue}</p>

      <div>
        ${this.state.items.map((item) => `<p>${item.full_name}</p>`).join("")}
      </div>
    </form>
    `;

    const formInput = document.getElementById("form__input");
    formInput.addEventListener("input", (event) => {
      this.setState("inputValue", event.target.value);
    });
  },
};

App.render();
