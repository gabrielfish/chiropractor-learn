import { c as createSsrRpc } from "./createSsrRpc-Bc62EJ78.mjs";
import { a as createServerFn } from "./server-BomfFVcN.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-dN1VnyDc.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
const checkAndIssueCourse = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  courseId: stringType().uuid()
}).parse(input)).handler(createSsrRpc("ca907afd7154926c0643ad4efb0b37c995ebff273cf9f64b283c5fcbfe3959fa"));
const checkAndIssueCategory = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  contentId: stringType().uuid()
}).parse(input)).handler(createSsrRpc("443b7b2b6c237a7e86d2f03f69c45da71ac37428d371c90b7e4ba12a3a2f0e89"));
const getMyCertificates = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("2f6381d8b4aa45f8e1f0857553ceaa9bf61a8ff4b8296eb2a5512f2e6830b70d"));
const debugCourseProgress = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  courseId: stringType().uuid()
}).parse(input)).handler(createSsrRpc("708f5e1b78e2361d479cad50ac70ea32d645b7ce04bc1addcf5a8e44ab5f2b13"));
const getCertificatePublic = createServerFn({
  method: "POST"
}).inputValidator((input) => objectType({
  id: stringType().uuid()
}).parse(input)).handler(createSsrRpc("e96cd38371d9d0f9d9d2de0544899f061ac569b39948ef7d4d6f37fcb0ed4d3d"));
export {
  getMyCertificates as a,
  checkAndIssueCategory as b,
  checkAndIssueCourse as c,
  debugCourseProgress as d,
  getCertificatePublic as g
};
