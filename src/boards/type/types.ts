export interface CreateBoard {
  id: string;
  userId: string;
  email: string;
  imagePath: string;
  title: string;
  description: string;
  address: string;
  activityDate: string[];
  activityTime: string[];
}

export interface ServiceCreateBoard {
  userId: string;
  email: string;
  title: string;
  description: string;
  address: string;
  activityDate: string[];
  activityTime: string[];
  file: Express.Multer.File;
}

export interface UpdateBoard {
  id: string;
  userId: string;
  email: string;
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
