---
stepsCompleted: [1, 2, 5]
inputDocuments:
  - docs/app-store-metadata.md
workflowType: 'research'
lastStep: 5
research_type: 'market'
research_topic: 'ASO for Lịch Việt - Vạn Sự An Lành on the Vietnam App Store (app name, subtitle, keywords)'
research_goals: 'Decide whether to change App Name / Subtitle / Keywords in the 1.3.0 submission to rank higher for Vietnamese lunar-calendar searches'
user_name: 'Bằng Ca'
date: '2026-11-15'
web_research_enabled: true
source_verification: true
---

# Market Research: ASO for Lịch Việt on the Vietnam App Store

## Research Initialization

### Research Understanding Confirmed

**Topic**: App Store Optimization for the iOS app "Lịch Việt - Vạn Sự An Lành" (id6758169645) on the Vietnam storefront.
**Goals**: Decide whether to change the App Name, Subtitle and Keywords in the 1.3.0 submission (shipping with the 2027 Tết holiday schedule) to rank higher for Vietnamese lunar-calendar searches.
**Research Type**: Market Research, scoped to search and competitive positioning (not market sizing)
**Date**: 2026-11-15

### Current State (from `docs/app-store-metadata.md`)

| Field | Live (assumed) | Proposed in doc, not yet applied |
|-------|----------------|----------------------------------|
| App Name | `Lịch Việt - Vạn Sự An Lành` | `Lịch Việt: Lịch Âm & Vạn Sự` |
| Subtitle | `Lịch âm, phong thủy, giờ hoàng đạo` | `Lịch Vạn Niên, Xem Ngày Tốt` |
| Keywords (vi) | — | `phong thủy,giờ hoàng đạo,can chi,la bàn,28 sao,12 trực,cưới hỏi,khai trương,xuất hành,tử vi,ngày lễ` |
| Keywords (en-GB) | — | `lich viet,lich am,lich van nien,van su an lanh,xem ngay tot,gio hoang dao,phong thuy,am lich,tu vi` |

Note: the doc lists Bundle ID `com.bangca.lichviet`, but the Xcode project uses `vn.bradley.vietcalendar`. Verify before relying on the doc.

### Research Scope

**Focus areas:**

1. **Apple indexing rules:** which fields are indexed and with what weight (name > subtitle > keywords); 30/30/100 character limits; whether words are deduplicated across fields; how diacritics are handled ("lịch âm" vs "lich am"); which localizations the VN storefront indexes (vi, en-GB, others?); whether a name change resets ranking or affects review.
2. **Competitor landscape:** names, subtitles and positioning of the top lunar-calendar / lịch vạn niên apps on the VN App Store; which high-volume terms they hold in the title.
3. **Search demand:** relative popularity of candidate terms (lịch âm, lịch vạn niên, lịch việt, xem ngày tốt, âm lịch 2027, lịch nghỉ tết…); seasonal demand around Tết.
4. **Brand trade-off:** keeping the "Vạn Sự An Lành" brand vs giving up name characters for keywords; consistency with the website (lichviet domain, JSON-LD, Smart App Banner).
5. **Recommendation:** concrete Name / Subtitle / Keywords for 1.3.0 within the limits, plus a seasonal keyword rotation for Tết 2027.

**Out of scope:** market size and revenue figures, Google Play listing (can be a follow-up), paid user acquisition.

**Research Methodology:**

- Current web data with source URLs
- At least two independent sources for indexing-rule claims
- Confidence levels for uncertain data (search volumes are estimates)

### Next Steps

1. ✅ Initialization and scope setting (current step)
2. Customer insights: how Vietnamese users search for calendar apps
3. Competitive landscape: names, subtitles and positioning of top competitors
4. Strategic synthesis: Name / Subtitle / Keywords recommendation

**Research Status**: Complete (2026-11-15). Steps 3–4 are not used by this workflow route (step 2 → step 5).

## Customer Insights

> Scope note: no public survey measures Vietnamese lunar-calendar app usage specifically. The findings below combine Google's Tết search reports, App Store listings, third-party app trackers (AppGoblin, AppFollow, mwm.ai) and general Vietnamese mobile-usage surveys. Tracker figures are estimates and sometimes conflict with each other.

