import { Board } from '../../boards/entities/boards.entity';
import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  id: string;

  @Column({ type: 'varchar', length: 40 })
  nickname: string;

  @Column({ type: 'varchar', length: 40, unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  password: string;

  @Column({ type: 'varchar', default: 'user' })
  permission: string;

  @Column({ type: 'varchar', nullable: true })
  phoneNumber: string;

  @OneToMany(() => Board, (board) => board.user)
  boards: Board[];
}
