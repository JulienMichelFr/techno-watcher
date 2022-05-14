/**
 * Logs arguments to the console.
 * / ! \ Must be applied before any other decorators.
 */
export function LogArgs(markerName?: string, disabled: boolean = false) {
  return (target: unknown, propertyKey: string, descriptor: PropertyDescriptor): unknown => {
    const originalMethod: (...args: unknown[]) => unknown = descriptor.value;

    if (disabled) {
      return descriptor;
    }

    descriptor.value = function (...args: unknown[]): unknown {
      console.log(`--- START ${markerName || propertyKey} ---`);
      console.log({ args });
      console.log(`--- END ${markerName || propertyKey} ---`);
      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
}
