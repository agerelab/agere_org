import { inputDocs } from "./inputs";
import { displayDocs } from "./display";
import { navigationDocs } from "./navigation";
import { feedbackDocs } from "./feedback";
import { workspaceDocs } from "./workspace";
import { shadcnDocs } from "./shadcn";
import { shadcnV61Docs } from "./shadcn-v61";
import { shadcnV62Docs } from "./shadcn-v62";
import { shadcnV63Docs } from "./shadcn-v63";
import { v64Docs } from "./v64";
import type { ComponentDoc } from "./types";

export const COMPONENTS: ComponentDoc[] = [...inputDocs, ...displayDocs, ...navigationDocs, ...feedbackDocs, ...shadcnDocs, ...shadcnV61Docs, ...shadcnV62Docs, ...shadcnV63Docs, ...v64Docs, ...workspaceDocs];
export const byId = (id: string) => COMPONENTS.find((c) => c.id === id);
export * from "./types";
