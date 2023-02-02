import { useState } from "react";
import Button from "@cloudscape-design/components/button";
import Header from "@cloudscape-design/components/header";
import Input from "@cloudscape-design/components/input";
import SpaceBetween from "@cloudscape-design/components/space-between";
import AppLayout from  "@cloudscape-design/components/app-layout";
import { SignOut } from "@aws-amplify/ui-react";

export interface AppProps {
  signOut?: SignOut;
};

function App({ signOut }: AppProps) {
  const [value, setValue] = useState("");
  
  return (
    <AppLayout
      content={
        <SpaceBetween size="s">
          <Header
            variant="h1"
            actions={
              signOut && <Button key={"signout"} onClick={signOut}>Sign out</Button>
            }
          >IoT Application</Header>

          <span>Start editing to see some magic happen</span>
          <Input
            value={value}
            onChange={(event) => setValue(event.detail.value)}
          ></Input>
          <Button variant="primary">Click me</Button>
        </SpaceBetween>
      }
      navigationHide={true}
      toolsHide={true}
    />
  );
}

export default App;
