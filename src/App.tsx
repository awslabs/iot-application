import { useState } from "react";
import Button from "@cloudscape-design/components/button";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import Input from "@cloudscape-design/components/input";
import SpaceBetween from "@cloudscape-design/components/space-between";

import logger from "./services/logger";

function App() {
  const [value, setValue] = useState("");

  logger.log("app started");

  return (
    <SpaceBetween size="m">
      <Header variant="h1">Centurion</Header>

      <Container>
        <SpaceBetween size="s">
          <span>Start editing to see some magic happen</span>
          <Input
            value={value}
            onChange={(event) => setValue(event.detail.value)}
          ></Input>
          <Button variant="primary">Click me</Button>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}

export default App;