### Customer Behavior Patterns

- **Search is the main way people find non-game apps.** Sensor Tower found 65% of App Store downloads came from search (May 2017 – Apr 2018), with 69% for non-game apps. A 2021 update put it at 59% for 2020. [High confidence that search is the largest single channel; the exact share varies by year]
  _Source: https://sensortower.com/blog/app-store-download-sources_
  _Source: https://sensortower.com/blog/app-store-download-sources-report-2021_
- **Users search by generic category plus year, not by brand.** Almost every top competitor puts "Lịch Vạn Niên" and/or "Lịch Âm" plus the current year in the title: "Lịch Vạn Niên 2026 & Lịch Việt", "Lịch Âm 2026 - Lịch Vạn Niên", "Lịch Vạn Niên 2026 - Âm Lịch", "Lịch Vạn Niên 2026, Lịch Âm". Developers converging on this pattern is indirect evidence that these are the high-volume queries. [Medium confidence: inferred from competitor behaviour, no search-volume data]
  _Source: https://appgoblin.info/apps/1071624317/keywords/ranking_
  _Source: https://apps.apple.com/us/app/l%E1%BB%8Bch-v%E1%BA%A1n-ni%C3%AAn-2026-l%E1%BB%8Bch-%C3%A2m/id789302410_
  _Source: https://apps.apple.com/us/app/-/id6739935133_
- **Mobile engagement is high.** Vietnamese users spend about 7.1 hours a day in apps and use more than 27 apps a week (Q&Me, March 2026), down slightly from 7.3 hours and about 29 apps in 2025.
  _Source: https://qandme.net/en/report/vietnam-mobile-app-usage-trends-2026.html_
  _Source: https://qandme.net/en/report/viet-nam-mobile-app-popularity-2025.html_

### Pain Points and Challenges

- **Accuracy.** Wrong lunar dates are a visible complaint. One review of "Lịch Vạn Niên 2025 - Lịch Âm" reads "Sai số lịch quá trầm trọng!" and the developer replied that they had shipped a fix. [Single source, Medium confidence]
  _Source: https://apps.apple.com/us/app/l%E1%BB%8Bch-%C3%A2m-l%E1%BB%8Bch-v%E1%BA%A1n-ni%C3%AAn-2025/id6499255314_
- **Ads and paywalls.** The leading apps are ad-funded: AppGoblin estimates "Lịch Vạn Niên 2026 & Lịch Việt" earns 72% from ads and 28% from IAP. Its App Store page also lists VIP subscriptions ($0.99/month). Some competitors advertise "MIỄN PHÍ 100%, KHÔNG CHỨA QUẢNG CÁO" or "Không có quảng cáo POP-UP", which implies users dislike ads. [Medium confidence: developer claims; no 1–2★ review analysis was found]
  _Source: https://appgoblin.info/apps/1071624317/keywords/ranking_
  _Source: https://apps.apple.com/us/app/-/id1071624317_
  _Source: https://apps.apple.com/us/app/l%E1%BB%8Bch-v%E1%BA%A1n-ni%C3%AAn-%C3%A2m-l%E1%BB%8Bch/id877914778_
- **Too many near-identical listings.** Dozens of apps share the "Lịch Vạn Niên 2026" name, so a new app is hard to tell apart in search results.
  _Source: https://appgoblin.info/apps/1071624317/keywords/ranking_

### Decision-Making Processes

- **Searches move from information to action as Tết approaches.** Google's Tết 2026 report says planning searches started about 3 months before the holiday (previously 1–2 months). Early queries were about dates and schedules, such as "Tết 2026 là năm con gì", "mùng 1 Tết 2026 là ngày mấy" and "lịch nghỉ Tết 2026". They later shifted to concrete preparation. [High confidence: Google data reported by several outlets]
  _Source: https://services.google.com/fh/files/misc/google_tet_2026_vn.pdf_
  _Source: https://nguoiquansat.vn/nguoi-viet-chuan-bi-tet-2026-truoc-3-thang-som-hon-moi-nam-273874.html_
  _Source: https://vneconomy.vn/google-cong-bo-xu-huong-tim-kiem-tet-2026-nguoi-viet-dang-tan-dung-ai-de-don-tet-hieu-qua-hon.htm_
