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
import { Priority } from '../type/types';

@Entity()
export class Board {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'varchar', length: 255 })
  commitUrl: string;

  @Column({
    type: 'enum',
    enum: Priority,
    default: Priority.LOW,
    nullable: false,
  })
  priority: Priority;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @ManyToOne(() => User, (user) => user.boards)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', length: 255 })
  userId: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
