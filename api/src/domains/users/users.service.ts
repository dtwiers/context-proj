import type {
  CreateUserBody,
  Paginated,
  UpdateUserBody,
} from '../../api-interface';
import { Injectable } from '@nestjs/common';
import type { Prisma, User } from '@prisma/client';
import { hashSync } from 'bcryptjs';
import { paginate } from '../../pagination';
import { PrismaService } from '../../prisma/prisma.service';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async user(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({
      where,
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
  }): Promise<Paginated<User[]>> {
    const [count, results] = await Promise.all([
      this.prisma.user.count({ where: params.where }),
      this.prisma.user.findMany({
        take: 20,
        ...params,
        orderBy: {username: 'asc'}
      }),
    ]);
    return paginate(results, count, params.skip ?? 0, params.take ?? 20);
  }

  // I don't know why I need a Required<> block here.
  async createUser(user: Required<CreateUserBody>): Promise<User> {
    const { password, ...rest } = user;
    const passwordHash = hashSync(password, 11);
    return this.prisma.user.create({
      data: {
        ...rest,
        passwordHash,
      },
    });
  }

  async deleteUser(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async updateUser(
    where: Prisma.UserWhereUniqueInput,
    data: UpdateUserBody
  ): Promise<User> {
    return this.prisma.user.update({
      where,
      data,
    });
  }

  async resetPassword(where: Prisma.UserWhereUniqueInput, password: string) {
    const passwordHash = hashSync(password, 11);
    return this.prisma.user.update({
      where,
      data: {
        passwordHash,
      },
    });
  }

  async userCount(): Promise<number> {
    return this.prisma.user.count({});
  }
}
