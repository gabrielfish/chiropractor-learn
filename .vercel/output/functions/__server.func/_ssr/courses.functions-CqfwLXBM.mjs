import { c as createSsrRpc } from "./createSsrRpc-Bc62EJ78.mjs";
import { a as createServerFn } from "./server-BomfFVcN.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-dN1VnyDc.mjs";
import { o as objectType, a as arrayType, e as enumType, s as stringType, n as numberType } from "../_libs/zod.mjs";
const lessonSchema = objectType({
  id: stringType().uuid().nullable(),
  title: stringType().trim().min(1).max(200),
  description: stringType().trim().max(2e3).nullable().optional(),
  content_type: enumType(["video", "pdf", "text"]),
  video_url: stringType().trim().max(2e3).nullable().optional(),
  pdf_url: stringType().trim().max(2e3).nullable().optional(),
  text_content: stringType().trim().max(5e4).nullable().optional(),
  order_index: numberType().int().min(0)
});
const moduleSchema = objectType({
  id: stringType().uuid().nullable(),
  title: stringType().trim().min(1).max(200),
  description: stringType().trim().max(2e3).nullable().optional(),
  order_index: numberType().int().min(0),
  lessons: arrayType(lessonSchema)
});
const saveCourseSchema = objectType({
  id: stringType().uuid().nullable(),
  title: stringType().trim().min(1).max(300),
  description: stringType().trim().max(5e3).nullable().optional(),
  thumbnail_url: stringType().trim().max(2e3).nullable().optional(),
  category_id: stringType().uuid().nullable().optional(),
  display_author_name: stringType().trim().max(120).nullable().optional(),
  status: enumType(["draft", "published"]),
  modules: arrayType(moduleSchema)
});
const deleteCourseSchema = objectType({
  id: stringType().uuid()
});
const saveCourse = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => saveCourseSchema.parse(input)).handler(createSsrRpc("303b702e8ad651844f252c7c77d8a1cdb39da0b55118d0aeba8a89d87a861e47"));
const listAdminCourses = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("132dd310d19cf0eec5e5ecf14ec409903610a795ec02ff8bf96fdbca9bd1ea77"));
const deleteCourse = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => deleteCourseSchema.parse(input)).handler(createSsrRpc("398a5874789098e47ced66f8e6b8370109c861aefb975c8725f6a6aa92e62ea2"));
export {
  deleteCourse as d,
  listAdminCourses as l,
  saveCourse as s
};
