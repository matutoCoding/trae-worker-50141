import type {
  Animal, FeedFormula, FeedingPlan, FeedingRecord, HealthRecord,
  BreedingRecord, Enclosure, BehaviorRecord, EnrichmentActivity,
  EducationSchedule, VisitorInteraction, Species
} from '@/types';

export const speciesList: Species[] = [
  { id: 'sp001', commonName: '大熊猫', scientificName: 'Ailuropoda melanoleuca', conservationStatus: '易危', habitat: '中国四川山区竹林', dietType: '植食性', description: '中国国宝，以竹子为主食' },
  { id: 'sp002', commonName: '东北虎', scientificName: 'Panthera tigris altaica', conservationStatus: '濒危', habitat: '俄罗斯远东和中国东北森林', dietType: '肉食性', description: '体型最大的猫科动物' },
  { id: 'sp003', commonName: '金丝猴', scientificName: 'Rhinopithecus roxellana', conservationStatus: '濒危', habitat: '中国中西部高山森林', dietType: '植食性', description: '毛色金黄的珍稀灵长类' },
  { id: 'sp004', commonName: '亚洲象', scientificName: 'Elephas maximus', conservationStatus: '濒危', habitat: '南亚和东南亚热带雨林', dietType: '植食性', description: '陆地上最大的哺乳动物之一' },
  { id: 'sp005', commonName: '丹顶鹤', scientificName: 'Grus japonensis', conservationStatus: '易危', habitat: '东亚湿地和沼泽', dietType: '杂食性', description: '象征吉祥长寿的优雅鸟类' },
  { id: 'sp006', commonName: '长颈鹿', scientificName: 'Giraffa camelopardalis', conservationStatus: '易危', habitat: '非洲稀树草原', dietType: '植食性', description: '世界上最高的陆生动物' },
];

