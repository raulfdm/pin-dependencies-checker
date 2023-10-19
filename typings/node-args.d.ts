declare module 'node-args' {
  declare const additional: string[];
  declare const _: string[];

  declare const devDeps: boolean | undefined;
  declare const deps: boolean | undefined;
  declare const peerDeps: boolean | undefined;
  declare const optionalDeps: boolean | undefined;
}
