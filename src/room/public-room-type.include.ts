export const PublicRoomTypeInclude = {
  RoomType: true,
  RoomUser: {
    select: {
      is_dead: true,
      status: true,
      User: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          avatar_src: true,
        },
      },
    },
  },
};