export const animals: Animal[] = [
  {
    id: 'a001', name: '团团', speciesId: 'sp001', speciesName: '大熊猫',
    scientificName: 'Ailuropoda melanoleuca', gender: 'male',
    birthDate: '2015-08-15', age: 10, weight: 118,
    entryDate: '2016-03-20', healthStatus: 'healthy',
    enclosureId: 'e001', enclosureName: '熊猫馆A区',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20giant%20panda%20sitting%20eating%20bamboo%20professional%20zoo%20photo&image_size=square',
    conservationStatus: '易危', dietType: '植食性',
    pedigree: { fatherId: 'a000', fatherName: '兴兴', motherId: 'a000m', motherName: '圆圆', childrenIds: ['a009', 'a010'] }
  },
  {
    id: 'a002', name: '圆圆', speciesId: 'sp001', speciesName: '大熊猫',
    scientificName: 'Ailuropoda melanoleuca', gender: 'female',
    birthDate: '2016-06-20', age: 9, weight: 102,
    entryDate: '2017-04-10', healthStatus: 'healthy',
    enclosureId: 'e001', enclosureName: '熊猫馆A区',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=giant%20panda%20female%20lying%20peacefully%20zoo%20enclosure%20natural%20lighting&image_size=square',
    conservationStatus: '易危', dietType: '植食性',
    pedigree: { childrenIds: ['a009', 'a010'] }
  },
  {
    id: 'a003', name: '威威', speciesId: 'sp002', speciesName: '东北虎',
    scientificName: 'Panthera tigris altaica', gender: 'male',
    birthDate: '2018-04-10', age: 7, weight: 215,
    entryDate: '2019-07-15', healthStatus: 'healthy',
    enclosureId: 'e002', enclosureName: '虎山林',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=majestic%20siberian%20tiger%20standing%20on%20rock%20zoo%20habitat%20professional%20photo&image_size=square',
    conservationStatus: '濒危', dietType: '肉食性'
  },
  {
    id: 'a004', name: '玲玲', speciesId: 'sp003', speciesName: '金丝猴',
    scientificName: 'Rhinopithecus roxellana', gender: 'female',
    birthDate: '2019-11-25', age: 6, weight: 12.5,
    entryDate: '2020-09-01', healthStatus: 'recovering',
    enclosureId: 'e003', enclosureName: '金丝猴馆',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=golden%20snub%20nosed%20monkey%20sitting%20on%20tree%20branch%20beautiful%20fur&image_size=square',
    conservationStatus: '濒危', dietType: '植食性'
  },
  {
    id: 'a005', name: '象象', speciesId: 'sp004', speciesName: '亚洲象',
    scientificName: 'Elephas maximus', gender: 'male',
    birthDate: '2010-02-14', age: 15, weight: 3200,
    entryDate: '2012-08-30', healthStatus: 'healthy',
    enclosureId: 'e004', enclosureName: '亚洲象园',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=asian%20elephant%20walking%20in%20zoo%20enclosure%20natural%20setting&image_size=square',
    conservationStatus: '濒危', dietType: '植食性'
  },
  {
    id: 'a006', name: '丹丹', speciesId: 'sp005', speciesName: '丹顶鹤',
    scientificName: 'Grus japonensis', gender: 'female',
    birthDate: '2017-05-05', age: 8, weight: 8.2,
    entryDate: '2018-06-12', healthStatus: 'healthy',
    enclosureId: 'e005', enclosureName: '鹤鸟湿地',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=red%20crowned%20crane%20standing%20elegantly%20in%20wetland%20zoo%20habitat&image_size=square',
    conservationStatus: '易危', dietType: '杂食性'
  },
  {
    id: 'a007', name: '鹿鹿', speciesId: 'sp006', speciesName: '长颈鹿',
    scientificName: 'Giraffa camelopardalis', gender: 'male',
    birthDate: '2019-09-08', age: 6, weight: 850,
    entryDate: '2020-12-01', healthStatus: 'quarantine',
    enclosureId: 'e006', enclosureName: '长颈鹿馆',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tall%20giraffe%20eating%20leaves%20from%20tree%20zoo%20sunlight&image_size=square',
    conservationStatus: '易危', dietType: '植食性',
    quarantine: { startDate: '2026-06-10', status: 'active', notes: '新引进个体，正在进行30天隔离观察' }
  },
  {
    id: 'a008', name: '乐乐', speciesId: 'sp002', speciesName: '东北虎',
    scientificName: 'Panthera tigris altaica', gender: 'female',
    birthDate: '2020-01-20', age: 5, weight: 145,
    entryDate: '2021-05-10', healthStatus: 'sick',
    enclosureId: 'e002', enclosureName: '虎山林',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=siberian%20tiger%20female%20resting%20peacefully%20zoo%20enclosure&image_size=square',
    conservationStatus: '濒危', dietType: '肉食性'
  },
  {
    id: 'a009', name: '小宝', speciesId: 'sp001', speciesName: '大熊猫',
    scientificName: 'Ailuropoda melanoleuca', gender: 'male',
    birthDate: '2022-07-22', age: 3, weight: 62,
    entryDate: '2022-07-22', healthStatus: 'healthy',
    enclosureId: 'e001', enclosureName: '熊猫馆A区',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20baby%20giant%20panda%20playing%20adorable%20zoo%20photo&image_size=square',
    conservationStatus: '易危', dietType: '植食性',
    pedigree: { fatherId: 'a001', fatherName: '团团', motherId: 'a002', motherName: '圆圆', childrenIds: [] }
  },
  {
    id: 'a010', name: '小贝', speciesId: 'sp001', speciesName: '大熊猫',
    scientificName: 'Ailuropoda melanoleuca', gender: 'female',
    birthDate: '2022-07-22', age: 3, weight: 58,
    entryDate: '2022-07-22', healthStatus: 'healthy',
    enclosureId: 'e001', enclosureName: '熊猫馆A区',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=baby%20giant%20panda%20female%20sleeping%20peacefully%20cute%20zoo&image_size=square',
    conservationStatus: '易危', dietType: '植食性',
    pedigree: { fatherId: 'a001', fatherName: '团团', motherId: 'a002', motherName: '圆圆', childrenIds: [] }
  },
];

