const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const port = 3001;

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", routes);

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});
