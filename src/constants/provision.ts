/**
 * Provision types.
 */
export enum PROVISION_TYPE {
  PDF = 'pdf',
  IMAGE = 'image',
  VIDEO = 'video',
  LINK = 'link',
  TEXT = 'text',
}

/**
 * Provision list.
 */
export const PROVISION_LIST_TYPE = [
  PROVISION_TYPE.PDF,
  PROVISION_TYPE.IMAGE,
  PROVISION_TYPE.VIDEO,
  PROVISION_TYPE.LINK,
  PROVISION_TYPE.TEXT,
]

/**
 * Provision format.
 */
export enum PROVISION_FORMAT {
  PDF = 'pdf',
  JPEG = 'jpg',
  MP4 = 'mp4',
  TXT = 'txt',
}

/**
 * Used to define expiration time of link (1 hour).
 */
export const PROVISION_EXPIRATION_TIME_LINK_IN_SECONDS = 3600

/**
 * Default LINK.
 */
export const PROVISION_DEFAULT_LINK = 'http://default.com'