- **Holiday schedules come back every year.** Google's 2023 Tết blog cited "lịch nghỉ tết của 63 tỉnh thành". After Tết, people search "giỗ tổ Hùng Vương nghỉ mấy ngày".
  _Source: https://vietnamese.googleblog.com/2023/01/nguoi-viet-tim-kiem-gi-vao-dip-tet.html_
  _Source: https://phongvu.vn/cong-nghe/?p=166874_
- **Choosing auspicious days drives use.** Many Vietnamese still pick dates for weddings, shop openings, car purchases and house moves, and avoid days 5, 14 and 23 of the lunar month for big events. [Medium confidence: descriptive sources, no national survey]
  _Source: https://www.vietnamtourism.com/en/the-lunar-calendar-and-vietnamese-superstitions-what-travelers-should-know_
  _Source: https://tienphong.vn/vi-sao-ngay-5-14-23-am-lich-bi-coi-la-khong-tot-nen-tranh-lam-viec-lon-post1860362.tpo_

### Customer Journey Mapping

1. **Trigger:** an upcoming date. Tết (about 3 months ahead), a family event (wedding, shop opening, house move), or a monthly ritual (mùng 1, rằm).
2. **Search:** a generic App Store query, often with the year ("lịch vạn niên 2027", "lịch âm"). Typed with or without diacritics.
3. **Compare:** results that look alike. Users choose on title, icon, rating count and screenshots.
4. **Use:** check the lunar date, good/bad hours, and things to do or avoid for the target day. Holiday schedules matter around Tết.
5. **Retain or churn:** keep the app if it is accurate and not too intrusive. Ads and wrong dates are the visible churn causes.

_Source: synthesis of the sources above (Analysis, not a sourced fact)_

### Customer Satisfaction Drivers

- **Accuracy of the lunar date:** see the "Sai số lịch" review above.
- **Light or no ads:** competitors advertise "no ads" and "no pop-ups" as a selling point.
- **Social proof:** leaders show large rating counts (Zegome on Google Play: about 9.5M installs, 127.5K ratings, 4.84★; Lich Viet JSC on iOS: 4.6★ from 14K ratings).
  _Source: https://appgoblin.info/apps/com.zegome.app.lichvannien_
  _Source: https://apps.apple.com/us/app/l%E1%BB%8Bch-v%E1%BA%A1n-ni%C3%AAn-2026-l%E1%BB%8Bch-%C3%A2m/id789302410_

### Demographic Profiles

- No age or gender breakdown for lunar-calendar app users was found. Q&Me's 2026 sample was 74% aged 27+ and split between Hanoi and Ho Chi Minh City, but it does not report the calendar category separately. [Gap: Low confidence on any demographic claim]
  _Source: https://cdn.qandme.net/1773712237_Vietnam_mobile_app_popularity_2026_-_13032026.pdf_

### Psychographic Profiles

- Users are tradition-minded and plan around lunar dates and auspicious days. Interest in the lunar calendar is practical (dates, holidays, rituals), not occasional curiosity.
- In 2026 users also used Gemini to plan Tết (wishes, budget, itinerary). Expectations for quick, direct answers are rising.
  _Source: https://vneconomy.vn/google-cong-bo-xu-huong-tim-kiem-tet-2026-nguoi-viet-dang-tan-dung-ai-de-don-tet-hieu-qua-hon.htm_

### Implications for ASO (Analysis)

- The year number and the generic category terms ("lịch vạn niên", "lịch âm") are what users type. A brand-only phrase such as "Vạn Sự An Lành" has little search value on its own.
- Tết 2027 falls on 06/02/2027. If searches start about 3 months earlier, the window opens around early November 2026, which is now. Metadata for 1.3.0 should target "2027" and "lịch nghỉ tết".
- "No ads" plus accuracy is a real point of difference against ad-heavy leaders. It belongs in the subtitle or screenshots, not only the description.

