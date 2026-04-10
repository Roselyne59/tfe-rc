import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Article } from '../articles/article.entity';
import { EventType } from './enum/EventType.enum';

@Entity('analytics_events')
export class AnalyticsEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: EventType })
  eventType: EventType;

  @ManyToOne(() => Article, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'articleId' })
  article: Article;

  @Column({ nullable: true })
  articleId: number;

  @Column({ type: 'uuid' })
  anonymousId: string;

  @Column({ type: 'int', nullable: true })
  duration: number;

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, any>;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;
}
