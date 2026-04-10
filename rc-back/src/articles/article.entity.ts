import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Comment } from '../comments/comment.entity';

import { ArticleType } from '../articles/enum/ArticleType.enum' // Assuming you have an enum for ArticleType

@Entity('articles')
export class Article {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Comment, (comment) => comment.article)
  comments: Comment[];

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ type: 'enum', enum: ArticleType })
  type: ArticleType;

  @Column({ default: false })
  isActive: boolean;

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, any>;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}