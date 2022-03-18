/**
 * Logs arguments to the console.
 * / ! \ Must be applied before any other decorators.
 */
export function LogArgs(markerName?: string, disabled: boolean = false) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor): any => {
    const originalMethod: (...args: any[]) => any = descriptor.value;

    if (disabled) {
      return descriptor;
    }

    descriptor.value = function (...args: any[]): any {
      console.log(`--- START ${markerName || propertyKey} ---`);
      console.log({ args });
      console.log(`--- END ${markerName || propertyKey} ---`);
      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
}