**Research gaps:** no measured App Store search volume for individual Vietnamese terms (needs Apple Search Ads popularity scores or a paid ASO tool); no review mining of competitors' 1–2★ reviews.

## Competitive Landscape

> Method: search positions come from Apple's public iTunes Search API (`itunes.apple.com/search?country=vn&entity=software`) queried on 2026-11-15. The API's ordering is close to, but not identical to, in-app App Store search: it ignores personalisation and Search Ads. Our live listing comes from `itunes.apple.com/lookup?id=6758169645&country=vn`. Rating counts are those returned by the API.

### Our Live Listing (2026-11-15)

| Field | Value |
|-------|-------|
| Name | `Lịch Việt Vạn Sự An Lành` (24 characters) |
| Version | 1.2 (released 2026-02-09) |
| Category | Lifestyle (the metadata doc recommends Utilities; not applied) |
| Ratings | 3 |
| Seller / bundle | Bang Nguyen Khanh / `vn.bradley.vietcalendar` |

Corrections to `docs/app-store-metadata.md`: the live version is **1.2**, not 1.0.0. The bundle ID is `vn.bradley.vietcalendar`, not `com.bangca.lichviet`. The "old subtitle" listed there, `Lịch âm, phong thủy, giờ hoàng đạo`, is 34 characters, above the 30-character limit, so it cannot be the live subtitle. Check the real subtitle in App Store Connect.

### Key Market Players

| App (VN store name) | Ratings | Name pattern |
|---|---|---|
| Lịch Vạn Niên 2026 & Lịch Việt | ~675K | category + year + brand-ish term |
| Lịch Vạn Niên 2026 Lịch Việt | ~656K | category + year |
| Lịch Vạn Niên 2026, Lịch Âm | ~252K | two category terms + year |
| Lịch Vạn Niên 2026 - Lịch Âm | ~250K | two category terms + year |
| Lịch Vạn Niên 2026 & Lịch Âm | ~209K | two category terms + year |
| Lịch Vạn Niên - Lịch VN 2017 | ~9.7K | old listing, still ranks on history |
| Lịch Âm 2027 - Lịch Vạn Niên | 805 | **already uses 2027** |
| Lịch Vạn Niên 2027 - Sum Vầy | 3 | **already uses 2027** |

_Source: iTunes Search API, VN storefront, 2026-11-15_
_Source: https://appgoblin.info/apps/1071624317/keywords/ranking_

### Market Share Analysis

No share-of-downloads data exists for this category. Rating count is the best available proxy: the top five listings hold about 2M ratings between them, and we have 3. On Google Play, Zegome's "Lịch Vạn Niên 2026 - Lịch Âm" has about 9.5M installs. [Low confidence on any share figure]
_Source: https://appgoblin.info/apps/com.zegome.app.lichvannien_

### Competitive Positioning: Where We Rank Today

