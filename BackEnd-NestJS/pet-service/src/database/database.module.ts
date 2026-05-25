import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Permission,
  PermissionSchema,
} from 'src/permissions/schemas/permission.schema';
import {
  PriceRule,
  PriceRuleSchema,
} from 'src/price-rule/schemas/price-rule.schema';
import { Role, RoleSchema } from 'src/roles/schemas/role.schema';
import { Service, ServiceSchema } from 'src/services/schemas/service.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: Permission.name, schema: PermissionSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Service.name, schema: ServiceSchema },
      { name: PriceRule.name, schema: PriceRuleSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [DatabaseService],
})
export class DatabaseModule {}
