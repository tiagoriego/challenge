import { IsNull, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { Content } from 'src/content/entity'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class ContentRepository {
  constructor(@InjectRepository(Content) private readonly contentRepository: Repository<Content>) {}

  public async findById(id: string): Promise<Content> {
    return this.contentRepository.findOne({
      where: {
        id,
        deleted_at: IsNull(),
      },
    })
  }
}
