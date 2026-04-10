import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
export declare class CommentsService {
    private readonly commentRepository;
    constructor(commentRepository: Repository<Comment>);
    findAll(): Promise<Comment[]>;
    findByArticle(articleId: number): Promise<Comment[]>;
    create(dto: CreateCommentDto): Promise<Comment>;
    update(id: number, content: string): Promise<Comment>;
    delete(id: number): Promise<void>;
}
