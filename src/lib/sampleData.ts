import type { BanksPayload } from './types'

/** A built-in sample so you can try the whole game before wiring up Google Sheets. */
export const SAMPLE_BANKS: BanksPayload = {
  config: { teacherPin: '1234', timerSeconds: 30 },
  players: ['小明', '小華', '阿志', '小美', '阿翔', '小芳'],
  regions: [
    {
      name: '桃園（範例）',
      questions: [
        { id: 't1', type: 'text', question: '桃園早期因為遍植哪種樹而得名?', media: '', options: ['桃樹', '櫻花', '楓樹', '榕樹'], answerIndex: 0, explain: '桃園昔日桃樹成林,故名桃園。' },
        { id: 't2', type: 'text', question: '台灣最大的國際機場位於桃園哪個區?', media: '', options: ['大園區', '中壢區', '龜山區', '楊梅區'], answerIndex: 0, explain: '桃園國際機場位於大園區。' },
        { id: 't3', type: 'text', question: '桃園著名的「石門水庫」主要功能是?', media: '', options: ['供水與防洪', '發電廠', '遊樂園', '港口'], answerIndex: 0, explain: '石門水庫供應大桃園地區用水並調節洪水。' },
        { id: 't4', type: 'text', question: '下列哪個族群是桃園復興區的原住民?', media: '', options: ['泰雅族', '達悟族', '排灣族', '鄒族'], answerIndex: 0, explain: '復興區以泰雅族為主。' },
        { id: 't5', type: 'text', question: '桃園的「大溪」過去因哪條河運興盛?', media: '', options: ['大漢溪', '淡水河', '濁水溪', '高屏溪'], answerIndex: 0, explain: '大溪昔日靠大漢溪河運繁榮。' }
      ]
    },
    {
      name: '台北（範例）',
      questions: [
        { id: 'p1', type: 'text', question: '台北101曾是世界第一高樓,它有幾層樓?', media: '', options: ['101 層', '85 層', '120 層', '99 層'], answerIndex: 0, explain: '台北101地上共101層。' },
        { id: 'p2', type: 'text', question: '流經台北市、匯入淡水河的主要河川是?', media: '', options: ['基隆河', '濁水溪', '大甲溪', '曾文溪'], answerIndex: 0, explain: '基隆河流經台北匯入淡水河。' },
        { id: 'p3', type: 'text', question: '台北市的最高山,也是著名步道的是?', media: '', options: ['七星山', '玉山', '合歡山', '阿里山'], answerIndex: 0, explain: '七星山是台北市最高峰。' },
        { id: 'p4', type: 'text', question: '故宮博物院位於台北哪個區?', media: '', options: ['士林區', '萬華區', '信義區', '大同區'], answerIndex: 0, explain: '國立故宮博物院位於士林區。' },
        { id: 'p5', type: 'text', question: '台北舊稱「艋舺」的是現在的哪一區?', media: '', options: ['萬華區', '中山區', '南港區', '文山區'], answerIndex: 0, explain: '艋舺即今萬華區。' }
      ]
    }
  ]
}
