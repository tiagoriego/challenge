import * as fs from 'fs'
import * as path from 'path'
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common'
import { ContentRepository } from 'src/content/repository'
import { ProvisionDto } from 'src/content/dto'
import { Content } from 'src/content/entity'
import {
  PROVISION_DEFAULT_LINK,
  PROVISION_EXPIRATION_TIME_LINK_IN_SECONDS,
  PROVISION_FORMAT,
  PROVISION_LIST_TYPE,
  PROVISION_TYPE,
} from 'src/constants'

@Injectable()
export class ContentService {
  private readonly logger = new Logger(ContentService.name)
  private readonly expirationTime = PROVISION_EXPIRATION_TIME_LINK_IN_SECONDS

  constructor(private readonly contentRepository: ContentRepository) {}

  async provision(contentId: string): Promise<ProvisionDto> {
    if (!contentId) {
      this.logger.error(`Invalid Content ID: ${contentId}`)
      throw new UnprocessableEntityException(`Content ID is invalid: ${contentId}`)
    }

    this.logger.log(`Provisioning content for id=${contentId}`)
    let content: Content | null

    try {
      content = await this.contentRepository.findById(contentId)
    } catch (error) {
      this.logger.error(`Database error while fetching content: ${error}`)
      throw new NotFoundException(`Database error: ${error}`)
    }

    if (!content) {
      this.logger.warn(`Content not found for id=${contentId}`)
      throw new NotFoundException(`Content not found: ${contentId}`)
    }

    const filePath = content.url ? content.url : undefined
    let bytes = 0

    try {
      bytes = fs.existsSync(filePath) ? fs.statSync(filePath).size : 0
    } catch (error) {
      this.logger.error(`File system error: ${error}`)
    }

    const url = this.generateSignedUrl(content.url || '')

    if (!content.type) {
      this.logger.warn(`Missing content type for ID=${contentId}`)
      throw new BadRequestException('Content type is missing')
    }

    if (PROVISION_LIST_TYPE.includes(content.type as PROVISION_TYPE)) {
      const provisionResult = new ProvisionDto()

      provisionResult.id = content.id
      provisionResult.title = content.title
      provisionResult.cover = content.cover
      provisionResult.created_at = content.created_at
      provisionResult.description = content.description
      provisionResult.total_likes = content.total_likes

      switch (content.type) {
        case PROVISION_TYPE.PDF:
          provisionResult.type = PROVISION_TYPE.PDF
          provisionResult.url = url
          provisionResult.allow_download = true
          provisionResult.is_embeddable = false
          provisionResult.format = PROVISION_FORMAT.PDF
          provisionResult.bytes = bytes
          provisionResult.metadata = {
            ...this.getMetadataPDF(bytes),
          }
          break
        case PROVISION_TYPE.IMAGE:
          provisionResult.type = PROVISION_TYPE.IMAGE
          provisionResult.url = url
          provisionResult.allow_download = true
          provisionResult.is_embeddable = true
          provisionResult.format = path.extname(content.url || '').slice(1) || PROVISION_FORMAT.JPEG
          provisionResult.bytes = bytes
          provisionResult.metadata = {
            ...this.getMetadaIMAGE(),
          }
          break
        case PROVISION_TYPE.VIDEO:
          provisionResult.type = PROVISION_TYPE.VIDEO
          provisionResult.url = url
          provisionResult.allow_download = false
          provisionResult.is_embeddable = true
          provisionResult.format = path.extname(content.url || '').slice(1) || PROVISION_FORMAT.MP4
          provisionResult.bytes = bytes
          provisionResult.metadata = {
            ...this.getMetadaVIDEO(bytes),
          }
          break
        case PROVISION_TYPE.LINK:
          provisionResult.type = PROVISION_TYPE.LINK
          provisionResult.url = content.url || PROVISION_DEFAULT_LINK
          provisionResult.allow_download = false
          provisionResult.is_embeddable = true
          provisionResult.format = null
          provisionResult.bytes = 0
          provisionResult.metadata = {
            ...this.getMetadataLINK(content.url),
          }
          break
        case PROVISION_TYPE.TEXT:
          provisionResult.type = PROVISION_TYPE.TEXT
          provisionResult.url = url
          provisionResult.allow_download = true
          provisionResult.is_embeddable = false
          provisionResult.format = path.extname(content.url || '').slice(1) || PROVISION_FORMAT.TXT
          provisionResult.bytes = bytes
          provisionResult.metadata = {
            ...this.getMetadaTXT(bytes),
          }
          break
      }

      return provisionResult
    }

    this.logger.warn(`Unsupported content type for ID=${contentId}, type=${content.type}`)
    throw new BadRequestException(`Unsupported content type: ${content.type}`)
  }

  generateSignedUrl(originalUrl: string): string {
    const expires = Math.floor(Date.now() / 1000) + this.expirationTime
    return `${originalUrl}?expires=${expires}&signature=${Math.random().toString(36).substring(7)}`
  }

  /**
   * Metadata PDF.
   * @param bytes bytes of file
   * @returns
   */
  getMetadataPDF = (bytes: number) => {
    return {
      author: 'Unknown',
      pages: Math.floor(bytes / 50000) || 1,
      encrypted: false,
    }
  }

  /**
   * Metadata IMAGE.
   */
  getMetadaIMAGE = () => {
    return {
      resolution: '1920x1080',
      aspect_ratio: '16:9',
    }
  }

  /**
   * Metadata Video.
   * @param bytes bytes of file
   * @returns
   */
  getMetadaVIDEO = (bytes: number) => {
    return {
      duration: Math.floor(bytes / 100000) || 10,
      resolution: '1080p',
    }
  }

  /**
   * Metadata Link.
   * @param url String
   * @returns
   */
  getMetadataLINK = (url: string) => {
    return {
      trusted: url?.includes('https') || false,
    }
  }

  /**
   * Metadata TXT.
   * @param bytes bytes of file
   * @returns
   */
  getMetadaTXT = (bytes: number) => {
    return {
      author: 'Unknown',
      pages: Math.floor(bytes / 50000) || 1,
      encrypted: false,
    }
  }
}
