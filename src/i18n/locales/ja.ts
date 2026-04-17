import type { TranslationStrings } from "./en"

const ja: TranslationStrings = {
  // Common
  ongoing: "開催中",
  back_to_meetings: "ミーティング一覧に戻る",

  // Search & Filters
  filters: "フィルター",
  clear_filters: "フィルターをクリア",
  search_placeholder: "検索",
  search_min_chars: "3文字以上入力してください。",
  scheduled: "予定あり",
  filters_unavailable:
    "フィルターは一時的に利用できません。しばらくしてから再度お試しください。",
  retry: "再試行",

  // Filter section headings
  filter_day_time: "曜日・時間",
  filter_meeting_type: "ミーティング種別",
  filter_formats: "形式",
  filter_features: "特徴",
  filter_communities: "コミュニティ",
  filter_languages: "言語",

  // Days
  day: "曜日",
  monday: "月曜日",
  tuesday: "火曜日",
  wednesday: "水曜日",
  thursday: "木曜日",
  friday: "金曜日",
  saturday: "土曜日",
  sunday: "日曜日",

  // Time frames
  time: "時間",
  morning: "朝（4〜11時）",
  midday: "昼（11〜13時）",
  afternoon: "午後（13〜17時）",
  evening: "夕方（17〜21時）",
  night: "夜（21〜4時）",

  // Meeting list
  meetings: "ミーティング",
  meetings_summary: "（合計{{total}}件；{{shown}}件表示中。）",
  no_results: "条件に一致するミーティングが見つかりませんでした。",

  // Meeting time
  today: "今日",
  tomorrow: "明日",
  yesterday: "昨日",
  in_days: "{{count}}日後",
  days_ago: "{{count}}日前",
  originally: "（元々は{{day}}）",
  meeting_time_label: "ミーティング時間：",
  your_local_time: "（現地時間）",
  your_time: "現地時間：{{time}}",
  your_local_time_label: "現地時間：",
  at: "",

  // Meeting detail page
  meeting_details: "ミーティング詳細",
  meeting_information: "ミーティング情報",
  meeting_categories: "ミーティングカテゴリー",
  additional_categories: "追加カテゴリー：",
  meeting_id: "ミーティングID",
  group_id: "グループID",
  meeting_time: "ミーティング時間",
  your_local_time_heading: "現地時間",
  conference_provider: "会議プロバイダー",
  minutes: "{{count}}分",

  // Group info
  about_this_group: "このグループについて",
  group_notes: "グループノート",
  all_meetings: "{{name}} - 全ミーティング",

  // Actions
  join: "参加する",
  join_meeting: "ミーティングに参加",
  join_service: "{{service}}に参加",
  join_service_meeting: "{{service}}ミーティングに参加",
  send_email: "メールを送る",
  email_group: "グループにメールを送る",
  email: "メール",
  visit_website: "ウェブサイトを見る",
  website: "ウェブサイト",

  // Calendar
  add_to_calendar: "カレンダーに追加",
  calendar: "カレンダー",
  add: "追加",
  add_event: "イベントを追加",
  single_event: "単発イベント",
  single_event_ics: "単発イベント（.ics（mac））",
  recurring_series: "定期シリーズ（毎週）",
  recurring_series_ics: "定期シリーズ（.ics（mac））",
  google_calendar: "Googleカレンダー",
  quick_add: "クイック追加：",
  calendar_events_note:
    "イベントにはミーティングリンク、電話番号、リマインダーが含まれます。",
  online_meeting: "オンラインミーティング",
  meeting_reminder: "ミーティングリマインダー",

  // ICS content strings
  ics_join: "ミーティングに参加：{{url}}",
  ics_phone: "電話：{{phone}}",
  ics_contact: "連絡先：{{email}}",
  ics_website: "ウェブサイト：{{url}}",
  ics_join_short: "参加：{{url}}",

  // Meeting types
  types: {
    O: "オープン",
    C: "クローズド",
  },

  // Formats
  formats: {
    "11": "ステップ11瞑想",
    "12x12": "12ステップ＆12の伝統",
    A: "非宗教的",
    ABSI: "ビルの見方",
    B: "ビッグブック",
    BE: "ニューカマー",
    D: "ディスカッション",
    DR: "日々の黙想",
    GR: "グレープバイン",
    H: "バースデー",
    LIT: "文献",
    LS: "素面で生きる",
    MED: "瞑想",
    SP: "スピーカー",
    ST: "ステップスタディ",
    TR: "伝統スタディ",
  },

  // Features
  features: {
    "AL-AN": "アラノンと同時開催",
    AL: "アラティーンと同時開催",
    ASL: "アメリカ手話",
    BA: "託児所あり",
    BRK: "朝食あり",
    CAN: "キャンドルライト",
    CF: "子ども歓迎",
    DB: "デジタル募金",
    FF: "無香料",
    OUT: "屋外",
    POA: "出席証明書あり",
    RSL: "ロシア手話",
    SM: "喫煙可",
    TC: "会場一時閉鎖",
    X: "車椅子対応",
    XB: "車椅子対応トイレあり",
    XT: "クロストーク可",
  },

  // Communities
  communities: {
    M: "男性",
    W: "女性",
    DD: "二重診断",
    LGBTQ: "LGBTQIAA+",
    BI: "バイセクシュアル",
    G: "ゲイ",
    L: "レズビアン",
    T: "トランスジェンダー",
    SEN: "シニア",
    Y: "若者",
    POC: "有色人種",
    N: "ネイティブアメリカン",
    NDG: "先住民",
    "BV-I": "盲目・視覚障害者",
    "D-HOH": "聴覚障害者・難聴者",
    "LO-I": "ひとり参加・孤立者",
    P: "専門職",
  },

  // Languages
  languages: {
    am: "アムハラ語",
    bg: "ブルガリア語",
    de: "ドイツ語",
    el: "ギリシャ語",
    en: "英語",
    es: "スペイン語",
    fa: "ペルシャ語",
    fr: "フランス語",
    hi: "ヒンディー語",
    hu: "ハンガリー語",
    it: "イタリア語",
    ja: "日本語",
    ko: "韓国語",
    lt: "リトアニア語",
    ml: "マラヤーラム語",
    mt: "マルタ語",
    pa: "パンジャブ語",
    pl: "ポーランド語",
    pt: "ポルトガル語",
    ru: "ロシア語",
    sv: "スウェーデン語",
  },
}

export default ja
