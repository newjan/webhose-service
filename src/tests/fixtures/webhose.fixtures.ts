import { faker } from "@faker-js/faker";
import { PostApiData, ThreadApiData } from "@/types/webhose";

export function createMockThreadApiData(): ThreadApiData {
  return {
    uuid: faker.string.uuid(),
    url: faker.internet.url(),
    site_full: faker.internet.domainName(),
    site: faker.internet.domainName(),
    site_section: faker.internet.url(),
    site_categories: [faker.lorem.word()],
    section_title: faker.lorem.sentence(),
    title: faker.lorem.sentence(),
    title_full: faker.lorem.sentence(),
    published: faker.date.past().toISOString(),
    replies_count: faker.number.int({ min: 0, max: 10000 }),
    participants_count: faker.number.int({ min: 1, max: 50 }),
    site_type: "discussions",
    country: faker.location.countryCode(),
    main_image: faker.image.url(),
    performance_score: faker.number.int({ min: 0, max: 100 }),
    domain_rank: faker.number.int({ min: 1, max: 100000 }),
    domain_rank_updated: new Date(faker.date.recent().toISOString()),
    social: {
      facebook: { likes: faker.number.int(), comments: faker.number.int(), shares: faker.number.int() },
    },
  };
}

export function createMockPostApiData(): PostApiData {
  return {
    uuid: faker.string.uuid (),
    thread: createMockThreadApiData(),
    url: faker.internet.url(),
    ord_in_thread: faker.number.int({ min: 0, max: 100 }),
    parent_url: faker.internet.url(),
    author: faker.person.fullName(),
    published: faker.date.past().toISOString(),
    title: faker.lorem.sentence(),
    text: faker.lorem.paragraph(),
    language: "english",
    highlightText: "",
    highlightTitle: "",
    highlightThreadTitle: "",
    ai_allow: true,
    has_canonical: false,
    webz_reporter: false,
    external_images: [faker.image.url()],
    external_links: [faker.internet.url()],
    entities: {},
    syndication: {},
    crawled: faker.date.recent().toISOString(),
    updated: faker.date.recent().toISOString(),
  };
}
