import dev from "./dev/dev";
import MainApp from "./app/MainApp";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

library.add(fas);

function App() {
  if (import.meta.env.DEV) dev();

  return <MainApp />;
}

export default App;
