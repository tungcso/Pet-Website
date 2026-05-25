import { Types } from 'mongoose';
export const ADMIN_ROLE = 'admin';
export const USER_ROLE = 'user';
export const MANAGER_ROLE = 'manager';
export const BANNED_ROLE = 'banned';

export const SERVICE_IDS = {
  BATH: new Types.ObjectId('665a00000000000000000001'),
  GROOMING: new Types.ObjectId('665a00000000000000000002'),
  HOTEL: new Types.ObjectId('665a00000000000000000003'),
  OTHER: new Types.ObjectId('665a00000000000000000004'),
} as const;

/** 1) PERMISSIONS */
export const INIT_PERMISSIONS = [
  // USERS
  {
    _id: new Types.ObjectId().toString(),
    name: 'Cập nhật người dùng',
    key: 'users:patch',
    module: 'USERS',
  },
  {
    _id: new Types.ObjectId().toString(),
    name: 'Xem danh sách người dùng',
    key: 'users:get',
    module: 'USERS',
  },
  {
    _id: new Types.ObjectId().toString(),
    name: 'Xem chi tiết người dùng',
    key: 'users/:id:get',
    module: 'USERS',
  },
  {
    _id: new Types.ObjectId().toString(),
    name: 'Xóa người dùng',
    key: 'users:delete',
    module: 'USERS',
  },
  {
    _id: new Types.ObjectId().toString(),
    name: 'Tạo người dùng',
    key: 'users:post',
    module: 'USERS',
  },

  // SERVICES
  {
    _id: new Types.ObjectId().toString(),
    name: 'Xóa dịch vụ',
    key: 'services:delete',
    module: 'SERVICES',
  },
  {
    _id: new Types.ObjectId().toString(),
    name: 'Cập nhật dịch vụ',
    key: 'services:patch',
    module: 'SERVICES',
  },
  {
    _id: new Types.ObjectId().toString(),
    name: 'Tạo dịch vụ',
    key: 'services:post',
    module: 'SERVICES',
  },

  // ROLES
  {
    _id: new Types.ObjectId().toString(),
    name: 'Tạo vai trò',
    key: 'roles:post',
    module: 'ROLES',
  },
  {
    _id: new Types.ObjectId().toString(),
    name: 'Xem danh sách vai trò',
    key: 'roles:get',
    module: 'ROLES',
  },
  {
    _id: new Types.ObjectId().toString(),
    name: 'Xem chi tiết vai trò',
    key: 'roles/:id:get',
    module: 'ROLES',
  },
  {
    _id: new Types.ObjectId().toString(),
    name: 'Cập nhật vai trò',
    key: 'roles:patch',
    module: 'ROLES',
  },
  {
    _id: new Types.ObjectId().toString(),
    name: 'Xóa vai trò',
    key: 'roles:delete',
    module: 'ROLES',
  },

  // PERMISSIONS
  {
    _id: new Types.ObjectId().toString(),
    name: 'Tạo quyền',
    key: 'permissions:post',
    module: 'PERMISSIONS',
  },
  {
    _id: new Types.ObjectId().toString(),
    name: 'Xem danh sách quyền',
    key: 'permissions:get',
    module: 'PERMISSIONS',
  },
  {
    _id: new Types.ObjectId().toString(),
    name: 'Xem chi tiết quyền',
    key: 'permissions/:id:get',
    module: 'PERMISSIONS',
  },
  {
    _id: new Types.ObjectId().toString(),
    name: 'Cập nhật quyền',
    key: 'permissions:patch',
    module: 'PERMISSIONS',
  },
  {
    _id: new Types.ObjectId().toString(),
    name: 'Xóa quyền',
    key: 'permissions:delete',
    module: 'PERMISSIONS',
  },

  // APPOINTMENTS
  {
    _id: new Types.ObjectId().toString(),
    name: 'Xóa lịch hẹn',
    key: 'appointments:delete',
    module: 'APPOINTMENTS',
  },
  {
    _id: new Types.ObjectId().toString(),
    name: 'Sửa lịch hẹn',
    key: 'appointments:patch',
    module: 'APPOINTMENTS',
  },
  // PRICE-RULES
  {
    _id: new Types.ObjectId().toString(),
    name: 'Tạo luật giá',
    key: 'price-rules:post',
    module: 'PRICE-RULES',
  },
  {
    _id: new Types.ObjectId().toString(),
    name: 'Xem danh sách luật giá',
    key: 'price-rules:get',
    module: 'PRICE-RULES',
  },
  {
    _id: new Types.ObjectId().toString(),
    name: 'Xem chi tiết luật giá',
    key: 'price-rules/:id:get',
    module: 'PRICE-RULES',
  },
  {
    _id: new Types.ObjectId().toString(),
    name: 'Cập nhật luật giá',
    key: 'price-rules:patch',
    module: 'PRICE-RULES',
  },
  {
    _id: new Types.ObjectId().toString(),
    name: 'Xóa luật giá',
    key: 'price-rules:delete',
    module: 'PRICE-RULES',
  },
] as const;

