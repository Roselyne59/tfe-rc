"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsService = void 0;
const common_1 = require("@nestjs/common");
const articles_service_1 = require("../articles.service");
const ArticleType_enum_1 = require("../enum/ArticleType.enum");
let NewsService = class NewsService {
    articlesService;
    constructor(articlesService) {
        this.articlesService = articlesService;
    }
    createNewsArticle(data) {
        return this.articlesService.creeateBaseArticle({
            userId: data.userId,
            title: data.title,
            content: data.content,
            type: data.type,
            isActive: data.isActive,
            metadata: {
                picturesList: data.metadata.picturesList,
            }
        });
    }
    findLastNewsArticle() {
        return this.articlesService.findAllByType(ArticleType_enum_1.ArticleType.NEWS);
    }
};
exports.NewsService = NewsService;
exports.NewsService = NewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [articles_service_1.ArticlesService])
], NewsService);
//# sourceMappingURL=news.service.js.map