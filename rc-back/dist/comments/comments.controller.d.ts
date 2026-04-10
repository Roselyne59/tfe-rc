import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './comment.entity';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    findAll(): Promise<Comment[]>;
    findByArticle(articleId: string): Promise<Comment[]>;
    create(dto: CreateCommentDto): Promise<Comment>;
    update(id: string, content: string): Promise<Comment>;
    delete(id: string): Promise<void>;
}
