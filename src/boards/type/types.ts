export interface CreateBoard {
  userId: string;
  imagePath: string;
  title: string;
  description: string;
  address: string;
  activityDate: string[];
  activityTime: string[];
}

export interface GetBoards {
  page: number;
}
