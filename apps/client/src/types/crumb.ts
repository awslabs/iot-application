export interface Crumb {
  text: string;
  href: string;
}

export type GetCrumb<T> = (data?: T) => Crumb;

export interface Crumbly<T> {
  crumb: GetCrumb<T>;
}

export type MaybeCrumbly<T> = Partial<Crumbly<T>>;