/** helper: lấy _id theo key */
const idOf = (key: (typeof INIT_PERMISSIONS)[number]['key']) =>
  INIT_PERMISSIONS.find((p) => p.key === key)!._id;

/** 2) ROLES (name, description, isActive, permission[]) */
export const INIT_ROLES = [
  {
    _id: new Types.ObjectId('689f6e674d5811bd2021bbab'),
    name: BANNED_ROLE,
    description: 'BỊ BÂN',
    isActive: true,
    permissions: [], // BÂn
  },
  {
    _id: new Types.ObjectId('689f6e674d5811bd20a1bbab'),
    name: ADMIN_ROLE,
    description: 'Toàn quyền quản trị hệ thống',
    isActive: true,
    permissions: INIT_PERMISSIONS.map((p) => p._id), // admin có tất cả
  },
  {
    _id: new Types.ObjectId('689f6e674d5811bd20a1bbaa'),
    name: MANAGER_ROLE,
    description: 'Quản lý nghiệp vụ: dịch vụ, lịch hẹn, người dùng (mức vừa)',
    isActive: true,
    permissions: [
      // USERS: xem + cập nhật (không tạo/xóa)
      idOf('users:get'),
      idOf('users/:id:get'),
      idOf('users:patch'),

      // SERVICES: full CRUD trừ read (bạn chưa định nghĩa GET cho services, nếu có thì thêm)
      idOf('services:post'),
      idOf('services:patch'),
      idOf('services:delete'),

      // ROLES: chỉ xem
      idOf('roles:get'),
      idOf('roles/:id:get'),

      // PERMISSIONS: chỉ xem
      idOf('permissions:get'),
      idOf('permissions/:id:get'),

      // APPOINTMENTS: có quyền xóa lịch hẹn (duyệt/hủy)
      idOf('appointments:delete'),
      idOf('appointments:patch'),
    ],
  },
  {
    _id: new Types.ObjectId('689f6e674d5811bd20a1bba9'),
    name: USER_ROLE,
    description: 'Người dùng thường, tự thao tác phần của mình',
    isActive: true,
    permissions: [
      // Người dùng thường không có đặc quyền admin,
      // các route self-service nên dựa vào JWT + ownership, không cần permission.
      // Nếu bạn muốn cho quyền “xem danh sách vai trò/quyền” thì có thể thêm:
      // idOf("services:post") ... (nhưng thường KHÔNG)
    ],
  },
] as const;

