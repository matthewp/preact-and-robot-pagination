import {
  createMachine,
  immediate,
  interpret,
  invoke,
  reduce,
  state,
  transition
} from "robot3";
import { h, Component, render } from "preact";
//import { useMachine } from "preact-robot";
import getUserNames from "./get-user-names.js";

const paginate = by => reduce((ev, ctx) => ({ ...ctx, page: ctx.page + by }));

const loadUsers = async ctx => {
  let names = await getUserNames(ctx.page);
  return names;
};

const machine = createMachine(
  {
    boot: state(immediate("loading")),
    idle: state(
      transition("forward", "loading", paginate(1)),
      transition("back", "loading", paginate(-1))
    ),
    loading: invoke(
      loadUsers,
      transition(
        "done",
        "idle",
        reduce((ev, ctx) => ({
          ...ctx,
          names: ev.data
        }))
      )
    )
  },
  () => ({ page: 1, names: [] })
);

class App extends Component {
  constructor(...props) {
    super(...props);

    let service = interpret(machine, () => {
      this.setState({
        current: service.machine.state
      });
    });

    this.state = {
      send: service.send,
      service,
      current: service.machine.state
    };
  }

  render() {
    let { current, send, service } = this.state;
    const { names } = service.context;

    return (
      <div className="App">
        <h1>State Machines and Preact</h1>
        <List items={names} />
        <button onClick={() => send("back")}>⇦</button>
        <button onClick={() => send("forward")}>⇨</button>
      </div>
    );
  }
}

const List = ({ items = [], loading = false }) => (
  <ul className={loading ? "loading" : null}>
    {items.map(item => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);

render(<App />, document.querySelector("#app"));