| Query | Results | Our rank | Note |
|---|---|---|---|
| lịch âm | 183 | **78** | |
| lich am (no diacritics) | 182 | **146** | Unaccented query ranks us far lower |
| âm lịch | 188 | not in list | Word order matters |
| lịch vạn niên | 174 | **not in list** | Largest category term; we don't have it in name/subtitle |
| lich van nien | 181 | not in list | |
| lịch việt | 185 | **18** | Our brand word helps |
| vạn sự | 175 | 15 | Low-value term (Coursera ranks #2) |
| xem ngày tốt | 87 | 21 | Smaller field |
| giờ hoàng đạo | 93 | 63 | |
| phong thủy | 177 | 101 | Dominated by compass / feng-shui apps |
| lịch 2027 | 87 | not in list | Leaders still say 2026; "Lịch Âm 2027 - Lịch Vạn Niên" is #1 |
| lịch nghỉ tết | 24 | not in list | Weakest field: top results have 0–8 ratings |

_Source: iTunes Search API, VN storefront, 2026-11-15_

### Strengths and Weaknesses

**Strengths:** no ads (leaders earn about 72% of revenue from ads); data re-verified in 1.3.0; 2025–2027 official holiday schedule; widget; offline.
**Weaknesses:** 3 ratings against hundreds of thousands; the name has no high-volume category term ("lịch vạn niên", "lịch âm"); the brand phrase "Vạn Sự An Lành" is not searched; the listing still says 2026 or no year while competitors already target 2027.
_Source: https://appgoblin.info/apps/1071624317/keywords/ranking_

### Apple Indexing Rules Relevant to the Decision

- **Indexed fields:** app name, subtitle, keywords and company name. [High confidence: Apple]
  _Source: https://developer.apple.com/help/app-store-connect/create-an-app-record/view-and-edit-app-information_
- **Weight:** name > subtitle > keywords. Words are combined across fields, so "lịch" in the name plus "nghỉ,tết" in keywords can rank for "lịch nghỉ tết". Repeating a word that is already in the name or subtitle wastes keyword space. [Medium–High confidence: consistent across ASO vendors, not stated by Apple]
  _Source: https://www.apptamin.com/blog/app-store-optimization-aso-app-name-and-keywords/_
  _Source: https://splitmetrics.com/blog/apple-app-store-ranking-factors/_
  _Source: https://trysonar.app/blog/app-store-keyword-field_
- **Limits:** name 30 characters, subtitle 30, keywords 100. One guide says the keyword limit is 100 *bytes*. Vietnamese letters with diacritics take 2–3 bytes each, so check the counter in App Store Connect before relying on 100 characters. [Conflicting sources]
  _Source: https://appdrift.co/blog/app-store-character-limits-complete-reference_
  _Source: https://www.revenuecat.com/guides/revenuecat-replit/complete-your-app-store-connect-setup_
- **When fields can change:** name, subtitle and keywords change only with a new version submission. Promotional text can change at any time without review. [Medium–High confidence]
  _Source: https://developer.apple.com/app-store/product-page-updates/_
  _Source: https://weareaffective.com/learning-centre/which-app-store-metadata-changes-require-re-submission_
- **Diacritics:** for European languages, sources say App Store search normalises accents. Our own data contradicts that for Vietnamese: "lịch âm" ranks us at 78, "lich am" at 146. Unaccented terms are therefore worth covering explicitly. [Medium confidence: one-off measurement]
  _Source: https://www.apptweak.com/en/aso-blog/do-accents-on-mobile-search-matter-for-aso_
  _Source: https://developer.apple.com/forums/thread/810030_
- **Extra English (U.K.) localization:** a common ASO pattern is that en-GB keywords are indexed in many non-English storefronts. No source confirms this for Vietnam. [Low confidence for VN: test it with a tracked keyword]
  _Source: https://phiture.com/asostack/increasing-the-number-of-keywords-in-app-store-optimization-by-localization-daa02ffd8946/_

### Market Differentiation

The leaders are near-identical ("Lịch Vạn Niên 2026 …"). Credible differences for us: **no ads**, **accurate data**, and the **official 2027 Tết / public holiday schedule**. The subtitle and the first screenshots should carry these, because they are what users weigh when choosing between look-alike results.

### Competitive Threats

- Listings with hundreds of thousands of ratings will keep the top spots for "lịch âm" and "lịch vạn niên" whatever our metadata says. Metadata alone gets us indexed and into the long tail, not to #1.
- Small competitors are already renaming to 2027 and will take "2027" searches as Tết approaches.

### Opportunities

- **"lịch vạn niên":** we are not even indexed for it. Putting it in the name is the single biggest gain available.
- **"lịch nghỉ tết" and "2027":** weak competition (24 results, leaders with 0–8 ratings), and demand peaks from now until Tết (06/02/2027). It fits the new 1.3.0 feature.
- **Ratings:** with 3 ratings, an in-app review prompt (`SKStoreReviewController`) after a positive moment would help ranking more than any wording change. [Analysis]

## Recommendation for 1.3.0

**Change the metadata: yes.** The current name only ranks for brand-ish words ("lịch việt" #18, "vạn sự" #15) and is missing the largest category term entirely.

| Field | Proposed | Length | Covers |
|---|---|---|---|
| **Name** | `Lịch Việt: Lịch Âm Vạn Niên` | 27 | lịch việt, lịch âm, lịch vạn niên, âm lịch* |
| **Subtitle** | `Lịch 2027, Xem Ngày Tốt Xấu` | 27 | lịch 2027, xem ngày tốt, ngày tốt xấu |
| **Keywords (vi)** | `nghỉ,tết,giờ,hoàng,đạo,phong,thủy,la,bàn,tử,vi,can,chi,cưới,hỏi,khai,trương,dương,lễ,rằm,cúng,tuổi` | 98 chars | lịch nghỉ tết, giờ hoàng đạo, phong thủy, la bàn, tử vi, cưới hỏi, khai trương, âm dương… |
| **Keywords (en-GB, unaccented)** | `lich viet,lich am,lich van nien,xem ngay tot,gio hoang dao,phong thuy,am lich,tu vi,nghi tet` | ~93 | unaccented queries (if VN indexes en-GB) |

\* "âm lịch" in reverse word order is not guaranteed.

- **Why the brand goes first and the year goes in the subtitle:** "Lịch Việt" ranks us at #18 and matches the website. The name will not need changing every year; only the subtitle changes (2027 → 2028). Alternative if you prefer maximum weight on the year: name `Lịch Vạn Niên 2027 - Lịch Việt` (30) with subtitle `Lịch Âm, Xem Ngày Tốt Xấu` (25). That covers the same words but puts the year in the name, so the name must change every year.
- **Compared with the proposal already in `docs/app-store-metadata.md`** (`Lịch Việt: Lịch Âm & Vạn Sự` / `Lịch Vạn Niên, Xem Ngày Tốt`): it spends name characters on "Vạn Sự", which is low value, and has no year. The proposal above moves "Vạn Niên" into the name and adds 2027.
- **"Vạn Sự An Lành" brand:** drop it from the name. It can stay as the tagline in the description and on the website.
- **Promotional text (no review needed, change today):** `Lịch nghỉ Tết Đinh Mùi 2027: nghỉ 7 ngày 04/02 – 10/02. Xem ngày tốt cưới hỏi, khai trương, xuất hành. Không quảng cáo.`
- **Category:** keep Lifestyle for now. Changing it is a separate test with no supporting data here.
- **Measure:** re-run `docs/analysis/research/aso-rank-check.py "lịch âm" "lịch vạn niên" …` about 1 week after 1.3.0 goes live and compare against the table above.

### Update 2026-11-15: Name Collision and Final Choice

App Store Connect rejected `Lịch Việt: Lịch Âm Vạn Niên` with "The app name you entered is already being used". Two live apps use the same words: `Lịch Việt - Lịch Âm Vạn Niên` and `Lịch Việt: Lịch Âm, Vạn Niên`. Apple appears to ignore punctuation when it compares names.

We searched VN and US listings through the iTunes Search API, then chose **option A**:

| Field | Final | Length |
|---|---|---|
| **Name** | `Lịch Vạn Niên: Lịch Âm An Lành` | 30 |
| **Subtitle** | `Lịch Việt 2027, Ngày Tốt Xấu` | 28 |
| **Keywords (vi)** | `xem,nghỉ,tết,giờ,hoàng,đạo,phong,thủy,la,bàn,tử,vi,can,chi,cưới,hỏi,khai,trương,dương,lễ,rằm,cúng` | 97 |

- "lịch vạn niên" and "lịch âm" now each appear as an exact adjacent phrase in the name. "An Lành" keeps part of the old brand and makes a collision less likely.
- "Việt" moved to the subtitle, so "lịch việt" still matches across fields. "xem" moved to keywords so "xem ngày tốt" still matches. "tuổi" was dropped to make room.
- Fallback (option B): Name `Lịch Âm Việt: Vạn Niên An Lành`, Subtitle `Lịch 2027, Xem Ngày Tốt Xấu`.
- Rejected: `Lịch Vạn Niên - Lịch Âm Việt`. It uses the same word set as three live apps, so it carries a collision or copycat risk.
- Limitation: the search API only shows published apps in the storefronts queried. Names reserved by unreleased apps are visible only in App Store Connect.
