import { c as createSsrRpc } from "./createSsrRpc-Bc62EJ78.mjs";
import { a as createServerFn } from "./server-BomfFVcN.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-dN1VnyDc.mjs";
import { o as objectType, e as enumType, s as stringType, b as booleanType } from "../_libs/zod.mjs";
const listMembers = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("b7f69ca8c31846e3e8e27a7ded678ada2faeaaaa74d025348bd7d70d7e81d0f1"));
const toggleSchema = objectType({
  userId: stringType().uuid(),
  is_active: booleanType()
});
const setMemberActive = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => toggleSchema.parse(input)).handler(createSsrRpc("76e5caeb85e11253ba2d587d3ed1f43c677355ef05d9c4eac1d046b5da1d49c9"));
const roleSchema = objectType({
  userId: stringType().uuid(),
  role: enumType(["member", "author", "super_admin"])
});
const setUserRole = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => roleSchema.parse(input)).handler(createSsrRpc("562376604b9ca9c8280c3c5611eb443082154e7a89c0f83fcad9b01fb088961f"));
export {
  setMemberActive as a,
  listMembers as l,
  setUserRole as s
};
