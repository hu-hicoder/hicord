export const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max)
}

export type MyOmit<T, K extends keyof T> = {
  [Key in keyof T as Key extends K ? never : Key]: T[Key]
}
