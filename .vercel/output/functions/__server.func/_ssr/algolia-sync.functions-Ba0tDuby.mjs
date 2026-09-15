import { c as createSsrRpc } from "./createSsrRpc-D1HIuwD_.mjs";
import { a as createServerFn } from "./server-DAhjTOZR.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CINWQ1Vb.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
const syncContentToAlgolia = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  contentId: stringType().uuid()
}).parse(input)).handler(createSsrRpc("c778cec3e03861c034f10d7d49762b58e8c414447551211242615b1de6a3f3ac"));
const syncCourseToAlgolia = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  courseId: stringType().uuid()
}).parse(input)).handler(createSsrRpc("96d42b91b17a98c826f92399721f25670ea8f67e8a83a305a4607179d532f874"));
const syncAllToAlgolia = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("c2ac10dbe25b976250d09b5c104bc9513f76da5c835d98ec06845e1d7649591c"));
export {
  syncCourseToAlgolia as a,
  syncAllToAlgolia as b,
  syncContentToAlgolia as s
};