export const feedFormulas: FeedFormula[] = [
  {
    id: 'f001', name: '大熊猫主食配方',
    ingredients: [
      { name: '新鲜竹子', percentage: 60 },
      { name: '竹笋', percentage: 15 },
      { name: '特制窝头', percentage: 15 },
      { name: '胡萝卜', percentage: 5 },
      { name: '苹果', percentage: 5 },
    ],
    nutritionInfo: { protein: 8.5, fat: 3.2, carbohydrate: 45, fiber: 28 },
    applicableSpecies: ['大熊猫'],
    isFavorite: true
  },
  {
    id: 'f002', name: '猫科动物肉食配方',
    ingredients: [
      { name: '牛肉', percentage: 50 },
      { name: '鸡肉', percentage: 25 },
      { name: '猪心', percentage: 10 },
      { name: '鸡骨架', percentage: 10 },
      { name: '营养补充剂', percentage: 5 },
    ],
    nutritionInfo: { protein: 42, fat: 18, carbohydrate: 2, fiber: 0.5 },
    applicableSpecies: ['东北虎', '非洲狮', '豹'],
    isFavorite: true
  },
  {
    id: 'f003', name: '灵长类果蔬配方',
    ingredients: [
      { name: '香蕉', percentage: 20 },
      { name: '苹果', percentage: 15 },
      { name: '胡萝卜', percentage: 15 },
      { name: '红薯', percentage: 15 },
      { name: '新鲜树叶', percentage: 20 },
      { name: '灵长类专用颗粒', percentage: 15 },
    ],
    nutritionInfo: { protein: 15, fat: 4, carbohydrate: 52, fiber: 12 },
    applicableSpecies: ['金丝猴', '黑猩猩', '猕猴'],
    isFavorite: false
  },
  {
    id: 'f004', name: '大象高纤维配方',
    ingredients: [
      { name: '干草', percentage: 35 },
      { name: '新鲜青草', percentage: 25 },
      { name: '甘蔗', percentage: 10 },
      { name: '胡萝卜', percentage: 10 },
      { name: '苹果', percentage: 10 },
      { name: '谷物混合', percentage: 10 },
    ],
    nutritionInfo: { protein: 10, fat: 2.5, carbohydrate: 55, fiber: 22 },
    applicableSpecies: ['亚洲象', '非洲象'],
    isFavorite: true
  },
  {
    id: 'f005', name: '涉禽鱼虾配方',
    ingredients: [
      { name: '小鱼', percentage: 40 },
      { name: '虾', percentage: 20 },
      { name: '谷物', percentage: 20 },
      { name: '蔬菜', percentage: 15 },
      { name: '矿物质补充', percentage: 5 },
    ],
    nutritionInfo: { protein: 28, fat: 8, carbohydrate: 35, fiber: 4 },
    applicableSpecies: ['丹顶鹤', '火烈鸟', '鹈鹕'],
    isFavorite: false
  },
  {
    id: 'f006', name: '长颈鹿树叶配方',
    ingredients: [
      { name: '洋槐树叶', percentage: 40 },
      { name: '榆树叶子', percentage: 20 },
      { name: '干草', percentage: 15 },
      { name: '胡萝卜', percentage: 10 },
      { name: '苹果', percentage: 10 },
      { name: '矿物质舔砖', percentage: 5 },
    ],
    nutritionInfo: { protein: 14, fat: 3, carbohydrate: 48, fiber: 25 },
    applicableSpecies: ['长颈鹿'],
    isFavorite: false
  },
];

export const feedingPlans: FeedingPlan[] = [
  { id: 'fp001', animalId: 'a001', animalName: '团团', formulaId: 'f001', formulaName: '大熊猫主食配方', feedingTime: '08:30', quantity: 25, unit: 'kg', frequency: '每日两次' },
  { id: 'fp002', animalId: 'a001', animalName: '团团', formulaId: 'f001', formulaName: '大熊猫主食配方', feedingTime: '15:30', quantity: 20, unit: 'kg', frequency: '每日两次' },
  { id: 'fp003', animalId: 'a002', animalName: '圆圆', formulaId: 'f001', formulaName: '大熊猫主食配方', feedingTime: '08:30', quantity: 22, unit: 'kg', frequency: '每日两次' },
  { id: 'fp004', animalId: 'a003', animalName: '威威', formulaId: 'f002', formulaName: '猫科动物肉食配方', feedingTime: '09:00', quantity: 8, unit: 'kg', frequency: '每日一次' },
  { id: 'fp005', animalId: 'a004', animalName: '玲玲', formulaId: 'f003', formulaName: '灵长类果蔬配方', feedingTime: '08:00', quantity: 1.2, unit: 'kg', frequency: '每日三次' },
  { id: 'fp006', animalId: 'a005', animalName: '象象', formulaId: 'f004', formulaName: '大象高纤维配方', feedingTime: '07:00', quantity: 80, unit: 'kg', frequency: '每日两次' },
  { id: 'fp007', animalId: 'a006', animalName: '丹丹', formulaId: 'f005', formulaName: '涉禽鱼虾配方', feedingTime: '09:30', quantity: 0.6, unit: 'kg', frequency: '每日两次' },
  { id: 'fp008', animalId: 'a008', animalName: '乐乐', formulaId: 'f002', formulaName: '猫科动物肉食配方', feedingTime: '09:00', quantity: 6, unit: 'kg', frequency: '每日一次' },
];

