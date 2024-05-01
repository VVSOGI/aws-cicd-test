import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Board {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @ManyToOne(() => User, (user) => user.boards)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', length: 255 })
  userId: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'int', default: 0 })
  likeNumber: number;

  @Column({ type: 'varchar', length: 255 })
  imagePath: string;

  @Column({ type: 'text', array: true })
  activityDate: string[];

  @Column({ type: 'text', array: true })
  activityTime: string[];

  @Column({ type: 'varchar' })
  address: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
