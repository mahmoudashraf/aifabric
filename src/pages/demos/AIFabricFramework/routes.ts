export const AI_SHOPPING_EXPERIENCE_ROUTE = "/demos/ai-shopping-experience";
export const LEGACY_AI_FABRIC_FRAMEWORK_ROUTE = "/demos/ai-fabric-framework";
export const AI_SHOPPING_EXPERIENCE_ABOUT_ROUTE = `${AI_SHOPPING_EXPERIENCE_ROUTE}/about`;
export const LEGACY_AI_FABRIC_FRAMEWORK_ABOUT_ROUTE = `${LEGACY_AI_FABRIC_FRAMEWORK_ROUTE}/about`;

export function shoppingProductRoute(productId: string | number) {
  return `${AI_SHOPPING_EXPERIENCE_ROUTE}/product/${productId}`;
}
