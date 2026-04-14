import { AppRouter } from "./router";
import { SettingsMenu } from "./components/shared/SettingsMenu";

export default function App() {
  return (
    <>
      <AppRouter />
      <SettingsMenu />
    </>
  );
}
