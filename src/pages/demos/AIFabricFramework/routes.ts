export const AI_SHOPPING_EXPERIENCE_ROUTE = "/demos/ai-shopping-experience";
export const LEGACY_AI_FABRIC_FRAMEWORK_ROUTE = "/demos/ai-fabric-framework";

export function shoppingProductRoute(productId: string | number) {
  return `${AI_SHOPPING_EXPERIENCE_ROUTE}/product/${productId}`;
}
