import { FlatNamespace } from "i18next";
import "./src/i18next.d.ts";
type NS = FlatNamespace;
// @ts-expect-error
const x: NS = "NOT_A_NAMESPACE";