export const INIT_SERVICES = [
  {
    _id: SERVICE_IDS.BATH,
    name: 'Tắm & vệ sinh cho chó mèo',
    duration: 60,
    picture: '/images/ui/Dog_cat_shower.png',
    variant: 'STANDARD',
    public_id: 'pet-service/bath-basic',
    type: 'BATH',
    pet: 'DOG',
    priceStart: 150000,
    priceEnd: 350000,
    description: [
      'Tắm bằng sản phẩm dịu nhẹ theo loại da',
      'Sấy tạo form lông gọn gàng',
      'Vệ sinh tai, móng và vùng nhạy cảm',
    ],
  },
  {
    _id: SERVICE_IDS.GROOMING,
    name: 'Cắt tỉa & chăm sóc lông',
    duration: 90,
    picture: '/images/ui/massage.png',
    variant: 'PRO',
    public_id: 'pet-service/grooming-care',
    type: 'GROOMING',
    pet: 'DOG',
    priceStart: 180000,
    priceEnd: 420000,
    description: [
      'Tỉa mặt, chân, bụng theo tỉ lệ phù hợp',
      'Gỡ rối và xử lý lông vón cục',
      'Tư vấn lịch chăm sóc định kỳ',
    ],
  },
  {
    _id: SERVICE_IDS.HOTEL,
    name: 'Khách sạn thú cưng',
    duration: 1440,
    picture: '/images/ui/meo_tam.png',
    variant: 'PROMAX',
    public_id: 'pet-service/hotel-daycare',
    type: 'HOTEL',
    pet: 'DOG',
    priceStart: 250000,
    priceEnd: 650000,
    description: [
      'Khu ở sạch, thoáng và tách khu phù hợp',
      'Cập nhật ăn uống, vận động mỗi ngày',
      'Hỗ trợ chăm sóc theo thói quen của bé',
    ],
  },
  {
    _id: SERVICE_IDS.OTHER,
    name: 'Dịch vụ bổ sung',
    duration: 45,
    picture: '/images/ui/Tiem_phong.png',
    variant: 'STANDARD',
    public_id: 'pet-service/other-care',
    type: 'OTHER',
    pet: 'CAT',
    priceStart: 80000,
    priceEnd: 180000,
    description: [
      'Khử mùi, dưỡng da lông chuyên biệt',
      'Xử lý ve rận và phòng ngừa tái phát',
      'Combo chăm sóc tiết kiệm theo tháng',
    ],
  },
] as const;

export const INIT_PRICE_RULES = [
  {
    name: 'Tắm & vệ sinh - chó nhỏ',
    service: SERVICE_IDS.BATH,
    minWeight: 0,
    maxWeight: 5,
    price: 150000,
    isActive: true,
  },
  {
    name: 'Tắm & vệ sinh - chó vừa',
    service: SERVICE_IDS.BATH,
    minWeight: 5,
    maxWeight: 15,
    price: 220000,
    isActive: true,
  },
  {
    name: 'Tắm & vệ sinh - chó lớn',
    service: SERVICE_IDS.BATH,
    minWeight: 15,
    maxWeight: 100,
    price: 320000,
    isActive: true,
  },
  {
    name: 'Cắt tỉa - chó mèo nhỏ',
    service: SERVICE_IDS.GROOMING,
    minWeight: 0,
    maxWeight: 5,
    price: 180000,
    isActive: true,
  },
  {
    name: 'Cắt tỉa - chó mèo vừa',
    service: SERVICE_IDS.GROOMING,
    minWeight: 5,
    maxWeight: 15,
    price: 280000,
    isActive: true,
  },
  {
    name: 'Cắt tỉa - chó mèo lớn',
    service: SERVICE_IDS.GROOMING,
    minWeight: 15,
    maxWeight: 100,
    price: 420000,
    isActive: true,
  },
  {
    name: 'Khách sạn - bé nhỏ',
    service: SERVICE_IDS.HOTEL,
    minWeight: 0,
    maxWeight: 5,
    price: 250000,
    isActive: true,
  },
  {
    name: 'Khách sạn - bé vừa',
    service: SERVICE_IDS.HOTEL,
    minWeight: 5,
    maxWeight: 15,
    price: 400000,
    isActive: true,
  },
  {
    name: 'Khách sạn - bé lớn',
    service: SERVICE_IDS.HOTEL,
    minWeight: 15,
    maxWeight: 100,
    price: 650000,
    isActive: true,
  },
  {
    name: 'Dịch vụ bổ sung',
    service: SERVICE_IDS.OTHER,
    minWeight: 0,
    maxWeight: 100,
    price: 120000,
    isActive: true,
  },
] as const;
