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
exports.AnalyticsEvent = void 0;
const typeorm_1 = require("typeorm");
const article_entity_1 = require("../articles/article.entity");
const EventType_enum_1 = require("./enum/EventType.enum");
let AnalyticsEvent = class AnalyticsEvent {
    id;
    eventType;
    article;
    articleId;
    anonymousId;
    duration;
    metadata;
    createdAt;
    expiresAt;
};
exports.AnalyticsEvent = AnalyticsEvent;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AnalyticsEvent.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: EventType_enum_1.EventType }),
    __metadata("design:type", String)
], AnalyticsEvent.prototype, "eventType", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => article_entity_1.Article, { nullable: true, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'articleId' }),
    __metadata("design:type", article_entity_1.Article)
], AnalyticsEvent.prototype, "article", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], AnalyticsEvent.prototype, "articleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], AnalyticsEvent.prototype, "anonymousId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AnalyticsEvent.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: {} }),
    __metadata("design:type", Object)
], AnalyticsEvent.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], AnalyticsEvent.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], AnalyticsEvent.prototype, "expiresAt", void 0);
exports.AnalyticsEvent = AnalyticsEvent = __decorate([
    (0, typeorm_1.Entity)('analytics_events')
], AnalyticsEvent);
//# sourceMappingURL=analytics.entity.js.map