export const feedingRecords: FeedingRecord[] = [
  { id: 'fr001', planId: 'fp001', animalId: 'a001', animalName: '团团', formulaName: '大熊猫主食配方', feedingDateTime: '2026-06-18 08:35', plannedQuantity: 25, actualQuantity: 24, remainingAmount: 1, feeder: '王饲养员', notes: '食欲良好，剩余少量竹子', status: 'completed' },
  { id: 'fr002', planId: 'fp003', animalId: 'a002', animalName: '圆圆', formulaName: '大熊猫主食配方', feedingDateTime: '2026-06-18 08:40', plannedQuantity: 22, actualQuantity: 22, remainingAmount: 0, feeder: '王饲养员', notes: '全部吃完', status: 'completed' },
  { id: 'fr003', planId: 'fp004', animalId: 'a003', animalName: '威威', formulaName: '猫科动物肉食配方', feedingDateTime: '2026-06-18 09:10', plannedQuantity: 8, actualQuantity: 8, remainingAmount: 0, feeder: '李饲养员', notes: '进食迅速', status: 'completed' },
  { id: 'fr004', planId: 'fp005', animalId: 'a004', animalName: '玲玲', formulaName: '灵长类果蔬配方', feedingDateTime: '2026-06-18 08:15', plannedQuantity: 1.2, actualQuantity: 0.9, remainingAmount: 0.3, feeder: '张饲养员', notes: '食欲稍差，恢复期中', status: 'partial' },
  { id: 'fr005', planId: 'fp008', animalId: 'a008', animalName: '乐乐', formulaName: '猫科动物肉食配方', feedingDateTime: '2026-06-18 09:05', plannedQuantity: 6, actualQuantity: 4, remainingAmount: 2, feeder: '李饲养员', notes: '生病期间食欲下降', status: 'partial' },
  { id: 'fr006', planId: 'fp006', animalId: 'a005', animalName: '象象', formulaName: '大象高纤维配方', feedingDateTime: '2026-06-18 07:30', plannedQuantity: 80, actualQuantity: 78, remainingAmount: 2, feeder: '赵饲养员', notes: '正常进食', status: 'completed' },
];

export const healthRecords: HealthRecord[] = [
  {
    id: 'h001', animalId: 'a001', animalName: '团团',
    checkupDate: '2026-06-15', veterinarian: '张医生',
    weight: 118, temperature: 36.8, heartRate: 78, bloodPressure: '125/82',
    diagnoses: [],
    vaccinations: [
      { vaccineName: '犬瘟热疫苗', date: '2026-03-10', nextDue: '2027-03-10' },
      { vaccineName: '狂犬疫苗', date: '2026-03-10', nextDue: '2027-03-10' },
    ],
    overallStatus: '健康'
  },
  {
    id: 'h002', animalId: 'a004', animalName: '玲玲',
    checkupDate: '2026-06-17', veterinarian: '李医生',
    weight: 12.5, temperature: 38.2, heartRate: 96, bloodPressure: '118/76',
    diagnoses: [
      { condition: '轻度消化不良', treatment: '益生菌调理，减少粗纤维摄入', medication: '益生菌粉 每日两次', followUpDate: '2026-06-20' }
    ],
    vaccinations: [
      { vaccineName: '猴痘疫苗', date: '2026-02-15', nextDue: '2027-02-15' },
    ],
    overallStatus: '恢复中'
  },
  {
    id: 'h003', animalId: 'a008', animalName: '乐乐',
    checkupDate: '2026-06-18', veterinarian: '张医生',
    weight: 145, temperature: 39.1, heartRate: 110, bloodPressure: '135/88',
    diagnoses: [
      { condition: '呼吸道感染', treatment: '抗生素治疗+雾化吸入', medication: '头孢类抗生素 每日两次', followUpDate: '2026-06-21' }
    ],
    vaccinations: [
      { vaccineName: '猫三联疫苗', date: '2026-01-20', nextDue: '2027-01-20' },
    ],
    overallStatus: '治疗中'
  },
  {
    id: 'h004', animalId: 'a003', animalName: '威威',
    checkupDate: '2026-06-10', veterinarian: '张医生',
    weight: 215, temperature: 37.5, heartRate: 68, bloodPressure: '130/85',
    diagnoses: [],
    vaccinations: [
      { vaccineName: '猫三联疫苗', date: '2026-02-01', nextDue: '2027-02-01' },
    ],
    overallStatus: '健康'
  },
  {
    id: 'h005', animalId: 'a005', animalName: '象象',
    checkupDate: '2026-06-12', veterinarian: '李医生',
    weight: 3200, temperature: 36.2, heartRate: 42, bloodPressure: '120/75',
    diagnoses: [],
    vaccinations: [
      { vaccineName: '破伤风疫苗', date: '2026-04-01', nextDue: '2027-04-01' },
    ],
    overallStatus: '健康'
  },
];

