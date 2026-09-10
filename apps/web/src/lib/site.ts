/** Client-safe site constants — re-exports from the shared theme package.
 *  Never import node:* modules here; this file is used by client components. */
export { SITE, WEB_ROUTES, DOCS_ROUTES, docsUrl, webUrl } from "@niki/theme/site";
