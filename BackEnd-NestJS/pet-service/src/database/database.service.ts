import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Permission } from 'src/permissions/schemas/permission.schema';
import {
  ADMIN_ROLE,
  INIT_PRICE_RULES,
  INIT_SERVICES,
  INIT_PERMISSIONS,
  INIT_ROLES,
  MANAGER_ROLE,
  USER_ROLE,
} from './sample';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/schemas/user.schema';
import { Role } from 'src/roles/schemas/role.schema';
import { UsersService } from 'src/users/users.service';
import { Service } from 'src/services/schemas/service.schema';
import { PriceRule } from 'src/price-rule/schemas/price-rule.schema';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(
    private userService: UsersService,
    private configService: ConfigService,
    @InjectModel(Permission.name) private permissionModel: Model<Permission>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Role.name) private roleModel: Model<Role>,
    @InjectModel(Service.name) private serviceModel: Model<Service>,
    @InjectModel(PriceRule.name) private priceRuleModel: Model<PriceRule>,
  ) {}

  async onModuleInit() {
    const isInit = this.configService.get<boolean>('SHOULD_INIT');
    if (!Boolean(isInit)) return;

    const [
      countUser,
      countPermission,
      countRole,
      countService,
      countPriceRule,
    ] = await Promise.all([
      this.userModel.countDocuments({}),
      this.permissionModel.countDocuments({}),
      this.roleModel.countDocuments({}),
      this.serviceModel.countDocuments({}),
      this.priceRuleModel.countDocuments({}),
    ]);

    // 1) Init Permissions
    if (countPermission === 0) {
      // Đảm bảo _id là ObjectId, tránh lệch kiểu

      await this.permissionModel.insertMany(INIT_PERMISSIONS);
    }

    // 2) Init Roles
    if (countRole === 0) {
      // Lấy toàn bộ permissions (chỉ _id + metadata để lọc)

      // Tạo roles (để Mongo tự sinh _id, tránh hardcode id rỗng/sai)
      await this.roleModel.insertMany(INIT_ROLES);
    }

    // 3) Init Users
    if (countUser === 0) {
      const [userRole, adminRole, managerRole] = await Promise.all([
        this.roleModel.findOne({ name: USER_ROLE }).select('_id').lean(),
        this.roleModel.findOne({ name: ADMIN_ROLE }).select('_id').lean(),
        this.roleModel.findOne({ name: MANAGER_ROLE }).select('_id').lean(),
      ]);

      await this.userModel.insertMany([
        {
          name: 'admin',
          email: 'admin@gmail.com',
          password: this.userService.getHash(
            this.configService.getOrThrow<string>('INIT_PASSWORD'),
          ),
          age: 20,
          gender: 'MALE',
          address: 'VietNam',
          role: adminRole?._id,
        },
        {
          name: 'user',
          email: 'user@gmail.com',
          password: this.userService.getHash(
            this.configService.getOrThrow<string>('INIT_PASSWORD'),
          ),
          age: 20,
          gender: 'FEMALE',
          address: 'KOREA',
          role: userRole?._id,
        },
        {
          name: 'Lương Thanh Tùng',
          email: 'luongtung@gmail.com',
          password: this.userService.getHash(
            this.configService.getOrThrow<string>('INIT_PASSWORD'),
          ),
          age: 20,
          gender: 'MALE',
          address: 'VIET',
          role: managerRole?._id,
        },
      ]);
    }

    // 4) Init Services
    if (countService === 0) {
      const adminUser = await this.userModel
        .findOne({ email: 'admin@gmail.com' })
        .select('_id email')
        .lean();

      await this.serviceModel.insertMany(
        INIT_SERVICES.map((service) => ({
          ...service,
          createdBy: adminUser
            ? {
                _id: adminUser._id,
                email: adminUser.email,
              }
            : undefined,
        })),
      );
    }

    // 5) Init Price Rules
    if (countPriceRule === 0) {
      await this.priceRuleModel.insertMany(INIT_PRICE_RULES);
    }

    // 6) Log
    const [afterUsers, afterPerms, afterRoles] = await Promise.all([
      this.userModel.countDocuments({}),
      this.permissionModel.countDocuments({}),
      this.roleModel.countDocuments({}),
    ]);
    if (afterUsers > 0 && afterPerms > 0 && afterRoles > 0) {
      console.log('>>> INIT SAMPLE DATA DONE (or already existed)');
    }
  }
}