export const breedingRecords: BreedingRecord[] = [
  {
    id: 'b001', animalId: 'a002', animalName: '圆圆',
    partnerId: 'a001', partnerName: '团团',
    breedingType: 'birth', eventDate: '2022-07-22',
    status: '已成功分娩',
    notes: '顺利产下龙凤胎，两只幼崽均健康',
    offspring: [
      { id: 'a009', name: '小宝', birthDate: '2022-07-22', gender: 'male', status: '健康存活' },
      { id: 'a010', name: '小贝', birthDate: '2022-07-22', gender: 'female', status: '健康存活' },
    ]
  },
  {
    id: 'b002', animalId: 'a002', animalName: '圆圆',
    partnerId: 'a001', partnerName: '团团',
    breedingType: 'mating', eventDate: '2026-05-10',
    status: '配种完成，观察中',
    notes: '自然交配成功，持续监测妊娠迹象'
  },
  {
    id: 'b003', animalId: 'a002', animalName: '圆圆',
    breedingType: 'estrus', eventDate: '2026-05-05',
    status: '发情期',
    notes: '激素水平升高，行为显示发情征兆'
  },
  {
    id: 'b004', animalId: 'a008', animalName: '乐乐',
    partnerId: 'a003', partnerName: '威威',
    breedingType: 'mating', eventDate: '2026-04-20',
    status: '配种完成',
    notes: '人工辅助交配，等待结果'
  },
  {
    id: 'b005', animalId: 'a006', animalName: '丹丹',
    breedingType: 'estrus', eventDate: '2026-06-01',
    status: '繁殖期活跃',
    notes: '求偶行为明显，配对准备中'
  },
];

