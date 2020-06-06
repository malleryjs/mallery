type Item = {
  id: number;
  title: string;
  path: string;
  hasContent: boolean;
  chapters: any;
};

export const createState = function () {
  return {
    rootUrl: "",
    toc: {
      items: [] as Item[],
      root: [],
      itemId: null as number | null,
      chapterId: null as number | null,
      itemContent: "",
    },
  };
};
