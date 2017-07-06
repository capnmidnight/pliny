import ConsoleFormatter from "./ConsoleFormatter";
import HTMLFormatter from "./HTMLFormatter";


const cons = new ConsoleFormatter(),
  html = new HTMLFormatter();

// A collection of different ways to output documentation data.

export default {
  cons: (database, name) => cons.format(database, name),
  html: (database, name) => html.format(database, name),
}