export const enclosures: Enclosure[] = [
  {
    id: 'e001', name: '熊猫馆A区', area: '1200㎡',
    capacity: 4, currentOccupancy: 4,
    temperature: 22, humidity: 65,
    tempRange: { min: 18, max: 26 },
    humidityRange: { min: 55, max: 75 },
    lastCleaned: '2026-06-18 07:00',
    status: 'normal',
    cleaningRecords: [
      { date: '2026-06-18 07:00', staff: '王饲养员', method: '全面清洁消毒' },
      { date: '2026-06-17 19:00', staff: '李饲养员', method: '日常清洁' },
    ],
    safetyChecks: [
      { date: '2026-06-15', inspector: '设施科-赵工', issues: [], status: '合格' }
    ]
  },
  {
    id: 'e002', name: '虎山林', area: '2500㎡',
    capacity: 3, currentOccupancy: 2,
    temperature: 26, humidity: 55,
    tempRange: { min: 15, max: 30 },
    humidityRange: { min: 40, max: 70 },
    lastCleaned: '2026-06-18 06:30',
    status: 'normal',
    cleaningRecords: [
      { date: '2026-06-18 06:30', staff: '李饲养员', method: '全面清洁消毒' },
    ],
    safetyChecks: [
      { date: '2026-06-10', inspector: '设施科-钱工', issues: ['围栏铁丝网有轻微锈蚀'], status: '需整改' }
    ]
  },
  {
    id: 'e003', name: '金丝猴馆', area: '800㎡',
    capacity: 8, currentOccupancy: 5,
    temperature: 24, humidity: 70,
    tempRange: { min: 18, max: 28 },
    humidityRange: { min: 55, max: 80 },
    lastCleaned: '2026-06-18 07:30',
    status: 'warning',
    cleaningRecords: [
      { date: '2026-06-18 07:30', staff: '张饲养员', method: '日常清洁' },
    ],
    safetyChecks: []
  },
  {
    id: 'e004', name: '亚洲象园', area: '5000㎡',
    capacity: 3, currentOccupancy: 2,
    temperature: 28, humidity: 60,
    tempRange: { min: 20, max: 32 },
    humidityRange: { min: 45, max: 75 },
    lastCleaned: '2026-06-18 06:00',
    status: 'normal',
    cleaningRecords: [
      { date: '2026-06-18 06:00', staff: '赵饲养员', method: '全面清洁消毒' },
    ],
    safetyChecks: []
  },
  {
    id: 'e005', name: '鹤鸟湿地', area: '3000㎡',
    capacity: 15, currentOccupancy: 8,
    temperature: 25, humidity: 78,
    tempRange: { min: 15, max: 30 },
    humidityRange: { min: 60, max: 90 },
    lastCleaned: '2026-06-17 18:00',
    status: 'normal',
    cleaningRecords: [],
    safetyChecks: []
  },
  {
    id: 'e006', name: '长颈鹿馆', area: '2000㎡',
    capacity: 4, currentOccupancy: 1,
    temperature: 29, humidity: 48,
    tempRange: { min: 18, max: 32 },
    humidityRange: { min: 40, max: 70 },
    lastCleaned: '2026-06-18 08:00',
    status: 'alert',
    cleaningRecords: [],
    safetyChecks: []
  },
];

export const behaviorRecords: BehaviorRecord[] = [
  {
    id: 'bh001', animalId: 'a001', animalName: '团团',
    observationDate: '2026-06-18', observer: '王饲养员',
    behaviorType: 'normal', behaviorName: '进食竹子',
    frequency: 4, durationMinutes: 120, notes: '进食状态良好'
  },
  {
    id: 'bh002', animalId: 'a001', animalName: '团团',
    observationDate: '2026-06-18', observer: '王饲养员',
    behaviorType: 'normal', behaviorName: '休息睡眠',
    frequency: 3, durationMinutes: 240, notes: '午后休息正常'
  },
  {
    id: 'bh003', animalId: 'a004', animalName: '玲玲',
    observationDate: '2026-06-17', observer: '张饲养员',
    behaviorType: 'stereotypic', behaviorName: '来回踱步',
    frequency: 8, durationMinutes: 45, severity: 'mild',
    enrichmentActivity: '新的觅食玩具投放',
    notes: '踱步频率较前几日减少，丰容措施有效'
  },
  {
    id: 'bh004', animalId: 'a003', animalName: '威威',
    observationDate: '2026-06-18', observer: '李饲养员',
    behaviorType: 'normal', behaviorName: '巡视领地',
    frequency: 2, durationMinutes: 60, notes: '领地行为正常'
  },
  {
    id: 'bh005', animalId: 'a004', animalName: '玲玲',
    observationDate: '2026-06-18', observer: '张饲养员',
    behaviorType: 'social', behaviorName: '群体理毛',
    frequency: 2, durationMinutes: 30, notes: '社交行为积极'
  },
  {
    id: 'bh006', animalId: 'a008', animalName: '乐乐',
    observationDate: '2026-06-18', observer: '李饲养员',
    behaviorType: 'normal', behaviorName: '静卧休息',
    frequency: 5, durationMinutes: 300, notes: '生病期间活动减少，属正常现象'
  },
];

export const enrichmentActivities: EnrichmentActivity[] = [
  { id: 'en001', name: '竹子喂食器', type: '食物丰容', targetSpecies: ['大熊猫'], description: '将竹子放置在不同高度和位置，增加取食难度', lastUsed: '2026-06-18', effectiveness: 85 },
  { id: 'en002', name: '气味探索箱', type: '感知丰容', targetSpecies: ['东北虎', '豹'], description: '放置带有不同气味的物品，刺激嗅觉', lastUsed: '2026-06-16', effectiveness: 78 },
  { id: 'en003', name: '觅食迷宫', type: '食物丰容', targetSpecies: ['金丝猴', '黑猩猩'], description: '需要操作才能获取食物的装置', lastUsed: '2026-06-17', effectiveness: 90 },
  { id: 'en004', name: '泥浴池', type: '环境丰容', targetSpecies: ['亚洲象'], description: '大型泥浴区域，满足象群习性需求', lastUsed: '2026-06-18', effectiveness: 95 },
  { id: 'en005', name: '栖息树枝', type: '环境丰容', targetSpecies: ['金丝猴', '长臂猿'], description: '不同高度和粗细的树枝，模拟自然环境', lastUsed: '2026-06-15', effectiveness: 82 },
];

