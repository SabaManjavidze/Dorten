import DataLoader from "dataloader";
import { In } from "typeorm";
import { User } from "../../server/entities/User";

export const createUserLoader = () =>
  new DataLoader<string, User>(async (userIds) => {
    const users = await User.find({
      where: {
        user_id: In(userIds as string[]),
      },
    });
    const userIdToUser: Record<string, User> = {};
    users.forEach((u) => {
      userIdToUser[u.user_id] = u;
    });

    const sortedUsers = userIds.map((userId) => userIdToUser[userId]);
    return sortedUsers;
  });
