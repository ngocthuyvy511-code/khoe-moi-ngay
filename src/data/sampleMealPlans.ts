import { MealPlanDay, ShoppingItem } from '../types';

export const SAMPLE_MEAL_PLAN: MealPlanDay[] = [
  {
    dayOfWeek: 'Thứ Hai',
    date: '2026-10-26',
    breakfast: {
      id: 'plan-mon-bf',
      title: 'Phở gà xé hành hoa',
      mealType: 'breakfast',
      servings: 1,
      prepTimeMinutes: 10,
      cookTimeMinutes: 15,
      caloriesPerServing: 410,
      macros: { protein: 28, carbs: 58, fat: 7.5, fiber: 2.8 },
      ingredients: [
        { name: 'Bánh phở tươi', amount: '180g', category: 'Tinh bột' },
        { name: 'Ức gà phi lê', amount: '90g', category: 'Thịt & Hải sản' },
        { name: 'Hành hoa & ngò gai', amount: '30g', category: 'Rau củ' },
        { name: 'Nước dùng gà luộc', amount: '350ml', category: 'Gia vị & Khô' }
      ],
      instructions: [
        'Trụng bánh phở qua nước sôi rồi cho vào tô.',
        'Ức gà luộc chín xé sợi xếp lên trên mặt bánh.',
        'Rắc hành ngò thái nhỏ, chan nước dùng gà nóng hổi vào và vắt chút chanh tươi.'
      ],
      source: 'Thực đơn dinh dưỡng gia đình Việt'
    },
    lunch: {
      id: 'plan-mon-lu',
      title: 'Cơm gạo lứt, cá lóc kho tộ & canh cải xanh',
      mealType: 'lunch',
      servings: 1,
      prepTimeMinutes: 15,
      cookTimeMinutes: 25,
      caloriesPerServing: 490,
      macros: { protein: 29, carbs: 62, fat: 12, fiber: 5.5 },
      ingredients: [
        { name: 'Gạo lứt đỏ', amount: '75g (nấu thành 150g)', category: 'Tinh bột' },
        { name: 'Cá lóc đồng làm sạch', amount: '100g', category: 'Thịt & Hải sản' },
        { name: 'Cải xanh non', amount: '120g', category: 'Rau củ' },
        { name: 'Gừng tươi & hành tím', amount: '20g', category: 'Rau củ' },
        { name: 'Nước mắm truyền thống & tiêu sọ', amount: '15ml', category: 'Gia vị & Khô' }
      ],
      instructions: [
        'Cơm gạo lứt nấu dẻo trong nồi cơm điện.',
        'Cá lóc ướp nước mắm, hành tiêu rồi kho tộ nhỏ lửa đến khi cạn sệt thơm lừng.',
        'Cải xanh cắt khúc nấu canh cùng vài lát gừng ấm bụng.'
      ],
      source: 'Mâm cơm cân bằng năng lượng'
    },
    dinner: {
      id: 'plan-mon-di',
      title: 'Đậu hũ dồn thịt sốt cà & rau muống luộc',
      mealType: 'dinner',
      servings: 1,
      prepTimeMinutes: 15,
      cookTimeMinutes: 20,
      caloriesPerServing: 380,
      macros: { protein: 26, carbs: 32, fat: 15, fiber: 4.8 },
      ingredients: [
        { name: 'Đậu hũ trắng', amount: '1 miếng (120g)', category: 'Đạm thực vật' },
        { name: 'Thịt nạc băm', amount: '50g', category: 'Thịt & Hải sản' },
        { name: 'Cà chua chín', amount: '2 quả (100g)', category: 'Rau củ' },
        { name: 'Rau muống ngọn', amount: '150g', category: 'Rau củ' }
      ],
      instructions: [
        'Đậu hũ khoét giữa, nhồi thịt nạc băm ướp tiêu hành.',
        'Áp chảo vàng nhẹ rồi sốt cùng cà chua nhuyễn.',
        'Rau muống luộc xanh giòn, nước luộc dầm sấu hoặc vắt chanh làm canh thanh mát.'
      ],
      source: 'Món ngon gia đình thanh nhẹ'
    },
    snack: {
      id: 'plan-mon-sn',
      title: 'Bưởi da xanh & hạt điều',
      mealType: 'snack',
      servings: 1,
      prepTimeMinutes: 5,
      cookTimeMinutes: 0,
      caloriesPerServing: 150,
      macros: { protein: 4, carbs: 18, fat: 7.5, fiber: 3.2 },
      ingredients: [
        { name: 'Bưởi da xanh', amount: '2 múi (100g)', category: 'Trái cây' },
        { name: 'Hạt điều rang', amount: '15g', category: 'Gia vị & Khô' }
      ],
      instructions: ['Thưởng thức bưởi ngọt mát và nhâm nhi vài hạt điều thơm giòn vào lúc 16h chiều.'],
      source: 'Bữa phụ kiểm soát cơn thèm ăn'
    }
  },
  {
    dayOfWeek: 'Thứ Ba',
    date: '2026-10-27',
    breakfast: {
      id: 'plan-tue-bf',
      title: 'Bánh mì ốp la kèm salad dưa chuột cà chua',
      mealType: 'breakfast',
      servings: 1,
      prepTimeMinutes: 5,
      cookTimeMinutes: 8,
      caloriesPerServing: 390,
      macros: { protein: 17, carbs: 48, fat: 14, fiber: 2.8 },
      ingredients: [
        { name: 'Bánh mì giòn', amount: '1 ổ (80g)', category: 'Tinh bột' },
        { name: 'Trứng gà tươi', amount: '2 quả', category: 'Thịt & Hải sản' },
        { name: 'Dưa leo & cà chua bi', amount: '80g', category: 'Rau củ' }
      ],
      instructions: [
        'Trứng ốp la lòng đào với chút dầu ô liu nhỏ.',
        'Kẹp bánh mì giòn rụm với rau thơm và dưa leo mát lành.'
      ],
      source: 'Bữa sáng nhanh giàu năng lượng'
    },
    lunch: {
      id: 'plan-tue-lu',
      title: 'Bún chả Hà Nội nướng than (phiên bản ít dầu)',
      mealType: 'lunch',
      servings: 1,
      prepTimeMinutes: 20,
      cookTimeMinutes: 15,
      caloriesPerServing: 510,
      macros: { protein: 28, carbs: 64, fat: 14, fiber: 4.2 },
      ingredients: [
        { name: 'Bún tươi sợi nhỏ', amount: '170g', category: 'Tinh bột' },
        { name: 'Thịt nạc vai băm viên', amount: '100g', category: 'Thịt & Hải sản' },
        { name: 'Đu đủ xanh & cà rốt', amount: '50g', category: 'Rau củ' },
        { name: 'Xà lách, tía tô, kinh giới', amount: '80g', category: 'Rau củ' }
      ],
      instructions: [
        'Nướng chả viên trong nồi chiên không dầu ở 180°C trong 12 phút.',
        'Pha nước mắm giấm tỏi ớt ấm, ngâm dưa góp giòn sần sật.',
        'Ăn kèm thật nhiều rau kinh giới và tía tô tươi thơm ngát.'
      ],
      source: 'Đặc sản Bắc Bộ lành mạnh'
    },
    dinner: {
      id: 'plan-tue-di',
      title: 'Canh chua tôm nõn & ức gà xào nấm',
      mealType: 'dinner',
      servings: 1,
      prepTimeMinutes: 15,
      cookTimeMinutes: 15,
      caloriesPerServing: 420,
      macros: { protein: 32, carbs: 38, fat: 11, fiber: 5.0 },
      ingredients: [
        { name: 'Cơm trắng', amount: '1/2 chén (80g)', category: 'Tinh bột' },
        { name: 'Tôm nõn tươi', amount: '60g', category: 'Thịt & Hải sản' },
        { name: 'Ức gà thái lát', amount: '70g', category: 'Thịt & Hải sản' },
        { name: 'Nấm rơm hoặc nấm đùi gà', amount: '80g', category: 'Rau củ' },
        { name: 'Đậu bắp, bạc hà, cà chua', amount: '100g', category: 'Rau củ' }
      ],
      instructions: [
        'Canh chua nấu nhanh cùng tôm nõn ngọt tự nhiên.',
        'Ức gà áp chảo xào nấm thơm lừng với hành hoa.'
      ],
      source: 'Mâm cơm tối tiêu hóa dễ'
    },
    snack: {
      id: 'plan-tue-sn',
      title: '1 quả ổi lê giòn & ly trà lài đá',
      mealType: 'snack',
      servings: 1,
      prepTimeMinutes: 3,
      cookTimeMinutes: 0,
      caloriesPerServing: 70,
      macros: { protein: 2.2, carbs: 15, fat: 0.5, fiber: 5.4 },
      ingredients: [
        { name: 'Ổi lê giòn', amount: '1 quả (160g)', category: 'Trái cây' }
      ],
      instructions: ['Rửa sạch, thái lát chấm muối ớt nhè nhẹ.'],
      source: 'Bữa phụ vitamin C tự nhiên'
    }
  },
  {
    dayOfWeek: 'Thứ Tư',
    date: '2026-10-28',
    breakfast: {
      id: 'plan-wed-bf',
      title: 'Gỏi cuốn tôm thịt & ly nước dừa tươi',
      mealType: 'breakfast',
      servings: 1,
      prepTimeMinutes: 15,
      cookTimeMinutes: 10,
      caloriesPerServing: 275,
      macros: { protein: 15, carbs: 43, fat: 4.8, fiber: 4.7 },
      ingredients: [
        { name: 'Bánh tráng cuốn & bún', amount: '60g', category: 'Tinh bột' },
        { name: 'Tôm tươi luộc', amount: '50g', category: 'Thịt & Hải sản' },
        { name: 'Thịt nạc heo luộc', amount: '40g', category: 'Thịt & Hải sản' },
        { name: 'Rau sống & hẹ tươi', amount: '50g', category: 'Rau củ' },
        { name: 'Nước dừa xiêm', amount: '200ml', category: 'Trái cây' }
      ],
      instructions: [
        'Cuốn chặt tay bánh tráng với rau thơm, tôm lột vỏ và thịt nạc thái mỏng.',
        'Chấm sốt tương bơ đậu phộng pha loãng thơm bùi.'
      ],
      source: 'Bữa sáng Nam Bộ thanh đạm'
    },
    lunch: {
      id: 'plan-wed-lu',
      title: 'Cơm tấm sườn nướng mật ong & dưa chuột',
      mealType: 'lunch',
      servings: 1,
      prepTimeMinutes: 10,
      cookTimeMinutes: 20,
      caloriesPerServing: 560,
      macros: { protein: 28, carbs: 74, fat: 16, fiber: 3.2 },
      ingredients: [
        { name: 'Gạo tấm thơm', amount: '1 bát (180g)', category: 'Tinh bột' },
        { name: 'Sườn cốt lết heo', amount: '1 miếng (100g)', category: 'Thịt & Hải sản' },
        { name: 'Dưa leo & cà chua', amount: '100g', category: 'Rau củ' }
      ],
      instructions: [
        'Sườn ướp tỏi mật ong nướng nồi chiên vàng ruộm.',
        'Ăn cùng cơm tấm nóng hổi và canh cải ngọt.'
      ],
      source: 'Thực đơn nạp năng lượng ngày giữa tuần'
    },
    dinner: {
      id: 'plan-wed-di',
      title: 'Canh bí đỏ nấu tôm & trứng xào khổ qua',
      mealType: 'dinner',
      servings: 1,
      prepTimeMinutes: 15,
      cookTimeMinutes: 15,
      caloriesPerServing: 360,
      macros: { protein: 22, carbs: 36, fat: 13, fiber: 4.5 },
      ingredients: [
        { name: 'Bí đỏ thái miếng', amount: '120g', category: 'Rau củ' },
        { name: 'Tôm băm nhỏ', amount: '50g', category: 'Thịt & Hải sản' },
        { name: 'Khổ qua (mướp đắng) bào mỏng', amount: '1 trái (100g)', category: 'Rau củ' },
        { name: 'Trứng gà', amount: '1 quả', category: 'Thịt & Hải sản' }
      ],
      instructions: [
        'Canh bí đỏ nấu ngọt tự nhiên từ tôm tươi, rắc ngò gai thơm.',
        'Khổ qua xào nhanh tay với trứng chín tới, không bị đắng gắt.'
      ],
      source: 'Bữa tối an thần thanh nhiệt'
    },
    snack: {
      id: 'plan-wed-sn',
      title: '1 hũ sữa chua men sống & vài quả chuối sứ',
      mealType: 'snack',
      servings: 1,
      prepTimeMinutes: 1,
      cookTimeMinutes: 0,
      caloriesPerServing: 138,
      macros: { protein: 4.7, carbs: 24, fat: 3.2, fiber: 1.8 },
      ingredients: [
        { name: 'Sữa chua không đường', amount: '1 hũ', category: 'Đạm thực vật' },
        { name: 'Chuối sứ', amount: '1 quả', category: 'Trái cây' }
      ],
      instructions: ['Thái lát chuối trộn cùng sữa chua mát lạnh thưởng thức.'],
      source: 'Men vi sinh tốt cho tiêu hóa'
    }
  }
];

export function buildShoppingListFromPlans(plans: MealPlanDay[], userId: string): ShoppingItem[] {
  const map = new Map<string, { amount: string; category: string }>();

  plans.forEach(planDay => {
    const meals = [planDay.breakfast, planDay.lunch, planDay.dinner, planDay.snack].filter(Boolean);
    meals.forEach(m => {
      if (!m) return;
      m.ingredients.forEach(ing => {
        const key = ing.name.trim();
        if (map.has(key)) {
          const existing = map.get(key)!;
          existing.amount += `, + ${ing.amount}`;
        } else {
          map.set(key, {
            amount: ing.amount,
            category: ing.category || 'Rau củ & Khác'
          });
        }
      });
    });
  });

  const result: ShoppingItem[] = [];
  let index = 1;
  map.forEach((val, name) => {
    result.push({
      id: `shop-${index++}-${Date.now()}`,
      userId,
      name,
      amount: val.amount,
      category: val.category,
      isBought: false,
      createdAt: new Date().toISOString()
    });
  });

  return result;
}