export const educationSchedules: EducationSchedule[] = [
  {
    id: 'es001', date: '2026-06-18',
    guideName: '陈科普', guideAvatar: '陈',
    topic: '大熊猫的饮食习惯', animalExhibit: '熊猫馆A区',
    startTime: '10:00', endTime: '10:30',
    expectedVisitors: 50, actualVisitors: 58,
    feedback: '游客反馈很好，孩子们特别喜欢',
    category: '食性科普'
  },
  {
    id: 'es002', date: '2026-06-18',
    guideName: '刘讲解', guideAvatar: '刘',
    topic: '东北虎的野外生存现状', animalExhibit: '虎山林',
    startTime: '11:00', endTime: '11:30',
    expectedVisitors: 40, actualVisitors: 35,
    feedback: '讲解生动，建议增加互动环节',
    category: '保护教育'
  },
  {
    id: 'es003', date: '2026-06-18',
    guideName: '陈科普', guideAvatar: '陈',
    topic: '亚洲象的智慧', animalExhibit: '亚洲象园',
    startTime: '14:00', endTime: '14:40',
    expectedVisitors: 60,
    category: '行为科普'
  },
  {
    id: 'es004', date: '2026-06-18',
    guideName: '王老师', guideAvatar: '王',
    topic: '丹顶鹤的迁徙故事', animalExhibit: '鹤鸟湿地',
    startTime: '15:30', endTime: '16:00',
    expectedVisitors: 45,
    category: '迁徙科普'
  },
  {
    id: 'es005', date: '2026-06-19',
    guideName: '刘讲解', guideAvatar: '刘',
    topic: '金丝猴的社会结构', animalExhibit: '金丝猴馆',
    startTime: '10:30', endTime: '11:00',
    expectedVisitors: 35,
    category: '行为科普'
  },
  {
    id: 'es006', date: '2026-06-19',
    guideName: '陈科普', guideAvatar: '陈',
    topic: '长颈鹿为什么脖子那么长', animalExhibit: '长颈鹿馆',
    startTime: '14:30', endTime: '15:00',
    expectedVisitors: 55,
    category: '进化科普'
  },
];

export const visitorInteractions: VisitorInteraction[] = [
  { id: 'vi001', date: '2026-06-17', activityName: '大熊猫喂食体验', animalExhibit: '熊猫馆A区', participantCount: 20, duration: 30, feedbackScore: 4.8, notes: '需提前预约，每场限20人' },
  { id: 'vi002', date: '2026-06-17', activityName: '大象洗澡互动', animalExhibit: '亚洲象园', participantCount: 15, duration: 45, feedbackScore: 4.9, notes: '夏季热门活动，每天两场' },
  { id: 'vi003', date: '2026-06-17', activityName: '科普小课堂-丹顶鹤', animalExhibit: '鹤鸟湿地', participantCount: 30, duration: 40, feedbackScore: 4.6, notes: '适合亲子家庭' },
  { id: 'vi004', date: '2026-06-18', activityName: '长颈鹿喂食', animalExhibit: '长颈鹿馆', participantCount: 25, duration: 25, feedbackScore: 4.7, notes: '需购买专用树叶' },
];

export const dashboardStats = {
  totalAnimals: 156,
  speciesCount: 42,
  endangeredCount: 18,
  healthyCount: 145,
  sickCount: 5,
  quarantineCount: 6,
  todayFeedings: 86,
  todayFeedingsCompleted: 78,
  activeBreedingPrograms: 7,
  enclosuresTotal: 24,
  enclosuresNormal: 21,
  enclosuresWarning: 2,
  enclosuresAlert: 1,
  todayEducationalPrograms: 6,
  todayVisitors: 2847,
};
