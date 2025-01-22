import { Thread } from "@/models/thread-model";
import { ThreadApiData } from "@/types/webhose";
import { RequiredEntityData } from "@mikro-orm/core";
import _ from "lodash";

/**
 * Mapper function to transform API thread data into Thread DTO.
 * @param threadApiObject The raw thread data from the API.
 * @returns A Thread object.
 */
export function mapThreadApiObjToModel(
    threadApiObject: ThreadApiData
  ): RequiredEntityData<Thread> {
    return {
      threadUuid: threadApiObject.uuid,
      url: threadApiObject.url,
      siteFull: threadApiObject.site_full,
      site: threadApiObject.site,
      siteSection: threadApiObject.site_section,
      siteCategories: threadApiObject.site_categories,
      sectionTitle: threadApiObject.section_title,
      title: threadApiObject.title,
      titleFull: threadApiObject.title_full,
      published: new Date(threadApiObject.published),
      repliesCount: threadApiObject.replies_count,
      participantsCount: threadApiObject.participants_count,
      siteType: threadApiObject.site_type,
      country: threadApiObject.country,
      mainImage: threadApiObject.main_image,
      performanceScore: threadApiObject.performance_score,
      domainRank: threadApiObject.domain_rank,
      domainRankUpdated: threadApiObject.domain_rank_updated
        ? new Date(threadApiObject.domain_rank_updated)
        : undefined,
      social: _.isEmpty(threadApiObject.social) ? {} : threadApiObject.social,
    };
  }
    