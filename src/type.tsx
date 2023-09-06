export type Id = string | number;
export type Column = {
  id: Id;
  title: String;
};
export type Task = {
  id: Id;
  columnId: Id;
  content: string;
};
