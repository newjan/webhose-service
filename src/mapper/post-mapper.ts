import { Post } from "@/models/post-model";
import { Thread } from "@/models/thread-model";
import { PostApiData } from "@/types/webhose";
import { RequiredEntityData } from "@mikro-orm/core";
import _ from "lodash";

/**
 * Mapper function to transform API post data into PostDTO.
 * @param postApiObj The raw post data from the API.
 * @returns A PostDTO object.
 */
export function mapPostApiObjToModel(
  postApiObj: PostApiData,
  thread: Thread
): RequiredEntityData<Post> {
  return {
    postUuid: postApiObj.uuid,
    thread: thread,
    url: postApiObj.url,
    ordInThread: postApiObj.ord_in_thread,
    parentUrl: postApiObj.parent_url,
    author: postApiObj.author,
    published: new Date(postApiObj.published),
    title: postApiObj.title,
    text: postApiObj.text,
    language: postApiObj.language,
    highlightText: postApiObj.highlightText,
    highlightTitle: postApiObj.highlightTitle,
    highlightThreadTitle: postApiObj.highlightThreadTitle,
    aiAllow: postApiObj.ai_allow,
    hasCanonical: postApiObj.has_canonical,
    webzReporter: postApiObj.webz_reporter,
    externalLinks: _.isEmpty(postApiObj.external_links)
      ? []
      : postApiObj.external_links,
    externalImages: _.isEmpty(postApiObj.external_images)
      ? []
      : postApiObj.external_images,
    entities: _.isEmpty(postApiObj.entities) ? {} : postApiObj.entities,
    syndication: _.isEmpty(postApiObj.syndication)
      ? {}
      : postApiObj.syndication,
    crawled: new Date(postApiObj.crawled),
    updated: new Date(postApiObj.updated),
  };
}
